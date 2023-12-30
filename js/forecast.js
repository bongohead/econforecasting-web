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
			hist_is_agg: el.dataset.histIsAgg === 'true',
			site: el.dataset.site,
			debug: window.location.host.split('.')[0] === 'dev'
		};

		setData('forecast', ud);
	}

	/********** GET DATA **********/
	const ud = getData('forecast') || {};
	const start = performance.now();

	const get_hist_obs = getApi(`get_hist_obs?varname=${ud.varname}&freq=${ud.hist_freq}`, 10, ud.debug);
	const get_forecast_values = getApi(`get_latest_forecast_obs?varname=${ud.varname}&forecast=${[ud.primary_forecast, ud.secondary_forecasts].join(',')}`, 10, ud.debug);

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

		if (ud.debug) console.log('Draw time', Date.now() - start);
	})
	.catch(e => ajaxError(e));

	if (ud.show_vintage_chart === true) {		

		document.querySelector('#fixed-date-chart-modal').addEventListener('shown.bs.modal', function(e) {
			e.preventDefault();
			e.stopPropagation();
			if (Highcharts.charts[document.querySelector('#fixed-date-chart-container > div.loadee-container').getAttribute('data-highcharts-chart')] != undefined) return;

			const get_dates_with_vintages = getApi(`get_dates_with_vintages?varname=${ud.varname}&forecast=${ud.primary_forecast}`)

			Promise.all([get_hist_obs, get_dates_with_vintages])
				.then(function(r) {
					// if (ud.debug) console.log('Obs dates data load time', performance.now() - start, r[1]);
					const res = {...ud, hist: r[0][0], dates_with_vintages: r[1].map(z => z.date)};
					return(res);
				}).then(function(res) {
					// if (ud.debug) console.log('r', res);
					withLoader('fixed-date-chart-container', drawFixedDateChart)(res);
				})
				.catch(e => ajaxError(e));
		});

		document.querySelector('#fixed-vdate-chart-modal').addEventListener('shown.bs.modal', function(e) {
			e.preventDefault();
			e.stopPropagation();
			if (Highcharts.charts[document.querySelector('#fixed-vdate-chart-container > div.loadee-container').getAttribute('data-highcharts-chart')] != undefined) return;

			const get_vdates = getApi(`get_vdates?varname=${ud.varname}&forecast=${ud.primary_forecast}`);
		
			Promise.all([get_hist_obs, get_vdates])
				.then(function(r) {
					// if (ud.debug) console.log('Obs dates data load time', performance.now() - start, r[1]);
					const res = {...ud, hist: r[0][0], vdates: r[1].map(z => z.vdate)};
					return(res);
				}).then(function(res) {
					// if (ud.debug) console.log('r', res);
					withLoader('fixed-vdate-chart-container', drawFixedVdateChart)(res);
				})
				.catch(e => ajaxError(e));
		});

	}


});

