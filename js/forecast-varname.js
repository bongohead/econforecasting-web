document.addEventListener("DOMContentLoaded", function(event) {
	
	/********** INITIALIZE **********/
	$('div.overlay').show();

	(function() {
		const varname = window.location.pathname.split('-').pop().padStart(3, '0');
					
		const primary_forecast =
			['sofr', 'ffr', 'ameribor', 'bsby', 'mort30y', 'mort15y',
			't03m', 't06m', 't01y', 't02y', 't05y', 't10y', 't20y', 't30y',
			'sonia', 'estr'].includes(varname) ? 'int'
			: ['gdp', 'pce'].includes(varname) ? 'comp'
			: ['cpi'].includes(varname) ? 'einf'
			: null;
			
		const show_vintage_chart = 
			['gdp', 'pce'].includes(varname) ? false
			: true;
			
		//document.querySelectorAll('span.t-varname').forEach(x => x.textContent = tFullname);
		const ud_prev = getAllData()['forecast-varname'] || {};
		const ud = {... ud_prev, ... {
				varname: varname,
				primary_forecast: primary_forecast,
				show_vintage_chart: show_vintage_chart
			}};
		setData('forecast-varname', ud);
	})();

	/********** GET DATA **********/
	const ud = getData('forecast-varname') || {};
	const get_varname_desc = getFetch('get_forecast_variable', ['forecast_variable'], {varname: ud.varname}, 10000, false);
	Promise.all([get_varname_desc])
		.then(function(response) {
			const variable_raw = response[0].forecast_variable[0];
			return {
				varname: variable_raw.varname,
				fullname: variable_raw.fullname,
				units:
					variable_raw.d1 === 'base' ? variable_raw.units 
					: variable_raw.d1 === 'apchg' ? 'Annualized Percent Change (%)' 
					: '',
				// Add on aggregated historical frequency to display
				hist_freq: variable_raw.hist_source_freq === 'q' ? 'q' : 'm'
			}
		})
		// Pull historical data & forecasts
		.then(function(variable) { 
			// console.log('variable', variable);
			const get_forecast_hist_values_last_vintage = getFetch('get_forecast_hist_values_last_vintage', ['forecast_hist_values'], {varname: variable.varname, freq: variable.hist_freq, form: 'd1'}, 10000, false);	
			const get_forecast_values = getFetch('get_forecast_values_last_vintage', ['forecast_values'], {varname: variable.varname, freq: ['m', 'q'], form: 'd1'}, 10000, false);
			//console.log({varname: variable.varname, forecast: ud.primary_forecast, freq: variable.hist_freq, form: 'd1'});
			const get_forecast_vintage_values = getFetch('get_forecast_vintage_values', ['forecast_vintage_values'], {varname: variable.varname, forecast: ud.primary_forecast, freq: variable.hist_freq, form: 'd1'}, 10000, false);
			return Promise.all([variable, get_forecast_hist_values_last_vintage, get_forecast_values, get_forecast_vintage_values]);
		})
		// Pull response data & forecasts
		.then(function(response) {
			const variable = response[0];
			// console.log(response);
			const ts_data_raw =
				response[1].forecast_hist_values
					// Filter monthly historical data if same month as current month
					//.filter(x => variable.hist_freq === 'm' ? moment().isSame(x.date, 'month') === false : true)
					.map(x => ({
						tskey: 'hist',
						freq: variable.hist_freq,
						shortname: 'Historical Data',
						description: 'Historical Data',
						external: false,
						vdate: moment().format('YYYY-MM-DD'),
						date: x.date,
						value: parseFloat(x.value)
					}))
				.concat(
					response[2].forecast_values
						// Don't return nowcasts for interest rate models
						.filter(x => ud.primary_forecast === 'int' ? x.forecast !== 'now' : true)
						// Filter only monthly forecasts if they are too old
						.filter(x => variable.hist_freq === 'm' ? moment(x.vdate) <= moment(x.date).add(30, 'days') : true)
						.map(x => ({
							tskey: x.forecast,
							freq: x.freq,
							shortname: x.shortname,
							description: x.description,
							external: x.external,
							vdate: x.vdate,
							date: x.date, 
							value: parseFloat(x.value)
						}))
				);
			//console.log('raw_raw', ts_data_raw);
			
			// Now group data under tskeys
			const ts_data_parsed = 
				[... new Set(ts_data_raw.map(x => x.tskey))] // Get list of dates
				.map(function(tskey) { // Group each value of the original array under the correct date
					const z = ts_data_raw.filter(x => x.tskey === tskey)[0];
					return {
						tskey: tskey,
						freq: z.freq,
						ts_type: z.tskey === 'hist' ? 'hist' : z.tskey === ud.primary_forecast ? 'primary' : 'secondary',
						shortname: z.shortname,
						description: z.description,
						external: z.external,
						freq: z.freq,
						vdate: z.vdate || null,
						data: ts_data_raw.filter(x => x.tskey === tskey)
							.filter(x => moment(x.date) <= moment().add(10, 'years'))
							.map(x => [x.date, x.value]).sort((a, b) => a[0] - b[0])
					}
				})
				//Sort so that CMEFI forecasts are first and historical data is last
				.sort((a, b) =>
					a.ts_type === 'primary' && a.ts_type !== 'hist' ? -1
					: b.ts_type === 'primary' && b.fcname !== 'hist' ? 1 
					: a.ts_type === 'hist' ? 1 
					: b.ts_type === 'hist' ? -1
					: 0
				).map((x, i) => ({...x, order: i}));
			// console.log('ts_data_parsed', ts_data_parsed);
			
			const vintage_values_parsed = response[3].forecast_vintage_values.map(x => ({date: x.date, vdate: x.vdate, value: parseFloat(x.value)}))
			
			setData('forecast-varname', {...getData('forecast-varname'), ts_data_parsed: ts_data_parsed, vintage_values_parsed: vintage_values_parsed, ...variable});

			return({variable, ts_data_parsed, vintage_values_parsed});	
		})
		.then(function({variable, ts_data_parsed, vintage_values_parsed}) {
			drawChart(ts_data_parsed, variable.fullname, variable.units, variable.hist_freq);
			drawTable(ts_data_parsed, variable.units);
			drawDescription(ts_data_parsed, variable.varname, ud.primary_forecast);
			drawVintageChart(vintage_values_parsed, ts_data_parsed, variable.fullname, variable.units, variable.hist_freq, ud.show_vintage_chart);
			$('div.overlay').hide();
		})
});

