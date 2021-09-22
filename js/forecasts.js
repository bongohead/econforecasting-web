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
			
		const lastUpdated = moment.max(tsValues.map(x => moment(x.vdate))).format('YYYY-MM-DD');

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
						.map((x, i) => ({date:x.date, formatdate: x.formatdate, value: x.value, tskey: x.tskey}))[0];
					if (res == null || res.length === 0) return {date: null, formatdate: thisDate, value: null, tskey: null}; // Return when res returns nothing
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
						.map((x, i) => ({date: x.date, formatdate: x.formatdate, value: x.value, tskey: x.tskey}))[0];
					if (res == null || res.length === 0) return {date: null, formatdate: thisDate, value: null, tskey: null}; // Return when res returns nothing
					return res;
				});

				const res = [
					{
						varname: param.varname, fullname: param.fullname, dispgroup: param.dispgroup, disporder: param.disporder, disprank: param.disprank, disptabs: param.disptabs,
						units: param.units, d1: param.d1,
						freq: 'q', data: dataByDateQuarterly
					},
					{
						varname: param.varname, fullname: param.fullname, dispgroup: param.dispgroup, disporder: param.disporder, disprank: param.disprank, disptabs: param.disptabs,
						units: param.units, d1: param.d1,
						freq: 'm', data: dataByDateMonthly
					}
				].filter(z => z.data.filter(aa => aa.value !== null).length !== 0);
				
				return res;
			});

		//console.log('tsValuesGrouped', tsValuesGrouped);
		setData('userData', {...getData('userData'), lastUpdated: lastUpdated, tsValuesGrouped: tsValuesGrouped, displayDatesQ: displayDatesQ, displayDatesM: displayDatesM});
		
		return({tsValuesGrouped: tsValuesGrouped, lastUpdated: lastUpdated, displayDatesQ: displayDatesQ, displayDatesM: displayDatesM});
	
	})
	/********** DRAW CHART & TABLE **********/
	.then(function(res) {
		//drawChart(res.ncValuesGrouped, res.ncReleases, displayQuarter = ud.displayQuarter);
		drawCard('GDP', 1, res.lastUpdated);
		drawCard('Housing', 1, res.lastUpdated);
		drawCard('Consumer_Sales', 1, res.lastUpdated);
		drawCard('Credit', 1, res.lastUpdated);

		drawCard('Labor_Market', 2, res.lastUpdated);
		drawCard('Benchmark_Rates', 2, res.lastUpdated);
		drawCard('Stocks_and_Commodities', 2, res.lastUpdated);
		drawCard('Currencies', 2, res.lastUpdated);
		drawCard('Inflation', 2, res.lastUpdated);


		drawTable('GDP', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM);
		drawTable('Housing', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM);
		drawTable('Consumer_Sales', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM);

		drawTable('Labor_Market', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM);
		drawTable('Benchmark_Rates', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM);
		drawTable('Stocks_and_Commodities', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM);
		drawTable('Currencies', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM);
		drawTable('Inflation', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM);
		drawTable('Credit', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM);
		
		document.querySelectorAll('div.card').forEach(function(card, i) {
			card.style.border = '1px solid ' + getColorArray()[i];
			card.querySelector('div.card-header').style.color = getColorArray()[i];
			card.querySelectorAll('table thead th').forEach(x => x.style.backgroundColor = getColorArray()[i]);
			card.querySelector('.collapse-btn').style.backgroundColor = getColorArray()[i];
			card.querySelectorAll('.dt-button').forEach(x => {
				x.style.backgroundColor = getColorArray()[i];
				x.style.borderColor = getColorArray()[i];

			});

		});
		
		drawChart('GDP', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM, 'q');
		drawChart('Housing', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM, 'q');
		drawChart('Consumer_Sales', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM, 'q');
		
		drawChart('Labor_Market', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM, 'q');
		drawChart('Benchmark_Rates', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM, 'q');
		drawChart('Stocks_and_Commodities', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM, 'q');
		drawChart('Currencies', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM, 'q');
		drawChart('Inflation', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM, 'q');
		drawChart('Credit', res.tsValuesGrouped, res.displayDatesQ, res.displayDatesM, 'q');

		//drawTable('gdp', res.tsValuesGrouped.filter(x => x.dispgroup === 'GDP'), res.displayDates);

		$('div.overlay').hide();
	});
	
	
	/********** Attach Table Event Listener to Show/Hide All Variables **********/
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
	
	/********** Attach Table Event Listener to Change Frequency **********/
	$('main').on('change', 'div.card-header select', function(event) {
		
		const refDispgroup = this.closest('div.card').dataset.refDispgroup;
		const newFreq = this.value;
		const newBody = this.closest('div.card').querySelector('div.card-body[data-ref-freq="' + newFreq + '"]');
		$(this.closest('div.card').querySelectorAll('div.card-body')).hide();
		$(newBody).show();
		const dt = $(document.querySelector('#table-' + refDispgroup + '-freq-' + newFreq)).DataTable();
		dt.draw();
		
		const ud = getData('userData');
		drawChart(refDispgroup, ud.tsValuesGrouped, ud.displayDatesQ, ud.displayDatesM, newFreq)
		//console.log(refDispgroup, newFreq);
	});
	

	

});

