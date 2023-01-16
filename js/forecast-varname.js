/*
import './add_jquery'
import {getApi, getAllData, getData, setData, init, ajaxError, getColorArray} from './helpers'
import DataTable from 'datatables.net-dt'

import dayjs from './libs/dayjs/dayjs'
import timezone from './libs/dayjs/timezone'
import utc from './libs/dayjs/utc'
import minMax from './libs/dayjs/minmax'
import advancedFormat from './libs/dayjs/advancedformat'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(minMax)
dayjs.extend(advancedFormat)

import Highcharts from 'highcharts/highstock';
*/
document.addEventListener("DOMContentLoaded", function(event) {

	/********** INITIALIZE **********/
	init();

	(function() {

		const el = document.querySelector('#forecast-container');
		const varname = el.dataset.varname;
		const primary_forecast = el.dataset.primaryForecast;
		const secondary_forecasts = el.dataset.secondaryForecasts.split(',');	
		const show_vintage_chart =  ['gdp', 'pce'].includes(varname) ? false: true;
			
		const ud_prev = getAllData()['forecast-varname'] || {};
		const ud = {... ud_prev, ... {
				varname: varname,
				primary_forecast: primary_forecast,
				show_vintage_chart: show_vintage_chart,
				debug: true
			}};
		setData('forecast-varname', ud);
	})();


	/********** GET DATA **********/
	const ud = getData('forecast-varname') || {};

	const get_forecast_variable = getApi(`get_forecast_variable?varname=${ud.varname}`, 10, ud.debug);
	const get_hist_obs = getApi(`get_hist_obs?varname=${ud.varname}`, 10, ud.debug);
	const get_forecast_values = getApi(`get_latest_forecast_obs?varname=${ud.varname}`, 10, ud.debug);
	const start = performance.now();

	Promise.all([get_forecast_variable, get_hist_obs, get_forecast_values]).then(function(r) {

		const forecast_variable = r[0][0];
		const hist_obs = r[1][0];
		const forecast_values = r[2];
		if (ud.debug) console.log('Data load time', performance.now() - start, forecast_values);
		
		const variable = {
			varname: forecast_variable.varname,
			fullname: forecast_variable.fullname,
			units:
				forecast_variable.d1 === 'base' ? forecast_variable.units 
				: forecast_variable.d1 === 'apchg' ? 'Annualized Percent Change (%)' 
				: '',
			hist_freq: forecast_variable.hist_source_freq === 'q' ? 'q' : 'm'
		};

		const hist_series = {
			tskey: 'hist',
			ts_type: 'hist',
			freq: variable.hist_freq,
			shortname: 'Historical Data',
			description: 'Historical Data',
			external: false,
			vdate: dayjs().format('YYYY-MM-DD'),
			data: hist_obs.data
				.filter(x => dayjs(x.date) <= dayjs().add(10, 'years'))
				.map(x => [x.date, parseFloat(x.value)]).sort((a, b) => a[0] - b[0])
		};

		const forecast_series = forecast_values.map(f => ({
			tskey: f.forecast,
			ts_type: f.forecast === ud.primary_forecast ? 'primary' : 'secondary',
			freq: f.freq,
			shortname: f.shortname,
			description: f.description,
			external: f.external,
			vdate: f.vdate || null,
			data: f.data
				.filter(x => dayjs(x.date) <= dayjs().add(10, 'years'))
				.filter(x => f.vdate == null || dayjs(x.date) >= dayjs(f.vdate).add(-4, 'months'))
				.map(x => [x.date, parseFloat(x.value)]).sort((a, b) => dayjs(a[0]) - dayjs(b[0]))
		}));
		
		const ts_data_parsed =
			[hist_series].concat(forecast_series)
			//Sort so that CMEFI forecasts are first and historical data is last
			.sort((a, b) =>
				a.ts_type === 'primary' && a.ts_type !== 'hist' ? -1
				: b.ts_type === 'primary' && b.fcname !== 'hist' ? 1 
				: a.ts_type === 'hist' ? 1 
				: b.ts_type === 'hist' ? -1
				: 0
			).map((x, i) => ({...x, order: i}));

				
		setData('forecast-varname', {...getData('forecast-varname'), ts_data_parsed: ts_data_parsed, ...variable});
		if (ud.debug) console.log('Data parse time', performance.now() - start, forecast_values);

		return({variable, ts_data_parsed});	
	}).then(function({variable, ts_data_parsed}) {
		drawChart(ts_data_parsed, variable.fullname, variable.units, variable.hist_freq);
		drawTable(ts_data_parsed, variable.units);
		if (ud.show_vintage_chart === true) addVintageChartListener()
		if (ud.debug) console.log('Draw time', Date.now() - start);
	})
	.catch(e => ajaxError(e));
});

