document.addEventListener("DOMContentLoaded", function(event) {

	/********** INITIALIZE **********/
	$('div.overlay').show();


	/********** GET DATA **********/
	const ud = getData('rates-model-treasury') || {};
	const get_forecast_hist_values_last_vintage = getFetch('get_forecast_hist_values_last_vintage', ['forecast_hist_values'], {forecast: 'int', varname: ['t01m', 't03m', 't06m', 't01y', 't05y', 't07y', 't10y', 't20y', 't30y'], freq: 'm', form: 'd1'}, 10000, false);	
	const get_forecast_values_dfd = getFetch('get_forecast_values_last_vintage', ['forecast_values'], {varname: ['t01m', 't03m', 't06m', 't01y', 't05y', 't07y', 't10y', 't20y', 't30y'], freq: 'm', form: 'd1'}, 10000, false);
	
	Promise.all([get_forecast_hist_values_last_vintage, get_forecast_values_dfd]).then(function(response) {
		
		const ts_data_hist = response[0];
		const ts_data_forecast = response[1];
		console.log(ts_data_hist, ts_data_forecast);
		
		const hist_values_raw = response[0].forecast_hist_values.map(x => ({
			date: x.date,
			value: parseFloat(x.value),
			ttm: parseInt(x.varname.substring(1, 3)) * (x.varname.substring(3, 4) === 'm' ? 1 : 12)
			}));

		const hist_values =
			[... new Set(hist_values_raw.map(x => x.date))]
			.map(d => ({
				date: d,
				type: 'history',
				data: hist_values_raw.filter(x => x.date == d).map(x => [x.ttm, x.value]).sort((a, b) => a[0] - b[0]); // Sort according to largest value
			}));
			
		//console.log('hist_values', hist_values);
		
		const forecast_values_raw = response[1].forecast_values.map(x => ({
			vdate : x.vdate,
			date: x.date,
			value: parseFloat(x.value),
			ttm: parseInt(x.varname.substring(1, 3)) * (x.varname.substring(3, 4) === 'm' ? 1 : 12)
		}));
		
		const forecast_values =
			[... new Set(forecast_values_raw.map(x => x.date))]
			.map(d => ({
				date: d,
				type: 'forecast',
				data: forecast_values_raw.filter(x => x.date == d).map(x => [x.ttm, x.value]).sort((a, b) => a[0] - b[0]); // Sort according to largest value
			}));
			
		const treasury_data = hist_values.concat(forecast_values).map((x, i) => ({...x, ...{date_index: i}}));
		setData('rates-model-treasury-summary', {...getData('rates-model-treasury-summary'), ...{treasury_data: treasury_data}});
		return(treasury_data);
	})
	/********** DRAW CHART & TABLE **********/
	.then(function(treasury_data) {
		drawChart(treasury_data);
		drawTable(treasury_data);
		$('div.overlay').hide();
	});

	
});


/*** Draw chart ***/
function drawChart(treasury_data) {
	
	//console.log('treasury_data', treasury_data);
	
	const grMap = gradient.create(
	  [0, 1, 24, 48, 72], //array of color stops
	  ['#17202a', '#2874a6', '#148f77', '#d4ac0d', '#cb4335'], //array of colors corresponding to color stops
	  'hex' //format of colors in previous parameter - 'hex', 'htmlcolor', 'rgb', or 'rgba'
	);
	
	const chartData =
		treasury_data.filter(x => x.type === 'history').slice(-1) // Get last historical forecast
		.concat(treasury_data.filter(x => x.type === 'forecast').slice(0, 71)) // Get first 24 forecasts
		.map((x, i) => (
			{
				name: moment(x.date).format('MMM YYYY') + ' ' + (x.type === 'history' ? '(Historical)' : '(Forecast)'),
				data: x.data,
				type: 'spline',
				color: gradient.valToColor(i, grMap, 'hex'),
				dashStyle: (x.type === 'history' ? 'solid' : 'shortdot'),
				visible: i === 0 || i % 6 === 1
				//(x.type === 'history' || moment(x.date).month() === moment(treasury_data.filter(x => x.type === 'history').slice(-1)[0].date).month() + 1)
			}
		));
	//console.log('chartData', chartData);
	
	const o = {
        chart: {
			spacingTop: 20,
            backgroundColor: 'rgba(255, 255, 255, 0)',
			plotBackgroundColor: '#FFFFFF',
			style: {
				fontFamily: '"Assistant", "sans-serif"',
				fontColor: 'var(--econgreen)'
			},
			height: 360,
			plotBorderColor: 'rgb(33, 37, 41)',
			plotBorderWidth: 2
        },
        credits: {
			enabled: true,
			text: 'econforecasting.com',
			href: 'https://econforecasting.com'
        },
        title: {
			text: 'Treasury Yield Curve Forecast'
        },
		subtitle: {
			text: 'Data updated ' + ([1, 2, 3, 4, 5].indexOf(moment().subtract(1, 'day').day()) > -1 ? moment().subtract(1, 'day').format('MMM DD YYYY') : moment(moment().day(-2)).format('MMM DD YYYY')) // Last previous weekday
		},
		plotOptions: {
			series: {
				opacity: 0.9,
				lineWidth: 1,
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
			layout: 'vertical',
			align: 'right'
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
	const chart = Highcharts.chart('chart-container', o);
	
	return;
}




function drawTable(treasury_data) {
	
	//console.log('treasury_data', treasury_data);
	
	// Get list of ttm's present in data as array of form [{num: 1, fmt: '1m'}, {num: 3, fmt: '3m'}, ...]
	const ttmsList =
		[...new Set(treasury_data.map(x => (x.data.map(y => y[0]))).flat(1))].sort((a, b) => a > b ? 1 : -1)
		.map(x => ({num: x, fmt: (x >= 12 ? x/12 + 'y' : x + 'm')}))
		.filter(x => !['1m', '6m', '2y', '5y', '7y', '20y'].includes(x.fmt)) ;
	
	// Get obj of form 1m: 1, 3m: 3, 6m: 6, etc..
	// Create array of objects with each object of form {date: , 1m: , 3m: , ...,} returning null if data is unavailable
	const fcDataTable =
		treasury_data.map(function(x) {
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



