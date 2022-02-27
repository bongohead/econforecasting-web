document.addEventListener("DOMContentLoaded", function(event) {

	/********** INITIALIZE **********/
	$('div.overlay').show();
	
	/*** Set Default Data ***/
	(function() {
		const ud_prev = getAllData()['forecast-treasury-curve'] || {};
		const ud = {... ud_prev, ... {}};
		setData('forecast-treasury-curve', ud);
	})();

	/********** GET DATA **********/
	const ud = getData('forecast-treasury-curve') || {};
	const get_forecast_hist_values_last_vintage = getFetch('get_forecast_hist_values_last_vintage', ['forecast_hist_values'], {forecast: 'int', varname: ['t01m', 't03m', 't06m', 't01y', 't05y', 't07y', 't10y', 't20y', 't30y'], freq: 'm', form: 'd1'}, 10000, false);	
	// Don't bother with t07y
	const get_forecast_values_dfd = getFetch('get_forecast_values_last_vintage', ['forecast_values'], {varname: ['t01m', 't03m', 't06m', 't01y', 't05y', 't07y', 't10y', 't20y', 't30y'], freq: 'm', form: 'd1'}, 10000, false);
	Promise.all([get_forecast_hist_values_last_vintage, get_forecast_values_dfd]).then(function(response) {
		const hist_values_raw = response[0].forecast_hist_values.map(x => ({
			date: x.date,
			value: parseFloat(x.value),
			ttm: parseInt(x.varname.substring(1, 3)) * (x.varname.substring(3, 4) === 'm' ? 1 : 12)
			}));
		//console.log('hist_values_raw', hist_values_raw);
		
		const hist_values =
			[... new Set(hist_values_raw.map(x => x.date))] // Get list of obs_dates
			.map(d => ({
				date: d,
				type: 'history',
				data: hist_values_raw.filter(x => x.date == d).map(x => [x.ttm, x.value]).sort((a, b) => a[0] - b[0]); // Sort according to largest value
			}));
		//console.log('hist_values', hist_values);
		
		const forecast_values_raw = response[1].forecast_values.map(x => ({
			vdate : x.vdate,
			date: x.date,
			value: parseFloat(x.value),
			ttm: parseInt(x.varname.substring(1, 3)) * (x.varname.substring(3, 4) === 'm' ? 1 : 12)
		}));

		const forecast_vdate = forecast_values_raw[0].vdate;		
		const forecast_values =
			[... new Set(forecast_values_raw.map(x => x.date))]
			.map(d => ({ // Group each value of the original array under the correct obs_date
				date: d,
				type: 'forecast',
				data: forecast_values_raw.filter(x => x.date == d).map(x => [x.ttm, x.value]).sort((a, b) => a[0] - b[0]); // Sort according to largest value
			}));
		//console.log('forecast_values', forecast_values);
		
		const treasury_data = hist_values.concat(forecast_values).map((x, i) => ({...x, ...{date_index: i}}));
		const res = {
			treasury_data: treasury_data,
			forecast_vdate: forecast_vdate,
			play_state: 'pause',
			play_index: treasury_data.filter(x => x.type === 'forecast')[0].date_index
		};
		// console.log('res', res);
		setData('forecast-treasury-curve', {...getData('forecast-treasury-curve'), ...res});
		return(res);
	})
	/********** DRAW CHART & TABLE **********/
	.then(function(res) {
		//console.log('treasury_data', res.treasury_data);
		drawChart(res.treasury_data, res.play_index, res.forecast_vdate);
		drawChartAlt(res.treasury_data);
		drawTable(res.treasury_data);
		addCitation();
		addVdate(res.forecast_vdate);
		$('div.overlay').hide();
	});
	
	/********** EVENT LISTENERS FOR PLAYING **********/
	$('#chart-container').on('click', '#chart-subtitle-group > button.chart-subtitle', function() {
		const ud = getData('forecast-treasury-curve');
		const clickedPlayDirection = $(this).data('dir');
		if (ud.play_state == null) return;
           
		if (clickedPlayDirection === 'pause') {
			var newPlayState = 'pause';
			var newPlayIndex = ud.play_index;
		}
		else if (clickedPlayDirection === 'start' || clickedPlayDirection === 'end') {
			var newPlayState = 'pause';
			var newPlayIndex = (clickedPlayDirection === 'start') ? 0 : ud.treasury_data.length - 1;
		}
		// If click back & index greater than 5, head back by 5, otherwise 0 
		else if (clickedPlayDirection === 'back' || clickedPlayDirection === 'forward') {
			var newPlayState = clickedPlayDirection;
			if (clickedPlayDirection === 'back') var newPlayIndex = (ud.play_index >= 1) ? ud.play_index - 1 : 0;
			else var newPlayIndex = (ud.play_index + 1 <= ud.treasury_data.length - 1) ? ud.play_index + 1 : ud.treasury_data.length;
		}
		//console.log('clicked', clickedPlayDirection, newPlayState, newPlayIndex);
				           
		setData('forecast-treasury-curve', {...getData('forecast-treasury-curve'), ...{play_state: newPlayState, play_index: newPlayIndex}});
		if (clickedPlayDirection !== 'pause') updateChart();
		else updateButtons();
		
		return;
    });


});

