init();

document.addEventListener('DOMContentLoaded', function() {

	{
		const el = document.querySelector('#forecast-container');

		const ud =  {
			site: el.dataset.site,
			debug: window.location.host.split('.')[0] === 'dev'
		};

		setData('treasury-curve', ud);
	}

	/********** GET DATA **********/
	const ud = getData('treasury-curve') || {};
	const start = performance.now();

	const get_hist_obs = getApi(`get_hist_obs?varname=t01m,t02m,t03m,t06m,t01y,t02y,t05y,t07y,t10y,t20y,t30y&freq=m`, 10, ud.debug);
	const get_forecast_values = getApi(`get_latest_forecast_obs?varname=t01m,t02m,t03m,t06m,t01y,t02y,t05y,t07y,t10y,t20y,t30y&forecast=int`, 10, ud.debug);

	const get_cleaned_hist = get_hist_obs.then(function(r) {

		if (ud.debug) console.log('Fetch get_hist_obs', performance.now() - start, r);

		const hist_values_raw = r.map(x => {
			const ttm = parseInt(x.varname.substring(1, 3)) * (x.varname.substring(3, 4) === 'm' ? 1 : 12);
			return x.data.map(y => ({
				unixdate: dayjs(y.date),
				date: y.date,
				value: parseFloat(y.value),
				ttm: ttm
			}));
		}).flat().sort((a, b) => a.unixdate > b.unixdate);

		if (ud.debug) console.log('hist_values_raw', performance.now() - start, hist_values_raw);

		const hist_values =
			[... new Set(hist_values_raw.map(x => x.date))] // Get list of obs_dates
			.map(d => ({
				date: d,
				type: 'history',
				data: hist_values_raw.filter(x => x.date == d).map(x => [x.ttm, x.value]).sort((a, b) => a[0] - b[0]) // Sort according to largest value
			}));

		const hist_vdate = r[0].data.map(x => x.vdate).reduce((max, c) => c > max ? c : max);
		
		if (ud.debug) console.log('hist_values', performance.now() - start, hist_values);
		return {hist_values: hist_values, hist_vdate: hist_vdate};
	}).catch(e => ajaxError(e));

	const get_cleaned_forecast = get_forecast_values.then(function(r) {

		if (ud.debug) console.log('Fetch get_forecast_values', performance.now() - start, r);

		const forecast_values_raw = r.map(x => {
			const ttm = parseInt(x.varname.substring(1, 3)) * (x.varname.substring(3, 4) === 'm' ? 1 : 12);
			return x.data.map(y => ({
				vdate : x.vdate,
				date: y.date,
				unixdate: dayjs(y.date),
				value: parseFloat(y.value),
				ttm: ttm
			}));
		}).flat().sort((a, b) => a.unixdate > b.unixdate);

		if (ud.debug) console.log('forecast_values_raw', Date.now() - start, forecast_values_raw);

		const forecast_vdate = forecast_values_raw[0].vdate;		
		const forecast_values =
			[... new Set(forecast_values_raw.map(x => x.date))]
			.map(d => ({ // Group each value of the original array under the correct obs_date
				date: d,
				type: 'forecast',
				data: forecast_values_raw.filter(x => x.date == d).map(x => [x.ttm, x.value]).sort((a, b) => a[0] - b[0]) // Sort according to largest value
			}));

		if (ud.debug) console.log('forecast_values', Date.now() - start, forecast_values);
		return {forecast_values: forecast_values, forecast_vdate: forecast_vdate};
	}).catch(e => ajaxError(e));
	
	Promise.all([get_cleaned_hist, get_cleaned_forecast]).then(function([{hist_values, hist_vdate}, {forecast_values, forecast_vdate}]) {

		const treasury_data = 
			hist_values.concat(forecast_values)
			.map((x, i) => ({...x, ...{date_index: i}}))
			// Ordered Treasury data
			//.sort((a, b) => parseInt(dayjs(a.date).format('x')) > parseInt(dayjs(b.date).format('x'))) ;
			
		const chart_info = {
			treasury_data: treasury_data,
			hist_vdate: hist_vdate,
			forecast_vdate: forecast_vdate,
			play_state: 'pause',
			play_index: treasury_data.filter(x => x.type === 'forecast')[1].date_index // Start one months ahead
		};
		if (ud.debug) console.log('Finished data clean', Date.now() - start);

		const res = {...ud, ...chart_info};
		setData('treasury-curve', res);
		return(res);
	})
	.then(function(res) {
		withLoader('chart-container', drawChart)(res.treasury_data, res.play_index, res.forecast_vdate, res.hist_vdate, res.site);
		// drawChartAlt(res.treasury_data);
		withLoader('table-container', drawTable)(res.treasury_data, res.forecast_vdate, res.hist_vdate);
	})
	.catch(e => ajaxError(e));


	/********** EVENT LISTENERS FOR PLAYING **********/
	$('#chart-container-1').on('click', '#treasury-curve-subtitle-group > button.treasury-curve-action-button', function() {
		const ud = getData('treasury-curve');
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
				           
		setData('treasury-curve', {...getData('treasury-curve'), ...{play_state: newPlayState, play_index: newPlayIndex}});
		if (clickedPlayDirection !== 'pause') updateChart();
		else updateButtons();
		
		return;
    });
});


