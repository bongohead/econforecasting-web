document.addEventListener("DOMContentLoaded", function(event) {
	
	/********** INITIALIZE **********/
	$('div.overlay').show();

	const promises = [
		getFetch('get_sentiment_analysis_indices', ['indices', 'index_values', 'index_stats', 'index_roberta_values'], 10000, false),
		getFetch('get_sentiment_analysis_benchmarks', ['benchmarks', 'benchmark_values'], 10000, false),
		getFetch('get_sentiment_analysis_subreddit_roberta_values', ['subreddit_roberta_values'], 10000, false),
		getFetch('get_sentiment_analysis_table_values', ['table_values'], 10000, false),

	];

	/********** GET DATA **********/
	const ud = getData('indices-sentiment') || {};
	
	Promise.all(promises)
		.then(function(r) {
			
			//console.log('raw', r);
			
			const indices = r[0].indices;
			const index_values = r[0].index_values;
			const index_stats = r[0].index_stats;
			const index_roberta_values = r[0].index_roberta_values;
			const index_data = indices.map(function(x) {
				const data = index_values.filter(y => y.index_id === x.id).map(y => ({
					date: y.date,
					count: y.count,
					score: Number(y.score),
					score_7dma: Number(y.score_7dma),
					score_14dma: Number(y.score_14dma),
					created_at: y.created_at
				}));
				const roberta_data_raw = index_roberta_values.filter(y => y.index_id === x.id).map(y => ({
					date: y.date,
					emotion: y.emotion,
					value: Number(y.value)
				}));
				//console.log(roberta_data_raw);
				const roberta_data = [...new Set(roberta_data_raw.map(y => y.emotion))].map((emotion, i) => ({
					emotion: emotion,
					data: roberta_data_raw.filter(y => y.emotion === emotion).map(y => [moment(y.date).toDate().getTime(), y.value])
				}));
				const stats = index_stats.filter(y => y.index_id === x.id)[0];
				return {
					...x,
					ch1m: parseFloat(stats.ch1m),
					ch1w: parseFloat(stats.ch1w),
					last_val: parseFloat(stats.last_val),
					data: data,
					roberta_data: roberta_data,
					first_date: moment.min(data.map(y => moment(y.date))).format('YYYY-MM-DD'),
					last_updated: stats.last_updated
				}
			});
			
			
			const benchmarks = r[1].benchmarks;
			const benchmark_values = r[1].benchmark_values;
			const benchmark_data = benchmarks.map(function(x) {
				const data = benchmark_values.filter(y => y.varname === x.varname).map(y => ({
					date: y.date,
					value: Number(y.value),
				}));
				return {
					name: x.fullname,
					data: data,
					last_updated: moment.max(data.map(y => moment(y.created_at))).format('YYYY-MM-DD')
				}
			});
			
			const subreddit_roberta_values = r[2].subreddit_roberta_values.map(x => ({
				subreddit: x.subreddit,
				series: JSON.parse(x.series)
			}));
			
			const table_values = r[3].table_values.map(x => ({
				date: x.date,
				...JSON.parse(x.data).reduce(((r, c) => Object.assign(r, c)), {})
			}));
			
			return {index_data: index_data, benchmark_data: benchmark_data, subreddit_roberta_values: subreddit_roberta_values, table_values: table_values};
		
		}).then(function(r) {
			//console.log('cleaned', r);
			drawCards(r.index_data, r.benchmark_data);
			drawEmotionCharts(r.subreddit_roberta_values);
			drawChart(r.index_data, r.benchmark_data);
			drawTable(r.index_data, r.table_values);
			$('div.overlay').hide();
		});
		
});

