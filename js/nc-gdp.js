document.addEventListener("DOMContentLoaded", function(event) {
	/********** INITIALIZE **********/
	$('div.overlay').show();
	
	/*** Set Default Data ***/
	/* Use previous options if set, otherwise use default options stated above.
	 */ 
	(function() {
		
		const varname = window.location.pathname.split('-').pop();
		const varFullname =
			varname === 'ffr' ? 'Effective Federal Funds Rate' 
			: varname === 'sofr' ? 'Secured Overnight Financing Rate'
			: varname === 'mort30y' ? '30-Year Fixed-Rate Mortgage Rate'
			: varname === 'mort15y' ? '15-Year Fixed-Rate Mortgage Rate'
			: varname === 'inf' ? 'CPI Inflation Rate'
			: 'NA';
			
		const varUnits = 
			varname === 'ffr' ? '%' 
			: varname === 'sofr' ? '%'
			: varname === 'mort30y' ? '%'
			: varname === 'mort15y' ? '%'
			: varname === 'inf' ? '%'
			: 'NA';

		const udPrev = getAllData().userData || {};
		const ud = {
			... udPrev,
			... {
					varname: varname,
					freq: 'm',
					varFullname: varFullname,
					varUnits: varUnits
				}
		}

		setData('userData', ud);
		
		document.title = varFullname + ' Forecast | Center for Macroeconomic Forecasting & Insights';
		document.querySelector('meta[name="description"]').setAttribute('content',
			varname === 'ffr' ? 'Monthly consensus forecasts for the federal funds rate (FFR) derived using a futures model.'
			: varname === 'sofr' ? 'Monthly consensus forecasts for the secured overnight financing rate (SOFR) derived using a futures model.'
			: varname === 'mort30y' ? 'Monthly forecasts for the 30-year fixed rate mortgage rate.'
			: varname === 'mort15y' ? 'Monthly forecasts for the 15-year fixed rate mortgage rate.'
			: varname === 'mort15y' ? 'Monthly forecasts for the CPI inflation rate.'
			: ''
		);


	})();



	/********** GET DATA **********/
	/* Do not transfer data directly between functions - instead have everything work with sessionStorage.
	 * Put the functions in a bigger $.Deferred function when more cleaning is needed before finalization;
	 */
	const ud = getData('userData');
	const getNcValuesDfd = getFetch('getNcValuesByGroup', toScript = ['ncValues'], fromAjax = {dispgroup: 'GDP', freq: 'q'});
	
	Promise.all([getNcValuesDfd]).then(function(response) {
		
		const ncValues =
			response[0].ncValues.map(function(x) {
				return {...x,
					date: (x.date),
					vdate: (x.vdate),
					value: parseFloat(x.value),
					formatdate: String(moment(x.date).year()) + 'Q' + String(Math.ceil((moment(x.date).month() + 1)/3))
				};
			});
			
		console.log(ncValues);
		// Order values for table
		const order = [
			'gdp',
			'pce',
			'pceg','pcegd','pcegdmotor','pcegdfurnish','pcegdrec','pcegdother','pcegn','pcegnfood','pcegnclothing','pcegngas','pcegnother',
			'pces','pceshousing','pceshealth','pcestransport','pcesrec','pcesfood','pcesfinal','pcesother','pcesnonprofit',
			'pdi','pdin','pdinstruct','pdinequip','pdinip','pdir','pceschange',
			'nx','ex','exg','exs','im','img','ims',
			'govt','govtf','govts'
			];
		//console.log('fcDataRaw', fcDataRaw);
		
		const ncValuesGrouped =		
			// Nest into array of objects containing each varname
			[... new Set(ncValues.map(x => x.varname))]
			.map(function(varname) {
				const z = ncValues.filter(x => x.varname == varname)[0];
				return {
					varname: z.varname,
					fullname: z.fullname,
					units: z.units,
					vdate: z.vdate,
					units: z.units,
					d1: z.d1,
					d2: z.d2,
					// Let data contain all vintages
					data: ncValues.filter(x => x.varname == varname).map(x => ({date: x.date, formatdate: x.formatdate, vdate: x.vdate, value: x.value})).sort((a, b) => a[0] - b[0]),
					tabs: (z.varname === 'gdp' ? 0 : z.fullname.split(':').length)
				}
			})
			// Sort to follow order of const order
			.sort((a, b) => (order.indexOf(a) > order.indexOf(b) ? -1 : 1))
			.map((x, i) => ({...x, order: i}));
			// Now modify data object ine ach so that it is of the form [{vdate: ., []}, {}, {}...]
			
			
		console.log(ncValuesGrouped);
		
		setData('userData', {...getData('userData'), ...{ncValuesGrouped: ncValuesGrouped}});
		
		return(ncValuesGrouped);
	
	})
	/********** DRAW CHART & TABLE **********/
	.then(function(ncValuesGrouped) {
		drawChart(ncValuesGrouped, displayQuarter = '2021Q1');
		drawTable(ncValuesGrouped);
		$('div.overlay').hide();
	});

});


