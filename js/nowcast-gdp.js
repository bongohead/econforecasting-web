init();

document.addEventListener('DOMContentLoaded', function() {
	
	/********** INITIALIZE **********/
	{
		const ud_prev = getAllData()['nowcast-gdp'] || {};
		const ud = {... ud_prev, ... {
			debug: true
		}};
		setData('nowcast-gdp', ud);
	}

	/********** GET DATA **********/
	const ud = getData('nowcast-gdp') || {};

	const get_gdp_values = getApi(`get_nowcast_model_gdp_values`, 10, ud.debug);
	const get_releases = getApi(`get_nowcast_model_releases`, 10, ud.debug);
	const start = performance.now();

	Promise.all([get_gdp_values, get_releases]).then(function(response) {

		if (ud.debug) console.log('Fetch get_hist_obs', performance.now() - start, response);

		const gdp_values =
			response[0].map(x => ({
				bdate: x.vdate,
				date: x.date,
				pretty_date: x.pretty_date,
				value: parseFloat(x.value),
				varname: x.varname,
				fullname: x.fullname
			}));
		
		const releases =
			response[1].map(x => ({
				id: x.id,
				fullname: x.fullname,
				url: x.url,
				input_varnames: (x.input_varnames),
				release_dates: (x.release_dates)
			}));

		if (ud.debug) console.log('gdp_values', gdp_values, 'releases', releases);

		// Get last backtest date in the dataset
		const last_bdate = dayjs.max([... new Set(gdp_values.map(x => x.bdate))].map(x => dayjs(x))).format('YYYY-MM-DD');
		if (ud.debug) console.log('last_bdate', last_bdate);

		// Get first obs of last date to use as default display quarter
		const default_disp_quarter = dayjs_to_quarter(dayjs.min([...new Set(gdp_values.filter(x => x.bdate === last_bdate).map(x => dayjs(x.date)))]))

		if (ud.debug) console.log('default_disp_quarter', default_disp_quarter);

		// Get list of all display quarters to include
		const display_quarters = 
			[...new Set(gdp_values.map(x => x.date))]
			// Get 2 quarters ago max
			.filter(x => dayjs(x) > quarter_to_dayjs(default_disp_quarter).add(-6, 'month'))
			.map(d => dayjs_to_quarter(dayjs(d)));

		// Order values for table
		const gdp_varnames = [
			'gdp',
			'pce',
			'pceg','pcegd','pcegdmotor','pcegdfurnish','pcegdrec','pcegdother','pcegn','pcegnfood','pcegnclothing','pcegngas','pcegnother',
			'pces','pceshousing','pceshealth','pcestransport','pcesrec','pcesfood','pcesfinal','pcesother','pcesnonprofit',
			'pdi','pdin','pdinstruct','pdinequip','pdinip','pdir','pceschange',
			'nx','ex','exg','exs','im','img','ims',
			'govt','govtf','govts'
			];
			
		const gdp_values_grouped =
			// Nest into array of objects containing each varname
			[... new Set(gdp_values.map(x => x.varname))]
			.map(function(varname) {
				const z = gdp_values.filter(x => x.varname == varname);
				return {
					varname: z[0].varname,
					fullname: z[0].fullname,
					data: z.map(x => ({date: x.date, pretty_date: x.pretty_date, bdate: x.bdate, value: x.value})).sort((a, b) => a[0] - b[0]),
					tabs: (z[0].varname === 'gdp' ? 0 : z[0].fullname.split(':').length)
				}
			})
			// Sort to follow order of const order
			.sort((a, b) => (gdp_varnames.indexOf(a.varname) > gdp_varnames.indexOf(b.varname) ? 1 : -1))
			.map((x, i) => ({...x, order: i}));
			
		// console.log('gdp_values_grouped', gdp_values_grouped);
		
		const res = {gdp_values_grouped: gdp_values_grouped, releases: releases, display_quarter: default_disp_quarter, display_quarters: display_quarters};
		setData('nowcast-model-gdp', {...getData('nowcast-model-gdp'), ...res});
		return(res);
	})
	/********** DRAW CHART & TABLE **********/
	.then(function(res) {
		drawChart(res.gdp_values_grouped, res.releases, res.display_quarter, res.display_quarters);
		drawTable(res.gdp_values_grouped, res.display_quarters);
		$('div.overlay').hide();
	});
	
	
	/********** EVENT LISTENERS FOR DATE SWITCH **********/
	$('#chart-container').on('click', '#chart-subtitle-group > button.chart-subtitle', function() {
		const new_display_quarter = this.innerHTML;
		drawChart(getData('nowcast-model-gdp').gdp_values_grouped, getData('nowcast-model-gdp').releases, new_display_quarter, getData('nowcast-model-gdp').display_quarters);		
		return;
    });
	
	/********** EVENT LISTENERS FOR DATA CALENDAR HOVER **********/
	$('#release-container').on('mouseenter', 'li.release-calendar-date', function() {
		//console.log(this.id.replace('li-', ''));
		const chart = $('#chart-container').highcharts();
		chart.xAxis[0].addPlotLine({
			value: parseInt(dayjs(this.id.replace('li-', '')).unix() * 1000),
			color: 'blue',
			width: 3,
			id: 'release-calendar-indicator'
		  });
		//console.log('highcharts');
	});
	$('#release-container').on('mouseleave', 'li.release-calendar-date', function() {
		const chart = $('#chart-container').highcharts();
		chart.xAxis[0].removePlotLine('release-calendar-indicator');
	});

});