/*** Draw chart ***/
function drawChart(treasury_data, play_index, forecast_vdate) {
	Highcharts.AST.allowedAttributes.push('data-dir');
	const o = {
        chart: {
			spacingTop: 10,
            backgroundColor: 'transparent',
			plotBackgroundColor: 'transparent',
			height: 400,
			plotBorderColor: 'rgb(33, 37, 41)',
			plotBorderWidth: 2,
			events: {
				load: function() {
					const distFromTop = this.chartHeight - (this.marginBottom + this.plotHeight) + 40;
					const distFromLeft = 50;
					//console.log(distFromTop, distFromLeft);
					this.renderer
						.text('Forecast for ' + moment(treasury_data[play_index].date).format('MMM YYYY'), distFromLeft, distFromTop)
						.attr({'id': 'date-text', fill: 'forestgreen', 'font-size': '1.5rem'})
						.add();
					/* Now render non-changing historical data on RHS */
					this.renderer
						.text('Current Yield Curve: ' + moment(treasury_data[play_index - 1].date).format('MMM YYYY'), distFromLeft, distFromTop + 40)
						.attr({'id': 'date-text', fill: 'black', 'font-size': '1.5rem'})
						.add();
				}
			}
        },
        credits: {
			enabled: false
        },
        title: {
			useHTML: true,
			text: 
			'<div class="row text-center justify-content-center">'+
				'<span class="my-0 py-1" style="font-size: 1.3rem;"><i class="cmefi-logo me-1"></i>Treasury Curve Forecasts (Updated ' + moment(forecast_vdate).format('MMM Do') + ')</span>'+
			'</div>'+
			'<div class="row text-center"><div class="col-12 btn-group d-inline-block" role="group" id="chart-subtitle-group">' +
				'<button class="btn btn-cmefi-dark text-light btn-sm" style="font-size:.8rem" type="button" >Hit "play" to show changes over time!&nbsp;</button>'+
				'<button class="btn btn-primary btn-sm chart-subtitle" style="font-size:.8rem" type="button" data-dir="start" style="letter-spacing:-2px"><i class="bi bi-skip-backward"></i></button>' +
				'<button class="btn btn-primary btn-sm chart-subtitle" style="font-size:.8rem" type="button" data-dir="back"><i class="bi bi-caret-left"></i></button>' +
				'<button class="btn btn-primary btn-sm chart-subtitle" style="font-size:.8rem" type="button" data-dir="pause" ><i class="bi bi-pause"></i></button>' +
				'<button class="btn btn-primary btn-sm chart-subtitle" style="font-size:.8rem" type="button" data-dir="forward" ><i class="bi bi-caret-right"></i></button>' +
				'<button class="btn btn-primary btn-sm chart-subtitle" style="font-size:.8rem" type="button" data-dir="end" style="letter-spacing:-2px" ><i class="bi bi-skip-forward"></i></button>' +
			'</div></div>'
        },
		xAxis: {
			title: {
				text: 'Time to Maturity (Months)',
				style: {
					fontSize: '1.2rem'
				}
			},
			min: 0,
			max: 360
		},
		yAxis: {
			title: {
				text: null
			},
			labels: {
				format: '{value}%'
			},
			min: 0,
			max: 8
		},
		legend: {
			enabled: false
		},
        tooltip: {
            useHTML: true,
			shared: true,
			formatter: function () {
				//console.log(this);
				const points = this.points; // SOlves issue of tooltip not updating correctly with chart
				if (points.length !== 2) return false;
				const tVarname = points[0].x >= 12 ? points[0].x/12 + ' Year Treasury' : points[0].x + ' Month Treasury Yield'
				//console.log(tVarname);
				const text =
					'<table>' +
					'<tr style="border-bottom:1px solid black"><td style="text-align:center;font-weight:600">' +
						tVarname +
					'</td></tr>' +
					'<tr><td style="text-align:center;font-weight:600;color:'+points[0].color+'">' +
						points[0].y.toFixed(2) + '%' +
					'</td></tr>' +
					'<tr><td style="text-align:center;font-weight:600;color:'+points[1].color+'">' +
						points[1].y.toFixed(2) + '%' +
					'</td></tr>' +
					'</table>';
				//console.log(text);
				return text;
			}
        },
        series: [{
            data: treasury_data[play_index].data,
			name: 'Yield',
            type: 'areaspline',
            color: 'forestgreen',
			/*
			fillColor: {
                linearGradient: [0, 0, 0, 300],
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },*/
			marker: {
				enabled: true
			},
			zIndex: 2,
			fillOpacity: 0.5
        }, {
            data: treasury_data[play_index - 1].data,
			name: 'Current Yield',
            type: 'spline',
            color: 'black',
			marker: {
				enabled: true
			},
			zIndex: 1,
			fillOpacity: 0.5
		}]
	};
	const chart = Highcharts.chart('chart-container', o);
	
	const o2 = {
        chart: {
			spacingTop: 0,
            backgroundColor: 'rgba(255, 255, 255, 0)',
			plotBackgroundColor: 'rgba(255, 255, 255, 0)',
			style: {
				fontcolor: 'rgb(48, 79, 11)'
			},
			height: 150,
			//plotBorderColor: 'rgb(33, 37, 41)',
			//plotBorderWidth: 2
			events: {
				load: function() {
					// this = chart
					// Get x-axis y distance from top- full chart height minus bottom margin + xaxis offset
					const axisDistFromTop = this.chartHeight - (this.marginBottom + 45);
					// Get x distance of the first histoircal point, last historical point, first ofrecast point, last forecast point
					const startHistory = Math.min(...this.series[0].points.filter(x => x.type === 'history').map(x => x.plotX));
					const endHistory = Math.max(...this.series[0].points.filter(x => x.type === 'history').map(x => x.plotX));
					const startForecast = Math.min(...this.series[0].points.filter(x => x.type === 'forecast').map(x => x.plotX));
					const endForecast = Math.max(...this.series[0].points.filter(x => x.type === 'forecast').map(x => x.plotX));
					this.renderer
						.path(['M', startHistory, axisDistFromTop, 'L', (endHistory + startForecast)/2, axisDistFromTop])
						.attr({'stroke-width': 2, stroke: 'firebrick'})
						.add();
					this.renderer
						.path(['M', (endHistory + startForecast)/2, axisDistFromTop, 'L', endForecast, axisDistFromTop])
						.attr({'stroke-width': 2, stroke: 'forestgreen'})
						.add();
					this.renderer
						.text('Historical Data', (endHistory + startForecast)/2 - 100, axisDistFromTop - 5)
						.css({color: 'firebrick', fontSize: '.8rem'})
						.add();
					this.renderer
						.text('Forecasts', (endHistory + startForecast)/2 + 100, axisDistFromTop - 5)
						.css({color: 'forestgreen', fontSize: '.8rem'})
						.add();
				}
			}
        },
		title: {
			text: null,
		},
		exporting: false,
		subtitle: {
			text: 'CLICK ON THE TIMELINE BELOW TO NAVIGATE'
		},
		tooltip: {
            useHTML: true,
            formatter: function () {
				//console.log(this);
                return '<h6 class="text-center;" style="font-weight:bold; color:black">' +
					moment(this.point.x).format('MMM YYYY') +
				'</h6>Click to set!';
            }
		},
		xAxis: {
			type: 'datetime',
            dateTimeLabelFormats: {
                day: "%m-%Y",
                week: "%m-%Y"
            },
			//startOnTick: true,
			//endOnTick: true,
			min: new Date(treasury_data[0].date).getTime(),
			max: new Date(treasury_data[treasury_data.length - 1].date).getTime(),
			lineWidth: 0,
			offset: -45,
			tickInterval: 12 * 3 * 30 * 24 * 3600 * 1000,
			plotLines: [{
				value: parseInt(moment(treasury_data[play_index].date).format('x')),
				color: 'rgba(255,0,0,.5)',
				width: 5,
				id: 'plot-line',
				zIndex: 3,
				label: {
					text: '<span class="text-danger">SELECT<br>A DATE</span>',
					align: 'left',
					verticalAlign: 'top',
					rotation: 90,
					useHTML: true
				}
			}]
		},
        plotOptions: {
			series: {
				dataGrouping: {
					enabled: true,
					units: [ ['month',[1]]]
				},
				cursor: 'pointer',
				point: {
					events: {
						click: function () {
							'forecast-treasury-curve',
							setData('forecast-treasury-curve', {
								...getData('forecast-treasury-curve'),
								...{play_state: 'pause', play_index: this.date_index}
							});
							//console.log(this.date_index);
							updateChart();
							updateChart2();
							updateButtons();
						}
					}
				}
			}
        },
		yAxis: {
			title: {
				text: null
			},
			max: 1,
			min: -1,
			labels: {
				enabled: false
			},
			gridLineColor: 'rgba(255, 255, 255, 0)'

		},
		legend: {
			enabled: false
		},
        credits: {
            text: 'econforecasting.com',
			href: 'https://econforecasting.com'
        },
        series: [{
            data: treasury_data.map(x => ({x: parseInt(moment(x.date).format('x')), low: -1, high: 1, y: x.data.filter(y => y[0] === 120)[0][1], date_index: x.date_index, type: x.type})),
            type: 'arearange',
            color: 'rgba(255, 255, 255, 0)',
            fillColor: 'rgba(255, 255, 255, 0)',
			marker: {
				enabled: false
			}
        }]
	};

	const chart2 = Highcharts.chart('chart-container-2', o2);
	return;
}