function drawCard(dispgroup, colIndex, lastUpdated) {
	
	console.log(colIndex);
	if (![1, 2].includes(colIndex)) throw new Error('Incorrect colIndex.');
	
	const html =
	`
	<div class="card shadow" data-ref-dispgroup="${dispgroup}">
		<div class="card-header">
			<div class="row flex-between-center">
				<div class="col-auto">
					<span class="mb-0 fw-bolder" style="font-size:.9rem">${dispgroup.replaceAll('_', ' ').toUpperCase()} FORECASTS</span>
				</div>
				<div class="col-auto ms-auto">
					<div class="input-group input-group-sm">
					  <label class="input-group-text">Frequency</label>
						<select class="form-select form-select-sm select-month me-2">
							<option value="q" selected>Quarterly</option><option value="m" disabled>Monthly</option>
						</select>
					</div>
				</div>
				<div class="col-auto">
					<button class="btn btn-sm collapse-btn text-white" data-bs-toggle="collapse" href="#card-body-${dispgroup}" type="button"  aria-expanded="true" >
					Hide/Show
					</button>
				</div>
			</div>
		</div>
		<div id="card-body-${dispgroup}" class="collapse show">
			<div class="card-body h-100" data-ref-freq="m" style="display:none">
				<div class="chart-container" id="chart-container-${dispgroup}-m"></div>
				<div class="">Last Updated ${lastUpdated}</div>
				<div class="table-container mt-2"></div>
				<div class="card-footer bg-light p-0" style="display:none">
					<a class="btn btn-sm btn-link d-block w-100 py-2" href="#!" style="font-family: 'Assistant'; font-size: 1.0rem;text-decoration: none;">
						<span class="align-middle pe-2">Show Additional Variables</span><i class="bi bi-chevron-down"></i>
					</a>
				</div>
			</div>
			<div class="card-body h-100" data-ref-freq="q" style="display:none">
				<div class="chart-container" id="chart-container-${dispgroup}-q"></div>
				<div class="">Last Updated ${lastUpdated}</div>
				<div class="table-container mt-2"></div>
				<div class="card-footer bg-light p-0" style="display:none">
					<a class="btn btn-sm btn-link d-block w-100 py-2" href="#!" style="font-family: 'Assistant'; font-size: 1.0rem;text-decoration: none;">
						<span class="align-middle pe-2">Show Additional Variables</span><i class="bi bi-chevron-down"></i>
					</a>
				</div>
			</div>
		</div>
		<div class="card-footer border-top py-1">
			<div class="row align-items-center gx-0">
				<div class="col text-end" style="font-size:.8rem">Values in <span style="color:rgb(150, 150, 150)">grey</span> represent historical data; values in <span style="font-weight:bolder">black</span> represent forecasts.</div>
			</div>
			<div class="row align-items-center gx-0">
				<div class="col text-end"><span class="fst-italic" style="font-size:.8rem"><span class="badge bg-light text-dark">SAAR%</span>: seasonally adjusted annualized growth rate</span></div>
			</div>

		</div>
	</div>
	`
	
	let containerEl = document.createElement('div');
	containerEl.classList.add('col-12', 'border-0', 'p-4');
	containerEl.innerHTML = html;
	
	document.querySelector('#card-col-' + colIndex + ' > div').append(containerEl);
}

