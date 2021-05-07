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
    const loadData = $.Deferred(function(dfd) {
		const ud = getData('userData');
		const getFcHistoryDfd = getTcurveHistory();
		const getFcForecastDfd = getFcForecast(fcname ='dns');

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
						fcDataParsed: fcDataParsed,
						playState: 'pause',
						playIndex: fcDataParsed.filter(x => x.type === 'forecast')[0].dateIndex
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
		drawChart(ud.fcDataParsed, ud.playIndex);
		drawTable(ud.fcDataParsed, ud.playIndex);
		$('#overlay').hide();
	});
	
	
	
	/********** EVENT LISTENERS FOR PLAYING **********/
	$('#chart-container').on('click', '#chart-subtitle-group > button.chart-subtitle', function() {
		const ud = getData('userData');
		const clickedPlayDirection = $(this).data('dir');
		if (ud.playState == null) return;
           
		if (clickedPlayDirection === 'pause') {
			var newPlayState = 'pause';
			var newPlayIndex = ud.playIndex;
		}
		else if (clickedPlayDirection === 'start' || clickedPlayDirection === 'end') {
			var newPlayState = 'pause';
			var newPlayIndex = (clickedPlayDirection === 'start') ? 0 : ud.fcDataParsed.length - 1;
		}
		/* If click back & index greater than 5, head back by 5, otherwise 0 */
		else if (clickedPlayDirection === 'back' || clickedPlayDirection === 'forward') {
			var newPlayState = clickedPlayDirection;
			if (clickedPlayDirection === 'back') var newPlayIndex = (ud.playIndex >= 1) ? ud.playIndex - 1 : 0;
			else var newPlayIndex = (ud.playIndex + 1 <= ud.fcDataParsed.length - 1) ? ud.playIndex + 1 : ud.fcDataParsed.length;
		}
		console.log('clicked', clickedPlayDirection, newPlayState, newPlayIndex);
				           
		setData('userData', {...getData('userData'), ...{playState: newPlayState, playIndex: newPlayIndex}});
		if (clickedPlayDirection !== 'pause') updateChart();
		else updateButtons();
		
		return;
    });

});

/*** Get relevant data ***/
function getTcurveHistory(freq) {
	const dfd = $.Deferred();
	getAJAX('getTcurveHistory', toScript = ['fcHistory'], fromAjax = {}).done(function(ajaxRes) {
		const fcHistory = JSON.parse(ajaxRes).fcHistory.map(function(x) {
			x.value = parseFloat(x.value);
			x.obs_date = (x.obs_date);
			x.ttm = parseInt(x.varname.substring(1, 3)) * (x.varname.substring(3, 4) === 'm' ? 1 : 12);
			return x;
		});
		dfd.resolve(fcHistory);
		});
	return dfd.promise();
}

/*** Get relevant data ***/
function getFcForecast(fcname) {
	const dfd = $.Deferred();
	getAJAX('getFcForecastLastByFcname', toScript = ['fcForecast'], fromAjax = {fcname: fcname}).done(function(ajaxRes) {
		const fcForecast = JSON.parse(ajaxRes).fcForecast.map(function(x) {
			x.vintage_date = (x.vintage_date);
			x.obs_date = (x.obs_date);
			x.value = parseFloat(x.value);
			x.ttm = parseInt(x.varname.substring(1, 3)) * (x.varname.substring(3, 4) === 'm' ? 1 : 12);
			return x;
		});
		dfd.resolve(fcForecast);
		});
	return dfd.promise();
}