/*** Draw chart ***/
function drawChart(ncValuesGrouped, displayQuarter) {
	
	// Create series - each corresponding to a different economic variable
	const chartData =
		ncValuesGrouped
		.filter(x => x.varname == 'gdp')
		.map((x, i) => (
			{
				id: x.varname,
				name: x.fullname,
				data: x.data.filter(y => y.formatDate == displayQuarter).map(y => [parseInt(moment(x.vdate).format('x')), x.value]),
				type: 'line',
				//dashStyle: (x.fcname === 'hist' ? 'solid' : 'solid'),
				lineWidth: (x.varname == 'gdp' ? 4 : 2),
				opacity: 2,
				visible: true,
				index: x.order // Force legend to order items correctly
			}
		));
		
	console.log('chartData', chartData);

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
				fill: 'var(--bs-econblue)',
				style: {
					color: 'white'
				},
				states: {
					hover: {
						fill: 'var(--bs-econdblue)'
					},
					select: {
						fill: 'var(--bs-econlblue)',
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
			style: {
				fontFamily: '"Assistant", "sans-serif"',
				fontColor: 'var(--bs-econgreen)'
			},
			height: 450,
			plotBorderColor: 'black',
			plotBorderWidth: 2
        },
        title: {
			useHTML: true,
			text: '<img class="me-2" width="20" height="20" src="/static/cmefi_short.png"><div style="vertical-align:middle;display:inline"><span>GDP Nowcasts for ' + displayQuarter + '</h5></span>',
			style: {
				fontSize: '1.5rem',
				color: 'var(--bs-econblue)'
			}
        },
		caption: {
			text: 'Shaded areas indicate recessions'
		},
        plotOptions: {
			series: {
				shadow: true,
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
					text: '1 Year',
					events: {
						click: function(e) {
							chart.xAxis[0].setExtremes(moment().add(-12, 'M').toDate().getTime(), moment().add(12, 'M').toDate().getTime());
							return false;
						}
					}
				}, {
					text: '2 Year',
					events: {
						click: function(e) {
							chart.xAxis[0].setExtremes(moment().add(-12, 'M').toDate().getTime(), moment().add(24, 'M').toDate().getTime());
							return false;
						}
					}
				}, {
					text: '5 Year',
					events: {
						click: function(e) {
							chart.xAxis[0].setExtremes(moment().add(-12, 'M').toDate().getTime(), moment().add(60, 'M').toDate().getTime());
							return false;
						}
					}
				}, {
					type: 'all',
					text: 'All Historical Data'
				}
			],
			buttonTheme: { // styles for the buttons
				width: '5rem'
			}
		},
		xAxis: {
			type: 'datetime',
            dateTimeLabelFormats: {
                day: "%m-%d-%Y",
                week: "%m-%d-%Y"
            },
			plotBands: [{color: '#ffd9b3', from: Date.UTC(2020, 2, 1), to: Date.UTC(2021, 2, 28)},
			{color: '#ffd9b3', from: Date.UTC(2007, 12, 1), to: Date.UTC(2009, 6, 30)},
			{color: '#ffd9b3', from: Date.UTC(2001, 3, 1), to: Date.UTC(2001, 11, 30)}],
			ordinal: false,
			min: moment().add(-12, 'M').toDate().getTime(),
			max: moment().add(60, 'M').toDate().getTime(),
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
				text: 'Annualized % Change',
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
			backgroundColor: 'var(--bs-econpale)',
			borderColor: 'var(--bs-econblue)',
			borderWidth: 1,
			align: 'center',
			verticalAlign: 'bottom',
			layout: 'horizontal',
			title: {
				text: 'Available Forecasts <span style="font-size: .8rem; color: #666; font-weight: normal; font-style: italic">(click to hide/show)</span>',
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
					'<tr style="border-bottom:1px solid black"><td>DATE</td><td style="font-weight:600">' +
						'FORECAST' +
					'</td></tr>' +
					points.map(function(point) {
						const freq = ud.fcDataParsed.filter(x => x.fcname === point.series.options.id)[0].freq;
						return '<tr><td style="padding-right:1rem; color:'+point.series.color+'">' + (freq === 'm' ? moment(x).format('MMM YYYY') : moment(x).format('YYYY[Q]Q')) +'</td><td style="color:' + point.color + '">' + point.series.name.replace(/ *\([^)]*\) */g, "") + ': ' + point.y.toFixed(2) + '%</td></tr>'; // Remove everything in aprantheses
					}).join('') +
					'</table>';
				
				return text;
			}
        },
        series: chartData
	};
	const chart = Highcharts.stockChart('chart-container', o);
	
	return;
}