function drawCards(index_data, benchmark_data) {
	
	
	const card_body_html = index_data.map((x, i) => 
		`<div class="col-lg-3 col-sm-6 col-xs-12 border-end border-md-0 pb-3 pb-lg-0">
			<span class="font-sans-serif mb-1 fs-6 pe-2">${x.name} (${moment(x.last_updated).format('MMM Do')})</span>
			<div class="d-flex">
				<div class="display-4 fs-2 mb-2 fw-normal font-sans-serif">
					<span style="color:${x.last_val > 60 ? 'green' : x.last_val >= 40 ? '#d8ca66' : x.last_val >= 20 ? 'orange' : 'red'}">
						${x.last_val}
					</span>
				</div>
				<div class="d-flex flex-column ps-1">
					<p class="mb-0">${(x.ch1w > 0 ? '<i class="bi bi-arrow-up" style="color:var(--bs-success)"></i>' : '<i class="bi bi-arrow-down" style="color:var(--bs-danger)"></i>') + Math.abs(x.ch1w).toFixed(1)} from 7d ago</p>
					<p class="mb-0">${(x.ch1m > 0 ? '<i class="bi bi-arrow-up" style="color:var(--bs-success)"></i>' : '<i class="bi bi-arrow-down" style="color:var(--bs-danger)"></i>') + Math.abs(x.ch1m).toFixed(1)} from 30d ago</p>
				</div>
			</div>
			<nav class="pt-3">
				<div class="nav nav-tabs" id="nav-tab-${i}" role="tablist">
					<button class="nav-link active" id="nav-gauge-tab-${i}" data-bs-toggle="tab" data-bs-target="#nav-gauge-${i}" type="button" role="tab" style="font-size:.9rem">Pulse</button>
					<button class="nav-link" id="nav-index-tab-${i}" data-bs-toggle="tab" data-bs-target="#nav-index-${i}" type="button" role="tab" style="font-size:.9rem">History</button>
					<button class="nav-link" id="nav-emotions-tab-${i}" data-bs-toggle="tab" data-bs-target="#nav-emotions-${i}" type="button" role="tab" style="font-size:.9rem">Breakdown</button>
				</div>
			</nav>
			<div class="tab-content" id="nav-tabContent">
				<div class="tab-pane fade show active" id="nav-gauge-${i}" role="tabpanel">
					<div class="chart-container" id="chart-gauge-${i}"></div>
					<span>Current sentiment is <span style="color:${x.last_val > 60 ? 'green' : x.last_val >= 40 ? '#d8ca66' : x.last_val >= 20 ? 'orange' : 'red'}">${x.last_val > 60 ? 'positive' : x.last_val >= 40 ? 'normal' : x.last_val >= 20 ? 'negative' : 'very negative'}</span>.</span>
				</div>
				<div class="tab-pane fade" id="nav-index-${i}" role="tabpanel"><div class="chart-container" id="chart-index-${i}"></div></div>
				<div class="tab-pane fade" id="nav-emotions-${i}" role="tabpanel">
					<div class="chart-container" id="chart-emotions-${i}"></div>
					<span style="font-size:.75rem">The above chart represents the percentage of articles/posts relevant to this index that predominately express each emotion.</span>
				</div>
			</div>

		</div>`
		).join('\n');

	$('#top-holder').html(card_body_html);
	
	// Gaugage
	index_data.forEach(function(index, i) {
		
		const o = {
			chart: {
				type: 'gauge',
				plotBackgroundColor: null,
				plotBackgroundImage: null,
				plotBorderWidth: 0,
				plotShadow: false,
				spacingTop: -120,
				marginTop: -120,
				height: 150
			},
			title: {
				text: null
			},
			credits: {
				enabled: false
			},
			pane: {
				startAngle: -90,
				endAngle: 90,
				center: ['50%', '100%'],
				background: [{
					// default background
					backgroundColor: 'transparent',
					 borderWidth: 0
				}]
			},
			// the value axis
			yAxis: {
				min: 0,
				max: 100,
				minorTickInterval: 'auto',
				minorTickWidth: 1,
				minorTickLength: 10,
				minorTickPosition: 'inside',
				minorTickColor: '#666',
				tickPixelInterval: 30,
				tickWidth: 2,
				tickPosition: 'inside',
				tickLength: 10,
				tickColor: '#666',
				labels: {
					step: 2,
					rotation: 'auto'
				},
				title: {
					text: null
				},
				plotBands: [{
					from: 60,
					to: 100,
					color: '#55BF3B' // green
				}, {
					from: 40,
					to: 60,
					color: '#DDDF0D' // yellow
				}, {
					from: 20,
					to: 40,
					color: 'orange' // orange
				}, {
					from: 0,
					to: 20,
					color: '#DF5353' // red
				}]
			},
			series: [{
				name: 'Sentiment Index',
				data: [index.last_val],
				tooltip: {
					valueSuffix: ''
				}
			}]
		}
		
		const chart = Highcharts.chart('chart-gauge-' + i, o);

		return;
	});
	

	// TS
	index_data.forEach(function(index, i) {
		
		
		const chart_data = index.data.map(x => [parseInt(moment(x.date).format('x')), x.score_14dma])
		// console.log(chart_data);
		const o = {
			chart: {
				spacingTop: 15,
				backgroundColor: 'rgba(255, 255, 255, 0)',
				plotBackgroundColor: '#FFFFFF',
				height: 300,
				plotBorderColor: 'black',
				plotBorderWidth: 2
			},
			title: {
				text: null
			},
			caption: {
				useHTML: true,
				text: 'Shaded area indicate recessions',
				style: {
					fontSize: '0.75rem'
				}
			},
			plotOptions: {
				series: {
					//shadow: true,
					dataGrouping: {
						enabled: true,
						units: [['day', [1]]]
					}
				}
			},
			rangeSelector: {
				inputEnabled: false,
				buttons: [
					{
						text: '<span style="font-size:.75rem">3M</span>',
						events: {
							click: function(e) {
								const state = $('#chart-index-' + i).highcharts().rangeSelector.buttons[0].state;
								chart.xAxis[0].setExtremes(moment().add(-90, 'd').toDate().getTime(), moment().toDate().getTime());
								$('#chart-index-' + i).highcharts().rangeSelector.buttons[0].setState(state === 0 ? 2 : 0);
								return false;
							}
						}
					}, {
						text: '<span style="font-size:.75rem">1Y</span>',
						events: {
							click: function(e) {
								const state = $('#chart-index-' + i).highcharts().rangeSelector.buttons[1].state;
								chart.xAxis[0].setExtremes(moment().add(-1, 'Y').toDate().getTime(), moment().toDate().getTime());
								$('#chart-index-' + i).highcharts().rangeSelector.buttons[1].setState(state === 0 ? 2 : 0);
								return false;
							}
						}
					}, {
						text: '<span style="font-size:.75rem">YTD</span>',
						events: {
							click: function(e) {
								const state = $('#chart-index-' + i).highcharts().rangeSelector.buttons[2].state;
								chart.xAxis[0].setExtremes(moment().startOf('Year').toDate().getTime(), moment().toDate().getTime());
								$('#chart-index-' + i).highcharts().rangeSelector.buttons[2].setState(state === 0 ? 2 : 0);
								return false;
							}
						}
					}, {
						text: '<span style="font-size:.75rem">All</span>',
						events: {
							click: function(e) {
								const state = $('#chart-index-' + i).highcharts().rangeSelector.buttons[3].state;
								chart.xAxis[0].setExtremes(moment(index.first_date).toDate().getTime(), moment().toDate().getTime());
								$('#chart-index-' + i).highcharts().rangeSelector.buttons[3].setState(state === 0 ? 2 : 0);
								return false;
							}
						}
					}
				],
				buttonPosition: {align: 'right'},
				buttonTheme: { // styles for the buttons
					//width: 20,
					//height: 8,
					style: {
						fontSize: '.75rem'
					},
					padding: 3.5
				}
			},
			xAxis: {
				type: 'datetime',
				dateTimeLabelFormats: {
					day: "%m-%d-%Y",
					week: "%m-%d-%Y"
				},
				min: moment().add(-90, 'd').toDate().getTime(),
				max: moment().toDate().getTime(),
				ordinal: false,
				labels: {
					style: {
						color: 'black'
					}
				},
				plotBands: [
					{color: '#D8D8D8', from: Date.UTC(2020, 2, 1), to: Date.UTC(2021, 2, 28)},
					{color: '#D8D8D8', from: Date.UTC(2007, 12, 1), to: Date.UTC(2009, 6, 30)},
					{color: '#D8D8D8', from: Date.UTC(2001, 3, 1), to: Date.UTC(2001, 11, 30)}
				]
			},
			yAxis: {
				labels: {
					reserveSpace: true,
					style: {
						color: 'black'
					},
					formatter: function () {
						return this.value.toFixed(1);
					}
				},
				opposite: true
			},
			navigator: {
				enabled: false
			},
			legend: {
				enabled: false
			},
			tooltip: {
				useHTML: true,
				formatter: function() {
					return (moment(this.x).format('LL') + ': ' + '<b style="color:' + getColorArray()[i] + '">' + this.y + '</b>');
				},
				backgroundColor: 'rgba(255, 255, 255, .8)',
			},
			series: [{
				name: index.name,
				color: getColorArray()[i],
				data: chart_data
			}]
		};
		
		const chart = Highcharts.stockChart('chart-index-' + i, o);
		$('#chart-index-' + i).highcharts().rangeSelector.buttons[0].setState(2);

		return;
	});

	// Emotions
	index_data.forEach(function(index, i) {
		
		const o = {
			chart: {
				spacingTop: 15,
				backgroundColor: 'white',
				plotBackgroundColor: 'white',
				height: 300,
				type: 'area'
			},
			title: {
				text: null
			},
			credits: {
				enabled: false
			},
			plotOptions: {
				series: {
					//shadow: true,
					dataGrouping: {
						enabled: true,
						units: [['day', [1]]]
					}
				},
				area: {
					stacking: 'percent'
				}
			},
			exporting: {
				enabled: true
			},
			rangeSelector: {
				inputEnabled: false,
				buttons: [
					{
						text: '<span style="font-size:.75rem">3M</span>',
						events: {
							click: function(e) {
								const state = $('#chart-emotions-' + i).highcharts().rangeSelector.buttons[0].state;
								chart.xAxis[0].setExtremes(moment().add(-3, 'M').toDate().getTime(), moment().toDate().getTime());
								$('#chart-emotions-' + i).highcharts().rangeSelector.buttons[0].setState(state === 0 ? 2 : 0);
								return false;
							}
						}
					}, {
						text: '<span style="font-size:.75rem">1Y</span>',
						events: {
							click: function(e) {
								const state = $('#chart-emotions-' + i).highcharts().rangeSelector.buttons[1].state;
								chart.xAxis[0].setExtremes(moment().add(-1, 'Y').toDate().getTime(), moment().toDate().getTime());
								$('#chart-emotions-' + i).highcharts().rangeSelector.buttons[1].setState(state === 0 ? 2 : 0);
								return false;
							}
						}
					}, {
						text: '<span style="font-size:.75rem">YTD</span>',
						events: {
							click: function(e) {
								const state = $('#chart-emotions-' + i).highcharts().rangeSelector.buttons[2].state;
								chart.xAxis[0].setExtremes(moment().startOf('Year').toDate().getTime(), moment().toDate().getTime());
								$('#chart-emotions-' + i).highcharts().rangeSelector.buttons[2].setState(state === 0 ? 2 : 0);
								return false;
							}
						}
					}, {
						text: '<span style="font-size:.75rem">All</span>',
						events: {
							click: function(e) {
								const state = $('#chart-emotions-' + i).highcharts().rangeSelector.buttons[3].state;
								chart.xAxis[0].setExtremes(moment(index.first_date).toDate().getTime(), moment().toDate().getTime());
								$('#chart-emotions-' + i).highcharts().rangeSelector.buttons[3].setState(state === 0 ? 2 : 0);
								return false;
							}
						}
					}
				],
				buttonPosition: {align: 'right'},
				buttonTheme: { // styles for the buttons
					//width: 20,
					//height: 8,
					style: {
						fontSize: '.75rem'
					},
					padding: 3
				}
			},
			xAxis: {
				type: 'datetime',
				dateTimeLabelFormats: {
					day: "%m-%d-%Y",
					week: "%m-%d-%Y"
				},
				min: moment().add(-3, 'M').toDate().getTime(),
				max: moment().toDate().getTime(),
				ordinal: false,
				labels: {
					style: {
						color: 'black'
					}
				}
			},
			yAxis: {
				labels: {
					enabled: false
				},
				opposite: true
			},
			navigator: {
				enabled: false
			},
			legend: {
				enabled: false
			},			
			tooltip: {
				useHTML: true,
				shared: true,
				formatter: function() {
					const y_points = this.points.map(y =>
						'<span style="color:' + y.color +  '">' + `${y.series.name[0].toUpperCase()}${y.series.name.slice(1)}` + '</span>: <b>' + y.percentage.toFixed(1) + '%</b>' //+ ' (' + y.y + ')' + ''						
					).join('<br>');
					return (moment(this.x).format('LL') + '<br>' + y_points);
				},
				backgroundColor: 'rgba(255, 255, 255, .8)',
			},
			series: index.roberta_data.map((y, j) => ({
				name: y.emotion,
				color: y.emotion === 'sadness' ? "#7cb5ec" :
					y.emotion === 'disgust' ? "#434348" :
					y.emotion === 'joy' ? "#90ed7d" :
					y.emotion === 'fear' ? "#f7a35c" :
					y.emotion === 'surprise' ? "#8085e9" :
					y.emotion === 'anger' ? "#f15c80" :
					"#e4d354",//, "#2b908f", "#f45b5b", "#91e8e1"][j],
				data: y.data
			})).sort((a, b) => a.name > b.name ? 1 : -1).map((y, j) => ({
				...y,
				legendIndex: j
			}))
		};
		const chart = Highcharts.stockChart('chart-emotions-' + i, o);
		$('#chart-emotions-' + i).highcharts().rangeSelector.buttons[0].setState(2);

		return;
	});
	

	//console.log(card_html);
	return;
	
}