/*** Draw chart ***/
function drawChart(fcDataParsed, playIndex) {
	
	Highcharts.AST.allowedAttributes.push('data-dir');
	
	const o = {
        chart: {
			spacingTop: 10,
            backgroundColor: 'rgba(255, 255, 255, 0)',
			plotBackgroundColor: '#FFFFFF',
			style: {
				fontFamily: '"Assistant", "sans-serif"',
				fontcolor: 'rgb(48, 79, 11)'
			},
			height: 400,
			plotBorderColor: 'rgb(33, 37, 41)',
			plotBorderWidth: 2,
			events: {
				load: function() {
					// this = chart
					// console.log('chart1', this);
					// Get top of plot area distance from chart
					const distFromTop = this.chartHeight - (this.marginBottom + this.plotHeight) + 40;
					const distFromLeft = 50;
					console.log(distFromTop, distFromLeft);
					this.renderer
						.text('Forecast for ' + moment(fcDataParsed[playIndex].date).format('MMM YYYY'), distFromLeft, distFromTop)
						.attr({'id': 'date-text', fill: 'rgb(33, 177, 151)', 'font-size': '1.5rem'})
						.add();
					
					/* Now render non-changing historical data on RHS */
					this.renderer
						.text('Historical data for ' + moment(fcDataParsed[playIndex - 1].date).format('MMM YYYY'), distFromLeft, distFromTop + 40)
						.attr({'id': 'date-text', fill: 'darkred', 'font-size': '1.5rem'})
						.add();

				}
			}

        },
        credits: {
			enabled: false
        },
        title: {
			useHTML: true,
			text: 
			'<div class="row text-center justify-content-center">'+
				'<span class="my-0 py-1" style="font-size: 1.3rem;">TREASURY YIELD CURVE</span>'+
			'</div>'+
			'<div class="row text-center"><div class="col-12 btn-group d-inline-block" role="group" id="chart-subtitle-group">' +
				'<button class="btn btn-secondary btn-sm" style="font-size:.8rem" type="button" >Click to show changes over time&nbsp;</button>'+
				'<button class="btn btn-primary btn-sm chart-subtitle" style="font-size:.8rem" type="button" data-dir="start" style="letter-spacing:-2px">&#10074;&#9664;&#9664;</button>' +
				'<button class="btn btn-primary btn-sm chart-subtitle" style="font-size:.8rem" type="button" data-dir="back">&#9664;</button>' +
				'<button class="btn btn-primary btn-sm chart-subtitle" style="font-size:.8rem" type="button" data-dir="pause" >&#10074;&#10074;</button>' +
				'<button class="btn btn-primary btn-sm chart-subtitle" style="font-size:.8rem" type="button" data-dir="forward" >&#9654;</button>' +
				'<button class="btn btn-primary btn-sm chart-subtitle" style="font-size:.8rem" type="button" data-dir="end" style="letter-spacing:-2px" >&#9654;&#9654;&#10074;</button>' +
			'</div></div>'
        },
		xAxis: {
			title: {
				text: 'Time to Maturity (Months)',
				style: {
					fontSize: '1.2rem'
				}
			},
			min: 0,
			max: 360
		},
		yAxis: {
			title: {
				text: null
			},
			min: 0,
			max: 8
		},
		legend: {
			enabled: false
		},
        tooltip: {
            useHTML: true,
			shared: true,
			formatter: function () {
				//console.log(this);
				const points = this.points; // SOlves issue of tooltip not updating correctly with chart
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
            data: fcDataParsed[playIndex].data,
			name: 'Yield',
            type: 'area',
            color: 'rgb(33, 177, 151)',
			/*
			fillColor: {
                linearGradient: [0, 0, 0, 300],
                stops: [
                    [0, Highcharts.getOptions().colors[0]],
                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                ]
            },*/
			marker: {
				enabled: true
			},
			zIndex: 2,
			fillOpacity: 0.5
        }, {
            data: fcDataParsed[playIndex - 1].data,
			name: 'Current Yield',
            type: 'area',
            color: 'red',
			marker: {
				enabled: true
			},
			zIndex: 1,
			fillOpacity: 0.5
		}]
	};
	const chart = Highcharts.chart('chart-container', o);
	
	
	const o2 = {
        chart: {
			spacingTop: 0,
            backgroundColor: 'rgba(255, 255, 255, 0)',
			plotBackgroundColor: 'rgba(255, 255, 255, 0)',
			style: {
				fontFamily: '"Assistant", "sans-serif"',
				fontcolor: 'rgb(48, 79, 11)'
			},
			height: 150,
			//plotBorderColor: 'rgb(33, 37, 41)',
			//plotBorderWidth: 2
			events: {
				load: function() {
					// this = chart
					// Get x-axis y distance from top- full chart height minus bottom margin + xaxis offset
					const axisDistFromTop = this.chartHeight - (this.marginBottom + 45);
					// Get x distance of the first histoircal point, last historical point, first ofrecast point, last forecast point
					const startHistory = Math.min(...this.series[0].points.filter(x => x.type === 'history').map(x => x.plotX));
					const endHistory = Math.max(...this.series[0].points.filter(x => x.type === 'history').map(x => x.plotX));
					const startForecast = Math.min(...this.series[0].points.filter(x => x.type === 'forecast').map(x => x.plotX));
					const endForecast = Math.max(...this.series[0].points.filter(x => x.type === 'forecast').map(x => x.plotX));
					this.renderer
						.path(['M', startHistory, axisDistFromTop, 'L', (endHistory + startForecast)/2, axisDistFromTop])
						.attr({
							'stroke-width': 2,
							stroke: 'darkblue'
							})
						.add();
					this.renderer
						.path(['M', (endHistory + startForecast)/2, axisDistFromTop, 'L', endForecast, axisDistFromTop])
						.attr({
							'stroke-width': 2,
							stroke: 'rgb(33, 177, 151)'
							})
						.add();
					this.renderer
						.text('Historical Data', (endHistory + startForecast)/2 - 100, axisDistFromTop - 5)
						.css({color: 'darkblue', fontSize: '.8rem'})
						.add();
					this.renderer
						.text('Forecasts', (endHistory + startForecast)/2 + 100, axisDistFromTop - 5)
						.css({color: 'rgb(33, 177, 151)', fontSize: '.8rem'})
						.add();
				}
			}
        },
		title: {
			text: null,
		},
		subtitle: {
			text: 'CLICK ON THE TIMELINE BELOW TO NAVIGATE'
		},
		tooltip: {
            useHTML: true,
            formatter: function () {
				//console.log(this);
                return '<h6 class="text-center;" style="font-weight:bold; color:black">' +
					moment(this.point.x).format('MMM YYYY') +
				'</h6>Click to set!';
            }
		},
		xAxis: {
			type: 'datetime',
            dateTimeLabelFormats: {
                day: "%m-%Y",
                week: "%m-%Y"
            },
			//startOnTick: true,
			//endOnTick: true,
			min: new Date(fcDataParsed[0].date).getTime(),
			max: new Date(fcDataParsed[fcDataParsed.length - 1].date).getTime(),
			lineWidth: 0,
			offset: -45,
			tickInterval: 12 * 3 * 30 * 24 * 3600 * 1000,
			plotLines: [{
				value: parseInt(moment(fcDataParsed[playIndex].date).format('x')),
				color: 'rgba(255,0,0,.5)',
				width: 5,
				id: 'plot-line',
				zIndex: 3,
				label: {
					text: '<span class="text-danger">SELECT<br>A DATE</span>',
					align: 'left',
					verticalAlign: 'top',
					rotation: 90,
					useHTML: true
				}
			}]
		},
        plotOptions: {
			series: {
				dataGrouping: {
					enabled: true,
					units: [ ['month',[1]]]
				},
				cursor: 'pointer',
				point: {
					events: {
						click: function () {
							'userData',
							setData('userData', {
								...getData('userData'),
								...{
									playState: 'pause',
									playIndex: this.dateIndex
									}
							});
							console.log(this.dateIndex);
							updateChart();
							updateChart2();
							updateButtons();
						}
					}
				}
			}
        },
		yAxis: {
			title: {
				text: null
			},
			max: 1,
			min: -1,
			labels: {
				enabled: false
			},
			gridLineColor: 'rgba(255, 255, 255, 0)'

		},
		legend: {
			enabled: false
		},
        credits: {
            text: 'econforecasting.com',
			href: 'https://econforecasting.com'
        },
        series: [{
            data: fcDataParsed.map(x => ({x: parseInt(moment(x.date).format('x')), low: -1, high: 1, y: x.data.filter(y => y[0] === 120)[0][1], dateIndex: x.dateIndex, type: x.type})),
            type: 'arearange',
            color: 'rgba(255, 255, 255, 0)',
            fillColor: 'rgba(255, 255, 255, 0)',
			marker: {
				enabled: false
			}
        }]
	};
		
	
	const chart2 = Highcharts.chart('chart-container-2', o2);
	return;
}