/*** Draw chart ***/
function drawChart(ts_data_parsed, fullname, units, hist_freq) {
	
	//console.log('fcDataParsed', fcDataParsed);
	/*
	const grMap = gradient.create(
	  [0, 1, 24, 48, 72], //array of color stops
	  ['#17202a', '#2874a6', '#148f77', '#d4ac0d', '#cb4335'], //array of colors corresponding to color stops
	  'hex' //format of colors in previous parameter - 'hex', 'htmlcolor', 'rgb', or 'rgba'
	);
	*/
	
	const chart_data =
		ts_data_parsed
		.map((x, i) => (
			{
				id: x.tskey,
				name:
					x.shortname +
					' <span style="font-size:.8rem;font-weight:normal">(' +
						'Updated ' + moment(x.vdate).format('MM/DD/YY') +
						(x.freq === 'q' ? '; Quarterly Data' : '; Monthly Data')  + 
					')</span>',
				data: x.data.map(x => [parseInt(moment(x[0]).format('x')), x[1]]),
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
			style: {
				fontColor: 'var(--bs-cmefi-green)'
			},
			height: 550,
			plotBorderColor: 'black',
			plotBorderWidth: 2
        },
        title: {
			useHTML: true,
			text: 
				'<img class="me-2 mb-1" width="22" height="22" src="/static/cmefi-short.svg">' +
				'<div style="vertical-align:middle;display:inline"><span>' + fullname + ' Forecast</span></div>',
			style: {
				fontSize: '1.3rem',
				color: 'var(--bs-dark)'
			}
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
					enabled: true,
					radius: 3,
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
									moment.min(...ts_data_parsed.filter(x => x.tskey === 'hist')[0].data.map(x => moment(x[0]))).toDate().getTime(),
									moment().add(-12, 'M').toDate().getTime()
									),
								moment().add(12, 'M').toDate().getTime()
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
									moment.min(...ts_data_parsed.filter(x => x.tskey === 'hist')[0].data.map(x => moment(x[0]))).toDate().getTime(),
									moment().add(-24, 'M').toDate().getTime()
									),
								moment().add(24, 'M').toDate().getTime()
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
									moment.min(...ts_data_parsed.filter(x => x.tskey === 'hist')[0].data.map(x => moment(x[0]))).toDate().getTime(),
									moment().add(-60, 'M').toDate().getTime()
									),
								moment().add(60, 'M').toDate().getTime()
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
			plotBands: [{color: '#D8D8D8', from: Date.UTC(2020, 2, 1), to: Date.UTC(2021, 2, 28)},
			{color: '#D8D8D8', from: Date.UTC(2007, 12, 1), to: Date.UTC(2009, 6, 30)},
			{color: '#D8D8D8', from: Date.UTC(2001, 3, 1), to: Date.UTC(2001, 11, 30)}],
			ordinal: false,
			min:
				Math.max(
					// Show max of either 4 years ago or first historical date. This handles situations where the first historical date is very recent.
					moment.min(...ts_data_parsed.filter(x => x.tskey === 'hist')[0].data.map(x => moment(x[0]))).toDate().getTime(),
					moment().add(-48, 'M').toDate().getTime()
				),
			max: 
				Math.min(
					// Show min of either 5 years ahead or last end date of any forecast ( + 1 month).
					moment.max(
						getData('forecast-varname').ts_data_parsed.filter(x => x.tskey !== 'hist').map(x => moment(x.data[x.data.length - 1][0]))
						).add(1, 'month').toDate().getTime(),
					moment().add(48, 'M').toDate().getTime(),
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
			backgroundColor: 'var(--bs-efpale)',
			borderColor: 'var(--bs-cmefi-dark)',
			borderWidth: 1,
			//useHTML: true,
			align: 'center',
			verticalAlign: 'bottom',
			layout: 'horizontal',
			title: {
				text: 'Available Forecasts <span style="font-size: .8rem; color: #666; font-weight: normal; font-style: italic">(click below to hide/show)</span>',
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
					'<tr style="border-bottom:1px solid black"><td>DATE</td><td style="font-weight:600">' +
						'DATA' +
					'</td></tr>' +
					points.map(function(point) {
						const freq = ud.ts_data_parsed.filter(x => x.tskey === point.series.options.id)[0].freq;
						const str =
							'<tr>' +
								'<td style="padding-right:1rem; color:'+point.series.color+'">' +
									(freq === 'm' ? moment(point.x).format('MMM YYYY') : moment(point.x).format('YYYY[Q]Q')) +
									// If historical data is monthly and is for same month, add asterisk!
									(hist_freq === 'm' & moment().isSame(moment(point.x), 'month') & point.series.userOptions.id === 'hist' ? '*' : '') +
								'</td>' + 
								'<td style="color:' + point.color + '">' +
									// Remove lal text in parantheses
									point.series.name.replace(/ *\([^)]*\) */g, "") + ': ' + point.y.toFixed(2) +
								'%</td>' + 
							'</tr>' +
							// If historical data is monthly and is for same month, add asterisk!
							(hist_freq === 'm' & moment().isSame(moment(point.x), 'month') & point.series.userOptions.id === 'hist' ? '<tr><td colspan="2" style="color:rgb(102, 102, 102);font-weight:normal;font-style:italic;font-size:.75rem;text-align:right">*Current average of existing data for this month</tr>' : '');
						return str;
					}).join('') +
					'</table>';
				return text;
			}
        },
        series: chart_data
	};
	const chart = Highcharts.stockChart('chart-container', o);
	
	return;
}