/*** Draw charts ***/
function drawEmotionCharts(subreddit_roberta_values) {
	
		
	const card_body_html = subreddit_roberta_values.map((x, i) => 
		`<div class="col-xxl-3 col-lg-4 col-xs-6 border p-2">
			<span class="badge rounded-pill ms-2" style="background-color:var(--bs-cmefi-green)">reddit.com/r/${x.subreddit}</span>
			<div id="chart-subreddit-emotions-${i}"></div>
		</div>`
		).join('\n');

	$('#emotions-container').html(card_body_html);
	
	
	subreddit_roberta_values.forEach(function(index, i) {
		
		const o = {
			chart: {
				spacingTop: 15,
				backgroundColor: 'white',
				plotBackgroundColor: 'white',
				height: 300,
				type: 'area'
			},
			title: {
				text: null
			},
			credits: {
				enabled: false
			},
			plotOptions: {
				series: {
					dataGrouping: {
						enabled: true,
						units: [['day', [1]]]
					}
				},
				area: {
					stacking: 'percent'
				}
			},
			exporting: {
				enabled: false
			},
			rangeSelector: {
				inputEnabled: false,
				buttons: [
					{
						text: '<span style="font-size:.75rem">3M</span>',
						events: {
							click: function(e) {
								const state = $('#chart-subreddit-emotions-' + i).highcharts().rangeSelector.buttons[0].state;
								chart.xAxis[0].setExtremes(moment().add(-3, 'M').toDate().getTime(), moment().toDate().getTime());
								$('#chart-subreddit-emotions-' + i).highcharts().rangeSelector.buttons[0].setState(state === 0 ? 2 : 0);
								return false;
							}
						}
					}, {
						text: '<span style="font-size:.75rem">1Y</span>',
						events: {
							click: function(e) {
								const state = $('#chart-subreddit-emotions-' + i).highcharts().rangeSelector.buttons[1].state;
								chart.xAxis[0].setExtremes(moment().add(-1, 'Y').toDate().getTime(), moment().toDate().getTime());
								$('#chart-subreddit-emotions-' + i).highcharts().rangeSelector.buttons[1].setState(state === 0 ? 2 : 0);
								return false;
							}
						}
					}, {
						text: '<span style="font-size:.75rem">YTD</span>',
						events: {
							click: function(e) {
								const state = $('#chart-subreddit-emotions-' + i).highcharts().rangeSelector.buttons[2].state;
								chart.xAxis[0].setExtremes(moment().startOf('Year').toDate().getTime(), moment().toDate().getTime());
								$('#chart-subreddit-emotions-' + i).highcharts().rangeSelector.buttons[2].setState(state === 0 ? 2 : 0);
								return false;
							}
						}
					}, {
						text: '<span style="font-size:.75rem">All</span>',
						events: {
							click: function(e) {
								const state = $('#chart-subreddit-emotions-' + i).highcharts().rangeSelector.buttons[3].state;
								chart.xAxis[0].setExtremes(moment('2020-01-01').toDate().getTime(), moment().toDate().getTime());
								$('#chart-subreddit-emotions-' + i).highcharts().rangeSelector.buttons[3].setState(state === 0 ? 2 : 0);
								return false;
							}
						}
					}
				],
				buttonPosition: {align: 'right'},
				buttonTheme: { // styles for the buttons
					width: 20,
					height: 8,
					style: {
						fontSize: '.75rem'
					}//,
					//padding: 3
				}
			},
			xAxis: {
				type: 'datetime',
				dateTimeLabelFormats: {
					day: "%m-%d-%Y",
					week: "%m-%d-%Y"
				},
				min: moment().add(-3, 'M').toDate().getTime(),
				max: moment().toDate().getTime(),
				ordinal: false,
				labels: {
					style: {
						color: 'black'
					}
				}
			},
			yAxis: {
				labels: {
					enabled: false
				},
				opposite: true
			},
			navigator: {
				enabled: false
			},
			legend: {
				enabled: false
			},			
			tooltip: {
				useHTML: true,
				shared: true,
				formatter: function() {
					const y_points = this.points.map(y =>
						'<span style="color:' + y.color +  '">' + `${y.series.name[0].toUpperCase()}${y.series.name.slice(1)}` + '</span>: <b>' + y.percentage.toFixed(1) + '%</b>' //+ ' (' + y.y + ')' + ''						
					).join('<br>');
					return (moment(this.x).format('LL') + '<br>' + y_points);
				},
				backgroundColor: 'rgba(255, 255, 255, .8)',
			},
			series: index.series.map((y, j) => ({
				name: y.emotion,
				color: y.emotion === 'sadness' ? "#7cb5ec" :
					y.emotion === 'disgust' ? "#434348" :
					y.emotion === 'joy' ? "#90ed7d" :
					y.emotion === 'fear' ? "#f7a35c" :
					y.emotion === 'surprise' ? "#8085e9" :
					y.emotion === 'anger' ? "#f15c80" :
					"#e4d354",//, "#2b908f", "#f45b5b", "#91e8e1"][j],
				data: y.data
			})).sort((a, b) => a.name > b.name ? 1 : -1).map((y, j) => ({
				...y,
				legendIndex: j
			}))
		};
		const chart = Highcharts.stockChart('chart-subreddit-emotions-' + i, o);
		$('#chart-subreddit-emotions-' + i).highcharts().rangeSelector.buttons[0].setState(2);
	});
	
	
}