function drawTable(fcDataParsed, playIndex) {
	
	console.log('fcDataParsed', fcDataParsed);
	
	// Get list of ttm's present in data as array of form [{num: 1, fmt: '1m'}, {num: 3, fmt: '3m'}, ...]
	const ttmsList =
		[...new Set(fcDataParsed.map(x => (x.data.map(y => y[0]))).flat(1))].sort((a, b) => a > b ? 1 : -1)
		.map(x => ({num: x, fmt: (x >= 12 ? x/12 + 'y' : x + 'm')}));
	
	// Get obj of form 1m: 1, 3m: 3, 6m: 6, etc..
	/*
	const ttmVarnameMap = [... new Set(histTtms.concat(forecastTtms)].reduce((accum, x) => Object.assign(accum, {[(x >= 12 ? x/12 + 'y' : x + 'm')]: x}), {});
	*/
	// Create array of objects with each object of form {date: , 1m: , 3m: , ...,} returning null if data is unavailable
	const fcDataTable =
		fcDataParsed.map(function(x) {
			let res = {
				date: moment(x.date).format('YYYY-MM'),
				type: x.type
			};
			ttmsList.forEach(function(ttm) {
				res[ttm.fmt] = (x.data.filter(x => x[0] === ttm.num).length === 0 ? null : x.data.filter(x => x[0] === ttm.num)[0][1].toFixed(2));
				return;
			});
			return res;
		});
	console.log('fcDataTable', fcDataTable, ttmsList);
	
	const dtCols =
		[
			{title: 'Date', data: 'date'},
		]
		.concat(ttmsList.map(ttm => ({title: ttm.fmt, data: ttm.fmt}))) // title and object property name are the same 
		.map(function(x, i) {
			return {...x, ...{
				visible: true,
				orderable: true,
				ordering: true,
				searchable: (x.title === 'Date'),
				type: (x.title === 'Date' ? 'date' : 'num'),
				className: 'dt-center'
			}};
		});
	console.log('dtCols', dtCols, fcDataTable.filter(x => x.type === 'history'));
	const o = {
		data: fcDataTable.filter(x => x.type === 'history'),
		columns: dtCols,
		iDisplayLength: 25,
		dom:
			"<'row pb-1 justify-content-end'<'col-auto'f>>" +
			"<'row justify-content-end'<'col-auto'B>>" +
			"<'row justify-content-center'<'col-12'tr>>" +
			"<'row justify-content-end'<'col-auto'p>>",
		buttons: [
			{extend: 'copyHtml5', text: 'Copy', exportOptions: {columns: [0, 1]}, className: 'btn btn-sm btn-secondary'},
			{extend: 'csvHtml5', text: 'Download', exportOptions: {columns: [0, 1]}, className: 'btn btn-sm btn-secondary'}
		],
		order: [[0, 'desc']],
		paging: true,
		pagingType: 'numbers',
		language: {
			search: "Filter By Date:",
			searchPlaceholder: "YYYY-MM"
		},
		responsive: true
	}
	
	const o2 = {
		...o,
		...{
			data: fcDataTable.filter(x => x.type === 'forecast'),
			order: [[0, 'asc']]
		}
	}
	
	$('#table-container').DataTable(o).draw();
	$('#table-container-2').DataTable(o2).draw();

	
	/*
			
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
*/
	return;
}