/*** Draw primary chart ***/
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

	const hist_data = chart_data.filter(x => x.id === 'hist')[0].data;
	// console.log('chart_data', chart_data);
	
	const o = {
        chart: {
        },
		responsive: {
			rules: [{
				chartOptions: {
					title: {
						align: 'center',
						margin: 20
					},
					legend: {
						enabled: false
					},
					yAxis: {
						title: {
							text: null
						}
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
					maxWidth: 576 // <= md
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
			fallbackToExportServer: false,
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
				showInNavigator: true,
				label: {
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
			enabled: true,
			buttons: [
				{
					text: '1Y',
					events: {
						click: function(e) {
							const state = $('#chart-container > div.loadee-container ').highcharts().rangeSelector.buttons[0].state;
							chart.xAxis[0].setExtremes(
								Math.max(hist_data[0][0], dayjs().add(-12, 'M').unix() * 1000),
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
								Math.max(hist_data[0][0], dayjs().add(-24, 'M').unix() * 1000),
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
								Math.max(hist_data[0][0], dayjs().add(-60, 'M').unix() * 1000),
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
			min: Math.max(hist_data[0][0], dayjs().add(-24, 'M').unix() * 1000),
			max: dayjs().add(24, 'M').unix() * 1000
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


const drawFixedDateChart = function(res) {

	const obs_dates = res.dates_with_vintages;
	const freq = res.hist_freq === 'm' ? 'month' : 'quarter';
	const floor_today = dayjs().startOf(freq).format('YYYY-MM-DD');

	// Define a custom symbol path
	Highcharts.SVGRenderer.prototype.symbols.cross = function (x, y, w, h) {
		return ['M', x, y, 'L', x + w, y + h, 'M', x + w, y, 'L', x, y + h, 'z'];
	};

	const hist_data = {
		name: 'Actual values',
		data: res.hist.data.map(x => [dayjs(x.date).endOf(freq).unix() * 1000, x.value]).sort((a, b) => a[0]- b[0]),
		type: 'line',
		showInLegend: false,
		enableMouseTracking: false,
		color: 'rgb(100, 116, 139)',
		visible: true,
		custom: {
			type: 'hist'
		},
		states: {
			inactive: {
				opacity: 1
			}
		}
	};
	
	const chart_data_0 = obs_dates.map((d, i) => {
		const pred = {
			name: dayjs(d).format('MMM YYYY'),
			type: 'line',
			id: 's' + d,
			data: [],
			color: getColor(i),
			visible: false,
			custom: {
				type: 'forecast',
				yyyymmdd_date: d
			}
		};
		const hist = {
			linkedTo: 's' + d,
			name: 'Final ' + dayjs(d).format('MMM YYYY') + ' value',
			data: [],
			color: pred.color,
			type: 'scatter',
			visible: pred.visible,
			showInLegend: false,
			custom: {
				type: 'actual'
			}
		};
		
		return [pred, hist]
	}).flat();

	const chart_data = chart_data_0.concat(hist_data);

	const o = {
		chart: {
		},
		title: {
			text: res.fullname + ' - Rolling Forecasts by Target Period',
			align: 'left',
			style: {
				fontWeight: "normal"
			}
		},
		responsive: {
			rules: [{
				chartOptions: {
					title: {
						align: 'center',
						floating: false
					},
					exporting: {
						enabled: false
					},
				},
				condition: {
					maxWidth: 700 
				}
			}]
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
			fallbackToExportServer: false,
			sourceWidth: 1000,
			sourceHeight: 500,
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
			line: {
				showInNavigator: true,
				label: {
					enabled: true,
					formatter: function() {
						return this.options.custom.type === 'forecast' ? `<span>Forecast for ${this.name}</span>` : `${this.name}`
					}
				},
				dataGrouping: {
					enabled: false
				},
				events: {
					show: function () {

						const series = this;
						const hist_series = this.linkedSeries[0];
						const chart = this.chart;
						chart.showLoading('Loading data ...');

						getApi(`get_forecast_vintages_for_date?varname=${res.varname}&forecast=${res.primary_forecast}&date=${this.options.custom.yyyymmdd_date}&hist_freq=${res.hist_freq}`, 10, res.debug)
							.then(function(r) {
								chart.series.forEach(s => {
									if (s.options.id !== series.options.id & s.options.id !== hist_series.options.id && s.options.visible) s.hide()
								});
								if (r[0].actual !== null) {
									hist_series.setData([[dayjs(r[0].date).endOf(freq).unix() * 1000, r[0].actual]], true);
								}
								const new_data = r[0].values.map(y => [dayjs(y[0]).unix() * 1000, y[1]]);
								series.setData(new_data, true);
								chart.xAxis[0].setExtremes(new_data[0][0], new_data[new_data.length - 1][0] + 86400 * 31000 )
								chart.hideLoading();
							})
					},
					hide: function() {
						this.setData([], true);
					}
				}
			},
			scatter: {
				enableMouseTracking: false,
				dataLabels: {
					enabled: true,
					formatter: function() {
						return `<span style="color:${this.series.color}">Final value: ` + this.y + '</span>';
					}
				},
				marker: {
					symbol: 'cross',
					lineColor: null,
					lineWidth: 3,
					// height: 10,
					// width: 10,
					radius: 7
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
			ordinal: false,
			title: {
				text: 'Date of forecast'
			}
		},
		yAxis: {
			labels: {
				reserveSpace: true,
				formatter: function () {
					return this.value.toFixed(2) + '%';
				}
			},
			opposite: false
		},
		navigator: {
			enabled: false,
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
					'<span class="text-sm fw-normal">Target Forecast</span>'
			},
			reversed: true,
			navigation: {
				activeColor: 'var(--sky)',
				animation: true,
				arrowSize: 12,
				inactiveColor: '#CCC',
				style: {
					color: 'var(--slate-500)'
				}
			}
		},
		tooltip: {
			useHTML: true,
			shared: true,
			backgroundColor: 'rgba(255, 255, 255, .8)',
			formatter: function () {
				return `${dayjs(this.x).format('MMM Do YYYY')} forecast for <span style="color:${this.color}">${this.series.name} ${res.fullname}</span>: ${this.y}`
			}

		},
		series: chart_data
	};
	
	const chart = Highcharts.stockChart(document.querySelector('#fixed-date-chart-container > .loadee-container'), o);
	chart.series.filter(s => s.options.custom.yyyymmdd_date === floor_today)[0].show();
	return;
}

const drawFixedVdateChart = function (res) {

	// const vintage_values_parsed = r.map(x => ({date: x.date, vdate: x.vdate, value: parseFloat(x.d1)}));
	const vdates = res.vdates;

	// const gradient_map = gradient.create(
	// 	[0, vdates.length * .25, vdates.length * .3, vdates.length * .35, vdates.length * .6, vdates.length * .8, vdates.length], //array of color stops
	// 	['#0094ff', '#00ffa8', '#8aff00', '#FFd200', '#FF8c00', '#FF5a00', '#FF1e00'], //array of colors corresponding to color stops
	// 	'hex' //format of colors in previous parameter - 'hex', 'htmlcolor', 'rgb', or 'rgba'
	// );

	const hist_data = {
		data: res.hist.data.map(x => [dayjs(x.date).unix() * 1000, x.value]).sort((a, b) => a[0]- b[0]),
		color: 'rgb(100, 116, 139)',
		name: 'Historical data',
		visible: true,
		lineWidth: 4,
		opacity: .7,
		custom: {
			type: 'hist',
			legend_label: 'Actual value'
		},
		marker : {
			enabled: true,
			radius: 2,
			symbol: 'triangle'
		},
		zIndex: 3
	};

	const chart_data_0 = 
		vdates.map((vdate, i) => ({
			index: i,
			color: getColor(i),
			name: dayjs(vdate).format('MM/DD/YY'),
			custom: {
				type: 'forecast',
				legend_label: dayjs(vdate).format('MMM Do YYYY') + ' forecast',
				yyyymmdd_vdate: vdate
			},
			data: [],
			visible: false,
			lineWidth: 2,
			opacity: .7,
			dashStyle: 'ShortDash',
			zIndex: 4
		}));

	const chart_data = chart_data_0.concat(hist_data);
				
	const o = {
		chart: {
		},
		title: {
			text: res.fullname + ' - Prior Forecasts',
			align: 'left',
			style: {
				fontWeight: "normal"
			}
		},
		responsive: {
			rules: [{
				chartOptions: {
					title: {
						align: 'center',
						floating: false,
						margin: 50
					},
					exporting: {
						enabled: false
					},
					rangeSelector: {
						buttonPosition: {
							align: 'center',
						}
					},
					legend: {
						y: 0,
						maxHeight: 350,
					},			
				},
				condition: {
					maxWidth: 700 
				}
			}]
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
			fallbackToExportServer: false,
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
			line: {
				label: {
					enabled: true,
					formatter: function() {
						return this.options.custom.type !== 'hist' ? this.name + ' forecast': 'Realized values'
					}
				},
				dataGrouping: {
					enabled: false
				},
				events: {
					show: function () {
						const series = this;
						const chart = this.chart;
						if (this.options.custom.type !== 'forecast') return;
						chart.showLoading('Loading data ...');

						getApi(`get_forecasts_for_vdate?varname=${res.varname}&forecast=${res.primary_forecast}&vdate=${this.options.custom.yyyymmdd_vdate}`, 10, res.debug)
							.then(function(r) {
								const new_data = r[0].values.map(y => [dayjs(y[0]).unix() * 1000, y[1]]);
								series.setData(new_data, true);
								chart.hideLoading();
							})
					},
					hide: function() {
						if (this.options.custom.type !== 'forecast') return;
						this.setData([], true);
					}
				}
			}
		},
		rangeSelector: {
			enabled: true,
			floating: true,
			y: -40,
			buttons: [
				{
					text: '1Y',
					events: {
						click: function(e) {
							const state = $('#fixed-vdate-chart-container > div.loadee-container ').highcharts().rangeSelector.buttons[0].state;
							chart.xAxis[0].setExtremes(
								Math.max(hist_data.data[0][0], dayjs().add(-12, 'M').unix() * 1000),
								dayjs().add(12, 'M').unix() * 1000
							);
							$('#fixed-vdate-chart-container > div.loadee-container').highcharts().rangeSelector.buttons[0].setState(state === 0 ? 2 : 0);
							return false;
						}
					}
				}, {
					text: '2Y',
					events: {
						click: function(e) {
							const state = $('#fixed-vdate-chart-container > div.loadee-container ').highcharts().rangeSelector.buttons[1].state;
							chart.xAxis[0].setExtremes(
								Math.max(hist_data.data[0][0], dayjs().add(-24, 'M').unix() * 1000),
								dayjs().add(24, 'M').unix() * 1000
							);
							$('#fixed-vdate-chart-container > div.loadee-container ').highcharts().rangeSelector.buttons[1].setState(state === 0 ? 2 : 0);
							return false;
						}
					}
				}, {
					text: '5Y',
					events: {
						click: function(e) {
							const state = $('#fixed-vdate-chart-container > div.loadee-container ').highcharts().rangeSelector.buttons[2].state;
							chart.xAxis[0].setExtremes(
								Math.max(hist_data.data[0][0], dayjs().add(-60, 'M').unix() * 1000),
								dayjs().add(60, 'M').unix() * 1000
							);
							$('#fixed-vdate-chart-container > div.loadee-container ').highcharts().rangeSelector.buttons[2].setState(state === 0 ? 2 : 0);
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
			min: Math.max(hist_data.data[0][0], dayjs().add(-60, 'M').unix() * 1000),
			max: dayjs().add(60, 'M').unix() * 1000
		},
		yAxis: {
			labels: {
				reserveSpace: true,
				formatter: function () {
					return this.value.toFixed(1) + '%';
				}
			},
			opposite: false
		},
		navigator: {
			enabled: false,
			height: 20,
			maskFill: 'rgba(48, 79, 11, .3)'
		},
		legend: {
			enabled: true,
			y: 5,
			backgroundColor: 'var(--white-warmer)',
			borderWidth: 0,
			align: 'right',
			padding: 10,
			verticalAlign: 'top',
			layout: 'vertical',
			title: {
				text: '<span class="text-sm fw-normal">LEGEND</span>'
			},
			maxHeight: 400,
			reversed: true,
			navigation: {
				activeColor: 'var(--sky)',
				animation: true,
				arrowSize: 12,
				inactiveColor: '#CCC',
				style: {
					color: 'var(--slate-500)'
				}
			}	
		},
		tooltip: {
			useHTML: true,
			shared: true,
			backgroundColor: 'rgba(255, 255, 255, .8)',
			formatter: function () {
				const points = this.points;
				const x_date = dayjs(this.x).format('MMM YYYY');
				const text =
					points.filter(p => p.series.options.custom.type !== 'hist').map(function(point) {
						const str =
							`<span class="fw-normal d-block"><span class="fw-bolder" style="color:${point.color}">${point.series.options.custom.legend_label}</span> for ${x_date} ${res.fullname}:
							<span class="fw-bolder">${point.y.toFixed(2)}</span></span>`
						return str;
					}).join('') +
					points.filter(p => p.series.options.custom.type === 'hist').map(function(point) {
						const str =
							`<span class="fw-normal d-block"><span class="fw-bolder text-slate-500">Actual value</span> for ${x_date}:
							<span class="fw-bolder">${point.y.toFixed(2)}</span></span>`
						return str;
					}).join('');
				return text;
			}
		},
		series: chart_data
	};
	
	const chart = Highcharts.stockChart(document.querySelector('#fixed-vdate-chart-container > .loadee-container'), o);
	chart.series.slice(-4).forEach(s => s.show());
	chart.rangeSelector.buttons[2].setState(2);

	return;
		
}




const drawTable = function(ts_data_parsed, units) {
	
	// Turn into list of series
	// Separate tab for each table
	const table_data = ts_data_parsed.sort((a, b) => a.ts_type === 'hist' ? -1 : b.ts_type === 'hist' ? 1 : a.ts_type === 'primary' ? -1: 0).forEach(function(x, i) {

		const series_data =
			(x.tskey === 'hist') ?
			x.data.map(y => ({date: (x.freq === 'q' ? dayjs(y[0]).format('YYYY[Q]Q') : dayjs(y[0]).format('YYYY-MM')), type: 'Historical Data', value: y[1].toFixed(4)})) :
			x.data.map(y => ({date: (x.freq === 'q' ? dayjs(y[0]).format('YYYY[Q]Q') : dayjs(y[0]).format('YYYY-MM')), type: 'Forecast', value: y[1].toFixed(4)}));
		
		const dt_cols = [
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
		
		const copy_svg =
			`<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-clipboard me-1" viewBox="0 0 16 16">
				<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
				<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
			</svg>`;
			
		const download_svg = 
			`<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-download me-1" viewBox="0 0 16 16">
			<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path>
			<path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"></path>
			</svg>`;

		const o = {
			data: series_data,
			columns: dt_cols,
			iDisplayLength: 15,
			dom:
				"<'row justify-content-end'<'col-auto'B>>" +
				"<'row justify-content-center'<'col-12'tr>>" +
				"<'row justify-content-end'<'col-auto'p>>",
			buttons: [
				{extend: 'copyHtml5', text: copy_svg + 'Copy', exportOptions: {columns: [0, 2]}, className: 'btn btn-sm'},
				{extend: 'csvHtml5', text: download_svg + 'Download', exportOptions: {columns: [0, 2]}, className: 'btn btn-sm'}
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
		if (x.ts_type === 'primary') li.classList.add('active');
		document.querySelector('#li-container').appendChild(li);
		
		// Create table and style it
		const table_el = document.createElement('table');
		table_el.classList.add('table', 'data-table', 'w-100');
		document.querySelector('#dt-container').appendChild(table_el);
		
		// Draw the table
		$(table_el).DataTable(o);
		$(table_el).parents('div.dataTables_wrapper').addClass('transition duration-400');
		if (i !== 0) $(table_el).parents('div.dataTables_wrapper').addClass('position-absolute'); // Make all els after first el absolute-positioned
		if (x.ts_type !== 'primary') {
			$(table_el).parents('div.dataTables_wrapper').css('opacity', 0).css('z-index', 1);
		} else {
			$(table_el).parents('div.dataTables_wrapper').css('opacity', 1).css('z-index', 2);
		}

		// Move the download buttons
		const download_div = table_el.closest('.dataTables_wrapper').querySelector('.dt-buttons');
		download_div.classList.add('float-end');
		if (x.ts_type !== 'primary') download_div.style.display = 'none'
		$('#table-container > div.loadee-container > span').after($(download_div).detach());
		
		/* Now add event listener */
		li.addEventListener('click', function() { 
			document.querySelectorAll('#li-container > li').forEach(el => el.classList.remove('active'));
			this.classList.add('active');
			
			$('div.dataTables_wrapper').css('opacity', 0).css('z-index', 1);
			
			$(table_el).parents('div.dataTables_wrapper').css('opacity', 1).css('z-index', 2);
			
			$('#data-card div.dt-buttons').hide();
			$(download_div).show();
						
		}, false);
	});

	return;
}