/*** Draw chart ***/
function drawChart(index_data, benchmark_data) {
	
	//console.log('fcDataParsed', fcDataParsed);
	/*
	const grMap = gradient.create(
	  [0, 1, 24, 48, 72], //array of color stops
	  ['#17202a', '#2874a6', '#148f77', '#d4ac0d', '#cb4335'], //array of colors corresponding to color stops
	  'hex' //format of colors in previous parameter - 'hex', 'htmlcolor', 'rgb', or 'rgba'
	);
	*/
	
	const index_chart_data = index_data.map((x, i) => ({
		id: 'index-' + i,
		name: x.name,
		last_updated: moment(x.last_updated).format('MM/DD/YY'),
		data: x.data.map(y => [moment(y.date).toDate().getTime(), y.score_7dma]),
		type: 'line',
		dashStyle: 'solid',
		lineWidth: 4,
		color: getColorArray()[i],
		yAxis: 0,
		zIndex: 3,
		visible: (x.name === 'Social Media Financial Sentiment Index')
	}));
		
		
	const benchmark_chart_data = benchmark_data.map((x, i) => ({
		id: 'benchmark-' + i,
		name: x.name,
		data: x.data.map(y => [moment(y.date).toDate().getTime(), y.value]),
		type: 'area',
		color: getColorArray()[i + 6],
		zIndex: 2,
		//dashStyle: 'dashed',
		yAxis: 1,
		visible: (x.name === 'S&P 500'),
		threshold: null // Use if area/column instead of line, will prevent min from being 0 http://jsfiddle.net/highcharts/jQVaA/14/
	}));
	
	const chart_data = index_chart_data.concat(benchmark_chart_data);

	/****** Add Sentiment Index Legend *****/
	const legend_indices_html = index_chart_data.map(function(x) {
		const text =
			'<li class="list-group-item border-0 bg-transparent py-1" data-legend-index-id="' + x.id + '">' + 
				'<span style="cursor:pointer">' + 
					'<i class="bi bi-dash-square-fill pe-1" style="color:' + (x.visible === true ? x.color : 'gray') + '"></i>' +
					'<span style="color:' + (x.visible === true ? 'black' : 'gray' ) + '">' + x.name + '</span>' + 
					'<span class="ms-1 badge rounded-pill bg-light text-muted">Updated ' + x.last_updated + '</span>' +
					//'<span style="color:' + (x.visible === true ? 'black' : 'gray' ) + '"> (Updated' + x.last_updated + ')</span>' +
				'</span>' + 
			'</li>';
		return text;
	}).join('\n');
	$('#main-chart-legend-indices').html(legend_indices_html);
	
	// Add event listener
	$('#main-chart-legend-container').on('click', 'li[data-legend-index-id]', function() {
		const chart = $("#main-chart-container").highcharts();
		const series = chart.series.filter(x => x.userOptions.id === this.dataset.legendIndexId)[0];
		if (series.visible === true) {
			[...this.querySelectorAll('span > i, span > span')].forEach(y => y.style.color = 'gray');
			series.setVisible(false);
		} else {
			this.querySelector('span > i').style.color = series.color;
			this.querySelector('span > span').style.color = 'black';
			series.setVisible(true);
		}
		return;
	});

	/****** Add Sentiment Benchmark Legend *****/
	const legend_benchmarks_html = benchmark_chart_data.map(function(x) {
		const text =
			'<li class="list-group-item border-0 bg-transparent py-1" data-legend-benchmark-id="' + x.id + '">' + 
				'<span style="cursor:pointer">' + 
					'<i class="bi bi-dash-square-fill pe-1" style="color:' + (x.visible === true ? x.color : 'gray') + '"></i>' +
					'<span style="color:' + (x.visible === true ? 'black' : 'gray' ) + '">' + x.name + '</span>' + 
				'</span>' + 
			'</li>';
		return text;
	}).join('\n');
	$('#main-chart-legend-benchmarks').html(legend_benchmarks_html);

	// Add event listener
	$('#main-chart-legend-container').on('click', 'li[data-legend-benchmark-id]', function() {
		const chart = $("#main-chart-container").highcharts();
		const series = chart.series.filter(x => x.userOptions.id === this.dataset.legendBenchmarkId)[0];
		
		chart.series.filter(x => x.userOptions.yAxis === 1 && x.userOptions.id !== this.dataset.legendBenchmarkId && x.visible === true).forEach(x => x.setVisible(false));
		
		[...document.querySelector('#main-chart-legend-container').querySelectorAll('li[data-legend-benchmark-id] > span > i, li[data-legend-benchmark-id] > span > span')].forEach(x => x.style.color = 'gray');
		
		if (series.visible === true) {
			[...this.querySelectorAll('span > i, span > span')].forEach(y => y.style.color = 'gray');
			series.setVisible(false);
		} else {
			this.querySelector('span > i').style.color = series.color;
			this.querySelector('span > span').style.color = 'black';
			series.setVisible(true);
		}
		return;
	});
	
	
	// console.log('chart_data', chart_data);
	
	const o = {
        chart: {
			spacingTop: 15,
            backgroundColor: 'rgba(255, 255, 255, 0)',
			plotBackgroundColor: '#FFFFFF',
			style: {
				fontColor: 'var(--bs-cmefi-green)'
			},
			height: 500,
			plotBorderColor: 'black',
			plotBorderWidth: 2
        },
        title: {
			useHTML: true,
			text: 
				'<img class="me-1" width="18" height="18" src="/static/cmefi-short.svg">' +
				'<div style="vertical-align:middle;display:inline"><span>Economic Sentiment Indices</span></div>',
			style: {
				fontSize: '1.3rem',
				color: 'var(--bs-dark)'
			}
        },
		caption: {
			useHTML: true,
			text: 'Shaded area indicate recessions',
			style: {
				fontSize: '0.75rem'
			}
		},
        plotOptions: {
			series: {
				//shadow: true,
				dataGrouping: {
					enabled: true,
					units: [['day', [1]]]
				},
				marker : {
					enabled: true,
					radius: 2,
					symbol: 'triangle'
				}
			}
        },
		rangeSelector: {
			buttons: [
				{
					text: '<span style="font-size:.75rem">3M</span>',
					events: {
						click: function(e) {
							const state = $('#main-chart-container').highcharts().rangeSelector.buttons[0].state;
							chart.xAxis[0].setExtremes(moment().add(-3, 'M').toDate().getTime(), moment().toDate().getTime());
							$('#main-chart-container').highcharts().rangeSelector.buttons[0].setState(state === 0 ? 2 : 0);
							return false;
						}
					}
				}, {
					text: '<span style="font-size:.75rem">6M</span>',
					events: {
						click: function(e) {
							const state = $('#main-chart-container').highcharts().rangeSelector.buttons[1].state;
							chart.xAxis[0].setExtremes(moment().add(-6, 'M').toDate().getTime(), moment().toDate().getTime());
							$('#main-chart-container').highcharts().rangeSelector.buttons[1].setState(state === 0 ? 2 : 0);
							return false;
						}
					}
				}, {
					text: '<span style="font-size:.75rem">1Y</span>',
					events: {
						click: function(e) {
							const state = $('#main-chart-container').highcharts().rangeSelector.buttons[2].state;
							chart.xAxis[0].setExtremes(moment().add(-1, 'Y').toDate().getTime(), moment().toDate().getTime());
							$('#main-chart-container').highcharts().rangeSelector.buttons[2].setState(state === 0 ? 2 : 0);
							return false;
						}
					}
				}, {
					text: '<span style="font-size:.75rem">YTD</span>',
					events: {
						click: function(e) {
							const state = $('#main-chart-container').highcharts().rangeSelector.buttons[3].state;
							chart.xAxis[0].setExtremes(moment().startOf('Year').toDate().getTime(), moment().toDate().getTime());
							$('#main-chart-container').highcharts().rangeSelector.buttons[3].setState(state === 0 ? 2 : 0);
							return false;
						}
					}
				}, {
					text: '<span style="font-size:.75rem">All</span>',
					events: {
						click: function(e) {
							const state = $('#main-chart-container').highcharts().rangeSelector.buttons[4].state;
							chart.xAxis[0].setExtremes(moment('2020-01-01').toDate().getTime(), moment().toDate().getTime());
							$('#main-chart-container').highcharts().rangeSelector.buttons[4].setState(state === 0 ? 2 : 0);
							return false;
						}
					}
				}
			],
			buttonTheme: { // styles for the buttons
				width: '6rem',
				padding: 5
			}
		},
		xAxis: {
			type: 'datetime',
            dateTimeLabelFormats: {
                day: "%m-%d-%Y",
                week: "%m-%d-%Y"
            },
			plotBands: [
				{color: '#D8D8D8', from: Date.UTC(2020, 2, 1), to: Date.UTC(2021, 2, 28)},
				{color: '#D8D8D8', from: Date.UTC(2007, 12, 1), to: Date.UTC(2009, 6, 30)},
				{color: '#D8D8D8', from: Date.UTC(2001, 3, 1), to: Date.UTC(2001, 11, 30)}
			],
			ordinal: false,
			min: moment().startOf('Year').toDate().getTime(), //moment().add(-1, 'Y').toDate().getTime(), 
			max: moment().toDate().getTime(),
			labels: {
				style: {
					color: 'black'
				}
			}
		},
		yAxis: [{
			title: {
				text: 'Sentiment Index',
				style: {
					color: 'black'
				}
			},
			opposite: false,
			endOnTick: false
		}, {
			title: {
				text: 'Benchmark',
				style: {
					color: 'black'
				}
			},
			opposite: true,
			endOnTick: false
		}],
        navigator: {
            enabled: true,
			height: 30,
			maskFill: 'rgba(48, 79, 11, .3)'
        },
		legend: {
			enabled: false
		},
        tooltip: {
            useHTML: true,
			shared: true,
			backgroundColor: 'rgba(255, 255, 255, .8)',
        },
        series: chart_data
	};
	
	const chart = Highcharts.stockChart('main-chart-container', o);
	chart.rangeSelector.buttons[3].setState(2);

	return;
}




