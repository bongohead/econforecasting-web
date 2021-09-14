document.addEventListener("DOMContentLoaded", function(event) {
	/********** INITIALIZE **********/
	$('div.overlay').show();
	
	/*** Set Default Data ***/
	/* Use previous options if set, otherwise use default options stated above.
	 */ 
	(function() {
		const udPrev = getAllData().userData || {};
		const ud = {
			... udPrev,
			... {
					displayForm: udPrev.displayForm || 'd1',
					displayScenario: udPrev.displayScenario || 'baseline'
				}
		}
		setData('userData', ud);
	})();



	/********** GET DATA **********/
	/* Do not transfer data directly between functions - instead have everything work with sessionStorage.
	 * Put the functions in a bigger $.Deferred function when more cleaning is needed before finalization;
	 */
	const ud = getData('userData');
	const getTsValuesDfd = getFetch('getTsValuesLast', toScript = ['tsValues'],
		fromAjax = {tskey: '{' + [ud.displayScenario, 'hist'].join() + '}', form: '{' + ud.displayForm + '}', freq:  '{' + ['q', 'm'].join() + '}'}
		);
	const getTsParamsDfd = getFetch('getTsParams', toScript = ['tsParams'], fromAjax = {});
	const getTsTypesDfd = getFetch('getTsTypes', toScript = ['tsTypes'], fromAjax = {});

	Promise.all([getTsValuesDfd, getTsParamsDfd, getTsTypesDfd]).then(function(response) {
		
		const tsValues =
			response[0].tsValues.map(function(x) {
				return {
					date: x.date,
					freq: x.freq,
					formatdate: x.freq === 'q' ? moment(x.date).format('YYYY[Q]Q') : moment(x.date).format('YYYY-MM'),
					varname: x.varname,
					tskey: x.tskey,
					vdate: x.vdate,
					value: Number(x.value)
				};
			});
		
		const tsParams =
			response[1].tsParams.map(function(x) {
				return {...x
				};
			});
			
		const tsTypes =
			response[2].tsTypes.map(function(x) {
				return {...x
				};
			});
			
		// console.log('tsValues', tsValues, 'tsParams', tsParams, 'tsTypes', tsTypes);
		
		/* Get varnames to display */
		const displayVarnames =
			tsParams
			.filter(x => x.dispgroup !== null && x.disporder !== null)
			.map(x => x.varname);
			
		/* Get dates to display - includes historical data (color in non historical data later) */
		const displayDatesQ = getDates(moment().startOf('quarter').subtract(2, 'quarters'), moment().startOf('quarter').add(4 * 4, 'quarters'), 1, 'quarters').map(x => moment(x).format('YYYY[Q]Q'));
		const displayDatesM = getDates(moment().startOf('month').subtract(2, 'months'), moment().startOf('quarter').add(4 * 12, 'months'), 1, 'months').map(x => moment(x).format('YYYY-MM'));
				
				
		console.log('displayVarnames', displayVarnames);	
		/* Get grouped values for chart - will combine historical values with scenario values */
		const tsValuesGrouped =
			displayVarnames
			.map(varname => tsParams.filter(x => x.varname === varname)[0]) // Get array of params
			.flatMap(function (param, i) {
				
				const varnameData = tsValues.filter(x => x.varname === param.varname);
				if (varnameData == null || varnameData.length === 0) return null;
				
				// Now map through dates
				const dataByDateMonthly = displayDatesM.map(function(thisDate) {
					const res =
						varnameData.filter(x => x.formatdate === thisDate)
						.sort(function(a, b) { // Always sort historical first before others
							const valA = (a === 'hist' ? 0 : 1);
							const valB = (b === 'hist' ? 0 : 1);
							return valA - valB;
						})
						.map((x, i) => ({formatdate: x.formatdate, value: x.value, tskey: x.tskey}))[0];
					if (res == null || res.length === 0) return {formatdate: thisDate, value: null, tskey: null}; // Return when res returns nothing
					return res;
				});
				
				const dataByDateQuarterly = displayDatesQ.map(function(thisDate) {
					const res =
						varnameData.filter(x => x.formatdate === thisDate)
						.sort(function(a, b) { // Always sort historical first before others
							const valA = (a === 'hist' ? 0 : 1);
							const valB = (b === 'hist' ? 0 : 1);
							return valA - valB;
						})
						.map((x, i) => ({formatdate: x.formatdate, value: x.value, tskey: x.tskey}))[0];
					if (res == null || res.length === 0) return {formatdate: thisDate, value: null, tskey: null}; // Return when res returns nothing
					return res;
				});

				const res = [
					{
						varname: param.varname, fullname: param.fullname, dispgroup: param.dispgroup, disporder: param.disporder, disprank: param.disprank, disptabs: param.disptabs,
						freq: 'q', data: dataByDateQuarterly
					},
					{
						varname: param.varname, fullname: param.fullname, dispgroup: param.dispgroup, disporder: param.disporder, disprank: param.disprank, disptabs: param.disptabs,
						freq: 'm', data: dataByDateMonthly
					}
				].filter(z => z.data.filter(aa => aa.value !== null).length !== 0);
				
				return res;
			});

		console.log('tsValuesGrouped', tsValuesGrouped);
		setData('userData', {...getData('userData'), ...{tsValuesGrouped: tsValuesGrouped}, displayDatesQ: displayDatesQ, displayDatesM: displayDatesM});
		
		return({tsValuesGrouped: tsValuesGrouped, displayDatesQ: displayDatesQ, displayDatesM: displayDatesM});

		/*
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
			.sort((a, b) => (order.indexOf(a.varname) > order.indexOf(b.varname) ? 1 : -1))
			.map((x, i) => ({...x, order: i}));
			// Now modify data object ine ach so that it is of the form [{vdate: ., []}, {}, {}...]
			
			
		console.log(ncValuesGrouped);
		
		setData('userData', {...getData('userData'), ...{ncValuesGrouped: ncValuesGrouped}, ...{ncReleases: ncReleases}});
		
		return({ncValuesGrouped: ncValuesGrouped, ncReleases: ncReleases});
		*/
	
	})
	/********** DRAW CHART & TABLE **********/
	.then(function(res) {
		//drawChart(res.ncValuesGrouped, res.ncReleases, displayQuarter = ud.displayQuarter);
		drawTable('GDP', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM);
		drawTable('Housing', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM);

		//drawTable('gdp', res.tsValuesGrouped.filter(x => x.dispgroup === 'GDP'), res.displayDates);

		$('div.overlay').hide();
	});
	
	/********** EVENT LISTENERS FOR DATE SWITCH **********/
	$('.card-body').on('click', '#chart-subtitle-group > button.chart-subtitle', function() {
		const newDisplayQuarter = this.innerHTML;
		
		//setData('userData', {...getData('userData'), ...{playState: newPlayState, playIndex: newPlayIndex}});
		//drawChart(getData('userData').ncValuesGrouped, getData('userData').ncReleases, newDisplayQuarter);
		
		return;
    });
	
	/********** EVENT LISTENERS FOR DATA CALENDAR HOVER **********/
	/*
	$('#release-container').on('mouseenter', 'li.release-calendar-date', function() {
		console.log(this.id.replace('li-', ''));
		const chart = $('#chart-container').highcharts();
		chart.xAxis[0].addPlotLine({
			value: parseInt(moment(this.id.replace('li-', '')).format('x')),
			color: 'blue',
			width: 3,
			id: 'release-calendar-indicator'
		  });
		console.log('highcharts');
	});
	$('#release-container').on('mouseleave', 'li.release-calendar-date', function() {
		const chart = $('#chart-container').highcharts();
		chart.xAxis[0].removePlotLine('release-calendar-indicator');
	});
	*/
	
	/********** Attach Table Event Listener to Show/Hide All Accounts **********/
	$('main').on('click', 'div.card-footer > a.btn', function(event) {
		
		const refFreq = this.closest('div.card-body').dataset.refFreq;
		const refDispgroup = this.closest('div.card').dataset.refDispgroup;
		const dt = $(document.querySelector('#table-' + refDispgroup + '-freq-' + refFreq)).DataTable();
		
		const showAllVarnames = (this.textContent.includes('Show') ? 1 : 0);
		dt.rows().every(function (rowIdx, tableLoop, rowLoop) {
			let rowData = this.data();
			rowData.showAllVarnames = showAllVarnames;
			this.data(rowData);
		});
		
		if (showAllVarnames === 1) this.innerHTML = '<span class="align-middle pe-2">Hide Additional Variables</span><i class="bi bi-chevron-up"></i>'
		else this.innerHTML = '<span class="align-middle pe-2">Show Additional Variables</span><i class="bi bi-chevron-down"></i>'			

		dt.draw();
	});
	
	

});


