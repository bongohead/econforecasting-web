$(document).ready(function() {

	/********** INITIALIZE **********/
	$('div.overlay').show();
	
	/*** Set Default Data ***/
	/* Use previous options if set, otherwise use default options stated above.
	 */ 
	(function() {
		
		const tVarname = 't' + window.location.pathname.split('-').pop().padStart(3, '0');
		const tFullname =
			tVarname === 't03m' ? '3-Month Treasury Bill Yield' 
			: tVarname === 't06m' ? '6-Month Treasury Bill Yield'
			: tVarname === 't01y' ? '1-Year Treasury Note Yield'
			: tVarname === 't02y' ? '2-Year Treasury Note Yield'
			: tVarname === 't05y' ? '5-Year Treasury Note Yield'
			: tVarname === 't10y' ? '10-Year Treasury Note Yield'
			: tVarname === 't20y' ? '20-Year Treasury Bill Yield'
			: tVarname === 't30y' ? '30-Year Treasury Bill Yield'
			: 'NA'
			
		document.querySelector('meta[name="description"]').setAttribute('content', '5-year monthly forecasts and historical data for ' + tFullname + '.');
		document.querySelectorAll('span.t-varname').forEach(x => x.textContent = tFullname);

		document.title  = tFullname + ' Forecast';

		const udPrev = getAllData().userData || {};
		const ud = {
			... udPrev,
			... {
					tVarname: tVarname,
					tFullname: tFullname
				}
		}

		setData('userData', ud);
		
	})();



	/********** GET DATA **********/
	/* Do not transfer data directly between functions - instead have everything work with sessionStorage.
	 * Put the functions in a bigger $.Deferred function when more cleaning is needed before finalization;
	 */
    const loadData = $.Deferred(function(dfd) {
		const ud = getData('userData');
		const getFcHistoryDfd = getFcHistory(varname = ud.tVarname, freq = 'd');
		const getFcForecastDfd = getFcForecast(varname = ud.tVarname, fcname ='dns');

		$.when(getFcHistoryDfd, getFcForecastDfd).done(function(fcHistory, fcForecast) {
			console.log('fcForecast', fcHistory, fcForecast);
			setData(
				'userData',
				{
					...getData('userData'),
					...{
						fcHistory: fcHistory,
						fcForecast: fcForecast
					}
				}
			);
			dfd.resolve();
		});
		return dfd.promise();
	});
	
	
	
	/********** DRAW CHART & TABLE **********/
	loadData.done(function() {
		const ud = getData('userData');
		drawChart(ud.fcHistory, ud.fcForecast, ud.tFullname);
		drawTable(ud.fcHistory, ud.fcForecast);
		$('#overlay').hide();
	});
	
	
});

/*** Get relevant data ***/
function getFcHistory(varname, freq) {
	const dfd = $.Deferred();
	getAJAX('getFcHistory', toScript = ['fcHistory'], fromAjax = {varname: varname, freq: freq}).done(function(ajaxRes) {
		const fcHistory = JSON.parse(ajaxRes).fcHistory.map(function(x) {
			x.obs_date = (x.obs_date);
			x.value = parseFloat(x.value);
			return x;
		});
		dfd.resolve(fcHistory);
		});
	return dfd.promise();
}

/*** Get relevant data ***/
function getFcForecast(varname, fcname) {
	const dfd = $.Deferred();
	getAJAX('getFcForecastLastByFcnameVarname', toScript = ['fcForecast'], fromAjax = {varname: varname, fcname: fcname}).done(function(ajaxRes) {
		const fcForecast = JSON.parse(ajaxRes).fcForecast.map(function(x) {
			x.vintage_date = (x.vintage_date);
			x.obs_date = (x.obs_date);
			x.value = parseFloat(x.value);
			return x;
		});
		dfd.resolve(fcForecast);
		});
	return dfd.promise();
}


