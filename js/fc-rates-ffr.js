$(document).ready(function() {	
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
				}
		}

		setData('userData', ud);
		
	})();



	/********** GET DATA **********/
	/* Do not transfer data directly between functions - instead have everything work with sessionStorage.
	 * Put the functions in a bigger $.Deferred function when more cleaning is needed before finalization;
	 */
	const getFcHistoryDfd = getFetch('getFcHistory', toScript = ['fcHistory'], fromAjax = {varname: 'ffr', freq: 'm'});
	const getFcForecastDfd = getFetch('getFcForecastLastByVarname', toScript = ['fcForecast'], fromAjax = {varname: 'ffr', freq: null});
	
	Promise.all([getFcHistoryDfd, getFcForecastDfd]).then(function(response) {
		const fcDataRaw =
			response[0].fcHistory.map(function(x) {
				return {...x,
					cmefi: true,
					fcname: 'hist',
					freq: 'm',
					fullname: 'Historical Data'
				};
			}).concat(response[1].fcForecast)
			.map(function(x) {
				return {...x,
					value: parseFloat(x.value)
				};
			});
		console.log('fcDataRaw', fcDataRaw);
		
		// Returns [{fcname: hist, data: [[],..]}, ...] MAX 5 years
		const fcDataParsed = 
			[... new Set(fcDataRaw.map(x => x.fcname))] // Get list of obs_dates
			.map(function(fc) { // Group each value of the original array under the correct obs_date
				return {
					fcname: fc,
					fullname: fcDataRaw.filter(x => x.fcname === fc)[0].fullname,
					freq: fcDataRaw.filter(x => x.fcname === fc)[0].freq,
					vintage_date: fcDataRaw.filter(x => x.fcname === fc)[0].vintage_date || null,
					data: fcDataRaw.filter(x => x.fcname === fc).filter(x => moment(x.obs_date) <= moment().add(5, 'years')).map(x => [x.obs_date, x.value]).sort((a, b) => a[0] - b[0])
				}
			});
			
		console.log('fcDataParsed', fcDataParsed);
		
		setData('userData', {...getData('userData'), ...{fcDataParsed: fcDataParsed}});
		
		return(fcDataParsed);
	})
	/********** DRAW CHART & TABLE **********/
	.then(function(fcDataParsed) {
		console.log('resp', fcDataParsed);
		drawChart(fcDataParsed);
		$('div.overlay').hide();

	});
	/*
    const loadData = $.Deferred(function(dfd) {
		const getFcHistoryDfd = getFetch('getFcHistory', toScript = ['fcHistory'], fromAjax = {varname: 'ffr', freq: 'm'}).fcHistory;
		const getFcForecastDfd = getFetch('getFcForecastLastByVarname', toScript = ['fcForecast'], fromAjax = {varname: 'ffr', freq: null}).fcForecast;
				
		$.when(getFcHistoryDfd, getFcForecastDfd).done(function(fcHistory, fcForecast) {
			const fcHistoryParsed =
				[... new Set(fcHistory
				.map(x => x.obs_date))] // Get list of obs_dates
				.map(function(d) { // Group each value of the original array under the correct obs_date
					return {
						date: d,
						type: 'history',
						data: fcHistory.filter(x => x.obs_date == d).map(x => [x.ttm, x.value]).sort((a, b) => a[0] - b[0]); // Sort according to largest value
					}
				});
			
			const fcForecastParsed =
				[... new Set(fcForecast
				.map(x => x.obs_date))] // Get list of obs_dates
				.map(function(d) { // Group each value of the original array under the correct obs_date
					return {
						date: d,
						type: 'forecast',
						data: fcForecast.filter(x => x.obs_date == d).map(x => [x.ttm, x.value]).sort((a, b) => a[0] - b[0]); // Sort according to largest value
					}
				});
				
			const fcDataParsed = fcHistoryParsed.concat(fcForecastParsed).map((x, i) => ({...x, ...{dateIndex: i}}));
			//console.log('fcDataParsed', fcDataParsed);
			setData(
				'userData',
				{
					...getData('userData'),
					...{
						fcDataParsed: fcDataParsed
					}
				}
			);
			dfd.resolve();
		});
		return dfd.promise();
	});
	*/


	
});