function drawTable(treasury_data) {
	
	
	// Get list of ttm's present in data as array of form [{num: 1, fmt: '1m'}, {num: 3, fmt: '3m'}, ...]
	const ttmsList =
		[...new Set(treasury_data.map(x => (x.data.map(y => y[0]))).flat(1))].sort((a, b) => a > b ? 1 : -1)
		.map(x => ({num: x, fmt: (x >= 12 ? x/12 + 'y' : x + 'm')}));
	
	// Get obj of form 1m: 1, 3m: 3, 6m: 6, etc..
	/*
	const ttmVarnameMap = [... new Set(histTtms.concat(forecastTtms)].reduce((accum, x) => Object.assign(accum, {[(x >= 12 ? x/12 + 'y' : x + 'm')]: x}), {});
	*/
	// Create array of objects with each object of form {date: , 1m: , 3m: , ...,} returning null if data is unavailable
	const fcDataTable =
		treasury_data.map(function(x) {
			let res = {
				date: moment(x.date).format('YYYY-MM'),
				type: x.type
			};
			ttmsList.forEach(function(ttm) {
				res[ttm.fmt] = (x.data.filter(x => x[0] === ttm.num).length === 0 ? null : x.data.filter(x => x[0] === ttm.num)[0][1].toFixed(2));
				return;
			});
			return res;
		});
	//console.log('fcDataTable', fcDataTable, ttmsList);
	
	const dtCols =
		[
			{title: 'Date', data: 'date'},
		]
		.concat(ttmsList.map(ttm => ({title: ttm.fmt, data: ttm.fmt}))) // title and object property name are the same 
		.map(function(x, i) {
			return {...x, ...{
				visible: true,
				orderable: true,
				ordering: true,
				searchable: (x.title === 'Date'),
				type: (x.title === 'Date' ? 'date' : 'num'),
				className: 'dt-center'
			}};
		});
	//console.log('dtCols', dtCols, fcDataTable.filter(x => x.type === 'history'));
	const o = {
		data: fcDataTable.filter(x => x.type === 'history'),
		columns: dtCols,
		iDisplayLength: 15,
		dom:
			"<'row pb-1 justify-content-end'<'col-auto'f>>" +
			"<'row justify-content-end'<'col-auto'B>>" +
			"<'row justify-content-center'<'col-12'tr>>" +
			"<'row justify-content-end'<'col-auto'p>>",
		buttons: [
			{extend: 'copyHtml5', text: 'Copy', exportOptions: {columns: [0, 1]}, className: 'btn btn-sm btn-light'},
			{extend: 'csvHtml5', text: 'Download', exportOptions: {columns: [0, 1]}, className: 'btn btn-sm btn-light'}
		],
		order: [[0, 'desc']],
		paging: true,
		pagingType: 'numbers',
		language: {
			search: "Filter By Date:",
			searchPlaceholder: "YYYY-MM"
		},
		responsive: true
	}
	
	const o2 = {
		...o,
		...{
			data: fcDataTable.filter(x => x.type === 'forecast'),
			order: [[0, 'asc']]
		}
	}
	
	$('#table-container').DataTable(o).draw();
	$('#table-container-2').DataTable(o2).draw();
	return;
}



