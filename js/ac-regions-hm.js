$(document).ready(function() {

	/********** Initialize **********/
	$('div.overlay').show();
	
	setAllData($.extend(true, getAllData(), {userData:{usage: 'reg', method: 'p', roll: 30}}));
	const userData = getData('userData');


	/*** Load initial data for basic fund info and map; use to get last date then pull historical series for that date ***/
    const loadDefinitionsData = $.Deferred(function(dfd) {
		/* Get data pieces 1-2 (& assign coordinate order acFund) */
		const getAcFundDfd = getAcFund(usage = userData.usage);
		const getAcFundSeriesMapDfd = getAcFundSeriesMap(usage = userData.usage, method = userData.method, roll = userData.roll);

		/* Add coordinate order to acFundSeriesMap */
		$.when(getAcFundDfd, getAcFundSeriesMapDfd).done(function(acFund, acFundSeriesMap) {
			/* Create object of {fundID1: orderID2, fundID2: orderID2, ..} */
			const fundIdToFundOrder = acFund.reduce((obj, item) => Object.assign(obj, { [item.id]: item.order }), {});

			acFundSeriesMapOrdered = acFundSeriesMap.map(function(x) {
				//console.log(x.fk_fund1, x.fk_fund2);
				x.order1 = fundIdToFundOrder[x.fk_fund1];
				x.order2 = fundIdToFundOrder[x.fk_fund2];
				return x;
			});
			//console.log(acFundSeriesMap, 'acFundSeriesMap');
			dfd.resolve({acFund: acFund, acFundSeriesMap: acFundSeriesMapOrdered, fundIdToFundOrder: fundIdToFundOrder});
		});
		return dfd.promise();
	});
	
	const loadSeriesData = $.Deferred(function(dfd) {
		
		$.when(loadDefinitionsData).done(function(res) {
			const acFund = res.acFund;
			const acFundSeriesMap = res.acFundSeriesMap;
			const fundIdToFundOrder = res.fundIdToFundOrder;
			
			const endDate = moment.max(...(acFundSeriesMap.map(x => x.obs_end))).format('YYYY-MM-DD');
			const startDate = endDate;
			const fundSeriesMapIds = acFundSeriesMap.map(x => x.id);

			const getAcSeriesDfd = getAcSeries(startDate, endDate, fundSeriesMapIds, fundIdToFundOrder);
			
			$.when(getAcSeriesDfd).done(function(acSeries) {
				//console.log(acSeries, 'acSeries');
				dfd.resolve({acFund: acFund, acFundSeriesMap: acFundSeriesMap, acSeries: acSeries});
			});
		});
		return dfd.promise();
	});
	
	
	loadSeriesData.done(function(res) {
		console.log('res', res);
		drawHeatmap(res.acFund, res.acFundSeriesMap, res.acSeries, seriesDate = moment.max(Object.keys(res.acSeries).map(x => moment(x))).format('YYYY-MM-DD'));
		$('#overlay').hide();
	});

		/* Get data piece 3 */
		/*
		$.when(getAcFundDfd, getAcFundSeriesMapDfd).done(function(acFund, acFundSeriesMap) {
			const endDate = moment.max(...(acFundSeriesMap.map(x => x.obs_end))).format('YYYY-MM-DD');
			const startDate = endDate;
			const fundSeriesMapIds = acFundSeriesMap.map(x => x.id);
						
			const getAcSeriesDfd = getAcSeries(startDate, endDate, fundSeriesMapIds);
			
			$.when(getAcSeriesDfd).done(function(acSeries) {
				dfd.resolve({acFund: acFund, acFundSeriesMap: acFundSeriesMap, acSeries: acSeries});
			});
		});
		*/
	/*
	loadData.done(function(res) {
		console.log('res', res);
		drawHeatmap(res.acFund, res.acFundSeriesMap, res.acSeries, seriesDate = moment.max(Object.keys(res.acSeries).map(x => moment(x))).format('YYYY-MM-DD'));
		$('#overlay').hide();
	});
	*/

/*	
	const getAcFundObj = getAcFund(usage = userData.usage, method = userData.method, roll = userData.roll);
	
	$.when(getAcFundObj).done(function(res) {
		const endDate = moment.max(...(res.acFund.map(x => x.obs_end))).format('YYYY-MM-DD');
		const startDate = endDate;
		const fundSeriesMapIds = res.acFund.map(x => x.id);
		const sendData = {startDate: startDate, endDate: endDate, fundSeriesMapIds: '{' + fundSeriesMapIds.join() + '}'};
		getAJAX('getAcSeries', toScript = ['acSeries'], fromAjax = sendData).done(function(ajaxRes) {
			console.log('ajaxRes', ajaxRes);
			const acSeries = groupBy(JSON.parse(ajaxRes).acSeries, 'date');
			console.log('acSeries', acSeries)
			drawHeatmap({res.acFund, acSeries});
		});
	})
*/
	
	
});


