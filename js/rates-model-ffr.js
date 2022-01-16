document.addEventListener("DOMContentLoaded", function(event) {
	
	/********** INITIALIZE **********/
	$('div.overlay').show();
	
	/********** GET DATA **********/
	/* Do not transfer data directly between functions - instead have everything work with sessionStorage.
	 * Put the functions in a bigger $.Deferred function when more cleaning is needed before finalization;
	 */
	const ud = getData('rates-model-ffr') || {};
	const get_hist_values_dfd = getFetch('get_rates_model_hist_values', toScript = ['hist_values'], fromAjax = {varname: 'ffr', freq: 'm'});
	const get_submodel_values_dfd = getFetch('get_rates_model_submodel_values_last_vintage', toScript = ['submodel_values'], fromAjax = {varname: 'ffr', freq: null});
	
	Promise.all([get_hist_values_dfd, get_submodel_values_dfd]).then(function(response) {
		const ts_data_raw =
			response[0].hist_values.map(x => ({
				tskey: 'hist',
				freq: 'm',
				vdate: moment().format('YYYY-MM-DD'),
				date: x.date,
				value: parseFloat(x.value)
			})).concat(response[1].submodel_values.filter(x => ['wsj', 'cme', 'cbo'].includes(x.submodel)).map(x => ({
				tskey: x.submodel,
				freq: x.freq,
				vdate: x.vdate,
				date: x.date, 
				value: parseFloat(x.value)
			}))
			);
		console.log('ts_data_raw', ts_data_raw);
		
		// Returns [{fcname: hist, data: [[],..]}, ...] MAX 5 years
		const ts_data_parsed = 
			[... new Set(ts_data_raw.map(x => x.tskey))] // Get list of dates
			.map(function(tskey) { // Group each value of the original array under the correct date
				
				const z = ts_data_raw.filter(x => x.tskey === tskey)[0];
				return {
					tskey: tskey,
					freq: z.freq,
					ts_type: 
						z.tskey ==='hist' ? 'hist'
						: z.tskey === 'cme' ? 'primary'
						: 'secondary',
					shortname: 
						z.tskey === 'hist' ? 'Historical Data' 
						: z.tskey === 'cme' ? 'Market Consensus'
						: z.tskey === 'cbo' ? 'CBO Model'
						: z.tskey === 'wsj' ? 'WSJ Survey'
						: 'Other',
					fullname: 
						z.tskey === 'hist' ? 'Historical Data' 
						: z.tskey === 'cme' ? 'Consensus Futures-Derived Forecast'
						: z.tskey === 'cbo' ? 'U.S. Congressional Budget Office Forecast'
						: z.tskey === 'wsj' ? 'Wall Street Journal Economic Forecasting Survey'
						: 'Other',
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

		//console.log('ts_data_parsed', ts_data_parsed);
		
		setData('rates-model-ffr', {...getData('rates-model-ffr'), ...{ts_data_parsed: ts_data_parsed}});
		return(ts_data_parsed);
	})
	/********** DRAW CHART & TABLE **********/
	.then(function(ts_data_parsed) {
		drawDates(ts_data_parsed);
		drawChart(ts_data_parsed);
		drawTable(ts_data_parsed);
		$('div.overlay').hide();
	});

});


/*** Draw last updated date in description paragraphs ***/
function drawDates(ts_data_parsed) {
	
	ts_data_parsed.filter(x => 
		document.querySelectorAll('#description-date-' + x.tskey).length == 1
	).forEach(x =>
		document.querySelector('#description-date-' + x.tskey).textContent = moment(x.vdate).format('MMM Do YYYY')
	);
	var myElement = document.getElementById("myElementID");

	
};

/*** Draw chart ***/
function drawChart(ts_data_parsed) {
	
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
					(x.tskey !== 'hist' ? x.shortname + ' Forecast': x.shortname) +
					' <span style="font-size:.8rem;font-weight:normal">(' +
						'Updated ' + moment(x.vdate).format('MM/DD/YY') +
						(x.freq === 'q' ? '; Quarterly Frequency' : '; Monthly Frequency')  + 
					')</span>',
				data: x.data.map(x => [parseInt(moment(x[0]).format('x')), x[1]]),
				type: 'line',
				dashStyle: (x.tskey === 'hist' ? 'Solid' : 'ShortDash'),
				lineWidth: (x.tskey === 'hist' ? 5 : 3),
				legendIndex: (x.ts_type === 'hist' ? 0 : x.ts_type == 'primary' ? 1 : 2),
				//['var(--bs-cmefi-blue)', 'var(--bs-cmefi-green)', 'var(--bs-cmefi-orange)'][i]
				color: (x.tskey === 'hist' ? 'black' : getColorArray()[i]),
				opacity: 2,
				visible: (x.ts_type === 'primary' || x.ts_type === 'hist', true),
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
			height: 450,
			plotBorderColor: 'black',
			plotBorderWidth: 2
        },
        title: {
			useHTML: true,
			text: 
				'<img class="me-1" width="18" height="18" src="/static/cmefi-short.svg">' +
				'<div style="vertical-align:middle;display:inline"><span>Effective Federal Funds Rate (FFR) Forecasts</span></div>',
			style: {
				fontSize: '1.3rem',
				color: 'var(--bs-dark)'
			}
        },
		caption: {
			useHTML: true,
			text: 'Data represents monthly-averaged values; shaded areas indicate recessions',

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
					radius: 2,
					symbol: 'triangle'
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
							chart.xAxis[0].setExtremes(moment().add(-36, 'M').toDate().getTime(), moment().add(12, 'M').toDate().getTime());
							$('#chart-container').highcharts().rangeSelector.buttons[0].setState(state === 0 ? 2 : 0);
							return false;
						}
					}
				}, {
					text: '2Y Forecast',
					events: {
						click: function(e) {
							const state = $('#chart-container').highcharts().rangeSelector.buttons[1].state;
							chart.xAxis[0].setExtremes(moment().add(-36, 'M').toDate().getTime(), moment().add(24, 'M').toDate().getTime());
							$('#chart-container').highcharts().rangeSelector.buttons[1].setState(state === 0 ? 2 : 0);
							return false;
						}
					}
				}, {
					text: '5Y Forecast',
					events: {
						click: function(e) {
							const state = $('#chart-container').highcharts().rangeSelector.buttons[2].state;
							chart.xAxis[0].setExtremes(moment().add(-36, 'M').toDate().getTime(), moment().add(60, 'M').toDate().getTime());
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
			min: moment().add(-36, 'M').toDate().getTime(),
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
				text: 'Percent (%)',
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
			formatter: function () {
				//console.log(this.points);
				//console.log(this, moment(this.x).format('YYYY MM DD'));
				const points = this.points;
				const x = this.x;
				const ud = getData('rates-model-ffr');
				const text =
					'<table>' +
					'<tr style="border-bottom:1px solid black"><td>DATE</td><td style="font-weight:600">' +
						'DATA' +
					'</td></tr>' +
					points.map(function(point) {
						const freq = ud.ts_data_parsed.filter(x => x.tskey === point.series.options.id)[0].freq;
						return '<tr><td style="padding-right:1rem; color:'+point.series.color+'">' + (freq === 'm' ? moment(x).format('MMM YYYY') : moment(x).format('YYYY[Q]Q')) +'</td><td style="color:' + point.color + '">' + point.series.name.replace(/ *\([^)]*\) */g, "") + ': ' + point.y.toFixed(2) + '%</td></tr>'; // Remove everything in aprantheses
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




function drawTable(ts_data_parsed) {
	
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
			{title: 'FFR (%)', data: 'value'}
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
			(x.tskey !== 'hist' ? x.shortname + ' Forecast' : x.shortname) +
			'<span style="font-size:0.8rem;color: rgb(180, 180, 180)" >' +
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
		if (i !== 0) $(table).parents('div.dataTables_wrapper').first().hide();
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