/*** Update Chart ***/
function updateChart() {
	let ud = getData('forecast-treasury-curve');
	const chart = $('#chart-container').highcharts();
	/* Return if play_state = paused; this is necessary to shut off the auto-repeating nature of this function */
	if (ud.treasury_data === undefined || ud.play_index === undefined) return;
	const timeStart = new Date().getTime();
  
	/* Get the new active date */
    const newData = ud.treasury_data[ud.play_index].data;
    const newDate = ud.treasury_data[ud.play_index].date;

	/* Update data */
	//console.log('Updating data...', newData);
	
	/* Update chart data and colors */
	chart.series[0].setData(newData, redraw = true, animation = {duration: 250}, updatePoints = true);
	chart.series[0].update({color: (ud.treasury_data[ud.play_index].type === 'forecast' ? 'forestgreen' : 'firebrick')})
	
	/* Update chart title*/
	if (ud.treasury_data[ud.play_index].type === 'history') {
		document.querySelector('#date-text').style.fill = 'firebrick';
		document.querySelector('#date-text').textContent = 'Historical curve for ' + moment(ud.treasury_data[ud.play_index].date).format('MMM YYYY');
	} else {
		document.querySelector('#date-text').style.fill = 'forestgreen';
		document.querySelector('#date-text').textContent = 'Forecasted curve for ' + moment(ud.treasury_data[ud.play_index].date).format('MMM YYYY');
	}
	
	/* Handle pause/unpause */
	//If at end or beginning, auto-pause
	if (ud.play_index <= 0 ) {
	  ud.play_state = 'pause';
	  ud.play_index = 0;
	}
	else if (ud.play_index >= ud.treasury_data.length - 1) {
	  ud.play_state = 'pause';
	  ud.play_index = ud.treasury_data.length - 1;
	}
	else {
	  if (ud.play_state === 'forward')  ud.play_index = ud.play_index + 1;
	  else ud.play_index = ud.play_index - 1;
	}
	
	/* Update userdata */
	setData('forecast-treasury-curve', {...ud, ...{}});
	
	updateButtons();
	updateChart2();
	
	const timeEnd = new Date().getTime();
	const timeWait = 250 /*timeEnd - timeStart < 5000 ? 5000 - (timeEnd - timeStart) : 5000*/;
  
	if (ud.play_state !== 'pause') setTimeout(function() {updateChart();}, timeWait);
	return;
}


