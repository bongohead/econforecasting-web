init();

document.addEventListener('DOMContentLoaded', function() {

	{
		const el = document.querySelector('#forecast-container');

		const ud =  {
			varname: el.dataset.varname,
			fullname: el.dataset.fullname,
			units: el.dataset.units,
			primary_forecast: el.dataset.primaryForecast,
			secondary_forecasts: el.dataset.secondaryForecasts,
			show_vintage_chart: el.dataset.showVintageChart === 'true',
			hist_freq: el.dataset.histFreq,
			hist_update_freq: el.dataset.histUpdateFreq,
			site: el.dataset.site,
			debug: window.location.host.split('.')[0] === 'dev'
		};

		setData('forecast', ud);
	}

	/********** GET DATA **********/
	const ud = getData('forecast') || {};

	const get_hist_obs = getApi(`get_hist_obs?varname=${ud.varname}&freq=${ud.hist_freq}`, 10, ud.debug);
	const get_forecast_values = getApi(`get_latest_forecast_obs?varname=${ud.varname}&forecast=${[ud.primary_forecast, ud.secondary_forecasts].join(',')}`, 10, ud.debug);
	const start = performance.now();

	Promise.all([get_hist_obs, get_forecast_values]).then(function(r) {

		const hist_obs = r[0][0];
		const forecast_values = r[1];
		if (ud.debug) console.log('Data load time', performance.now() - start, r);
		
		const hist_series = {
			tskey: 'hist',
			ts_type: 'hist',
			freq: ud.hist_freq,
			shortname: 'Historical Data',
			update_freq: ud.hist_update_freq,
			description: 'Historical Data',
			external: false,
			vdate: dayjs().format('YYYY-MM-DD'),
			data: hist_obs.data
				.filter(x => dayjs(x.date) <= dayjs().add(15, 'years'))
				.map(x => [x.date, parseFloat(x.value)]).sort((a, b) =>  dayjs(a[0]) - dayjs(b[0]))
		};

		if (ud.debug) console.log('hist_series', hist_series);

		const forecast_series = forecast_values.map(f => ({
			tskey: f.forecast,
			ts_type: f.forecast === ud.primary_forecast ? 'primary' : 'secondary',
			freq: f.freq,
			shortname: f.shortname,
			update_freq: f.update_freq,
			description: f.description,
			external: f.external,
			vdate: f.vdate || null,
			data: f.data
				.filter(x => dayjs(x.date) <= dayjs().add(10, 'years'))
				.filter(x => f.vdate == null || dayjs(x.date) >= dayjs(f.vdate).add(-4, 'months'))
				.map(x => [x.date, parseFloat(x.value)]).sort((a, b) => dayjs(a[0]) - dayjs(b[0]))
		}));

		if (ud.debug) console.log('forecast_series', forecast_series);
		
		const ts_data_parsed =
			[hist_series].concat(forecast_series)
			.sort((a, b) =>
				a.ts_type === 'primary' && a.ts_type !== 'hist' ? -1
				: b.ts_type === 'primary' && b.fcname !== 'hist' ? 1 
				: a.ts_type === 'hist' ? 1 
				: b.ts_type === 'hist' ? -1
				: 0
			).map((x, i) => ({...x, order: i}));

		const res = {...ud, ts_data_parsed: ts_data_parsed};
		setData('forecast', res);
		if (ud.debug) console.log('Data parse time', performance.now() - start, forecast_values);

		return(res);	
	}).then(function(res) {

		withLoader('chart-container', drawChart)(res.ts_data_parsed, res.fullname, res.units, res.hist_freq, res.site);
		withLoader('table-container', drawTable)(res.ts_data_parsed, res.units);

		if (ud.show_vintage_chart === true) addVintageChartListener(res)
		if (ud.debug) console.log('Draw time', Date.now() - start);
	})
	.catch(e => ajaxError(e));
});