/*** Draw chart ***/
function drawChart(fcDataParsed) {
	
	Highcharts.setOptions({
		tooltip: {
			style: {
				fontWeight: 'bold',
				fontSize: '0.85rem'
			}
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
				name: x.fullname,
				data: x.data.map(x => [new Date(x[0]).getTime(), x[1]]),
				type: 'spline',
				dashStyle: (x.fcname === 'hist' ? 'solid' : 'solid'),
				lineWidth: (x.fcname === 'hist' ? 4 : 2),
				color: (x.fcname === 'hist' ? 'black' : getColorArray()[i]),
				opacity: 2
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
				fontColor: 'var(--econgreen)'
			},
			height: 450,
			plotBorderColor: 'rgb(33, 37, 41)',
			plotBorderWidth: 2
        },
        credits: {
			enabled: true,
			text: 'econforecasting.com',
			href: 'https://econforecasting.com'
        },
        title: {
			text: 'Federal Funds Rate Forecast',
			style: {
				'font-weight': 'bolder',
				fontSize: '1.2rem',
				color: 'rgb(48, 79, 11)',
				fillColor: 'rgb(48, 79, 11)'
			}
        },
		caption: {
			text: 'Shaded areas indicate recessions'
		},
        plotOptions: {
			series: {
				dataGrouping: {
					enabled: true,
					units: [['day', [1]]],
					forced: true
				},
				marker : {
					enabled: true,
					radius: 3
				}
			}
        },
		rangeSelector: {
			buttons: [
				{
					text: '1 Year Forecast',
					events: {
						click: function(e) {
							chart.xAxis[0].setExtremes(moment().add(-36, 'M').toDate().getTime(), moment().add(12, 'M').toDate().getTime());
							return false;
						}
					}
				}, {
					text: '2 Year Forecast',
					events: {
						click: function(e) {
							chart.xAxis[0].setExtremes(moment().add(-36, 'M').toDate().getTime(), moment().add(24, 'M').toDate().getTime());
							return false;
						}
					}
				}, {
					text: '5 Year Forecast',
					events: {
						click: function(e) {
							chart.xAxis[0].setExtremes(moment().add(-36, 'M').toDate().getTime(), moment().add(60, 'M').toDate().getTime());
							return false;
						}
					}
				}, {
					type: 'all',
					text: 'Show All Historical Data'
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
			min: moment().add(-36, 'M').toDate().getTime(),
			max: moment().add(60, 'M').toDate().getTime()
		},
		yAxis: {
			endOnTick: false,
			showLastLabel: true,
            labels: {
                formatter: function () {
                    return this.value.toFixed(1) + '%';
                }
            }
		},
        navigator: {
            enabled: true,
			height: 30,
			maskFill: 'rgba(48, 79, 11, .3)'
        },
		legend: {
			enabled: true,
			align: 'right',
			verticalAlign: 'top',
			x: -10,
			y: 50,
			floating: true
		},
        tooltip: {
            useHTML: true,
			shared: true,
			formatter: function () {
				console.log(this, moment(this.x).format('YYYY MM DD'));
				const points = this.points;
				const x = this.x;
				const ud = getData('userData');
				const text =
					'<table>' +
					'<tr style="border-bottom:1px solid black"><td>DATE</td><td style="font-weight:600">' +
						'FORECAST' +
					'</td></tr>' +
					points.map(function(point) {
						const freq = ud.fcDataParsed.filter(x => x.fullname === point.series.name)[0].freq;
						return '<tr><td style="padding-right:1rem; color:'+point.series.color+'">' + (freq === 'm' ? moment(x).format('MMM YYYY') : moment(x).format('YYYY[Q]Q')) +'</td><td style="color:' + point.color + '">' + point.series.name + ': ' + point.y.toFixed(2) + '%</td></tr>';
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




function drawTable(fcDataParsed) {
	
	//console.log('fcDataParsed', fcDataParsed);
	
	// Get list of ttm's present in data as array of form [{num: 1, fmt: '1m'}, {num: 3, fmt: '3m'}, ...]
	const ttmsList =
		[...new Set(fcDataParsed.map(x => (x.data.map(y => y[0]))).flat(1))].sort((a, b) => a > b ? 1 : -1)
		.map(x => ({num: x, fmt: (x >= 12 ? x/12 + 'y' : x + 'm')}))
		.filter(x => !['1m', '6m', '2y', '5y', '7y', '20y'].includes(x.fmt)) ;
	
	// Get obj of form 1m: 1, 3m: 3, 6m: 6, etc..
	// Create array of objects with each object of form {date: , 1m: , 3m: , ...,} returning null if data is unavailable
	const fcDataTable =
		fcDataParsed.map(function(x) {
			let res = {
				date: moment(x.date).format('MMM YYYY') + (x.type === 'forecast' ? '*' : ''),
				type: x.type
			};
			ttmsList.forEach(function(ttm) {
				res[ttm.fmt] = (x.data.filter(x => x[0] === ttm.num).length === 0 ? null : x.data.filter(x => x[0] === ttm.num)[0][1].toFixed(2));
				return;
			});
			return res;
		});
	//console.log('fcDataTable', fcDataTable.filter(x => x.type === 'history').slice(-2).concat(fcDataTable.filter(x => x.type === 'forecast')), ttmsList);
	
	const dtCols =
		[
			{title: 'Date', data: 'date'},
		]
		.concat(ttmsList.map(ttm => ({title: ttm.fmt, data: ttm.fmt}))) // title and object property name are the same 
		.map(function(x, i) {
			return {...x, ...{
				visible: true,
				orderable: false,
				ordering: true,
				type: (x.title === 'Date' ? 'date' : 'num'),
				className: 'dt-center',
				css: 'font-size: .9rem'
			}};
		});
		
	const o = {
		data: fcDataTable.filter(x => x.type === 'history').slice(-2).concat(fcDataTable.filter(x => x.type === 'forecast').slice(0, 24)),
		columns: dtCols,
		iDisplayLength: 20,
		dom:
			"<'row justify-content-end'<'col-auto'B>>" +
			"<'row justify-content-center'<'col-12'tr>>" +
			"<'row justify-content-end'<'col-auto'p>>",
		buttons: [
		],
		order: [[0, 'asc']],
		paging: false,
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
	
	
	$('#table-container').DataTable(o).draw();

	
	return;
}