function updateChart2() {
	const ud = getData('forecast-treasury-curve');
	const chart = $('#chart-container-2').highcharts();
    chart.xAxis[0].removePlotLine('plot-line');
    chart.xAxis[0].addPlotLine({
        value: parseInt(moment(ud.treasury_data[ud.play_index].date).format('x')),
        color: 'rgba(255,0,0,.5)',
        width: 5,
        id: 'plot-line',
        zIndex: 3,
        label: {
            text: '<span class="text-danger">SELECT<br> A DATE</span>',
            align: 'left',
            verticalAlign: 'top',
            rotation: 90,
            useHTML: true
        }
    });
}

function updateButtons() {
	const ud = getData('forecast-treasury-curve');
	/* Update buttons */
	const buttons = $('#chart-subtitle-group').find('button.chart-subtitle').removeClass('active').prop('disabled', false).end();
	//console.log('updateButtons', ud.play_state, ud.play_index, ud.treasury_data.length - 1, buttons);

	if (ud.play_index === 0) buttons.find('[data-dir="start"],[data-dir="back"]').prop('disabled', true);
	else if (ud.play_index === ud.treasury_data.length - 1) buttons.find('[data-dir="end"],[data-dir="forward"]').prop('disabled', true);
	if (ud.play_state === 'pause') buttons.find('[data-dir="pause"]').addClass('active', true);
	else if (ud.play_state === 'back') buttons.find('[data-dir="back"]').addClass('active', true);
	else if (ud.play_state === 'forward') buttons.find('[data-dir="forward"]').addClass('active', true);
	else buttons.find('[data-dir="forward"]').addClass('active', true);
}

