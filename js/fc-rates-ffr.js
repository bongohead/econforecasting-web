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
			: 'NA';
			
		const varUnits = 
			varname === 'ffr' ? '%' 
			: varname === 'sofr' ? '%'
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
			: ''
		);

		document.querySelector('#text-container').innerHTML =
			varname === 'ffr' ?
			`
			<div class="d-inline"><span style="vertical-align:middle;font-size:1.4rem; color: var(--bs-econgreen)">OVERVIEW</span></div>
			<hr class="mt-0 mb-3 bg-econgreen">
			<p>The federal funds rate is a measure of interbank lending rates for funds held at the Federal Reserve. However, it is more commonly known for being the primary interest rate targeted by the Federal Reserve.</p>
			<p>This model aims to provide monthly federal fund rate forecasts using data from federal funds futures. Since the model is directly built from market rates and uses no extraneous assumptions, these forecasts can be interpreted as a consensus forecast of future federal funds rates. These forecasts reflect market knowledge and insight regarding future monetary policy.</p>
			<img class="me-2" width="16" height="16" src="/static/cmefi_short.png"><div class="d-inline"><span style="vertical-align:middle;font-size:1.4rem; color: var(--bs-econgreen)">BASELINE FORECAST - METHODOLOGY</span></div>
			<hr class="mt-0 mb-3 bg-econgreen">
			<p>Forecasts are constructed directly using futures data from the CME Group. Monthly expirations for 30-day federal funds futures are converted into rolling future forecast values by subtracting the futures price from 100.</p>
			<p>Data and forecasts are updated on a daily basis.</p>
			<div class="d-inline"><span style="vertical-align:middle;font-size:1.4rem; color: var(--bs-econgreen)">ALTERNATE FORECASTS</span></div>
			<hr class="mt-0 mb-3 bg-econgreen">
			<p>Forecasts from the U.S. Congressional Budget Office (CBO) are included for comparison purposes.</p>
			`
			: varname === 'sofr' ?
			`
			<div class="d-inline"><span style="vertical-align:middle;font-size:1.4rem; color: var(--bs-econgreen)">OVERVIEW</span></div>
			<hr class="mt-0 mb-3 bg-econgreen">
			<p>The secured overnight financing rate (SOFR) is a broad measure of the cost of borrowing cash overnight collateralized by Treasury securities. The SOFR rate is an important benchmark rate used in the trading of derivatives and interest-rate swaps.</p>
			<p>This model aims to provide monthly SOFR forecasts using data from federal funds futures. Since the model is directly built from market rates and uses no extraneous assumptions, these forecasts can be interpreted as a consensus forecast of future federal funds rates. These forecasts reflect market knowledge and insight regarding the future path of the SOFR rate.</p>
			<img class="me-2" width="16" height="16" src="/static/cmefi_short.png"><div class="d-inline"><span style="vertical-align:middle;font-size:1.4rem; color: var(--bs-econgreen)">BASELINE FORECAST - METHODOLOGY</span></div>
			<hr class="mt-0 mb-3 bg-econgreen">
			<p>Forecasts are constructed directly using futures data from the CME Group. Monthly expirations for 30-day federal funds futures are converted into rolling future forecast values by subtracting the futures price from 100.</p>
			<p>Data and forecasts are updated on a daily basis.</p>
			`
			: '';
	})();



	/********** GET DATA **********/
	/* Do not transfer data directly between functions - instead have everything work with sessionStorage.
	 * Put the functions in a bigger $.Deferred function when more cleaning is needed before finalization;
	 */
	const ud = getData('userData');
	const getFcHistoryDfd = getFetch('getFcHistory', toScript = ['fcHistory'], fromAjax = {varname: ud.varname, freq: ud.freq});
	const getFcForecastDfd = getFetch('getFcForecastLastByVarname', toScript = ['fcForecast'], fromAjax = {varname: ud.varname, freq: null});
	
	Promise.all([getFcHistoryDfd, getFcForecastDfd]).then(function(response) {
		const fcDataRaw =
			response[0].fcHistory.map(function(x) {
				return {...x,
					cmefi: true,
					fcname: 'hist',
					freq: ud.freq,
					fullname: 'Historical Data',
					shortname: 'Historical Data'
				};
			}).concat(response[1].fcForecast)
			.map(function(x) {
				return {...x,
					value: parseFloat(x.value)
				};
			});
		//console.log('fcDataRaw', fcDataRaw);
		
		// Returns [{fcname: hist, data: [[],..]}, ...] MAX 5 years
		const fcDataParsed = 
			[... new Set(fcDataRaw.map(x => x.fcname))] // Get list of obs_dates
			.map(function(fc) { // Group each value of the original array under the correct obs_date
				
				const z = fcDataRaw.filter(x => x.fcname === fc)[0];
				return {
					fcname: fc,
					freq: z.freq,
					cmefi: z.cmefi,
					shortname: z.shortname,
					fullname: z.fullname,
					freq: z.freq,
					vintage_date: z.vintage_date || null,
					data: fcDataRaw.filter(x => x.fcname === fc).filter(x => moment(x.obs_date) <= moment().add(5, 'years')).map(x => [x.obs_date, x.value]).sort((a, b) => a[0] - b[0])
				}
			})
			//Sort so that CMEFI forecasts are first and historical data is last
			.sort((a, b) =>
				(a.cmefi === true && a.fcname !== 'hist' ? -1 : (b.cmefi === true && b.fcname !== 'hist' ? 1 : (a.fcname === 'hist' ? 1 : (b.fcname === 'hist' ? -1 : 0))))
			).map((x, i) => ({...x, order: i}));
			
		console.log('fcDataParsed', fcDataParsed);
		
		setData('userData', {...getData('userData'), ...{fcDataParsed: fcDataParsed}});
		
		return(fcDataParsed);
	})
	/********** DRAW CHART & TABLE **********/
	.then(function(fcDataParsed) {
		drawChart(fcDataParsed, getData('userData').varFullname, getData('userData').varUnits);
		drawTable(fcDataParsed, getData('userData').varFullname, getData('userData').varUnits);
		$('div.overlay').hide();
	});

});