/*** Draw chart ***/
function drawChart(dispgroup, tsValuesGrouped, displayDatesQ, displayDatesM, selectedFreq) {
	
	['q', 'm']
	.filter(x => x == selectedFreq)
	.forEach(function(freq) {
		
		// Create series - each corresponding to a different economic variable
		const chartData =
			tsValuesGrouped
			.filter(x => x.dispgroup === dispgroup & x.freq === freq & x.disprank === 1)
			.map((x, i) => (
				{
					id: x.varname,
					name: x.fullname,
					data: x.data.map(y => [parseInt(moment(y.date).format('x')), y.value]).sort((a, b) => a[0] - b[0]),
					units: (x.d1 === 'apchg' ? 'SAAR%' : (x.d1 === 'pchg' ? '% change from prev period' : (x.d1 === 'base' ? x.units : ''))),
					type: 'line',
					zoneAxis: 'x',
					zones: [
						{
							value: parseInt(moment(x.data.filter(y => y.tskey !== 'hist').sort((a, b) => moment(a.date) - moment(b.date))[0].date).format('x')),
							dashStyle: 'dot',
						},
						{
							dashStyle: 'solid'
						}
					],
					opacity: 1,
					zIndex: 2,
					color: getColorArray()[i],
					index: x.disporder // Force legend to order items correctly
				}
			));
			
		if (chartData.length === 0) return;
			
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
		
		
		const o = {
			chart: {
				spacingTop: 10,
				backgroundColor: 'rgba(255, 255, 255, 0)',
				plotBackgroundColor: '#FFFFFF',
				style: {
					fontFamily: '"Assistant", "sans-serif"',
					fontColor: 'var(--bs-econgreen)'
				},
				height: 300,
				plotBorderColor: 'black',
				plotBorderWidth: 2
			},
			title: {
				useHTML: true,
				text: '<img class="me-2" width="14" height="14" src="/static/cmefi_short.png"><div style="vertical-align:middle;display:inline"><span>Forecasts - Updated ' + moment(getData('userData').lastUpdated).format('MMM Do YYYY') + ' </span></div>',
				floating: true,
				verticalAlign: 'top',
				align: 'center',
				y: 18,
				style: {
					fontSize: '1.0rem',
					color: 'var(--bs-econblue)'
				}
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
				labels: {
					style: {
						color: 'black'
					},
					formatter: function() {
						return (freq === 'q' ? moment(this.value).format('YYYY[Q]Q') : moment(this.value).format('YYYY[M]M'))
					}
				},
				ordinal: false
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
					text: chartData[0].units,
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
					text: null //'Variables: <span style="font-size: .8rem; color: #666; font-weight: normal; font-style: italic">(click to hide/show)</span>',
				}
			},
			tooltip: {
				useHTML: true,
				shared: true,
				formatter: function () {
					const points = this.points;
					const x = this.x;
					const ud = getData('userData');
					const text =
						'<table style="font-size:.7rem">' +
						'<tr style="border-bottom:1px solid black"><td style="font-weight:600; text-align:center">' + (freq === 'q' ? moment(x).format('YYYY[Q]Q') : moment(x).format('MMMM YYYY')) + '</td></tr>'  +
						points.map(function(point) {
							return '<tr><td style="color:' + point.color + '">' + '' + ' ' + point.series.name + ': ' + point.y.toFixed(2) + '%</td></tr>'; // Remove everything in aprantheses
						}).join('') +
						'</table>';
					
					return text;
				}
			},
			series: chartData
		};
		const chart = Highcharts.stockChart('chart-container-' + dispgroup + '-' + freq, o);
	});
	
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
	// console.log('tableRes', tableRes);
	
	// If monthly exists, enable frequency option
	if (tableRes.filter(x => x.freq === 'm')[0].tsValues.length !== 0) document.querySelector('div.card[data-ref-dispgroup="' + dispgroup + '"] option[value="m"]').disabled = false;
	else document.querySelector('div.card[data-ref-dispgroup="' + dispgroup + '"] option[value="m"]').style.display = 'none';
	
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
					order: x.disporder,
					units: x.units,
					d1: x.d1,
					disptabs: x.disptabs,
					disprank: x.disprank,
					fullname: 
						'<span style="font-weight: 600;">' + 
						(x.fullname.includes(':') ? x.fullname.substring(x.fullname.lastIndexOf(':') + 2) : x.fullname) +
						'</span>' +
						'<span class="badge bg-light text-dark ms-2 fst-italic fw-normal">' +
						(x.d1 === 'apchg' ? 'SAAR%' : (x.d1 === 'pchg' ? '% change from prev period' : (x.d1 === 'base' ? x.units : ''))) +
						'</span>',
					...Object.fromEntries(
						x.data.map(z => [
							z.formatdate,
							z.value == null ?
								'' : 
								((z.tskey === 'hist' ? '<span style="color:rgb(150,150,150)">' : '<span style="color:rgb(90,90,90);font-weight:bolder">') + z.value.toFixed(2) + '</span>')
							])
						)
					};
			});
		
		// console.log('tableData', tableData);
		
		// Get column names
		const dtCols0 = 
			[{title: 'Order', data: 'order'}, {title: 'Tabs', data: 'disptabs'}, {title: 'Variable', data: 'fullname'}]
			.concat(tableSpec.displayDates.map((x, i) => ({title: x, data: x})));
		
		// console.log('dtCols0', dtCols0);
		
		// Add formatter to dtCols
		const dtCols =
			dtCols0
			.map(function(x, i) {
				return {...x, ...{
					visible: (!['Order', 'Tabs'].includes(x.title)),
					orderable: false,
					type: (x.title === 'Variable' ? 'html' : 'html-num'),
					className: (x.title === 'Variable' ? 'dt-left' : 'dt-center'),
					css: 'font-size: 1.0rem',
					createdCell: function(td, cellData, rowData, rowIndex, colIndex) {
						(x.title === 'Variable' ? $(td).css('min-width', '14rem').css('color', 'rgb(90, 90, 90)') : false);
						/*(x.title !== 'Variable' ? $(td).css('min-width', '2rem').css('font-weight', '500').css('color', 'rgb(90, 90, 90)') : false);*/

						(x.title === 'Variable' ? $(td).css('padding-left', String((rowData.disptabs - 1)* 1.5 + .5) + 'rem' ) : false);
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
				{extend: 'copyHtml5', text: copySvg + 'Copy Data', exportOptions: {columns: dtCols.map((x, i) => ({...x, index: i})).filter(x => x.visible).map(x => x.index)}, className: 'btn btn-sm btn-efblue text-white'},
				{extend: 'csvHtml5', text: dlSvg + 'Download Data', exportOptions: {columns: dtCols.map((x, i) => ({...x, index: i})).filter(x => x.visible).map(x => x.index)}, className: 'btn btn-sm btn-efblue text-white'}
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

		// Create table and style it
		const table = document.createElement('table');
		table.classList.add('table');
		table.classList.add('data-table');
		table.classList.add('w-100');
		table.id = 'table-' + dispgroup + '-freq-' + tableSpec.freq;
		bodyEl.querySelector('div.table-container').appendChild(table);
		
		// Draw the table
		const dt = $(table).DataTable(o);
		
		// Create show/hide all variables button for this forecast if this is restricted and there are other non-restricted tables
		// console.log(tableData.filter(x => ![1, 2].includes(x.disprank)).length);
		if (tableData.filter(x => ![1, 2].includes(x.disprank)).length !== 0) {
			console.log('Show');
			$(bodyEl.querySelector('div.card-footer')).show();
		}

		// Show if either showAllVarnames == 0
		$.fn.dataTable.ext.search.push(function(settings, searchData, rowIndex, rowData, searchCounter) { // https://datatables.net/manual/plug-ins/search
			const show = (rowData.showAllVarnames === 1 || [1, 2].includes(rowData.disprank));
			return(show);
		});
		// console.log(dt.rows().data())
		// Show quarterly by default
		if (tableSpec.freq === 'q') $(bodyEl).show();
		
		dt.draw();
		
	});


	return;
}