/*** Draw chart ***/
function drawChart(ts_data_parsed, fullname, units, hist_freq) {
	
	const chart_data =
		ts_data_parsed
		.map((x, i) => (
			{
				id: x.tskey,
				name: x.shortname,
				custom: {
					legend_el: 
						x.shortname +
						' <span style="font-size:.8rem;font-weight:normal">(' +
							'Updated ' + dayjs(x.vdate).format('MM/DD/YY') +
							(x.freq === 'q' ? '; Quarterly Data' : '; Monthly Data')  + 
						')</span>'
				},
				data: x.data.map(x => [dayjs(x[0]).unix() * 1000, x[1]]),
				type: 'line',
				dashStyle: (x.tskey === 'hist' ? 'Solid' : 'ShortDash'),
				lineWidth: (x.ts_type === 'hist' ? 3 : 2),
				zIndex: (x.ts_type === 'hist' ? 3 : x.ts_type == 'primary' ? 3 : 1),
				legendIndex: (x.ts_type === 'hist' ? 0 : x.ts_type == 'primary' ? 1 : 2),
				color: (x.tskey === 'hist' ? 'black' : getColorArray()[i]),
				opacity: 2,
				visible: (x.ts_type === 'primary' || x.ts_type === 'hist'),
				index: i
			}
		));
	// console.log('chart_data', chart_data);
	
	const o = {
        chart: {
			spacingTop: 15,
            backgroundColor: 'rgba(255, 255, 255, 0)',
			plotBackgroundColor: '#FFFFFF',
			height: 550,
			plotBorderColor: 'black',
			plotBorderWidth: 2
        },
        title: {
			useHTML: true,
			text: 
				'<img class="me-2 mb-1" width="22" height="22" src="/static/brand/small.svg">' +
				'<div style="vertical-align:middle;display:inline"><span class="font-logo" style="vertical-align:middle;font-size:1.3rem;color:rgb(15, 17, 23)">' + fullname + ' Forecast</span></div>',
        },
		caption: {
			useHTML: true,
			text: 'Shaded area indicate recessions' + (hist_freq === 'm' ? '; Data represents monthly-averaged values when applicable' : ''),
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
					enabled: undefined,
					radius: 2,
					enabledThreshold: 5,
					symbol: 'square'
				}
			}
        },
		rangeSelector: {
			buttons: [
				{
					text: '1Y Forecast',
					events: {
						click: function(e) {
							const state = $('#chart-container').highcharts().rangeSelector.buttons[0].state;
							chart.xAxis[0].setExtremes(
								Math.max(
									dayjs.min(ts_data_parsed.filter(x => x.tskey === 'hist')[0].data.map(x => dayjs(x[0]))).unix() * 1000,
									dayjs().add(-12, 'M').unix() * 1000
									),
								dayjs().add(12, 'M').unix() * 1000
								);
							$('#chart-container').highcharts().rangeSelector.buttons[0].setState(state === 0 ? 2 : 0);
							return false;
						}
					}
				}, {
					text: '2Y Forecast',
					events: {
						click: function(e) {
							const state = $('#chart-container').highcharts().rangeSelector.buttons[1].state;
							chart.xAxis[0].setExtremes(
								Math.max(
									dayjs.min(ts_data_parsed.filter(x => x.tskey === 'hist')[0].data.map(x => dayjs(x[0]))).unix() * 1000,
									dayjs().add(-24, 'M').unix() * 1000
									),
								dayjs().add(24, 'M').unix() * 1000
								);
							$('#chart-container').highcharts().rangeSelector.buttons[1].setState(state === 0 ? 2 : 0);
							return false;
						}
					}
				}, {
					text: '5Y Forecast',
					events: {
						click: function(e) {
							const state = $('#chart-container').highcharts().rangeSelector.buttons[2].state;
							chart.xAxis[0].setExtremes(
								Math.max(
									dayjs.min(ts_data_parsed.filter(x => x.tskey === 'hist')[0].data.map(x => dayjs(x[0]))).unix() * 1000,
									dayjs().add(-60, 'M').unix() * 1000
									),
								dayjs().add(60, 'M').unix() * 1000
								);
							$('#chart-container').highcharts().rangeSelector.buttons[2].setState(state === 0 ? 2 : 0);
							return false;
						}
					}
				}, {
					type: 'all',
					text: 'Full Historical Data & Forecast'
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
			min:
				Math.max(
					// Show max of either 2 years ago or first historical date. This handles situations where the first historical date is very recent.
					dayjs.min(ts_data_parsed.filter(x => x.tskey === 'hist')[0].data.map(x => dayjs(x[0]))).unix() * 1000,
					dayjs().add(-24, 'M').unix() * 1000
				),
			max: 
				Math.min(
					// Show min of either 2 years ahead or last end date of any forecast ( + 1 month).
					dayjs.max(
						getData('forecast-varname').ts_data_parsed.filter(x => x.tskey !== 'hist').map(x => dayjs(x.data[x.data.length - 1][0]))
						).add(1, 'month').unix() * 1000,
					dayjs().add(24, 'M').unix() * 1000,
				),
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
                    return this.value.toFixed(1) + '%';
                }
            },
			title: {
				text: units,
				style: {
					color: 'black',
				}
			},
			opposite: false
		},
        navigator: {
            enabled: true,
			height: 30,
			maskFill: 'rgba(48, 79, 11, .3)'
        },
		legend: {
			enabled: true,
			backgroundColor: 'var(--bs-white-warmer)',
			borderColor: 'var(--bs-white-warm)',
			borderWidth: 1,
			useHTML: true,
			align: 'center',
			verticalAlign: 'bottom',
			layout: 'horizontal',
			labelFormatter: function() {
				return this.options.custom.legend_el;
			},
			title: {
				text:
					'<span style="font-weight: 400">Available Forecasts </span>' +
					'<span style="font-size: .8rem; color: #666; font-weight: normal;">(click below to hide/show)</span>'
			}
		},
        tooltip: {
            useHTML: true,
			shared: true,
			backgroundColor: 'rgba(255, 255, 255, .8)',
			formatter: function () {
				const points = this.points;
				const ud = getData('forecast-varname');
				const text =
					'<table>' +
					'<tr style="border-bottom:1px solid black"><td style="font-weight: 400">DATE</td><td style="font-weight:400">' +
						'DATA' +
					'</td></tr>' +
					points.map(function(point) {
						const freq = ud.ts_data_parsed.filter(x => x.tskey === point.series.options.id)[0].freq;
						const str =
							'<tr>' +
								'<td style="padding-right:1rem; font-weight: 500; color:'+point.series.color+'">' +
									(freq === 'm' ? dayjs(point.x).format('MMM YYYY') : dayjs(point.x).format('YYYY[Q]Q')) +
									// If historical data is monthly and is for same month, add asterisk!
									(hist_freq === 'm' & dayjs().isSame(dayjs(point.x), 'month') & point.series.userOptions.id === 'hist' ? '*' : '') +
								'</td>' + 
								'<td style="font-weight: 500;color:' + point.color + '">' +
									// Remove lal text in parantheses
									point.series.name.replace(/ *\([^)]*\) */g, "") + ': ' + point.y.toFixed(2) +
								'%</td>' + 
							'</tr>' +
							// If historical data is monthly and is for same month, add asterisk!
							(hist_freq === 'm' & dayjs().isSame(dayjs(point.x), 'month') & point.series.userOptions.id === 'hist' ? '<tr><td colspan="2" style="color:rgb(102, 102, 102);font-weight:normal;font-style:italic;font-size:.75rem;text-align:right">*Current average of existing data for this month</tr>' : '');
						return str;
					}).join('') +
					'</table>';
				return text;
			}
        },
        series: chart_data
	};
	const chart = Highcharts.stockChart('chart-container', o);
	$('#chart-container').highcharts().rangeSelector.buttons[1].setState(2);

	document.querySelector('#chart-loader-container').style.opacity = 0;
	document.querySelector('#chart-loadee-container').style.opacity = 1;
	return;
}