/*** Draw chart ***/
function drawChart(treasury_data, play_index, forecast_vdate, hist_vdate, site) {
	
	Highcharts.AST.allowedAttributes.push('data-dir');
	const o = {
        chart: {
			height: 450,
			animation: {
				duration: 500,
				easing: 'linear'
			},	
			spacingTop: 20,
			marginTop: 100,
			marginBottom: 80,
			spacingRight: 150,
			events: {
				load: function() {
					const distFromTop = this.chartHeight - (this.marginBottom + this.plotHeight);
					const distFromLeft = this.chartWidth - (this.marginRight + this.plotWidth);

					const text = this.renderer.label(
						`
						<tspan dy="0" x="5" id="date-text-current" style="color: #334155;font-size:13px;">
							⎯ Current yield curve for <tspan style="font-weight:bold">${dayjs(treasury_data.filter(t => t.type == 'history').slice(-1)[0].date).format('MMM YYYY')}</tspan>*
						</tspan>
						<tspan dy="16px" x="5" id="date-text-forecast" style="color:#298D25;font-size:13px;">
							⎯ Forecasted curve for <tspan style="font-weight:bold">${dayjs(treasury_data[play_index].date).format('MMM YYYY')}</tspan> (updated ${dayjs(forecast_vdate).format('MM/DD')})
						</tspan>
						`,
						x = distFromLeft, y = distFromTop, shape = 'rect'
					);

					text.attr({fill: '#FCFBEF', padding: 8, r: 0, zIndex: 0}).add();
				}
			}
        },
		responsive: {
			rules: [
			// Smallish, for ipads
			{
				condition: {maxWidth: 900},
				chartOptions: {
					exporting: {enabled: false},
					caption: {
						text: `<span class="text-xs d-block text-end">
							<a href="https://${site}.com" class="d-flex align-items-center text-xs justify-content-end"><img class="me-1" width="12" height="12" src="/static/brand/small.svg"> https://${site}.com</a>
						</span>`,
						align: 'right',
						x: 0
					}
				},
			},
			// Tiny 
			{
				condition: { maxWidth: 692 },
				chartOptions: {
					exporting: {enabled: false},
					chart: {marginRight: 0, spacingRight: 0},
					caption: {enabled: false, text: null}
				},
			}
			]
		},	
		navigation: {
			buttonOptions: {
				align: 'right',
				verticalAlign: 'bottom',
				y: 3,
				zIndex: 99999
			}
		},
		exporting: {
			enabled: true,
			sourceWidth: 1000,
			sourceHeight: 500,
			fallbackToExportServer: false,
			chartOptions: {
				chart: {
					backgroundColor: 'white',//'rgba(255, 255, 255, 1)',
					plotBackgroundColor: '#FFFFFF',	
					style: {
						fontFamily: 'sans-serif'
					},
					spacingRight: 20
				},
				filename: 'treasury-curve',
				title: {
					align: 'center',
					margin: 20
				},
				subtitle: {
					text: null
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
					x: 0,
					text: `https://${site}.com`
				}	
			}
		},
		plotOptions: {
			series: {
				label: {
					enabled: false
				}
			}
		},
		rangeSelector: {
			enabled: false
		},
		navigator: {
			enabled: false
		},
        title: {
			align: 'left',
			text: 'Treasury curve forecasts',
			style: {
				fontWeight: 'bold',
				fontSize: '1.2rem'
			}
        },
		subtitle: {
			useHTML: true,
			align: 'center',
			floating: true,
			text: 
			'<div class="btn-group d-inline-block" role="group" id="treasury-curve-subtitle-group">' +
				'<button class="btn btn-sm rounded-0 bg-slate-300 text-slate-500 fw-bolder text-xs border-0" type="button">FORECAST OVER TIME</button>'+
				'<button class="btn btn-sm rounded-0 text-xs treasury-curve-action-button" type="button" data-dir="start"><i class="bi bi-skip-backward"></i></button>' +
				'<button class="btn btn-sm rounded-0 text-xs treasury-curve-action-button" type="button" data-dir="back"><i class="bi bi-caret-left"></i></button>' +
				'<button class="btn btn-sm rounded-0 text-xs treasury-curve-action-button active" type="button" data-dir="pause"><i class="bi bi-pause"></i></button>' +
				'<button class="btn btn-sm rounded-0 text-xs treasury-curve-action-button" type="button" data-dir="forward" ><i class="bi bi-caret-right"></i></button>' +
				'<button class="btn btn-sm rounded-0 text-xs treasury-curve-action-button" type="button" data-dir="end"><i class="bi bi-skip-forward"></i></button>' +
			'</div>',
			y: 30,
			x: 10
		},
		caption: {
			useHTML: true,
			text: 
				`
				<div class="text-xs d-block text-end" style="line-height:.75rem">
					<a href="https://${site}.com" class="d-flex align-items-center justify-content-end mb-1"><img class="me-1" width="12" height="12" src="/static/brand/small.svg"> https://${site}.com</a>
					<span class="d-block">*<em>Average of daily data from ${dayjs(hist_vdate).startOf('month').format('MM/DD')} - ${dayjs(hist_vdate).format('MM/DD')}</em></span>
				</span>
				`,
			align: 'right',
			x: -80
		},
		xAxis: {
			title: {
				text: 'Time to Maturity (Months)'
			},
			tickPositions: [1, 2, 3, 6, 12, 24, 60, 84, 120, 240, 360],
			breaks: [{
				from: 12,
				to: 12 + (24 - 12) * .2
			}, {
				from: 24,
				to: 24 + (60 - 24) * .6
			}, {
				from: 60,
				to: 60 + (84 - 60) * .6
			}, {
				from: 84,
				to: 84 + (120 - 84) * .6
			}, {
				from: 120,
				to: 120 + (240 - 120) * .8
			}, {
				from: 240,
				to: 240 + (360 - 240) * .8
			}],
			min: 1,
			max: 360
		},
		yAxis: {
			title: {
				text: null
			},
			labels: {
				format: '{value}%'
			}
		},
		legend: {
			enabled: false
		},
        tooltip: {
            useHTML: true,
			shared: true,
			backgroundColor: 'rgba(255, 255, 255, .8)',
			formatter: function () {
				//console.log(this);
				const points = this.points; // Solves issue of tooltip not updating correctly with chart
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
            type: 'area',
			fillColor: {
                linearGradient: [0, 0, 0, 300],
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },
			marker: {
				enabled: true
			},
			zIndex: 2,
			fillColor: 'rgba(45, 140, 38, .5)',
			color: 'rgba(45, 140, 38, 1)'
        }, {
            data: treasury_data[play_index - 1].data,
			name: 'Current Yield',
            type: 'line',
            color: 'rgba(35, 45, 35, 1)',
			fillColor: 'rgba(35, 45, 35, .5)',
			marker: {
				enabled: true
			},
			zIndex: 1
		}]
	};

	const chart = Highcharts.chart('chart-container-1', o);

	const o2 = {
        chart: {
			height: 470,
			marginTop: 83,
			marginLeft: 30,
			marginBottom: 25,
			marginRight: 10,
			// width: 140,
			inverted: true,
            backgroundColor: 'transparent',
			plotBackgroundColor: 'var(--white-warmer)',
			style: {
				fontcolor: 'rgb(48, 79, 11)'
			},
			events: {
				load: function() {
				}
			}
        },
		title: {
			useHTML: true,
			floating: true,
			text: '<span class="text-xs fw-bold text-slate-500">SELECT A DATE</span>',
			widthAdjust: 0,
			y: 50,
			align: 'center'
		},
		tooltip: {
            useHTML: true,
			backgroundColor: 'rgba(255, 255, 255, .8)',
            formatter: function () {
                return `<div style="backdrop-filter:blur(5px);">
					<span class="text-center text-sm text-slate-800 d-block">${dayjs(this.point.x).format('MMM YYYY')}</span>
					<span class="text-slate-500 text-sm fw-bold">Click to set!</span>
				</div>`;
            }
		},
		xAxis: {
			type: 'datetime',
			min: dayjs(treasury_data[0].date).add(-6, 'M').unix() * 1000,  
			max: dayjs(treasury_data[treasury_data.length - 1].date).add(6, 'M').unix() * 1000,
			lineWidth: 0,
			offset: -0,
			tickLength: 0,
			labels: {
				zIndex: -999999,
				distance: -40
			},
			tickPosition: 'inside',
			tickInterval: 12 * 3 * 30 * 24 * 3600 * 1000,
			plotLines: [{
				value: dayjs(treasury_data[play_index].date).unix() * 1000,
				color: 'rgba(255,0,0,.5)',
				width: 8,
				id: 'plot-line',
				zIndex: 3,
			}],
			title: {
				text: null
			}
		},
        plotOptions: {
			series: {
				label: {
					enabled: false
				},
				zoneAxis: 'x',
				zones: [
				{
					value: 
						.5 * Math.max(...treasury_data.filter(x => x.type === 'history').map(x => dayjs(x.date).unix())) * 1000 +
						.5 * Math.min(...treasury_data.filter(x => x.type === 'forecast').map(x => dayjs(x.date).unix())) * 1000,
					color: '#f59e0b'
				}, {
					color: '#33A12B'
				}],		
				dataGrouping: {
					enabled: true,
					units: [['month',[1]]]
				},
				cursor: 'pointer',
				point: {
					events: {
						click: function () {
							'treasury-curve',
							setData('treasury-curve', {
								...getData('treasury-curve'),
								...{play_state: 'pause', play_index: this.date_index}
							});
							updateChart();
							updateChart2();
							updateButtons();
						}
					}
				}
			}
        },
		rangeSelector: {
			enabled: false
		},
		yAxis: {
			title: {
				text: null
			},
			max: 1,
			min: 0,
			labels: {
				enabled: false
			},
			gridLineColor: 'transparent'
		},
		exporting: {
			enabled: false
		},
		legend: {
			enabled: false
		},
        series: [{
            data: treasury_data.map(x => ({x: dayjs(x.date).unix() * 1000, low: -.1, high: 2, y: 0, date_index: x.date_index, type: x.type})),
			type: 'arearange',
			color: 'transparent',
			fillColor: 'transparent',
			lineWidth: 5,
			marker: {
				enabled: false
			}
        }]
	};

	const chart2 = Highcharts.chart('chart-container-2', o2);

	return;
}