/*** Update Chart ***/
function updateChart() {
	let ud = getData('userData');
	const chart = $('#chart-container').highcharts();
	/* Return if playstate = paused; this is necessary to shut off the auto-repeating nature of this function */
	if (ud.fcDataParsed === undefined || ud.playIndex === undefined) return;
	const timeStart = new Date().getTime();
  
	/* Get the new active date */
    const newData = ud.fcDataParsed[ud.playIndex].data;
    const newDate = ud.fcDataParsed[ud.playIndex].date;

	/* Update data */
	//console.log('Updating data...', newData);
	
	/* Update chart data and colors */
	chart.series[0].setData(newData, redraw = true, animation = {duration: 250}, updatePoints = true);
	chart.series[0].update({color: (ud.fcDataParsed[ud.playIndex].type === 'forecast' ? 'rgb(33, 177, 151)' : '#3333A2')})
	
	/* Update chart title*/
	if (ud.fcDataParsed[ud.playIndex].type === 'history') {
		document.querySelector('#date-text').style.fill = 'darkblue';
		document.querySelector('#date-text').textContent = 'Historical curve for ' + moment(ud.fcDataParsed[ud.playIndex].date).format('MMM YYYY');
	} else {
		document.querySelector('#date-text').style.fill = 'rgb(33, 177, 151)';
		document.querySelector('#date-text').textContent = 'Forecasted curve for ' + moment(ud.fcDataParsed[ud.playIndex].date).format('MMM YYYY');
	}
	
	/* Handle pause/unpause */
	//If at end or beginning, auto-pause
	if (ud.playIndex <= 0 ) {
	  ud.playState = 'pause';
	  ud.playIndex = 0;
	}
	else if (ud.playIndex >= ud.fcDataParsed.length - 1) {
	  ud.playState = 'pause';
	  ud.playIndex = ud.fcDataParsed.length - 1;
	}
	else {
	  if (ud.playState === 'forward')  ud.playIndex = ud.playIndex + 1;
	  else ud.playIndex = ud.playIndex - 1;
	}
	
	/* Update userdata */
	setData('userData', {...ud, ...{}});
	
	updateButtons();
	updateChart2();
	
	const timeEnd = new Date().getTime();
	const timeWait = 250 /*timeEnd - timeStart < 5000 ? 5000 - (timeEnd - timeStart) : 5000*/;
  
	if (ud.playState !== 'pause') setTimeout(function() {updateChart();}, timeWait);
	return;
}