function addVintageChartListener() {
	
	// <button type="button" class="btn btn-sm text-dark mx-auto px-2 py-2" style="background: linear-gradient(rgb(255, 247, 237), rgb(255, 247, 237));
	// color: rgb(154, 52, 18) !important; border: 0px !important" data-bs-toggle="modal" data-bs-target="#primary-forecast-vintage-modal">
	// <button type="button" class="btn btn-sm text-dark mx-auto px-2 py-2" style="background: var(--bs-sky-light);
	// color: white !important; border: 0px !important" data-bs-toggle="modal" data-bs-target="#primary-forecast-vintage-modal">
	
	// 			See prior forecast vintages
	// 		</button>
	
	document.querySelector('#primary-forecast-vintage-div').innerHTML = `
		<p><a href="" data-bs-toggle="modal" data-bs-target="#primary-forecast-vintage-modal">Click here</a> to see prior forecast values.</p>

		<div class="modal fade" id="primary-forecast-vintage-modal" tabindex="-1">
		  <div class="modal-dialog modal-xl">
			<div class="modal-content">
			  <div class="modal-header">
				<h5 class="modal-title"></h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			  </div>
			  <div class="modal-body">
				<div id="vintage-chart-container" >Loading...</div>
			  </div>
			  <div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
			  </div>
			</div>
		  </div>
		</div>
		`
	const ud = getData('forecast-varname') || {};
	if (!ud.ts_data_parsed || !ud.varname || !ud.primary_forecast) {
		return;
	}


	const modal = document.querySelector('#primary-forecast-vintage-modal')
		
	modal.addEventListener('shown.bs.modal', function(e) {
		e.preventDefault();
		e.stopPropagation();
		// Only build on first modal load
		if ($('#vintage-chart-container').highcharts() != undefined) return;

		const get_monthly_vintage_forecast_obs = getApi(`get_monthly_vintage_forecast_obs?varname=${ud.varname}&forecast=${ud.primary_forecast}`, 10, ud.debug);
		get_monthly_vintage_forecast_obs.then(r => {

			const vintage_values_parsed = r.map(x => ({date: x.date, vdate: x.vdate, value: parseFloat(x.d1)}));

			const vdates = [...new Set(vintage_values_parsed.map(x => x.vdate))]
		
			const gradient_map = gradient.create(
			  [0, vdates.length * .25, vdates.length * .3, vdates.length * .35, vdates.length * .6, vdates.length * .8, vdates.length], //array of color stops
			  ['#0094ff', '#00ffa8', '#8aff00', '#FFd200', '#FF8c00', '#FF5a00', '#FF1e00'], //array of colors corresponding to color stops
			  'hex' //format of colors in previous parameter - 'hex', 'htmlcolor', 'rgb', or 'rgba'
			);

			const chart_data_0 = vdates
				.map(vdate => ({
					vdate: vdate,
					data: vintage_values_parsed.filter(y => y.vdate === vdate).map(y => [y.date, y.value])
				}))
				.sort((a, b) => dayjs(a.vdate) > dayjs(b.vdate) ? 1 : -1)
				.map((x, i) => ({
					index: i,
					color: gradient.valToColor(i, gradient_map, 'hex'),
					name: dayjs(x.vdate).format('MMM YY'),
					custom: {
						label: x.vdate + ' Forecast'
					},
					data: x.data.map(y => [dayjs(y[0]).unix() * 1000, y[1]]),
					visible: (ud.hist_freq === 'm' ? dayjs(x.vdate).month() == dayjs().month() : dayjs(x.vdate).quarter() == dayjs().quarter() ),
					lineWidth: 3,
					opacity: .7,
					dashStyle: 'ShortDash',
					zIndex: 4
				}));
				const hist_chart_data = {
					data: ud.ts_data_parsed.filter(x => x.tskey === 'hist')[0]['data']
						.map(y => [dayjs(y[0]).unix() * 1000, y[1]])
						.filter(y => dayjs(y[0]) >= dayjs(chart_data_0[0].data[0][0])),
					color: 'black',
					name: 'Historical Data',
					visible: true,
					lineWidth: 5,
					opacity: .7,
					custom: {
						label: 'Realized History'
					},
					marker : {
						enabled: true,
						radius: 2,
						symbol: 'triangle'
					},
					zIndex: 3
				};
				
				// console.log(hist_chart_data);
				const chart_data = chart_data_0.concat(hist_chart_data)
				
				//console.log('chart_data', chart_data);
				
				const o = {
					chart: {
						spacingTop: 15,
						backgroundColor: 'rgba(255, 255, 255, 0)',
						plotBackgroundColor: '#FFFFFF',
						style: {
							fontColor: 'var(--bs-forest)'
						},
						height: 500,
						plotBorderColor: 'black',
						plotBorderWidth: 2
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
							dataLabels: {
								enabled: true,
								crop: false,
								overflow: 'none',
								align: 'left',
								verticalAlign: 'middle',
								formatter: function() {
									if (this.point === this.series.points[Math.ceil((this.series.points.length - 1)/3)]) {
										return '<span style="color:'+this.series.color+'">'+this.series.options.custom.label+'</span>';
									}
								}
							}
						}
					},
					
					rangeSelector: {
						enabled: false
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
								return this.value.toFixed(1) + '%';
							}
						},
						title: {
							text: ud.units,
							style: {
								color: 'black',
							}
						},
						opposite: false
					},
					navigator: {
						enabled: false,
					},
					legend: {
						enabled: true,
						backgroundColor: 'var(--bs-white-warmer)',
						borderWidth: 1,
						align: 'right',
						verticalAlign: 'top',
						layout: 'vertical',
						title: {
							text: 'Prior forecast vintages<br><span style="font-size: .7rem; color: #666; font-weight: normal; font-style: italic">(click below to hide/show)</span>',
						}
					},
					tooltip: {
						useHTML: true,
						shared: true,
						backgroundColor: 'rgba(255, 255, 255, .8)',
						formatter: function () {
							const points = this.points;
							const text =
								'Historical Forecasts for ' + dayjs(this.x).format('MMM YYYY') + ' Value' +
								'<table>' +
								'<tr class="px-1" style="border-bottom:1px solid black;font-weight:400;"><td>DATE</td><td class="px-2" style="font-weight:400">' +
									'FORECAST' +
								'</td></tr>' +
								points.map(function(point) {
									const str =
										`<tr>
											<td class="px-1" style="font-weight:500;color:${point.color}">${point.series.options.custom.label}</td>
											<td class="px-2" style="font-weight:500;">${point.y.toFixed(2)}</td>
										</tr>`;
									return str;
								}).join('') +
								'</table>';
							return text;
						}
					},
					series: chart_data
				};
				
				const chart = Highcharts.stockChart('vintage-chart-container', o);
				return;
		
		});
		
	});
	
	
	return;
}