/*** Get basic fund info data and sort by category ***/
function getAcFund(usage) {
	const dfd = $.Deferred();
	getAJAX('getAcFund', toScript = ['acFund'], fromAjax = {usage: usage}).done(function(ajaxRes) {
		const acFund = JSON.parse(ajaxRes).acFund.sort((a, b) => (a.category > b.category) ? 1 : -1).map(function(x, i) {
			x.order = i;
			return x;
		});
		dfd.resolve(acFund);
		});
	return dfd.promise();
}


/*** Get fund map data; convert date variables to momentjs dates ***/
function getAcFundSeriesMap(usage, method, roll) {
	const dfd = $.Deferred();
	getAJAX('getAcFundSeriesMap', toScript = ['acFundSeriesMap'], fromAjax = {usage: usage, method: method, roll: roll}).done(function(ajaxRes) {
		const acFundSeriesMap = JSON.parse(ajaxRes).acFundSeriesMap.map(function(x) {
			x.obs_start = moment(x.obs_start);
			x.obs_end = moment(x.obs_end);
			return x;
		});
		dfd.resolve(acFundSeriesMap);
		});
	return dfd.promise();
}

/*** Get historical data and group by date ***/
/* @param startDate: starting date of data pull
 * @param endDate: end date of data pull
 * @param fundSeriesMapIds: array of fundSeriesMap IDs for the historical series to pull
 * @param fundIdToFundOrder: object of {fundID1: orderID2, fundID2: orderID2, ..} to give an order assignment to each data point
 */
function getAcSeries(startDate, endDate, fundSeriesMapIds, fundIdToFundOrder) {

	const dfd = $.Deferred();
	const sendData = {startDate: startDate, endDate: endDate, fundSeriesMapIds: '{' + fundSeriesMapIds.join() + '}'};
	getAJAX('getAcSeries', toScript = ['acSeries'], fromAjax = sendData).done(function(ajaxRes) {
		//console.log('fundIdToFundOrder', fundIdToFundOrder);
		const acSeries0 = JSON.parse(ajaxRes).acSeries.map(function(x) {
			x.order1 = fundIdToFundOrder[x.fk_fund1];
			x.order2 = fundIdToFundOrder[x.fk_fund2];
			x.value = parseFloat(x.value);
			return x;
		});
		// Fill in inverse of series
		const acSeries1 = acSeries0.map(function(x) {return {fk_fund1: x.fk_fund2, fk_fund2: x.fk_fund1, order1: x.order2, order2: x.order1, value: x.value, date: x.date}; });
		// Fill in diagonal
		const acSeries2 = Object.entries(fundIdToFundOrder).map(x => x[1]).map(function(x) {
			return {
				order1: x,
				order2: x,
				date: acSeries1[0].date,
				value: null,
				color: 'rgba(20,20,20,.1)',
				tooltip: false
			} 
		});
		//const acSeries2 = Object.K;
		/*
		const acSeries1 = acSeries0.map(function(x) {
			let y = x;
			y.fk_fund1 = x.fk_fund2;
			y.fk_fund2 = x.fk_fund1;
			y.order1 = x.order2;
			y.order2 = x.order1;
			return y;
		});
		*/
		console.log(acSeries0, acSeries1);
		const acSeries = groupBy(acSeries0.concat(acSeries1).concat(acSeries2), 'date');
		dfd.resolve(acSeries);
	});
	return dfd.promise();
}


/*
function getAcFund(usage, method, roll) {
	// Create new promise for full function
	const dfdFn = $.Deferred();

	const getAcFund = $.Deferred(function(dfd) {
		getAJAX('getAcFund', toScript = ['acFund']).done(function(ajaxRes) {
			//console.log('ajaxRes', ajaxRes);
			//console.log(usage, method, roll);
			const acFund =
				JSON.parse(ajaxRes).acFund
				.filter(function(x) {
					return (x.usage === usage && x.method === method && parseInt(x.roll) === roll);
				})
				.map(function(x) {
					const y = {
						id: x.id,
						id1: x.fk_fund1,
						id2: x.fk_fund2,
						ticker1: x.ticker1,
						ticker2: x.ticker2,
						obs_start: moment(x.obs_start),
						obs_end: moment(x.obs_end)
					}
					return y;
				});
			console.log('acFund', acFund);
			dfd.resolve({acFund: acFund});
			dfdFn.resolve({acFund: acFund});
		});
		return dfd.promise();
	});
	return dfdFn.promise();
}

*/