/*** Draw chart ***/
function drawChart(fcHistory, fcForecast, tFullname) {
	
	const fcHistoryParsed = fcHistory.map(x => [new Date(x.obs_date).getTime(), parseFloat(x.value)]);
	// Push to end of month for forecasts
	const fcForecastParsed = fcForecast.map(x => [new Date(moment(x.obs_date)).getTime(), parseFloat(x.value)]);

	console.log(fcHistoryParsed, fcForecastParsed);
	Highcharts.setOptions({
		lang: {
			rangeSelectorZoom: 'Show forecast window: '
		}
	});

	const o = {
        chart: {
			spacingTop: 20,
            backgroundColor: 'rgba(255, 255, 255, 0)',
			plotBackgroundColor: '#FFFFFF',
			style: {
				fontFamily: '"Assistant", "sans-serif"',
				fontcolor: 'rgb(48, 79, 11)'
			},
			height: 450,
			plotBorderColor: 'rgb(33, 37, 41)',
			plotBorderWidth: 2
        },
        credits: {
            text: 'econforecasting.com',
			href: 'https://econforecasting.com'
        },
        title: {
            text: tFullname + ' Forecast (Updated ' + moment(fcForecast[0].vintage_date).format('MM/DD/YYYY') + ')',
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
				}
			}
        },
		rangeSelector: {
			buttons: [
				{
					text: '2 Years',
					events: {
						click: function(e) {
							chart.xAxis[0].setExtremes(moment().add(-36, 'M').toDate().getTime(), moment().add(12, 'M').toDate().getTime());
							return false;
						}
					}
				}, {
					text: '5 Years',
					events: {
						click: function(e) {
							chart.xAxis[0].setExtremes(moment().add(-36, 'M').toDate().getTime(), moment().add(60, 'M').toDate().getTime());
							return false;
						}
					}
				},  {
					text: '10 Years',
					events: {
						click: function(e) {
							chart.xAxis[0].setExtremes(moment().add(-36, 'M').toDate().getTime(), moment().add(120, 'M').toDate().getTime());
							return false;
						}
					}
				}, {
					type: 'all',
					text: 'All Data'
				}
			],
			buttonTheme: { // styles for the buttons
				width: '5rem'
			}
		},
        tooltip: {
            useHTML: true,
            formatter: function () {
                return '<h6 class="text-center;" style="font-weight:bold; color:' + this.points[0].series.color + '">' +
					this.points[0].series.name + ' Data For ' + (this.points[0].series.name === 'Historical' ? moment(this.points[0].x).format('MM-DD-YYYY') :  moment(this.points[0].x).format('MMM YYYY')) +
				'</h6>' +
                tFullname + ': ' + Highcharts.numberFormat(this.points[0].y, 2) + '%';
            }
        },
        yAxis: {
            showLastLabel: true,
            labels: {
                formatter: function () {
                    return this.value.toFixed(1) + '%';
                }
            }
        },
		legend: {
			enabled: true,
			align: 'right',
			verticalAlign: 'top',
			x: -10,
			y: 50,
			floating: true
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
        navigator: {
            enabled: true,
			height: 30,
			maskFill: 'rgba(48, 79, 11, .3)'
        },
        series: [{
            data: fcHistoryParsed,
            type: 'line',
            color: '#333',
			name: 'Historical',
			lineWidth: 5
        }, {
			data: fcForecastParsed,
            type: 'line',
            color: 'rgb(250, 100, 100)',
			name: 'Forecast',
			lineWidth: 5,
			marker: {
				enabled: true,
				lineColor: null,
				fillColor: null
			}
		}]
	};
		
		
	const chart = Highcharts.stockChart('chart-container', o);
	return;
}


function drawTable(fcHistory, fcForecast) {
		
	const dtCols =
		[
			{title: 'Date', data: 'obs_date'},
			{title: 'Value', data: 'value'},
		].map(function(x, i) {
			return {...x, ...{
				visible: true,
				orderable: true,
				ordering: true,
				searchable: (x.title === 'Date'),
				type: (x.title === 'Date' ? 'date' : 'num'),
				className: 'dt-center'
			}};
		});
		
	const o = {
		data: fcHistory,
		columns: dtCols,
		iDisplayLength: 25,
		dom:
			"<'row pb-1 justify-content-end'<'col-auto'f>>" +
			"<'row justify-content-end'<'col-auto'B>>" +
			"<'row justify-content-center'<'col-12'tr>>" +
			"<'row justify-content-end'<'col-auto'p>>",
		buttons: [
			{extend: 'copyHtml5', text: 'Copy to clipboard', exportOptions: {columns: [0, 1]}, className: 'btn btn-sm btn-dark'},
			{extend: 'csvHtml5', text: 'Export to CSV', exportOptions: {columns: [0, 1]}, className: 'btn btn-sm btn-dark'}
		],
		order: [[0, 'desc']],
		paging: true,
		pagingType: 'numbers',
		language: {
			search: "Filter By Date:",
			searchPlaceholder: "YYYY-MM-DD"
		}
	}
	
	$('#table-container').DataTable(o).draw();
	
			
	const o2 = {
		data: fcForecast,
		columns: dtCols,
		iDisplayLength: 25,
		dom:
			"<'row pb-1 justify-content-end'<'col-auto'f>>" +
			"<'row justify-content-end'<'col-auto'B>>" +
			"<'row justify-content-center'<'col-12'tr>>" +
			"<'row justify-content-end'<'col-auto'p>>",
		buttons: [
			{extend: 'copyHtml5', text: 'Copy to clipboard', exportOptions: {columns: [0, 1]}, className: 'btn btn-sm btn-dark'},
			{extend: 'csvHtml5', text: 'Export to CSV', exportOptions: {columns: [0, 1]}, className: 'btn btn-sm btn-dark'}
		],
		order: [[0, 'asc']],
		paging: true,
		pagingType: 'numbers',
		language: {
			search: "Filter By Date:",
			searchPlaceholder: "YYYY-MM-DD"
		}
	}
	
	$('#table-container-2').DataTable(o2).draw();

	return;
}