/*** Draw chart ***/
function drawChart(ncValuesGrouped, ncReleases, displayQuarter) {
	
	// Create series - each corresponding to a different economic variable
	const chartData =
		ncValuesGrouped
		.filter(x => ['gdp', 'pce', 'pcegd', 'pces', 'pdi', 'ex', 'im', 'govt'].includes(x.varname))
		.map((x, i) => (
			{
				id: x.varname,
				name: x.fullname,
				data: x.data.filter(y => y.formatdate == displayQuarter).map(y => [parseInt(moment(y.vdate).format('x')), y.value]).sort((a, b) => a[0] - b[0]),
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
		
	console.log('chartData', chartData);
	
	// Calculate end date (take the first vintage of the GDP release occuring after the quarter end date)
	const quarterEndDate = moment(displayQuarter, 'YYYY[Q]Q').add(1, 'Q');
	console.log('quarterEndDate', quarterEndDate);
	const chartEndDate0 =
		ncReleases.filter(x => x.relname == 'Gross Domestic Product')[0].reldates.filter(x => moment(x) > quarterEndDate)[0];
	// Modified 7-6-21 to automatically guess the date if doesn't exist
	const chartEndDate = (typeof(chartEndDate0) !== 'undefined' ? chartEndDate0 : quarterEndDate);
	
	console.log('chartEndDate', chartEndDate);
	
	function getDates(startDate, stopDate) {
		var dateArray = [];
		var currentDate = moment(startDate);
		var stopDate = moment(stopDate);
		while (currentDate <= stopDate) {
			dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
			currentDate = moment(currentDate).add(1, 'days');
		}
		return dateArray;
	}
	
	console.log('dateRange', getDates(chartData[0].data[0][0], moment(chartEndDate)));
	// Get flattened array of date x releaseid objects
	const releaseSeriesData =
		ncReleases
		.map(x => ({...x, reldates: x.reldates.filter(y => moment(y) > moment(chartData[0].data[0][0]) && moment(y) <= moment(chartEndDate))}))
		.filter(x => x.reldates.length > 0)
		.map(function(x, i) {
			return x.reldates.map(function(date) {
				return {
					color: getColorArray()[i], // Color value
					value: date, //parseInt(moment(date).format('x')),
					link: x.link,
					width: 1,
					label: {
						text: x.relname
					}
				};
			})
		}).flat();
		// nest releaseid under dates

	// Now get this data as a date => release id obj
	const releaseData =
		getDates(chartData[0].data[0][0], moment(chartEndDate))
		.map(date => releaseSeriesData.filter(x => x.value === date))
		.filter(x => x.length > 0)
		.sort(x => x.width == 1)
		
	const plotLinesChart =
		releaseData.filter(function(x) {
			return ['Selected Real Retail Sales Series', 'Gross Domestic Product', 'Employment Situation', 'G.17 Industrial Production and Capacity Utilization', 'Personal Income and Outlays'].some(release => x.map(y => y.label.text).includes(release));		
		}).map(x => ({
			color: 'orange',
			dashStyle: 'Solid',
			test: x[0].value,
			value: parseInt(moment(x[0].value).format('x')), 
			width: 1,
			zIndex: 0
		}));
		
	console.log('plotlinesChart', plotLinesChart);
		
	const releaseEl =
		'<ul class="list-group">' +
		releaseData.map(function(x) {
			return
			'<li href="#" id="li-' + x[0].value + '" class="list-group-item list-group-item-action release-calendar-date">' +
				'<div class="d-flex justify-content-between align-items-center">' +
					moment(x[0].value).format('MMMM Do') +
					'<span class="badge bg-econgreen">' + x.length + '</span>' +
				'</div>' +
				'<ul class="ps-2" style="font-size:.8rem">' +
					x.map(y => '<li><a ' + (['Selected Real Retail Sales Series', 'Gross Domestic Product', 'Employment Situation', 'G.17 Industrial Production and Capacity Utilization', 'Personal Income and Outlays'].includes(y.label.text) ? 'class="fw-bolder text-danger"' : '')+ ' href="'+ (y.label != null ? y.link : '') + '">' + y.label.text + '</a></li>').join('\n') +
				'</ul>' +
			'</li>'
		}).join('\n') +
		'</ul>';

	$('#release-container').html(releaseEl);
	
	// Auto scroll to most recent date
	// https://stackoverflow.com/questions/635706/how-to-scroll-to-an-element-inside-a-div
	
	const nextReleaseDate = releaseData.map(x => x[0].value).filter(x => moment(x) >= moment())[0] || releaseData[releaseData.length - 1][0].value;
	var myElement = document.getElementById('li-' + nextReleaseDate);
	var topPos = myElement.offsetTop;
	document.getElementById('release-container').scrollTop = topPos;

	console.log('releaseData', releaseData);
	
	
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
			text: '<img class="me-2" width="20" height="20" src="/static/cmefi_short.png"><div style="vertical-align:middle;display:inline"><span>Forecasted ' + displayQuarter + ' GDP Over Time</h5></span>',
			style: {
				fontSize: '1.5rem',
				color: 'var(--bs-econblue)'
			}
        },
		subtitle: {
			useHTML: true,
			text: 
				'<div class="col-12 btn-group d-inline-block" role="group" id="chart-subtitle-group">' +
					'<button class="btn btn-secondary btn" style="" type="button" disabled="">Select Nowcast Date:&nbsp;</button>' + 
					[... new Set(ncValuesGrouped.map(x => x.data.map(y => y.formatdate)).flat())].map(x => 
					'<button class="btn btn-primary chart-subtitle btn ' + (x === displayQuarter ? 'active' : '') + '" style="" type="button">' + x + '</button>'
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
			labels: {
				style: {
					color: 'black'
				}
			},
			max: parseInt(moment(chartEndDate).add(5, 'day').format('x')),
			ordinal: false,
			plotLines: [{
				color: 'red', // Color value
				dashStyle: 'ShortDash', // Style of the plot line. Default to solid
				//value: parseInt(moment(chartEndDate).format('x')), // Value of where the line will appear
				value: parseInt(moment(chartEndDate).format('x')), // Value of where the line will appear
				width: 2,
				label: {
					text: 'Official GDP Data Release',
					style: {
						color: 'red',
						fontWeight: 'bold'
					}
				}

			}].concat(plotLinesChart)
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
            enabled: false,
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
					'<tr style="border-bottom:1px solid black"><td style="font-weight:600; text-align:center">' + moment(x).format('MMM Do YY') + '</td></tr>'  +
					points.map(function(point) {
						//const freq = ud.ncValuesGrouped.filter(x => x.varname === point.series.options.id)[0].freq;
						return '<tr><td style="color:' + point.color + '">Nowcast for ' + displayQuarter + ' ' + point.series.name + ': ' + point.y.toFixed(2) + '%</td></tr>'; // Remove everything in aprantheses
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




function drawTable(dispgroup, tsValuesGrouped, displayDatesQ, displayDatesM) {
	
	//console.log(dispgroup, 'tsValuesGrouped', tsValuesGrouped, 'displayDates', displayDates);
		
	// Create 2 tables for each frequency
	// See fc-rates-other.js for usage and budget/accoutns.js for usage
	const tableRes = 
	[{freq: 'q'}, {freq: 'm'}]
	.map(function(x) {
		return {
			...x,
			displayDates: (x.freq === 'q' ? displayDatesQ : displayDatesM),
			tsValues: tsValuesGrouped.filter(y => y.dispgroup.toLowerCase() === dispgroup.toLowerCase() && y.freq === x.freq) // Get values for this dispgroup only
		};
	});
	console.log('tableRes', tableRes);
	
	// Now construct the tables (one per card body)
	tableRes
	.forEach(function(tableSpec, i) {	
		if (tableSpec.tsValues.length === 0) return;
			
		const dispEl = document.querySelector('div[data-ref-dispgroup="'+ dispgroup + '"]');
		const bodyEl = dispEl.querySelector('div.card-body[data-ref-freq="' + tableSpec.freq + '"]');
			
		const tableData =
			tableSpec.tsValues
			.map(function(x, i) {
				return {
					showAllVarnames: 0,
					order: i,
					disptabs: x.disptabs,
					disprank: x.disprank,
					fullname: (x.fullname.includes(':') ? x.fullname.substring(x.fullname.lastIndexOf(':') + 2) : x.fullname),
					...Object.fromEntries(
						x.data.map(z => [
							z.formatdate,
							z.value == null ?
								'' : 
								((z.tskey === 'hist' ? '<span style="color:#898989">' : '<span>') + z.value.toFixed(1) + '</span>')
							])
						)
					};
			});
		
		console.log('tableData', tableData);
		
		// Get column names
		const dtCols0 = 
			[{title: 'Order', data: 'order'}, {title: 'Tabs', data: 'disptabs'}, {title: 'Variable', data: 'fullname'}]
			.concat(tableSpec.displayDates.map((x, i) => ({title: x, data: x})));
		
		console.log('dtCols0', dtCols0);
		
		// Add formatter to dtCols
		const dtCols =
			dtCols0
			.map(function(x, i) {
				return {...x, ...{
					visible: (!['Order', 'Tabs'].includes(x.title)),
					orderable: false,
					type: (x.title === 'Variable' ? 'string' : 'html-num'),
					className: (x.title === 'Variable' ? 'dt-left' : 'dt-center'),
					css: 'font-size: 1.0rem',
					createdCell: function(td, cellData, rowData, rowIndex, colIndex) {
						(x.title === 'Variable' ? $(td).css('min-width', '15rem').css('font-weight', '600').css('color', 'rgb(90, 90, 90)') : false);
						(x.title !== 'Variable' ? $(td).css('min-width', '5rem').css('font-weight', '600').css('color', 'rgb(90, 90, 90)') : false);

						(x.title === 'Variable' ? $(td).css('padding-left', String((rowData.disptabs - 1)* 1.5 + .2) + 'rem' ) : false);
						//(!['Order', 'Tabs', 'Variable', 'Group'].includes(x.title) ?
							/*(tsValuesGrouped[rowIndex].data[dtCols0[colIndex].title].tskey === 'hist' ? $(td).css('color', '#898989') : false) :
							false);*/
					}
				}
				}
			});
		
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
			dom:
				"<'row justify-content-end'<'col-auto'B>>" +
				"<'row justify-content-center'<'col-12'tr>>" +
				"<'row justify-content-end'<'col-auto'p>>",
			buttons: [
				{extend: 'copyHtml5', text: copySvg + 'Copy', exportOptions: {columns: dtCols.map((x, i) => ({...x, index: i})).filter(x => x.visible).map(x => x.index)}, className: 'btn btn-sm btn-efblue text-white'},
				{extend: 'csvHtml5', text: dlSvg + 'Download', exportOptions: {columns: dtCols.map((x, i) => ({...x, index: i})).filter(x => x.visible).map(x => x.index)}, className: 'btn btn-sm btn-efblue text-white'}
			],
			scrollX: true,
			fixedColumns: {left: 1},
			paging: false,
			pagingType: 'numbers',
			language: {
				search: "Filter By Date:",
				searchPlaceholder: "YYYY-MM"
			},
			ordering: [[0, 'asc']],
			//responsive: true,
			rowGroup: {dataSrc: 'dispgroup'}
		};

		
		
		/*
		const li = document.createElement('li');
		li.classList.add('list-group-item');
		li.classList.add('w-100'); // Needed to get the thing to vertically align
		li.textContent = 'test'; //(x.fcname !== 'hist' ? x.shortname + ' Forecast' : x.shortname);
		li.setAttribute('data-ref-freq', tableSpec.freq);
		li.setAttribute('data-ref-restrict', tableSpec.restrict);
		if (i === 0) li.classList.add('active');
		document.querySelector('#li-container').appendChild(li);
		*/
		
		// Add last updated text
		/*
		const updatedDiv = document.createElement('div');
		const updatedSpan = document.createElement('span');
		updatedDiv.id = 'updated-'; //+ x.fcname;
		updatedDiv.classList.add('text-end');
		updatedSpan.textContent = '' //(x.fcname !== 'hist' ? x.shortname + ' Forecast Updated ' + x.vintage_date : '');
		updatedSpan.classList.add('text-muted');
		updatedSpan.style.fontSize = '0.9rem';
		updatedDiv.appendChild(updatedSpan);
		document.querySelector('#li-container').after(updatedDiv);
		if (i !== 0) updatedDiv.style.display = 'none';
		*/
		
		// Create table and style it
		const table = document.createElement('table');
		table.classList.add('table');
		table.classList.add('data-table');
		table.classList.add('w-100');
		table.id = 'table-' + dispgroup + '-freq-' + tableSpec.freq;
		bodyEl.querySelector('div.table-container').appendChild(table);
		

		// Draw the table
		const dt = $(table).DataTable(o);
		/*if (i !== 0) $(table).parents('div.dataTables_wrapper').first().hide();*/
		
		// Create show/hide all variables button for this forecast if this is restricted and there are other non-restricted tables
		console.log(tableData.filter(x => ![1, 2].includes(x.disprank)).length);
		if (tableData.filter(x => ![1, 2].includes(x.disprank)).length !== 0) {
			console.log('Show');
			$(bodyEl.querySelector('div.card-footer')).show();
			//$('#card-' + dispgroup + ' .card-footer.footer-show').show();
			//console.log('#card-' + dispgroup + ' div.card_footer.footer-show');
		}

		// Show if either showAllVarnames == 0
		$.fn.dataTable.ext.search.push(function(settings, searchData, rowIndex, rowData, searchCounter) { // https://datatables.net/manual/plug-ins/search
			const show = (rowData.showAllVarnames === 1 || [1, 2].includes(rowData.disprank));
			//console.log(originalData['name'], ancestorStatuses, show);
			return(show);
		});
		console.log(dt.rows().data())
		dt.draw();		
		
		// If this is monthly, or if this is the only option (i.e., no monthly exists), make the card body visible
		if (tableSpec.freq === 'm') $(bodyEl).hide();

		//console.log(dTable);

		// Move the download buttons
		//console.log(table.parentElement);
		/*
		const downloadDiv = table.closest('.dataTables_wrapper').querySelector('.dt-buttons');
		downloadDiv.classList.add('float-end');
		downloadDiv.id = 'download-' + dispgroup;
		if (i !== 0) downloadDiv.style.display = 'none'
		$('#tables-container .d-inline').after($(downloadDiv).detach());
		*/
		/*
		li.addEventListener('click', function() { 
			//console.log(this, this.getAttribute('data-ref-table'));
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
		*/
	});


/*
	
	// console.log('dtCols', dtCols);
	const tableData =
		tsValuesGrouped
		//.filter(x => (['core.endog', 'core.exog.p', 'core.exog'].includes(x.core_structural)))
		.map(function(x, i) {
			return {
				order: i,
				disptabs: x.disptabs,
				dispgroup: x.dispgroup,
				fullname: (x.fullname.includes(':') ? x.fullname.substring(x.fullname.lastIndexOf(':') + 2) : x.fullname),
				...Object.fromEntries(
					x.data.map(z => [z.formatdate, z.value == null ? '' : z.value.toFixed(1)])
					)
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
		dom:
			"<'row justify-content-end'<'col-auto'B>>" +
			"<'row justify-content-center'<'col-12'tr>>" +
			"<'row justify-content-end'<'col-auto'p>>",
		buttons: [
			{extend: 'copyHtml5', text: copySvg + 'Copy', exportOptions: {columns: dtCols.map((x, i) => ({...x, index: i})).filter(x => x.visible).map(x => x.index)}, className: 'btn btn-sm btn-econgreen'},
			{extend: 'csvHtml5', text: dlSvg + 'Download', exportOptions: {columns: dtCols.map((x, i) => ({...x, index: i})).filter(x => x.visible).map(x => x.index)}, className: 'btn btn-sm btn-econgreen'}
		],
		scrollX: true,
		fixedColumns: {left: 1},
		paging: false,
		pagingType: 'numbers',
		language: {
			search: "Filter By Date:",
			searchPlaceholder: "YYYY-MM"
		},
		ordering: [[0, 'asc']],
		responsive: true,
		rowGroup: {dataSrc: 'dispgroup'}
	}
	
	$('#' + dispgroup + '-table').DataTable(o);
	*/
	return;
}