function drawTable(ts_data_parsed, units) {
	
	//console.log('fcDataParsed', fcDataParsed);
	// Turn into list of series
	// Separate tab for each table
	const table_data = ts_data_parsed.sort((a, b) => a.ts_type === 'hist' ? -1 : b.ts_type === 'hist' ? 1 : a.ts_type === 'primary' ? -1: 0).forEach(function(x, i) {
		//console.log(x.data);
		const seriesData =
			(x.tskey === 'hist') ?
			x.data.map(y => ({date: (x.freq === 'q' ? dayjs(y[0]).format('YYYY[Q]Q') : dayjs(y[0]).format('YYYY-MM')), type: 'Historical Data', value: y[1].toFixed(4)})) :
			x.data.map(y => ({date: (x.freq === 'q' ? dayjs(y[0]).format('YYYY[Q]Q') : dayjs(y[0]).format('YYYY-MM')), type: 'Forecast', value: y[1].toFixed(4)}));
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
				css: 'font-size: .9rem',
				width: '50%'
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
				('Updated ' + dayjs(x.vdate).format('MM/DD/YYYY')) +
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
		console.log('#table-' + x.tskey);
		//const dTable = new DataTable(document.querySelector('#table-' + x.tskey), o); for ES6 imports
		$(table).DataTable(o); //new DataTable(table, o) $(table).DataTable(o);
		if (x.ts_type !== 'primary') $(table).parents('div.dataTables_wrapper').first().hide();
		//console.log(dTable);

		// Move the download buttons
		//console.log(table.parentElement);
		const downloadDiv = table.closest('.dataTables_wrapper').querySelector('.dt-buttons');
		//console.log('downloadDiv', downloadDiv);
		downloadDiv.classList.add('float-end');
		downloadDiv.id = 'download-' + x.tskey;
		if (i !== 0) downloadDiv.style.display = 'none'
		$('#data-card > .card-body > div:first-child > span').after($(downloadDiv).detach());
		
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

	document.querySelector('#tables-container-loader').style.opacity = 0;
	document.querySelector('#tables-container').style.opacity = 1;
	
	
	return;
}