function drawTable(ncValuesGrouped) {
	
	console.log('ncValuesGrouped', ncValuesGrouped);
	
	// Get last vdate - only show last vintage date data
	const vdate = ncValuesGrouped.map(x => x.data.map(y => y.vdate)).flat().sort().slice(-1);
	
	// Turn into list of series
	// Separate tab for each table
	// Get list of unique date values 
	const uniqueDates = [... new Set(ncValuesGrouped.map(x => x.data.map(y => y.formatdate)).flat())].sort()
		//.map((x, i) => ({date: x.substr(-1), formatdate = x}));
	const dtCols = 
		[{title: 'Order', data: 'order'}, {title: 'Tabs', data: 'tabs'}, {title: 'Nowcasted Date', data: 'fancyname'}]
		.concat(uniqueDates.map((x, i) => ({title: x, data: x})))
		.map(function(x, i) {
			return {...x, ...{
				visible: (!['Order', 'Tabs'].includes(x.title)),
				orderable: false,
				type: (x.title === 'Nowcasted Date' ? 'string' : 'num'),
				className: (x.title === 'Nowcasted Date' ? 'dt-right' : 'dt-center'),
				css: 'font-size: .9rem',
				createdCell: function(td, cellData, rowData, row, col) {
					(x.title === 'Nowcasted Date' ? $(td).css('padding-left', String(rowData.tabs * .8 + .5) + 'rem' ) : false)
				}
			}
			}
		});
	
	
	console.log(uniqueDates);
	const tableData =
		ncValuesGrouped.map(function(x) {
			return {
				order: x.order,
				tabs: x.tabs,
				fancyname: x.fullname,
				...Object.fromEntries(x.data.filter(y => y.vdate == vdate).map(z => [z.formatdate, z.value]))
				};
		});
	
	console.log('tableData', tableData);
		
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
		data: tableData,
		columns: dtCols,
		iDisplayLength: 15,
		dom:
			"<'row justify-content-end'<'col-auto'B>>" +
			"<'row justify-content-center'<'col-12'tr>>" +
			"<'row justify-content-end'<'col-auto'p>>",
		buttons: [
			{extend: 'copyHtml5', text: copySvg + 'Copy', exportOptions: {columns: [0, 2]}, className: 'btn btn-sm btn-econgreen'},
			{extend: 'csvHtml5', text: dlSvg + 'Download', exportOptions: {columns: [0, 2]}, className: 'btn btn-sm btn-econgreen'}
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
		

	/*
	const tableData =
		ncValuesGrouped
		.
		
		//console.log(x.fcname);
		const seriesData =
			(x.fcname === 'hist') ?
			x.data.map(y => ({date: (x.freq === 'q' ? moment(y[0]).format('YYYY[Q]Q') : moment(y[0]).format('YYYY-MM')), type: 'Historical Data', value: y[1].toFixed(4)})) :
			x.data.map(y => ({date: (x.freq === 'q' ? moment(y[0]).format('YYYY[Q]Q') : moment(y[0]).format('YYYY-MM')), type: 'Forecast', value: y[1].toFixed(4)}));
		const dtCols = [
			{title: 'Date', data: 'date'},
			{title: 'Type', data: 'type'},
			{title: varFullname + ' (' + varUnits + ')', data: 'value'}
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
				{extend: 'copyHtml5', text: copySvg + 'Copy', exportOptions: {columns: [0, 2]}, className: 'btn btn-sm btn-econgreen'},
				{extend: 'csvHtml5', text: dlSvg + 'Download', exportOptions: {columns: [0, 2]}, className: 'btn btn-sm btn-econgreen'}
			],
			order: (x.fcname === 'hist' ? [[0, 'desc']] : [[0, 'asc']]),
			paging: true,
			pagingType: 'numbers',
			language: {
				search: "Filter By Date:",
				searchPlaceholder: "YYYY-MM"
			},
			responsive: true,
			createdRow: function(row, data, dataIndex) {
				if (data.type === 'history')  {
					$(row).addClass('dog');
					$(row).css('color', 'var(--econgreen)');
				} else {
					$(row).css('color', 'var(--econred)');
				}
			}
		}
		
		// Create table and style it
		const table = document.createElement('table');
		table.classList.add('table');
		table.classList.add('data-table');
		table.classList.add('w-100');
		table.id = 'table-' + x.fcname;
		document.querySelector('#tables-container').appendChild(table);
		

		// Draw the table
		const dTable = $(table).DataTable(o);
		if (i !== 0) $(table).parents('div.dataTables_wrapper').first().hide();
		//console.log(dTable);

		// Move the download buttons
		//console.log(table.parentElement);
		const downloadDiv = table.closest('.dataTables_wrapper').querySelector('.dt-buttons');
		downloadDiv.classList.add('float-end');
		downloadDiv.id = 'download-' + x.fcname;
		if (i !== 0) downloadDiv.style.display = 'none'
		$('#tables-container .d-inline').after($(downloadDiv).detach());

	*/
	
	return;
}