function addCitation() {
	const citation_html =
		'Recommended citation for the Consensus Forecast:</br>' + 
		'<span class="fw-lighter text-muted">' + 
			'<em>econforecasting.com</em>, The Center for Macroeconomic Forecasts and Insights (' + new Date().getFullYear() + '). ' +
			'Consensus Interest Rate Forecast. Retrieved from ' + window.location.href + '.' 
		'</span>'
	document.querySelector('#citation').innerHTML = citation_html;
}

function addVdate(forecast_vdate) {
	document.querySelector('#last-updated').innerHTML = moment(forecast_vdate).format('MMM Do, YYYY');
}


/*** Draw chart ***/
function drawChartAlt(treasury_data) {
	
	//console.log('treasury_data', treasury_data);
	
	const grMap = gradient.create(
	  [0, 1, 24, 48, 72], //array of color stops
	  ['#17202a', '#2874a6', '#148f77', '#d4ac0d', '#cb4335'], //array of colors corresponding to color stops
	  'hex' //format of colors in previous parameter - 'hex', 'htmlcolor', 'rgb', or 'rgba'
	);
	
	const chartData =
		treasury_data.filter(x => x.type === 'history').slice(-1) // Get last historical forecast
		.concat(treasury_data.filter(x => x.type === 'forecast').slice(0, 71)) // Get first 24 forecasts
		.map((x, i) => (
			{
				name: moment(x.date).format('MMM YYYY') + ' ' + (x.type === 'history' ? '*' : ''),
				data: x.data,
				type: 'spline',
				color: gradient.valToColor(i, grMap, 'hex'),
				dashStyle: (x.type === 'history' ? 'solid' : 'shortdot'),
				visible: i === 0 || i % 6 === 1
				//(x.type === 'history' || moment(x.date).month() === moment(treasury_data.filter(x => x.type === 'history').slice(-1)[0].date).month() + 1)
			}
		));
	//console.log('chartData', chartData);
	
	const o = {
        chart: {
			spacingTop: 5,
            backgroundColor: 'rgba(255, 255, 255, 0)',
			plotBackgroundColor: '#FFFFFF',
			style: {
				fontColor: 'var(--bs-cmefi-green)'
			},
			height: 650,
			plotBorderColor: 'rgb(33, 37, 41)',
			plotBorderWidth: 2
        },
        credits: {
			enabled: true,
			text: '* Historical data; <a href="https://econforecasting.com">econforecasting.com</a>'
			//href: 'https://econforecasting.com'
        },
        title: {
			text: 'Forecasted Yield Curve By Date'
        },
		plotOptions: {
			series: {
				opacity: 0.9,
				lineWidth: 1.5,
				marker: {
					enabled: true
				}
			}
		},
		xAxis: {
			title: {
				text: 'Time to Maturity (Months)',
				style: {
					fontSize: '1.0rem'
				}
			},
			min: 0,
			//max: 360
		},
		yAxis: {
			title: {
				text: 'Yield (%)',
				style: {
					fontSize: '1.0rem'
				}
			},
			endOnTick: false
		},
		legend: {
			enabled: true,
			layout: 'horizontal',
			verticalAlign: 'bottom',
			align: 'center',
			title: {
				text: 'Forecasted Month <span style="font-style:italic;font-size:.9em">(Click to Show/Hide)</span>'
			}
		},
        tooltip: {
            useHTML: true,
			shared: true,
			formatter: function () {
				const points = this.points; // SOlves issue of tooltip not updating correctly with chart
				const tVarname = points[0].x >= 12 ? points[0].x/12 + ' Year Treasury Yield' : points[0].x + ' Month Treasury Yield'
				//console.log(points);
				const text =
					'<table>' +
					'<tr style="border-bottom:1px solid black"><td style="text-align:center;font-weight:600">' +
						tVarname +
					'</td></tr>' +
					points.map(point => '<tr><td style="text-align:center;color:' + point.color + '">' + point.series.name + ': ' + point.y.toFixed(2) + '%</td></tr>').join('') +
					'</table>';
				//console.log(text);
				return text;
			}
        },
        series: chartData
	};
	const chart = Highcharts.chart('chart-container-alt', o);
	
	return;
}