function updateChart2() {
	const ud = getData('userData');
	const chart = $('#chart-container-2').highcharts();
    chart.xAxis[0].removePlotLine('plot-line');
    chart.xAxis[0].addPlotLine({
        value: parseInt(moment(ud.fcDataParsed[ud.playIndex].date).format('x')),
        color: 'rgba(255,0,0,.5)',
        width: 5,
        id: 'plot-line',
        zIndex: 3,
        label: {
            text: '<span class="text-danger">SELECT<br> A DATE</span>',
            align: 'left',
            verticalAlign: 'top',
            rotation: 90,
            useHTML: true
        }
    });
}

function updateButtons() {
	const ud = getData('userData');
	/* Update buttons */
	const buttons = $('#chart-subtitle-group').find('button.chart-subtitle').removeClass('active').prop('disabled', false).end();
	//console.log('updateButtons', ud.playState, ud.playIndex, ud.fcDataParsed.length - 1, buttons);

	if (ud.playIndex === 0) buttons.find('[data-dir="start"],[data-dir="back"]').prop('disabled', true);
	else if (ud.playIndex === ud.fcDataParsed.length - 1) buttons.find('[data-dir="end"],[data-dir="forward"]').prop('disabled', true);
	if (ud.playState === 'pause') buttons.find('[data-dir="pause"]').addClass('active', true);
	else if (ud.playState === 'back') buttons.find('[data-dir="back"]').addClass('active', true);
	else if (ud.playState === 'forward') buttons.find('[data-dir="forward"]').addClass('active', true);
	else buttons.find('[data-dir="forward"]').addClass('active', true);
}