const drawTable = function(treasury_data, forecast_vdate, hist_vdate) {

	// Hashmap converting number into types
	const ttms = Object.fromEntries(
		[...new Set(treasury_data.map(x => (x.data.map(y => y[0]))).flat(1))].sort((a, b) => a > b ? 1 : -1)
		.filter(x => x !== 24 && x != 2)
		.map(x => ([String(x), (x >= 12 ? x/12 + 'y' : x + 'm')]))
	);

	// Cast into objects with where the data is nice
	const all_series = ['history', 'forecast'].map(function(type) {
		const series_data = treasury_data.filter(obs => obs.type === type);
		const table_data = series_data.map(function(month_data) {
			let month_dict = {}
			month_dict['date'] = month_data.date.substring(0,7);
			month_data.data.forEach(obs => {
				if (Object.keys(ttms).includes(String(obs[0])) === false) return;
				month_dict[ttms[String(obs[0])]] = obs[1]
			})
			return month_dict;
		});
		return {
			type: type, 
			vdate: (type === 'forecast' ? forecast_vdate: hist_vdate), 
			data: table_data
		}
	});
	
	const table_data = all_series.forEach(function(series, i) {

		const dt_cols = [
			{title: 'Date', data: 'date'},
		]
		.concat(Object.values(ttms).map(z => ({title: z, data: z})))
		.map(function(x, i) {
			return {...x, ...{
				orderable: true,
				ordering: true,
				type: (x.title === 'Date' ? 'date' : 'num'),
				className: 'dt-center'
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
			data: series.data,
			columns: dt_cols,
			iDisplayLength: 20,
			dom:
				`<"row justify-content-end"<"col-auto"B>>
				<"row justify-content-center"<"col-12"tr>>
				<"row justify-content-end"<"col-auto"p>>`,
			buttons: [
				{extend: 'copyHtml5', text: copy_svg + 'Copy', exportOptions: {}, className: 'btn btn-sm'},
				{extend: 'csvHtml5', text: download_svg + 'Download', exportOptions: {}, className: 'btn btn-sm'}
			],
			order: (series.type === 'history' ? [[0, 'desc']] : [[0, 'asc']]),
			paging: true,
			pagingType: 'numbers',
			responsive: true,
			createdRow: function(row, data, dataIndex) {
			}
		}
		
		// Create button for this forecast
		const li = document.createElement('li');
		li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
		li.innerHTML =
			'<span class="d-flex align-items-center fw-medium">' +
				(series.type === 'forecast' ? '<img class="mx-1" width="14" height="14" src="/static/brand/icon-clear-bg-static-for-png.svg">Market Consensus Forecast' : 'Historical data') +
			'</span>' + 
			'<span class="text-xs" style="color: rgb(180, 180, 180)" >' +
				('Updated ' + dayjs(series.vdate).format('MM/DD/YYYY')) +
			 '</span>';
		if (series.type === 'forecast') li.classList.add('active');
		document.querySelector('#li-container').appendChild(li);
		
		// Create table and style it
		const table_el = document.createElement('table');
		table_el.classList.add('table', 'data-table', 'w-100');
		document.querySelector('#dt-container').appendChild(table_el);
		
		// Draw the table
		const dt_table = $(table_el).DataTable(o);
		$(table_el).parents('div.dataTables_wrapper').addClass('transition duration-400');
		if (i !== 0) $(table_el).parents('div.dataTables_wrapper').addClass('position-absolute'); // Make all els after first el absolute-positioned
		if (series.type !== 'forecast') {
			$(table_el).parents('div.dataTables_wrapper').css('opacity', 0).css('z-index', 1);	
		} else {
			$(table_el).parents('div.dataTables_wrapper').css('opacity', 1).css('z-index', 2);
		}

		// Move the download buttons
		const download_div = table_el.closest('.dataTables_wrapper').querySelector('.dt-buttons');
		download_div.classList.add('float-end');
		if (series.type !== 'forecast') download_div.style.display = 'none';
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

}

/*** Update Chart ***/
function updateChart() {
	let ud = getData('treasury-curve');
	const chart = $('#chart-container-1').highcharts();
	/* Return if play_state = paused; this is necessary to shut off the auto-repeating nature of this function */
	if (ud.treasury_data === undefined || ud.play_index === undefined) return;
	const timeStart = new Date().getTime();
  
	/* Get the new active date */
    const newData = ud.treasury_data[ud.play_index].data;

	/* Update data */
	//console.log('Updating data...', newData);
	/* Update chart data and colors */
	chart.series[0].setData(newData, redraw = true, animation = {duration: 250}, updatePoints = true);
	chart.series[0].userOptions.data = newData; // <-- make exporter aware *added 7/3/25
	chart.series[0].update({
		color: (ud.treasury_data[ud.play_index].type === 'forecast' ? '#298D25' : '#d97706'),
		fillColor: (ud.treasury_data[ud.play_index].type === 'forecast' ? 'rgba(83, 163, 78, .4)' : 'rgba(228,159,80, .4)')
	})
	
	/* Update colors*/
	if (ud.treasury_data[ud.play_index].type === 'history') {
		document.querySelector('#date-text-forecast').style.fill = '#d97706';
		document.querySelector('#date-text-forecast').innerHTML = `⎯ Historical curve for <tspan style="font-weight: bold;">${dayjs(ud.treasury_data[ud.play_index].date).format('MMM YYYY')}</tspan>`
	} else {
		document.querySelector('#date-text-forecast').style.fill = '#298D25';
		document.querySelector('#date-text-forecast').innerHTML = `⎯ Forecasted curve for <tspan style="font-weight:bold">${dayjs(ud.treasury_data[ud.play_index].date).format('MMM YYYY')}</tspan> (updated ${dayjs(ud.forecast_vdate).format('MM/DD')})`
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
	setData('treasury-curve', {...ud, ...{}});
	
	updateButtons();
	updateChart2();
	
	const timeEnd = new Date().getTime();
	const timeWait = 200 /*timeEnd - timeStart < 5000 ? 5000 - (timeEnd - timeStart) : 5000*/;
  
	if (ud.play_state !== 'pause') setTimeout(function() {updateChart();}, timeWait);
	return;
}


function updateChart2() {
	const ud = getData('treasury-curve');
	const chart = $('#chart-container-2').highcharts();
    chart.xAxis[0].removePlotLine('plot-line');
    chart.xAxis[0].addPlotLine({
        value: dayjs(ud.treasury_data[ud.play_index].date).unix() * 1000,
        color: 'rgba(255,0,0,.5)',
        width: 5,
        id: 'plot-line',
        zIndex: 3,
    });
}

function updateButtons() {
	const ud = getData('treasury-curve');

	const buttons = document.querySelectorAll('#treasury-curve-subtitle-group .treasury-curve-action-button');

	// Function to disable buttons by dir
	const disableButtons = function(dir) {
		buttons.forEach(button => {if (button.dataset.dir === dir) button.disabled = true});
	}

	// Function to add active class by dir
	const addActiveClass = function(dir) {
		buttons.forEach(button => {if (button.dataset.dir === dir) button.classList.add('active')});
	}

	// Remove the 'active' class and enable all buttons
	buttons.forEach(button => {
		button.classList.remove('active');
		button.disabled = false;
	});

	// Disable start and back buttons if play_index is 0
	if (ud.play_index === 0) disableButtons('start');
	// Disable end and forward buttons if play_index is the last index
	else if (ud.play_index === ud.treasury_data.length - 1) disableButtons('end');

	// Add 'active' class to the appropriate button based on play_state
	switch (ud.play_state) {
		case 'pause':
		case 'back':
		case 'forward':
			addActiveClass(ud.play_state);
			break;
		default:
			addActiveClass('forward');
	}
	// /* Update buttons */
	// const buttons = $('#chart-subtitle-group').find('button.chart-subtitle').removeClass('active').prop('disabled', false).end();
	// //console.log('updateButtons', ud.play_state, ud.play_index, ud.treasury_data.length - 1, buttons);

	// if (ud.play_index === 0) buttons.find('[data-dir="start"],[data-dir="back"]').prop('disabled', true);
	// else if (ud.play_index === ud.treasury_data.length - 1) buttons.find('[data-dir="end"],[data-dir="forward"]').prop('disabled', true);

	// if (ud.play_state === 'pause') buttons.find('[data-dir="pause"]').addClass('active', true);
	// else if (ud.play_state === 'back') buttons.find('[data-dir="back"]').addClass('active', true);
	// else if (ud.play_state === 'forward') buttons.find('[data-dir="forward"]').addClass('active', true);
	// else buttons.find('[data-dir="forward"]').addClass('active', true);
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
		.sort((a, b) => (dayjs(a.date) > dayjs(b.date) ? 1 : -1))
		.map((x, i) => (
			{
				name: dayjs(x.date).format('MMM YYYY') + ' ' + (x.type === 'history' ? '*' : ''),
				data: x.data,
				type: 'spline',
				color: gradient.valToColor(i, grMap, 'hex'),
				dashStyle: (x.type === 'history' ? 'solid' : 'shortdot'),
				visible: i === 0 || (i % 12 === 1 && dayjs(x.date).diff(dayjs(), 'month') <= 36),
				legendIndex: i
				//(x.type === 'history' || dayjs(x.date).month() === dayjs(treasury_data.filter(x => x.type === 'history').slice(-1)[0].date).month() + 1)
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