/*** Draw chart ***/
const drawChart = function(ts_data_parsed, fullname, units, hist_freq, site) {
	
	const chart_data =
		ts_data_parsed
		.map((x, i) => (
			{
				id: x.tskey,
				name: x.shortname,
				custom: {
					legend_el: 
						`<div class="forecast-chart-legend-item">
							<span class="fw-bolder text-sm d-block" style="color: ${(x.tskey === 'hist' ? 'black' : getColorArray()[i])}">
								${x.shortname}
							</span>
							<span class="d-block fst-italic text-slate-500" style="font-size:.85rem;">
								updated ${x.update_freq  === 'd' ? 'daily' : x.update_freq === 'm' ? 'monthly' : x.update_freq === 'q' ? 'quarterly' : 'unknown'}, last on ${dayjs(x.vdate).format('MM/DD')}
							</span>
							<span class="d-block fst-italic text-slate-500" style="font-size:.85rem;">values are ${(x.freq === 'q' ? 'quarterly' : 'monthly')} aggregates</span>
						</div>`,
						label_el: `${x.shortname}${x.tskey === 'hist' ? '' : ' ' + dayjs(x.vdate).format('MM/DD')}`
				},
				data: x.data.map(x => [dayjs(x[0]).unix() * 1000, x[1]]),
				type: 'line',
				dashStyle: (x.tskey === 'hist' ? 'Solid' : 'ShortDash'),
				lineWidth: (x.ts_type === 'hist' ? 3 : 2),
				zIndex: (x.ts_type === 'hist' ? 3 : x.ts_type == 'primary' ? 3 : 1),
				legendIndex: (x.ts_type === 'hist' ? 0 : x.ts_type == 'primary' ? 1 : 2),
				color: (x.tskey === 'hist' ? '#344D56' : getColorArray()[i]),
				opacity: 2,
				visible: (x.ts_type === 'primary' || x.ts_type === 'hist'),
				index: i
			}
		));
	// console.log('chart_data', chart_data);
	
	const o = {
        chart: {
        },
		responsive: {
			rules: [{
				chartOptions: {
					legend: {
						enabled: false
					},
					navigator: {
						enabled: false
					},
					exporting: {
						enabled: false
					},
					caption: {
						text: `<span class="text-xs d-block text-end">
							<a href="https://${site}.com" class="d-flex align-items-center text-xs justify-content-end"><img class="me-1" width="12" height="12" src="/static/brand/small.svg"> https://${site}.com</a>
						</span>`,		
					}
				},
				condition: {
					maxWidth: 800
				}
			}]
		},	
        title: {
			text: fullname,
			margin: -20,
        },
		caption: {
			enabled: true,
			useHTML: true,
			text: 
				`
				<div class="text-xs d-block text-end" style="line-height:.75rem">
					<a href="https://${site}.com" class="d-flex align-items-center justify-content-end mb-1"><img class="me-1" width="12" height="12" src="/static/brand/small.svg"> https://${site}.com</a>
					<span class="d-block">Shaded area indicate recessions</span>
					<span class="d-block">${(hist_freq === 'm' ? 'Values represent monthly averages' : '')}</span>
				</span>
				`,
			align: 'right',
			floating: true
		},
		exporting: {
			enabled: true,
			sourceWidth: 1200,
			sourceHeight: 600,
			chartOptions: {
				chart: {
					backgroundColor: 'rgba(255, 255, 255, 1)',
					plotBackgroundColor: '#FFFFFF',	
					plotBorderWidth: 0,
					style: {
						fontFamily: 'sans-serif'
					}
				},
				filename: fullname,
				title: {
					align: 'center',
					margin: 20
				},
				legend: {
					enabled: false
				},
				rangeSelector: {
					enabled: false
				},
				navigator: {
					enabled: false
				},
				caption: {
					enabled: true,
					floating: false,
					text: `https://${site}.com`
				}	
			}
		},
        plotOptions: {
			series: {
				//shadow: true,
				showInNavigator: true,
				label: { // Series labels
					enabled: true,
					formatter: function() {
						return this.options.custom.label_el;
					}		
				},
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
					text: '1Y',
					events: {
						click: function(e) {
							const state = $('#chart-container > div.loadee-container ').highcharts().rangeSelector.buttons[0].state;
							chart.xAxis[0].setExtremes(
								Math.max(
									dayjs.min(ts_data_parsed.filter(x => x.tskey === 'hist')[0].data.map(x => dayjs(x[0]))).unix() * 1000,
									dayjs().add(-12, 'M').unix() * 1000
									),
								dayjs().add(12, 'M').unix() * 1000
								);
							$('#chart-container > div.loadee-container').highcharts().rangeSelector.buttons[0].setState(state === 0 ? 2 : 0);
							return false;
						}
					}
				}, {
					text: '2Y',
					events: {
						click: function(e) {
							const state = $('#chart-container > div.loadee-container ').highcharts().rangeSelector.buttons[1].state;
							chart.xAxis[0].setExtremes(
								Math.max(
									dayjs.min(ts_data_parsed.filter(x => x.tskey === 'hist')[0].data.map(x => dayjs(x[0]))).unix() * 1000,
									dayjs().add(-24, 'M').unix() * 1000
									),
								dayjs().add(24, 'M').unix() * 1000
								);
							$('#chart-container > div.loadee-container ').highcharts().rangeSelector.buttons[1].setState(state === 0 ? 2 : 0);
							return false;
						}
					}
				}, {
					text: '5Y',
					events: {
						click: function(e) {
							const state = $('#chart-container > div.loadee-container ').highcharts().rangeSelector.buttons[2].state;
							chart.xAxis[0].setExtremes(
								Math.max(
									dayjs.min(ts_data_parsed.filter(x => x.tskey === 'hist')[0].data.map(x => dayjs(x[0]))).unix() * 1000,
									dayjs().add(-60, 'M').unix() * 1000
									),
								dayjs().add(60, 'M').unix() * 1000
								);
							$('#chart-container > div.loadee-container ').highcharts().rangeSelector.buttons[2].setState(state === 0 ? 2 : 0);
							return false;
						}
					}
				}, {
					type: 'all',
					text: 'Full Historical Data & Forecast'
				}
			]
		},
		xAxis: {
			type: 'datetime',
            dateTimeLabelFormats: {
                day: "%m-%d-%Y",
                week: "%m-%d-%Y",
                month: "%m/%Y",
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
						getData('forecast').ts_data_parsed.filter(x => x.tskey !== 'hist').map(x => dayjs(x.data[x.data.length - 1][0]))
						).add(1, 'month').unix() * 1000,
					dayjs().add(24, 'M').unix() * 1000,
				)
		},
		yAxis: {
            labels: {
				reserveSpace: true,
                formatter: function () {
                    return this.value.toFixed(1) + '%';
                }
            },
			title: {
				text: units,
			},
			opposite: false
		},
        navigator: {
            enabled: true,
			height: 20,
			maskFill: 'rgba(48, 79, 11, .3)'
        },
		legend: {
			enabled: true,
			backgroundColor: 'var(--white-warmer)',
			borderColor: 'var(--slate-200)',
			borderWidth: 0,
			useHTML: true,
			align: 'right',
			padding: 10,
			verticalAlign: 'top',
			layout: 'vertical',
			maxHeight: 284,
			itemHiddenStyle: {
				opacity: .3,
			},	
			itemHoverStyle: {
				opacity: .8
			},
			labelFormatter: function() {
				return this.options.custom.legend_el;
			},
			navigation: {
				activeColor: 'var(--sky)',
				animation: true,
				arrowSize: 12,
				inactiveColor: '#CCC',
				style: {
					color: 'var(--slate-500)'
				}
			},	
			title: {
				text:
					'<span class="text-sm fw-normal">Available Series </span>' +
					'<span class="text-xs fw-normal fst-italic text-slate-500" >(click labels to hide/show)</span>'
			}
		},
        tooltip: {
            useHTML: true,
			shared: true,
			backgroundColor: 'rgba(255, 255, 255, .8)',
			formatter: function () {
				const points = this.points;
				// const ud = getData('forecast-varname');
				const text =
					'<table>' +
					'<tr style="border-bottom:1px solid black"><td style="font-weight: 400">DATE</td><td style="font-weight:400">' +
						'DATA' +
					'</td></tr>' +
					points.map(function(point) {
						const freq = ts_data_parsed.filter(x => x.tskey === point.series.options.id)[0].freq;
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
	const chart = Highcharts.stockChart(document.querySelector('#chart-container > .loadee-container'), o);
	chart.rangeSelector.buttons[1].setState(2);

	return;
}




const addVintageChartListener = function (res) {
	
	if (res.debug) console.log('Data stored in memory for event listener', res);

	const modal = document.querySelector('#primary-forecast-vintage-modal')
		
	modal.addEventListener('shown.bs.modal', function(e) {

		e.preventDefault();
		e.stopPropagation();
		// Only build on first modal load
		if (Highcharts.charts[document.querySelector('#vintage-chart-container').getAttribute('data-highcharts-chart')] != undefined) return;

		const get_monthly_vintage_forecast_obs = getApi(`get_monthly_vintage_forecast_obs?varname=${res.varname}&forecast=${res.primary_forecast}`, 10, res.debug);
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
					name: dayjs(x.vdate).format('YYYY - MMM'),
					custom: {
						label: x.vdate + ' Forecast'
					},
					data: x.data.map(y => [dayjs(y[0]).unix() * 1000, y[1]]),
					visible: (res.hist_freq === 'm' ? dayjs(x.vdate).month() == dayjs().month() : dayjs(x.vdate).quarter() == dayjs().quarter() ),
					lineWidth: 2,
					opacity: .7,
					dashStyle: 'ShortDash',
					zIndex: 4
				}));

				const hist_chart_data = {
					data: res.ts_data_parsed.filter(x => x.tskey === 'hist')[0]['data']
						.map(y => [dayjs(y[0]).unix() * 1000, y[1]])
						.filter(y => dayjs(y[0]) >= dayjs(chart_data_0[0].data[0][0]) - 5 * 365 * 86400000),
					color: 'black',
					name: 'Historical Data',
					visible: true,
					lineWidth: 4,
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
				
				if (res.debug) console.log('vintage_chart_data', chart_data);
				
				const o = {
					chart: {
					},
					title: {
						text: res.fullname + ' - Historical Forecast Values',
						align: 'left',
						style: {
							fontWeight: "normal"
						}
					},
					caption: {
						enabled: true,
						useHTML: true,
						text: 
							`
							<span class="text-xs d-block">
								<a href="https://${res.site}.com" class="d-flex align-items-center text-xs justify-content-end"><img class="me-1" width="12" height="12" src="/static/brand/small.svg"> https://${res.site}.com</a>
							</span>
							`,
						align: 'left',
						floating: false
					},
					exporting: {
						enabled: true,
						sourceWidth: 1200,
						sourceHeight: 600,
						chartOptions: {
							chart: {
								backgroundColor: 'rgba(255, 255, 255, 1)',
								plotBackgroundColor: '#FFFFFF',	
								plotBorderWidth: 0,
								style: {
									fontFamily: 'sans-serif'
								}
							},
							filename: res.fullname,
							title: {
								align: 'center',
								margin: 20
							},
							legend: {
								enabled: false
							},
							rangeSelector: {
								enabled: false
							},
							navigator: {
								enabled: false
							},
							caption: {
								enabled: true,
								floating: false,
								text: `https://${res.site}.com`
							}	
						}
					},			
					plotOptions: {
						series: {
							//shadow: true,
							showInNavigator: true,
							label: {
								enabled: false 
							},
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
							week: "%m-%d-%Y",
							month: "%m/%Y",
						},
						plotBands: [
							{color: '#D8D8D8', from: Date.UTC(2020, 2, 1), to: Date.UTC(2021, 2, 28)},
							{color: '#D8D8D8', from: Date.UTC(2007, 12, 1), to: Date.UTC(2009, 6, 30)},
							{color: '#D8D8D8', from: Date.UTC(2001, 3, 1), to: Date.UTC(2001, 11, 30)}
						],
						ordinal: false
					},
					yAxis: {
						labels: {
							reserveSpace: true,
							formatter: function () {
								return this.value.toFixed(1) + '%';
							}
						},
						title: {
							text: res.units
						},
						opposite: false
					},
					navigator: {
						enabled: true,
						height: 20,
						maskFill: 'rgba(48, 79, 11, .3)'
					},
					legend: {
						enabled: true,
						y: 38,
						backgroundColor: 'var(--white-warmer)',
						borderWidth: 0,
						align: 'right',
						padding: 10,
						verticalAlign: 'top',
						layout: 'vertical',
						title: {
							text: 
								'<span class="text-sm fw-normal">Prior Forecasts </span>' +
								'<span class="text-xs fw-normal fst-italic text-slate-500" >(click labels to hide/show)</span>'
						},
						reversed: true
					},
					tooltip: {
						useHTML: true,
						shared: true,
						backgroundColor: 'rgba(255, 255, 255, .8)',
						formatter: function () {
							const points = this.points;
							const text =
								'Historical Forecasts for ' + dayjs(this.x).format('MMM YYYY') + '' +
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



const drawTable = function(ts_data_parsed, units) {
	
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
		li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
		//li.classList.add('w-100'); // Needed to get the thing to vertically align
		li.innerHTML =
			'<span class="d-flex align-items-center fw-medium">' +
				(x.ts_type === 'primary' ? '<img class="mx-1" width="14" height="14" src="/static/brand/icon-clear-bg-static-for-png.svg">' : '') + x.shortname +
			'</span>' + 
			'<span class="text-xs" style="color: rgb(180, 180, 180)" >' +
				('Updated ' + dayjs(x.vdate).format('MM/DD/YYYY')) +
			 '</span>';
		li.setAttribute('data-ref-table', x.tskey); 
		if (x.ts_type === 'primary') li.classList.add('active');
		document.querySelector('#li-container').appendChild(li);
		
		
		// Create table and style it
		const table = document.createElement('table');
		table.classList.add('table', 'data-table', 'w-100');
		table.id = 'table-' + x.tskey;
		document.querySelector('#table-container > .loadee-container').appendChild(table);
		
		// <span style="font-size:.90rem">Select a series:</span>
		// <ul class="list-group list-group-vertical m-3" id="li-container">
		// </ul>

		// Draw the table
		//console.log('#table-' + x.tskey);
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
		if (x.ts_type !== 'primary') downloadDiv.style.display = 'none'
		$('#table-container > div.loadee-container > span').after($(downloadDiv).detach());
		
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