/*** Draw chart ***/
function drawChart(fcDataParsed, varFullname, varUnits) {
	
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
	
	const chartData =
		fcDataParsed
		.map((x, i) => (
			{
				id: x.fcname,
				name: (x.fcname !== 'hist' ? x.shortname + ' Forecast (Updated ' + moment(x.vintage_date).format('MM/DD/YY') + ')': x.shortname),
				data: x.data.map(x => [new Date(x[0]).getTime(), x[1]]),
				type: 'spline',
				dashStyle: (x.fcname === 'hist' ? 'solid' : 'solid'),
				lineWidth: (x.fcname === 'hist' ? 4 : 2),
				color: (x.fcname === 'hist' ? 'black' : getColorArray()[i]),
				opacity: 2,
				visible: (x.cmefi === true),
				index: i // Force legend to order items correctly
				//(x.type === 'history' || moment(x.date).month() === moment(fcDataParsed.filter(x => x.type === 'history').slice(-1)[0].date).month() + 1)
			}
		));
	console.log('chartData', chartData);
	
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
			text: '<img class="me-2" width="20" height="20" src="/static/cmefi_short.png"><div style="vertical-align:middle;display:inline"><span>' + varFullname + '</h5></span>',
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
					units: [['day', [1]]],
					forced: true
				},
				marker : {
					enabled: true,
					radius: 2
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
				text: varUnits,
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
				console.log(this.points);
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




function drawTable(fcDataParsed, varFullname, varUnits) {
	
	//console.log('fcDataParsed', fcDataParsed);
	// Turn into list of series
	// Separate tab for each table
	const tableData = fcDataParsed
	.forEach(function(x, i) {
		console.log(x.fcname);
		const seriesData =
			(x.fcname === 'hist') ?
			x.data.map(y => ({date: (x.freq === 'q' ? moment(y[0]).format('YYYY[Q]Q') : moment(y[0]).format('YYYY-MM')), type: 'Historical Data', value: y[1]})) :
			/*fcDataParsed.filter(x => x.fcname === 'hist')[0].data.slice(-4).map(y => ({date: (x.freq === 'q' ? moment(y[0]).format('YYYY[Q]Q') : moment(y[0]).format('YYYY-MM')), type: 'Historical Data', value: y[1]}))
				.concat(x.data.map(y => ({date: (x.freq === 'q' ? moment(y[0]).format('YYYY[Q]Q') : moment(y[0]).format('YYYY-MM')), type: 'Forecast', value: y[1]})));
				*/
			x.data.map(y => ({date: (x.freq === 'q' ? moment(y[0]).format('YYYY[Q]Q') : moment(y[0]).format('YYYY-MM')), type: 'Forecast', value: y[1]}));
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
		console.log(dtCols);
		
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
		li.classList.add('w-100'); // Needed to get the thing to vertically align
		li.textContent = (x.fcname !== 'hist' ? x.shortname + ' Forecast' : x.shortname);
		li.setAttribute('data-ref-table', x.fcname); 
		if (i === 0) li.classList.add('active');
		document.querySelector('#li-container').appendChild(li);
		
		// Add last updated text
		const updatedDiv = document.createElement('div');
		const updatedSpan = document.createElement('span');
		updatedDiv.id = 'updated-' + x.fcname;
		updatedDiv.classList.add('text-end');
		updatedSpan.textContent = (x.fcname !== 'hist' ? x.shortname + ' Forecast Updated ' + x.vintage_date : '');
		updatedSpan.classList.add('text-muted');
		updatedSpan.style.fontSize = '0.9rem';
		updatedDiv.appendChild(updatedSpan);
		document.querySelector('#li-container').after(updatedDiv);
		if (i !== 0) updatedDiv.style.display = 'none';
		
		
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
		console.log(dTable);

		// Move the download buttons
		console.log(table.parentElement);
		const downloadDiv = table.closest('.dataTables_wrapper').querySelector('.dt-buttons');
		downloadDiv.classList.add('float-end');
		downloadDiv.id = 'download-' + x.fcname;
		if (i !== 0) downloadDiv.style.display = 'none'
		$('#tables-container .d-inline').after($(downloadDiv).detach());
		
		/* Now add event listener */
		li.addEventListener('click', function() { 
			console.log(this, this.getAttribute('data-ref-table'));
			// Change active li
			document.querySelectorAll('#li-container > li').forEach(el => el.classList.remove('active'));
			this.classList.add('active');
			
			// First hide all tables-container
			$('div.dataTables_wrapper').hide();
			
			const table = document.querySelector('#table-' + this.getAttribute('data-ref-table'));
			$(table).parents('div.dataTables_wrapper').first().show();
			
			
			$('#tables-container div.dt-buttons').hide();
			$('#download-' + this.getAttribute('data-ref-table')).show();
			
			$('#tables-container div.text-end').hide();
			$('#updated-' + this.getAttribute('data-ref-table')).show();

			
		}, false);

		
		/*const btnEl = $('#tablediv.dt-buttons').addClass('float-end').attr('id', 'download-' + x.fcname).detach();
		$('div.d-inline').after(btnEl);
		*/
		/*
		new $.fn.dataTable.Buttons( dTable, {
			buttons: [
				{
					text: 'Button 1',
					action: function ( e, dt, node, conf ) {
						console.log( 'Button 1 clicked on' );
					}
				},
				{
					text: 'Button 2',
					action: function ( e, dt, node, conf ) {
						console.log( 'Button 2 clicked on' );
					}
				}
			]
		} );
	 
		dTable.buttons.container().prependTo(
			dTable.table().container()
		);
		*/
		console.log(dTable);

		
	});
	
	
	return;
}