function drawTable(index_data, table_values) {
	
		
	const series_names = [... new Set(index_data.map(x => x.name))];
		
	const dt_cols = [
		{title: 'Date', data: 'date'},
	].concat(
		series_names.map(x => ({
			title: x,
			data: 'index-id-' + index_data.filter(y => y.name === x)[0].id
		}))
	).map(function(x, i) {
		return {...x, ...{
			visible: true,
			orderable: true,
			ordering: true,
			type: (x.title === 'Date' ? 'date' : 'num'),
			className: 'dt-center',
			css: 'font-size: .9rem',
			// Due to the method of JSON aggregatino in PostgreSQL clause (needed for pivoting table), inevitable will be some NULL/missing values in some columns
			defaultContent: '' // ALlow missing/null content - see https://datatables.net/manual/tech-notes/4
		}}
	});
	
	//console.log(dt_cols, table_values);
	
	const copySvg =
	`<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-clipboard me-1" viewBox="0 0 16 16">
		<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
		<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
	</svg>`;
	const dlSvg = 
	`<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-download me-1" viewBox="0 0 16 16">
	  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path>
	  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"></path>
	</svg>`;
	const o = {
		data: table_values,
		columns: dt_cols,
		iDisplayLength: 15,
		dom:
			"<'row justify-content-end'<'col-auto'B>>" +
			"<'row justify-content-center'<'col-12'tr>>" +
			"<'row justify-content-end'<'col-auto'p>>",
		buttons: [
			{extend: 'copyHtml5', text: copySvg + 'Copy', exportOptions: {columns: [0, 2]}, className: 'btn btn-sm'},
			{extend: 'csvHtml5', text: dlSvg + 'Download', exportOptions: {columns: [0, 2]}, className: 'btn btn-sm'}
		],
		order: [[0, 'desc']],
		paging: true,
		pagingType: 'numbers',
		responsive: true,
		createdRow: function(row, data, dataIndex) {
		}
	}
	$('#sentiment-table').DataTable(o)
	
	
	return;
}