const dayjs_to_quarter = function(d) {
	return d.year().toString() + 'Q' + Math.floor((d.month() + 2)/3)
}

const quarter_to_dayjs = function(d) {
	const [year, q] = d.split('Q');
	const month = (q - 1) * 3 + 1;
	const monthStr = month.toString().padStart(2, '0');
	return dayjs(`${year}-${monthStr}-01`);
}

const get_dates = function(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const date = new Date(startDate.getTime());
    const dates = [];

    while (date <= endDate) {
        dates.push(date.toISOString().split('T')[0]);
        date.setDate(date.getDate() + 1);
    }

    return dates;
}


/*** Draw chart ***/
function drawChart(gdp_values_grouped, releases, display_quarter, display_quarters) {
	
	console.log('gdp_values_grouped', gdp_values_grouped);
	
	// Create series - each corresponding to a different economic variable
	const chart_data =
		gdp_values_grouped
		.filter(x => ['gdp', 'pce', 'pdi', 'ex', 'im', 'govt'].includes(x.varname))
		.map((x, i) => (
			{
				id: x.varname,
				name: x.fullname,
				// Create bdate, value pairs
				data: x.data.filter(y => y.pretty_date == display_quarter).map(y => [parseInt(dayjs(y.bdate).unix() * 1000), y.value]).sort((a, b) => a[0] - b[0]),
				type: (x.varname === 'gdp' ? 'area' : 'line'),
				//dashStyle: (x.fcname === 'hist' ? 'solid' : 'solid'),
				lineWidth: (x.varname === 'gdp' ? 4 : 2),
				opacity: 1,
				zIndex: 2,
				color: getColorArray()[i],
				visible: (x.varname === 'gdp' ? true : false),
				index: x.order // Force legend to order items correctly
			}
		));
		
	console.log('chart_data', chart_data);
	
	// Calculate end date (take the first vintage of the GDP release occuring after the quarter end date)
	const quarter_end_date = quarter_to_dayjs(display_quarter).add(3, 'month');
	//console.log('quarter_end_date', quarter_end_date);
	const chart_end_date_0 = releases.filter(x => x.id == 'BEA.GDP')[0].release_dates.filter(x => dayjs(x) > quarter_end_date)[0];
	// Modified 7-6-21 to automatically guess the date if doesn't exist
	const chart_end_date = (typeof(chart_end_date_0) !== 'undefined' ? chart_end_date_0 : quarter_end_date);
	//console.log('chart_end_date', chart_end_date);
		
	console.log('releases', releases.filter(x => x.release_dates));
	// Get flattened array of date x releaseid objects
	const release_series_data =
		releases
		.filter(x => x.release_dates)
		.map(x => ({...x, release_dates: x.release_dates.filter(y => dayjs(y) > dayjs(chart_data[0].data[0][0]) && dayjs(y) <= dayjs(chart_end_date))}))
		.filter(x => x.release_dates.length > 0)
		.map(function(x, i) {
			return x.release_dates.map(function(date) {
				return {
					color: getColorArray()[i], // Color value
					value: date, //parseInt(moment(date).format('x')),
					url: x.url,
					width: 1,
					label: {
						text: x.fullname
					}
				};
			})
		}).flat();
	console.log('release_series_data', release_series_data);
	
	// Now get this data as a date => release id obj
	const release_data =
		get_dates(dayjs.unix(chart_data[0].data[0][0]/1000).format('YYYY-MM-DD'), chart_end_date)
		.map(date => release_series_data.filter(x => x.value === date))
		.filter(x => x.length > 0)
		.sort(x => x.width == 1)
		
	const line_names = [
		'Selected Real Retail Sales Series',
		'Gross Domestic Product',
		'Employment Situation',
		'G.17 Industrial Production and Capacity Utilization', 
		'Personal Income and Outlays',
		'New Residential Sales'
		]
	
	const plot_lines_chart =
		release_data.filter(function(x) {
			return line_names.some(release => x.map(y => y.label.text).includes(release));		
		}).map(x => ({
			color: 'orange',
			dashStyle: 'Solid',
			test: x[0].value,
			value: parseInt(dayjs(x[0].value).unix() * 1000), 
			width: 1,
			zIndex: 0
		}));
		
	// console.log('plot_lines_chart', plot_lines_chart);
		
	const releaseEl =
		'<ul class="list-group">' +
		release_data.map(function(x) {
			return '<li href="#" id="li-' + x[0].value + '" class="list-group-item list-group-item-action release-calendar-date">' +
				'<div class="d-flex justify-content-between align-items-center">' +
					dayjs(x[0].value).format('MMMM Do') +
					'<span class="badge bg-cmefi-green">' + x.length + '</span>' +
				'</div>' +
				'<ul class="ps-2" style="font-size:.8rem">' +
					x.map(y => '<li><a ' + (line_names.includes(y.label.text) ? 'class="fw-bolder text-danger"' : '') +' target="_blank" href="'+(y.label != null ? y.url : '') + '">' + y.label.text + '</a></li>').join('\n') +
				'</ul>' +
			'</li>'
		}).join('\n') +
		'</ul>';

	$('#release-container').html(releaseEl);
	
	// Auto scroll to most recent date
	// https://stackoverflow.com/questions/635706/how-to-scroll-to-an-element-inside-a-div
	
	const next_release_date = release_data.map(x => x[0].value).filter(x => dayjs(x) >= dayjs())[0] || release_data[release_data.length - 1][0].value;
	var myElement = document.getElementById('li-' + next_release_date);
	var topPos = myElement.offsetTop;
	document.getElementById('release-container').scrollTop = topPos;

	// console.log('release_data', release_data);
	
	
	Highcharts.setOptions({
		lang: {
			rangeSelectorZoom: 'Display:'
		},
        credits: {
			enabled: true,
			text: 'econforecasting.com',
			href: 'https://econforecasting.com'
        },
		scrollbar: {
			enabled: false
		},
		tooltip: {
			style: {
				fontWeight: 'bold',
				fontSize: '0.85rem'
			}
		},
		rangeSelector: {
			buttonTheme: { // styles for the buttons
				fill: 'var(--bs-cmefi-blue)',
				style: {
					color: 'white'
				},
				states: {
					hover: {
						fill: 'var(--bs-cmefi-dark-blue)'
					},
					select: {
						fill: 'var(--bs-cmefi-light-blue)',
						style: {
							color: 'white'
						}
					}
				}
			},
			inputBoxBorderColor: 'gray',
			inputStyle: {
				color: 'black'
			},
			labelStyle: {
				color: 'black',
			},
		}

	});
	
	//console.log('fcDataParsed', fcDataParsed);
	/*
	const grMap = gradient.create(
	  [0, 1, 24, 48, 72], //array of color stops
	  ['#17202a', '#2874a6', '#148f77', '#d4ac0d', '#cb4335'], //array of colors corresponding to color stops
	  'hex' //format of colors in previous parameter - 'hex', 'htmlcolor', 'rgb', or 'rgba'
	);
	*/
	
	//console.log('chartData', chartData);
	
	const o = {
        chart: {
			spacingTop: 20,
            backgroundColor: 'rgba(255, 255, 255, 0)',
			plotBackgroundColor: '#FFFFFF',
			height: 450,
			plotBorderColor: 'black',
			plotBorderWidth: 2
        },
        title: {
			useHTML: true,
			text: '<img class="me-2" width="20" height="20" src="/static/cmefi-short.svg"><div style="vertical-align:middle;display:inline"><span>Nowcasted ' + display_quarter + ' GDP Over Time</h5></span>',
			style: {
				fontSize: '1.3rem',
				color: 'var(--bs-cmefi-dark)'
			}
        },
		subtitle: {
			useHTML: true,
			text: 
				'<div class="col-12 btn-group d-inline-block" role="group" id="chart-subtitle-group">' +
					'<button class="btn btn-secondary btn" style="" type="button" disabled="">Select Forecasted Quarter:&nbsp;</button>' + 
					display_quarters
					.map(x => 
					'<button class="btn btn-primary chart-subtitle btn ' + (x === display_quarter ? 'active' : '') + '" style="" type="button">' + x + '</button>'
					).join('') +
				'</div>'
		},
        plotOptions: {
			series: {
				shadow: true,
				dataGrouping: {
					enabled: true,
					units: [['day', [1]]],
					forced: true
				},
				marker : {
					enabled: false,
					radius: 3,
					symbol: 'triangle'
				}
			}
        },
		rangeSelector: {
			enabled: false
		},
		xAxis: {
			type: 'datetime',
            dateTimeLabelFormats: {
                day: "%m/%d",
                week: "%m/%d"
            },
			title: {
				text: 'Date of Forecast'
			},
			labels: {
				style: {
					color: 'black'
				}
			},
			max: parseInt(dayjs(chart_end_date).add(5, 'day').unix() * 1000),
			ordinal: false,
			plotLines: [{
				color: 'red', // Color value
				dashStyle: 'ShortDash', // Style of the plot line. Default to solid
				//value: parseInt(moment(chart_end_date).format('x')), // Value of where the line will appear
				value: parseInt(dayjs(chart_end_date).unix() * 1000), // Value of where the line will appear
				width: 2,
				label: {
					text: 'Official GDP Data Release',
					style: {
						color: 'red',
						fontWeight: 'bold'
					}
				}

			}].concat(plot_lines_chart)
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
				text: 'Forecasted Annualized % Change',
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
			backgroundColor: 'var(--bs-efpale)',
			borderColor: 'var(--bs-cmefi-dark)',
			borderWidth: 1,
			align: 'center',
			verticalAlign: 'bottom',
			layout: 'horizontal',
			title: {
				text: 'Nowcasted Variables <span style="font-size: .8rem; color: #666; font-weight: normal; font-style: italic">(click to hide/show)</span>',
			}
		},
        tooltip: {
            useHTML: true,
			shared: true,
			formatter: function () {
				//console.log(this.points);
				//console.log(this, moment(this.x).format('YYYY MM DD'));
				const points = this.points;
				const x = this.x;
				const ud = getData('userData');
				const text =
					'<table>' +
					'<tr style="border-bottom:1px solid black"><td style="font-weight:600; text-align:center">' + dayjs(x).format('MMM Do YY') + '</td></tr>'  +
					points.map(function(point) {
						//const freq = ud.ncValuesGrouped.filter(x => x.varname === point.series.options.id)[0].freq;
						return '<tr><td style="color:' + point.color + '">Nowcast for ' + display_quarter + ' ' + point.series.name + ': ' + point.y.toFixed(2) + '%</td></tr>'; // Remove everything in aprantheses
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




function drawTable(gdp_values_grouped) {
	
	//console.log('gdp_values_grouped', gdp_values_grouped);
	
	// Get last bdate - only show last vintage date data
	const bdate = gdp_values_grouped.map(x => x.data.map(y => y.bdate)).flat().sort().slice(-1)[0];
	
	// Get display quarters for table 
	// Get all dates available for bdate
	const tbl_display_quarters = [... new Set(gdp_values_grouped.map(x => x.data.filter(y => y.bdate == bdate)).flat().map(x => x.pretty_date))];
	
	$('#vdate').text(dayjs(bdate).format('MMM Do') + ' ');
	
	const dtCols = 
		[{title: 'Order', data: 'order'}, {title: 'Tabs', data: 'tabs'}, {title: 'NOWCAST', data: 'fancyname'}]
		.concat(tbl_display_quarters.map((x, i) => ({title: x, data: x})))
		.map(function(x, i) {
			return {...x, ...{
				visible: (!['Order', 'Tabs'].includes(x.title)),
				orderable: false,
				type: (x.title === 'NOWCAST' ? 'string' : 'num'),
				className: (x.title === 'NOWCAST' ? 'dt-left' : 'dt-center'),
				css: 'font-size: .9rem',
				createdCell: function(td, cellData, rowData, row, col) {
					(x.title === 'NOWCAST' ? $(td).css('padding-left', String(rowData.tabs * .8 + .5) + 'rem' ) : false)
				}
			}
			}
		});
		
	const tableData =
		gdp_values_grouped.map(function(x) {
			return {
				order: x.order,
				tabs: x.tabs,
				fancyname: x.fullname.split(':').pop(),
				...Object.fromEntries(x.data.filter(y => y.bdate == bdate).map(z => [z.pretty_date, z.value.toFixed(1)]))
				};
		});
	
	//console.log('tableData', tableData);
		
	const copySvg =
	`<svg xmlns="https://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-clipboard me-1" viewBox="0 0 16 16">
		<path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
		<path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
	</svg>`;
	const dlSvg = 
	`<svg xmlns="https://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-download me-1" viewBox="0 0 16 16">
	  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path>
	  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"></path>
	</svg>`;
	const o = {
		data: tableData,
		columns: dtCols,
		iDisplayLength: 15,
		dom:
			"<'row justify-content-end'<'col-auto'B>>" +
			"<'row justify-content-center'<'col-12'tr>>" +
			"<'row justify-content-end'<'col-auto'p>>",
		buttons: [
			{extend: 'copyHtml5', text: copySvg + 'Copy', exportOptions: {columns: dtCols.map((x, i) => ({...x, index: i})).filter(x => x.visible).map(x => x.index)}, className: 'btn btn-sm btn-light'},
			{extend: 'csvHtml5', text: dlSvg + 'Download', exportOptions: {columns: dtCols.map((x, i) => ({...x, index: i})).filter(x => x.visible).map(x => x.index)}, className: 'btn btn-sm btn-light'}
		],
		paging: false,
		pagingType: 'numbers',
		language: {
			search: "Filter By Date:",
			searchPlaceholder: "YYYY-MM"
		},
		ordering: [[0, 'asc']],
		responsive: true,
		/*
		columnDefs: [{
			targets: '_all',
			createdCell: function(td, cellData, rowData, row, col) {
				$(td).addClass('ps-1' + rowData.tabs);
			}
		}]*/
	}
	
	 $('#gdp-table').DataTable(o);
		
	return;
}