function createHeatmapData(acFund, acSeries) {
	
	
}


/*** Get series data - from fund data ***/
function drawHeatmap(acFund, acFundSeriesMap, acSeries, seriesDate) {
	
	/* Get groups */
	const groups = [...new Set(acFund.map(x => x.category.split('.')[0]))].map(function(x, i) {
		const y = {
			groupindex: i,
			groupname: x,
			color: getColorArray()[i],
			countries: acFund.filter(y => y.category.split('.')[0] === x).map(y => y.longname)
		};
		return y;
	});
	
	const categories = acFund.map(x => x.longname);
	console.log(categories, 'categories');
	console.log('groups', groups);
	
	console.log('seriesDate', seriesDate);
	Highcharts.chart('heatmap-container', {
		chart: {
			height: 1060,
			marginTop: 100,
			marginRight: 130,
			marginBottom: 200,
			marginLeft: 130,
			plotBorderWidth: 1,
			backgroundColor: null
		},
		title: {
			text: 'Correlation Matrix Between Stock Markets of Major Economies'
		},
		subtitle: {
			enabled: true,
			useHTML: true,
			style: {
				width: '100%',
				"z-index": 1
			},
			text: '<div class="row text-center"><div class="col-12 d-inline-block">'+
			'<h4 class="text-secondary"><span class="badge badge-secondary">*Data for&nbsp;<span id="heatmap-subtitle-date">'+ moment(seriesDate).format('MMM D YY') +'</span></span></h4>'+
			'</div></div>'+
			'<div class="row text-center"><div class="col-12 btn-group d-inline-block" role="group" id="heatmap-subtitle-group">' +
			'<button class="btn btn-secondary btn-sm" type="button" disabled>Click to show changes over time&nbsp;</button>'+
			'<button class="btn btn-primary btn-sm heatmap-subtitle" type="button" data-dir="start" style="letter-spacing:-2px">&#10074;&#9664;&#9664;</button>' +
			'<button class="btn btn-primary btn-sm heatmap-subtitle" type="button" data-dir="back">&#9664;</button>' +
			'<button class="btn btn-primary btn-sm heatmap-subtitle" type="button" data-dir="pause" disabled>&#10074;&#10074;</button>' +
			'<button class="btn btn-primary btn-sm heatmap-subtitle" type="button" data-dir="forward" disabled>&#9654;</button>' +
			'<button class="btn btn-primary btn-sm heatmap-subtitle" type="button" data-dir="end" style="letter-spacing:-2px" disabled>&#9654;&#9654;&#10074;</button>' +
			'</div></div>'
		},
		credits: {
			enabled: false
		},
		xAxis: {
			categories: categories,
			labels: {
				formatter: function () {
					const color = groups.filter(x => x.countries.includes(this.value))[0].color;
					return '<span style="font-weight:bold;color:' + color + '">' + this.value  + '</span>';
				},
				rotation: -90,
				y:15
			}
		},
		yAxis: {
			categories: categories,
			title: null,
			min: 0
			/*
            labels: {
				formatter: function () {
					const color = groups.filter(x => x.countries.includes(this.value))[0].color;
					return '<span style="font-weight:bold;color:' + color + '">' + this.value  + '</span>';
				},
                rotation: -45
             }
			 */
		},
		colorAxis: {
			min: -1,
			max: 1,
			reversed: false,
			stops:[
				[0, 'rgba(5,0,255,1)'], //darkblue
				[0.4, 'rgba(0,132,255,.8)'], //lightblue
				[0.5, 'rgba(0,212,255,.6)'], //cyan
				[0.6, 'rgba(179,255,179,.3)'], //green
				[0.7, 'rgba(253,255,53,.4)'], //yellow
				[0.85, 'rgba(255,160,0,.5)'], //orange
				[0.9, 'rgba(255,50,0,.8)'], //red
				[1, 'rgba(255,0,112,1)'] //violet
			]
		},
		legend: {
			enabled: true,
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'top',
			reversed: true,
			symbolHeight: 800,
			y: 40
		},
		series: [{
			name: 'Correlation',
			borderColor: 'rgba(255,255,255,0)',
			borderWidth: 1,
			type: 'heatmap',
			animation: {
				duration: 500
			},
			data: acSeries[seriesDate].map(x => [x.order1, x.order2, x.value]),
			turboThreshold: 100
		}]
	});
	
}

/*** Get series data - from fund data ***/
/*
function getAcSeries() {
	
	
}*/