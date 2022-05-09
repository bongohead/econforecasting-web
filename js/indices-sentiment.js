document.addEventListener("DOMContentLoaded", function(event) {
	
	/********** INITIALIZE **********/
	$('div.overlay').show();

	const promises = [
		getFetch('get_sentiment_analysis_indices', ['indices', 'index_values'], 10000, false),
		getFetch('get_sentiment_analysis_benchmarks', ['benchmarks', 'benchmark_values'], 10000, false),

	];

	/********** GET DATA **********/
	const ud = getData('indices-sentiment') || {};
	
	Promise.all(promises)
		.then(function(r) {
			
			console.log('raw', r);
			
			const indices = r[0].indices;
			const index_values = r[0].index_values;
			const index_data = indices.map(function(x) {
				const data = index_values.filter(y => y.index_id === x.id).map(y => ({
					date: y.date,
					count: y.count,
					score: Number(y.score),
					score_7dma: Number(y.score_7dma),
					created_at: y.created_at
				}));
				return {
					...x,
					data: data,
					first_date: moment.min(data.map(y => moment(y.date))).format('YYYY-MM-DD'),
					last_updated: moment.max(data.map(y => moment(y.created_at))).format('YYYY-MM-DD')
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
			
			return {index_data: index_data, benchmark_data: benchmark_data};
		
		}).then(function(r) {
			console.log('cleaned', r);
			drawCards(r.index_data, r.benchmark_data);
			drawChart(r.index_data, r.benchmark_data);
			$('div.overlay').hide();
		});
		
});

function drawCards(index_data, benchmark_data) {
	
	const card_html = index_data.map((x, i) => 
		`<div class="col-xxl-4 col-xl-6 col-md-12 px-0">
			<div class="card my-3 mx-2 rounded shadow-sm">
				<div class="card-body py-0">
					<span style="vertical-align:middle;font-size:1.0rem;">${x.name}</span>
					<div class="chart-container" id="chart-container-${i}"></div>
				</div>
			</div>
		</div>`
		).join('\n');

	$('#chart-holder').html(card_html);

	index_data.forEach(function(index, i) {
		
		const chart_data = index.data.map(x => [parseInt(moment(x.date).format('x')), x.score_7dma])
		// console.log(chart_data);
		const o = {
			chart: {
				spacingTop: 15,
				backgroundColor: 'rgba(255, 255, 255, 0)',
				plotBackgroundColor: '#FFFFFF',
				height: 400,
				plotBorderColor: 'black',
				plotBorderWidth: 2
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
				}
			},
			rangeSelector: {
				inputEnabled: false,
				buttons: [
					{
						text: '<span style="font-size:.75rem">3M</span>',
						events: {
							click: function(e) {
								const state = $('#chart-container-' + i).highcharts().rangeSelector.buttons[0].state;
								chart.xAxis[0].setExtremes(moment().add(-90, 'd').toDate().getTime(), moment().toDate().getTime());
								$('#chart-container-' + i).highcharts().rangeSelector.buttons[0].setState(state === 0 ? 2 : 0);
								return false;
							}
						}
					}, {
						text: '<span style="font-size:.75rem">1Y</span>',
						events: {
							click: function(e) {
								const state = $('#chart-container-' + i).highcharts().rangeSelector.buttons[1].state;
								chart.xAxis[0].setExtremes(moment().add(-1, 'Y').toDate().getTime(), moment().toDate().getTime());
								$('#chart-container-' + i).highcharts().rangeSelector.buttons[1].setState(state === 0 ? 2 : 0);
								return false;
							}
						}
					}, {
						text: '<span style="font-size:.75rem">YTD</span>',
						events: {
							click: function(e) {
								const state = $('#chart-container-' + i).highcharts().rangeSelector.buttons[2].state;
								chart.xAxis[0].setExtremes(moment().startOf('Year').toDate().getTime(), moment().toDate().getTime());
								$('#chart-container-' + i).highcharts().rangeSelector.buttons[2].setState(state === 0 ? 2 : 0);
								return false;
							}
						}
					}, {
						text: '<span style="font-size:.75rem">All</span>',
						events: {
							click: function(e) {
								const state = $('#chart-container-' + i).highcharts().rangeSelector.buttons[3].state;
								chart.xAxis[0].setExtremes(moment(index.first_date).toDate().getTime(), moment().toDate().getTime());
								$('#chart-container-' + i).highcharts().rangeSelector.buttons[3].setState(state === 0 ? 2 : 0);
								return false;
							}
						}
					}
				],
				buttonTheme: { // styles for the buttons
					width: '5rem',
					padding: 4,
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
				plotBands: [
					{color: '#D8D8D8', from: Date.UTC(2020, 2, 1), to: Date.UTC(2021, 2, 28)},
					{color: '#D8D8D8', from: Date.UTC(2007, 12, 1), to: Date.UTC(2009, 6, 30)},
					{color: '#D8D8D8', from: Date.UTC(2001, 3, 1), to: Date.UTC(2001, 11, 30)}
				],
				ordinal: false,
				labels: {
					style: {
						color: 'black'
					}
				}
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
		
		const chart = Highcharts.stockChart('chart-container-' + i, o);
		$('#chart-container-' + i).highcharts().rangeSelector.buttons[0].setState(2);

		return;
	});
	

	//console.log(card_html);
	return;
	
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
		visible: (x.name === 'Social Media Financial Markets Sentiment Index')
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
	
	
	console.log('chart_data', chart_data);
	
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
			min: moment().add(-1, 'Y').toDate().getTime(), 
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
	chart.rangeSelector.buttons[2].setState(2);

	return;
}




function drawTable(ts_data_parsed, units) {
	
	//console.log('fcDataParsed', fcDataParsed);
	// Turn into list of series
	// Separate tab for each table
	const table_data = ts_data_parsed.sort((a, b) => a.ts_type === 'hist' ? -1 : b.ts_type === 'hist' ? 1 : a.ts_type === 'primary' ? -1: 0).forEach(function(x, i) {
		//console.log(x.fcname);
		const seriesData =
			(x.tskey === 'hist') ?
			x.data.map(y => ({date: (x.freq === 'q' ? moment(y[0]).format('YYYY[Q]Q') : moment(y[0]).format('YYYY-MM')), type: 'Historical Data', value: y[1].toFixed(4)})) :
			x.data.map(y => ({date: (x.freq === 'q' ? moment(y[0]).format('YYYY[Q]Q') : moment(y[0]).format('YYYY-MM')), type: 'Forecast', value: y[1].toFixed(4)}));
		const dtCols = [
			{title: 'Date', data: 'date'},
			{title: 'Type', data: 'type'},
			{title: units, data: 'value'}
		].map(function(x, i) {
			return {...x, ...{
				visible: (x.title !== 'Type'),
				orderable: true,
				ordering: true,
				type: (x.title === 'Date' ? 'date' : 'num'),
				className: 'dt-center',
				css: 'font-size: .9rem'
			}}
		});
		//console.log(dtCols);
		
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
			data: seriesData,
			columns: dtCols,
			iDisplayLength: 15,
			dom:
				"<'row justify-content-end'<'col-auto'B>>" +
				"<'row justify-content-center'<'col-12'tr>>" +
				"<'row justify-content-end'<'col-auto'p>>",
			buttons: [
				{extend: 'copyHtml5', text: copySvg + 'Copy', exportOptions: {columns: [0, 2]}, className: 'btn btn-sm'},
				{extend: 'csvHtml5', text: dlSvg + 'Download', exportOptions: {columns: [0, 2]}, className: 'btn btn-sm'}
			],
			order: (x.tskey === 'hist' ? [[0, 'desc']] : [[0, 'asc']]),
			paging: true,
			pagingType: 'numbers',
			responsive: true,
			createdRow: function(row, data, dataIndex) {
				/*if (data.type === 'history')  {
					$(row).addClass('dog');
					$(row).css('color', 'var(--econgreen)');
				} else {
					$(row).css('color', 'var(--econred)');
				}*/
			}
		}
		//console.log('seriesData', seriesData);
		
		// Create button for this forecast
		const li = document.createElement('li');
		li.classList.add('list-group-item');
		li.classList.add('d-flex');
		li.classList.add('justify-content-between');
		li.classList.add('align-items-center');
		//li.classList.add('w-100'); // Needed to get the thing to vertically align
		li.innerHTML =
			'<span>' +
				(x.ts_type === 'primary' ? '<i class="cmefi-logo me-1"></i>' : '') + x.shortname +
			'</span>' + 
			'<span style="font-size:0.7rem;color: rgb(180, 180, 180)" >' +
				('Updated ' + moment(x.vdate).format('MM/DD/YYYY')) +
			 '</span>';
		li.setAttribute('data-ref-table', x.tskey); 
		if (x.ts_type === 'primary') li.classList.add('active');
		document.querySelector('#li-container').appendChild(li);
		
		
		// Create table and style it
		const table = document.createElement('table');
		table.classList.add('table');
		table.classList.add('data-table');
		table.classList.add('w-100');
		table.id = 'table-' + x.tskey;
		document.querySelector('#tables-container').appendChild(table);
		

		// Draw the table
		const dTable = $(table).DataTable(o);
		if (x.ts_type !== 'primary') $(table).parents('div.dataTables_wrapper').first().hide();
		//console.log(dTable);

		// Move the download buttons
		//console.log(table.parentElement);
		const downloadDiv = table.closest('.dataTables_wrapper').querySelector('.dt-buttons');
		downloadDiv.classList.add('float-end');
		downloadDiv.id = 'download-' + x.tskey;
		if (i !== 0) downloadDiv.style.display = 'none'
		$('#tables-container > div > span').after($(downloadDiv).detach());
		
		/* Now add event listener */
		li.addEventListener('click', function() { 
			//console.log(this, this.getAttribute('data-ref-table'));
			// Change active li
			document.querySelectorAll('#li-container > li').forEach(el => el.classList.remove('active'));
			this.classList.add('active');
			
			// First hide all tables-container
			$('div.dataTables_wrapper').hide();
			
			const table = document.querySelector('#table-' + this.getAttribute('data-ref-table'));
			$(table).parents('div.dataTables_wrapper').first().show();
			
			$('#data-card div.dt-buttons').hide();
			$('#download-' + this.getAttribute('data-ref-table')).show();
						
		}, false);
	});
	
	
	return;
}


function drawDescription(ts_data_parsed, varname, primary_forecast) {
	
	const description_html =
		varname === 'sofr' 
			? 
			`<p> This page provides monthly forecasts of the secured overnight financing rate (SOFR), a major <a href="https://www.investopedia.com/terms/r/referencerate.asp">benchmark interest rate</a> in the world 
			economy. 
			The rate measures the cost of overnight inter-bank borrowing rates for loans collaterized by Treasury securities.
			SOFR was created in 2019 as a replacement for the London interbank offered rate (Libor) following the 
			<a href="https://en.wikipedia.org/wiki/Libor_scandal" >2012 Libor rate manipulation scandal</a>. </p>`
		: varname === 'ffr'
			? 
			`<p>This page provides monthly forecasts of the <a href="https://fred.stlouisfed.org/series/FEDFUNDS">federal funds rate</a>, the short-term 
			 lending rate between different banks of cash held at the Federal Reserve. The federal funds rate is a critical benchmark rate in the global economy, 
			 and is the primary rate considered by the Federal Reserve when deciding monetary policy.</p>
			 <p>Both historical data and forecasted values on this page reflect period average values.</p>`
		: varname === 'ameribor'
			? 
			`<p>This page provides monthly forecasts of the overnight <a href="https://ameribor.net/">American Interbank Offered Rate</a>, a benchmark of the short-term 
			 lending rate between small and medium sized U.S. banks. The AMERIBOR rate was introduced in 2021 as an alternative to the now-defunct 
			 London interbank offer rate (Libor).</p>
			<p>Both historical data and forecasted values on this page reflect period average values.</p>`
		: varname === 'bsby'
			?
			`<p>This page provides monthly forecasts of the <a href="https://www.bloomberg.com/professional/product/indices/bsby/">Bloomberg Short-Term Bank Yield Index</a>, a benchmark of the short-term 
			 lending rate between large global banks. The BSBY rate was introduced in 2021 as an alternative to the now-defunct 
			 London interbank offer rate (Libor).</p>
			<p>Both historical data and forecasted values on this page reflect period average values.</p>`
		: varname === 'sonia'
			?
			`<p>This page provides monthly forecasts of the Sterling Overnight Interbank Average Rate (SONIA), a measure of overnight lending rates between banks using British 
			sterling. SONIA is administered by the Bank of England and is frequently used as a standardized measure of risk-free interest rates by U.K. authorities.<p>
			<p>Both historical data and forecasted values on this page reflect period average values.</p>`
		: varname === 'estr'
			?
			`<p>This page provides monthly forecasts of the Euro short-term rate (&euro;STR), a benchmark of the short-term 
			 unsecured lending rate in the euro area. The &euro;STR is used as a standard measure of the risk-free rate in the euro area. 
			 Unlike most risk-free rate benchmarkes, the &euro;STR reflects not just interbank lending, 
			 but lending between banks, insurers, and money market funds.<p>
			<p>Both historical data and forecasted values on this page reflect period average values.</p>`

		: ['mort15y', 'mort30y'].includes(varname)
			?
			`<p>This page provides monthly forecasts of 15 and 30-year fixed rate mortgage rates in the United States. 
			Historical data is sourced from <a href="https://www.freddiemac.com/pmms">Freddie Mac</a>.</p>
			<p>Both historical data and forecasted values on this page reflect period average values.</p>`
		: ['t03m', 't06m', 't01y', 't02y', 't05y', 't10y', 't20y', 't30y'].includes(varname)
			?
			`<p>This page provides monthly forecasts of U.S. Treasury bond yields. With over $20 trillion outstanding, Treasury bonds constitute nearly 15% of the global bond market and are the premier safe assets in many 
			financial markets across the world. Because of this, they are also often utilized as a benchmark measure of the riskless interest rate in the world economy.</p>
			<p>Both historical data and forecasted values on this page reflect period average values.</p>`
		: ['gdp'].includes(varname)
			?
			`<p>This page provides quarterly forecasts of U.S. real GDP. All historical and forecasted values represent seasonally adjusted annualized rates.</p>`
		: ['pce'].includes(varname)
			?
			`<p>This page provides quarterly forecasts of U.S. real personal consumption. All historical and forecasted values represent seasonally adjusted annualized rates.</p>`
		: ['cpi'].includes(varname)
			?
			`<p>This page provides forecasts of monthly inflation rates, as measured by the year over year percent change in standard headline CPI, 
			i.e. the <a href="https://www.bls.gov/news.release/cpi.t01.htm">consumer price index for all urban consumers (CPI-U)</a>.</p>`
		: 'Error';
	document.querySelector('#variable-description').innerHTML = description_html + '<hr>';

	
	const primary_forecast_html =
		varname === 'sofr' 
			? 
			`<p>Our <strong><i class="cmefi-logo mx-1"></i>Market Consensus Forecast</strong> for the secured overnight financing rate (SOFR) is generated utilizing data on publicly-traded SOFR futures 
			and other closely related benchmark interest rates. 
			Using this information, we construct a forward term structure for the full yield curve. The term structure is interpolated and smoothed using a three-factor 
			parametrization model, generating the final forecast.</p>
			<p>This forecast can be interpreted as the mean market-expected values of future SOFR values.</p>`
		: varname === 'ffr'
			? 
			`<p>Our <strong><i class="cmefi-logo mx-1"></i>Market Consensus Forecast</strong> for the federal funds rate rate (FFR) is generated utilizing data on publicly-traded FFR futures 
			and other closely related benchmark interest rates. 
			Using this information, we construct a forward term structure for the full yield curve. The term structure is interpolated and smoothed using a three-factor 
			parametrization model, generating the final forecast.</p>
			<p>This forecast can be interpreted as the mean market-expected values of future FFR values.</p>`
		: varname === 'ameribor'
			?
			`<p>Our <strong><i class="cmefi-logo mx-1"></i>Market Consensus Forecast</strong> for the Ameribor Unsecured Overnight Rate (AMERIBOR) is generated utilizing data on publicly-traded AMERIBOR futures 
			and other closely related benchmark interest rates. 
			Using this information, we construct a forward term structure for the full yield curve. The term structure is interpolated and smoothed using a three-factor 
			parametrization model, generating the final forecast.</p>
			<p>This forecast can be interpreted as the mean market-expected values of future AMERIBOR values.</p>`
		: varname === 'bsby'
			?
			`<p>Our <strong><i class="cmefi-logo mx-1"></i>Market Consensus Forecast</strong> for the Bloomberg Short-Term Bank Yield Index (BSBY) is generated utilizing data on publicly-traded BSBY futures 
			and other closely related benchmark interest rates. 
			Using this information, we construct a forward term structure for the full yield curve. The term structure is interpolated and smoothed using a three-factor 
			parametrization model, generating the final forecast.</p>
			<p>This forecast can be interpreted as the mean market-expected values of future BSBY values.</p>`
		: varname === 'sonia'
			?
			`<p>Our <strong><i class="cmefi-logo mx-1"></i>Market Consensus Forecast</strong> for the SONIA rate is generated utilizing data on publicly-traded SONIA futures 
			and other closely related benchmark interest rates. 
			Using this information, we construct a forward term structure for the full yield curve. The term structure is interpolated and smoothed using a three-factor 
			parametrization model, generating the final forecast.</p>
			<p>This forecast can be interpreted as the mean market-expected values of future SONIA values.</p>`
		: varname === 'estr'
			?
			`<p>Our <strong><i class="cmefi-logo mx-1"></i>Market Consensus Forecast</strong> for the Euro short-term rate is generated utilizing data on publicly-traded ESTR futures 
			and other closely related benchmark interest rates. 
			Using this information, we construct a forward term structure for the full yield curve. The term structure is interpolated and smoothed using a three-factor 
			parametrization model, generating the final forecast.</p>
			<p>This forecast can be interpreted as the mean market-expected values of future ESTR values.</p>`

		: ['mort15y', 'mort30y'].includes(varname)
			?
			`<p>Our <strong><i class="cmefi-logo mx-1"></i>Market Consensus Forecast</strong> for the 15 and 30 year fixed rate mortgage rates are derived from combining our 
			<a href="/forecast-t10y">Market Consensus Forecast for Treasury yields</a> with survey-based forecasts for housing prices.</p>
			<p>First, using historical data, we calculate historical mortgage-Treasury yield spreads; a model is then used to calculate the relationship 
			between these spreads and housing prices. 
			We then use survey-based economist forecasts of housing prices to estimate future mortgage-Treasury yield spreads, and add these to our 
			Market Consensus Forecasts for Treasury yields to arrive at our final estimate.</p>`
		: ['t03m', 't06m', 't01y', 't02y', 't05y', 't10y', 't20y', 't30y'].includes(varname)
			? 
			`<p>Our <strong><i class="cmefi-logo mx-1"></i>Consensus Treasury Forecast</strong> is a model that calculates the average market expectated forecast of U.S. Treasury yield rates. 
			It is derived using current <a href="https://www.treasury.gov/resource-center/data-chart-center/Pages/index.aspx">Treasury bond market data</a> 
			as well as futures market data. For each point in the yield term structure, our model derives the mean market-expected yield rate. 
			The term structure is then interpolated and smoothed using a three-factor parametrization model, generating the final forecast.</p>`
		: ['gdp', 'pce'].includes(varname)
			? 
			`<p>Our <strong><i class="cmefi-logo mx-1"></i>Composite Forecast Model</strong> is a model of models, 
			optimally finding weights between different qualitative and quantitative forecasts to generate a single composite forecast.<p>
			<p>Assigned weights are time-varying and depend on the remaining time until the official data release. For example, high-frequency <a href="/forecast-gdp-nowcast">nowcast</a> models 
			tend to perform better for short-term forecasts, while qualitative forecasts tend to be better predictors for long-term forecasts; 
			our model combines these forecasts using a locally linear random forest method to optimize the strengths of each forecast.</p>`
		: ['cpi'].includes(varname)
			? 
			`<p>Our <strong><i class="cmefi-logo mx-1"></i>Consensus Inflation Forecast</strong> is a model that measures the average expected inflation rate. 
			It is derived using bond market data (utilizing the spread between Treasury Inflation Protected Securities and Treasury yields) 
			as well as from household survey data. For each point in the forward term structure, our model derives the mean market-expected inflation rate. 
			The term structure is interpolated and smoothed using a three-factor parametrization model, generating the final forecast.</p>
			<p>The model is updated monthly, generally on the next business day following the release of CPI inflation data. 
			The CPI release schedule can be found <a href="https://www.bls.gov/schedule/news_release/cpi.htm">here</a>.</p>`
		: 'Data error - please reload the page'
		
	document.querySelector('#primary-forecast').innerHTML =
		primary_forecast_html +
		'<p>This model is updated daily. New releases will be made available between 16:00 and 20:00 ET.</p>';


	const external_forecasts = ts_data_parsed.filter(x => x.tskey != primary_forecast & x.tskey != 'hist');
	if (external_forecasts.length > 0) {
		const external_forecast_html =
			'<hr><div class="pt-2">Other included forecasts on this page are from external sources:' +
				'<ul>' +
					external_forecasts.map(x => '<li>' + x.description + '</li>').join('\n') +
				'</ul>' +
			'</div>';
		document.querySelector('#external-forecasts').innerHTML = external_forecast_html;
	}
	
	const primary_forecast_name =
		primary_forecast === 'int' ? 'Consensus Interest Rate Forecast Model'
		: primary_forecast === 'einf' ? 'Consensus Inflation Model'
		: primary_forecast === 'comp' ? 'Composite Forecast Model'
		: ''

	const citation_html =
		'Recommended citation for the ' + primary_forecast_name + ':</br>' + 
		'<span class="fw-lighter text-muted">' + 
			'<em>econforecasting.com</em>, The Center for Macroeconomic Forecasts and Insights (' + new Date().getFullYear() + '). ' +
			primary_forecast_name + '. Retrieved from ' + window.location.href + '.' 
		'</span>'
	document.querySelector('#citation').innerHTML = citation_html;
	
	return;
}