function drawVintageChart(vintage_values_parsed, ts_data_parsed, fullname, units, hist_freq, show) {
	
	//console.log('fcDataParsed', fcDataParsed);
	if (show === false) {
		console.log('Exiting');
		return;
	}
	
	document.querySelector('#primary-forecast-vintage-div').innerHTML = `
		<button type="button" class="btn btn-sm text-dark mx-auto px-2 py-2" style="background: linear-gradient(rgb(255, 247, 237), rgb(255, 247, 237));
color: rgb(154, 52, 18) !important; border: 0px !important" data-bs-toggle="modal" data-bs-target="#primary-forecast-vintage-modal">
			Prior Forecast Values
		</button>

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

	const modal = document.querySelector('#primary-forecast-vintage-modal')
		
	modal.addEventListener('shown.bs.modal', function(e) {
		
		// Only build on first modal load
		if ($('#vintage-chart-container').highcharts() != undefined) return;

		const vdates = [...new Set(vintage_values_parsed.map(x => x.vdate))]
		
		const gradient_map = gradient.create(
		  [0, vdates.length * .25, vdates.length * .3, vdates.length * .35, vdates.length * .6, vdates.length * .8, vdates.length], //array of color stops
		  ['#0094ff', '#00ffa8', '#8aff00', '#FFd200', '#FF8c00', '#FF5a00', '#FF1e00'], //array of colors corresponding to color stops
		  'hex' //format of colors in previous parameter - 'hex', 'htmlcolor', 'rgb', or 'rgba'
		);

		
		const chart_data_0 =
			vdates
			.map(vdate => ({
				vdate: vdate,
				data: vintage_values_parsed.filter(y => y.vdate === vdate).map(y => [y.date, y.value])
			}))
			.sort((a, b) => moment(a.vdate) > moment(b.vdate) ? 1 : -1)
			.map((x, i) => ({
				index: i,
				color: gradient.valToColor(i, gradient_map, 'hex'),
				name: moment(x.vdate).format('MMM YY'),
				custom: {
					label: x.vdate + ' Forecast'
				},
				data: x.data.map(y => [parseInt(moment(y[0]).format('x')), y[1]]),
				visible: (hist_freq === 'm' ? moment(x.vdate).month() == moment().month() : moment(x.vdate).quarter() == moment().quarter() ),
				lineWidth: 3,
				opacity: .7,
				dashStyle: 'ShortDash',
				zIndex: 4
			}))
			
		
		//console.log(ts_data_parsed);
		
		const hist_chart_data = {
			data: ts_data_parsed.filter(x => x.tskey === 'hist')[0]['data']
				.map(y => [parseInt(moment(y[0]).format('x')), y[1]])
				//.filter(y => moment(y[0]) >= moment().add(-3, 'years')),
				.filter(y => moment(y[0]) >= moment(chart_data_0[0].data[0][0])),
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
					fontColor: 'var(--bs-cmefi-green)'
				},
				height: 500,
				plotBorderColor: 'black',
				plotBorderWidth: 2
			},
			title: {
				useHTML: true,
				text: 
					'<img class="me-2 mb-1" width="18" height="18" src="/static/cmefi-short.svg">' +
					'<div style="vertical-align:middle;display:inline"><span>Prior Forecasts</span></div>',
				style: {
					fontSize: '1.1rem',
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
				plotBands: [{color: '#D8D8D8', from: Date.UTC(2020, 2, 1), to: Date.UTC(2021, 2, 28)},
				{color: '#D8D8D8', from: Date.UTC(2007, 12, 1), to: Date.UTC(2009, 6, 30)},
				{color: '#D8D8D8', from: Date.UTC(2001, 3, 1), to: Date.UTC(2001, 11, 30)}],
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
					text: units,
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
				backgroundColor: 'var(--bs-efpaleblue)',
				borderColor: 'var(--bs-cmefi-dark)',
				borderWidth: 1,
				align: 'right',
				verticalAlign: 'top',
				layout: 'vertical',
				title: {
					text: 'Prior Forecasts<br><span style="font-size: .7rem; color: #666; font-weight: normal; font-style: italic">(click below to hide/show)</span>',
				}
			},
			tooltip: {
				useHTML: true,
				shared: true,
				backgroundColor: 'rgba(255, 255, 255, .8)',
				formatter: function () {
					const points = this.points;
					const text =
						'Historical Forecasts for ' + moment(this.x).format('MMM YYYY') + ' Value' +
						'<table>' +
						'<tr class="px-1" style="border-bottom:1px solid black"><td>DATE</td><td class="px-2" style="font-weight:600">' +
							'FORECAST' +
						'</td></tr>' +
						points.map(function(point) {
							const str =
								`<tr>
									<td class="px-1" style="color:${point.color}">${point.series.options.custom.label}</td>
									<td class="px-2">${point.y.toFixed(2)}</td>
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
		
	});

		

		
	
	
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
		'<p>This model is updated daily. New releases will be made available between 16:00 and 20:00 ET.</p>' +
		document.querySelector('#primary-forecast').innerHTML;


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

