$(document).ready(function() {

	/********** Initialize **********/
	$('div.overlay').show();
	
	setAllData($.extend(true, getAllData(), {userData:{usage: 'reg', method: 'p', roll: 30}}));
	const userData = getData('userData');


	/*** Load dates list for when correlation data is available ***/
	const getAcSeriesDatesDfd = getAcSeriesDates();
	$.when(getAcSeriesDatesDfd).done(function(res) {
		setData('userData', $.extend(true, getData('userData'), {hmDates: res}));
	});


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
			setData('userData', $.extend(true, getData('userData'), {acFund: acFund, acFundSeriesMap: acFundSeriesMapOrdered, fundIdToFundOrder: fundIdToFundOrder}));
			dfd.resolve({acFund: acFund, acFundSeriesMap: acFundSeriesMapOrdered, fundIdToFundOrder: fundIdToFundOrder});
		});
		return dfd.promise();
	});
	
	/*** Load series data ***/
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

/*** Get series dates as array ***/
function getAcSeriesDates() {
	const dfd = $.Deferred();
	getAJAX('getAcSeriesDates', toScript = ['acSeriesDates']).done(function(ajaxRes) {
		const acSeriesDates = JSON.parse(ajaxRes).acSeriesDates.map(x => x.date);
		dfd.resolve(acSeriesDates);
		});
	return dfd.promise();
}


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
 * @param endDate: last date of data pull (SQL will pull most recent date before this)
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




/*** Get series data - from fund data ***/
function drawHeatmap(acFund, acFundSeriesMap, acSeries, seriesDate) {
	
	/* Get groups */
	const groups = [...new Set(acFund.map(x => x.category.split('.')[0]))].map(function(x, i) {
		const y = {
			groupindex: i,
			groupname: x,
			color: getColorArray()[i],
			countries: acFund.filter(y => y.category.split('.')[0] === x).map(y => y.longname),
			start: Math.min(...acFund.filter(y => y.category.split('.')[0] === x).map(y => y.order)),
			end: Math.max(...acFund.filter(y => y.category.split('.')[0] === x).map(y => y.order))
		};
		return y;
	});
	
	const categories = acFund.map(x => x.longname);
	console.log(categories, 'categories');
	console.log('groups', groups);
	
	console.log('seriesDate', seriesDate);
	const chart = Highcharts.chart('heatmap-container', {
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
			min: 0,
            labels: {
				formatter: function () {
					const color = groups.filter(x => x.countries.includes(this.value))[0].color;
					return '<span style="font-weight:bold;color:' + color + '">' + this.value  + '</span>';
				},
                rotation: -45
             }
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
	
	
	/** Draw group rectangles etc **/

	const boxW =  chart.xAxis[0].width/chart.xAxis[0].categories.length;
    const boxH =  chart.yAxis[0].height/chart.yAxis[0].categories.length;
    const offsetH = chart.plotSizeY + chart.plotTop;
    const offsetW = chart.plotLeft;
	
    //Get x-y coords of labels
    const xticks = chart.xAxis[0].ticks;
    const yticks = chart.yAxis[0].ticks;
	
	const groupsWithDimensions = groups.map(function(group) {
		group.XAXISy = xticks[group.start].label.attr('y');
        group.YAXISx = yticks[group.start].label.attr('x');

		//top-left, bottom-right,etc
		group.yTop = offsetH - (group.start) * boxH;
		group.yBottom = offsetH - (group.end + 1) * boxH;
		group.xLeft = offsetW + group.start * boxW;
		group.xRight = offsetW + (group.end + 1) * boxW;
		
		return group;
	});
	console.log('groupsWithDimensions', groupsWithDimensions);
	
    //Draw stuff
    groupsWithDimensions.map(function(group, index) {
        // horizontal line on x-axis
        chart.renderer.path(['M', group.start * boxW + offsetW + 2, group.XAXISy - 5,'L', (group.end + 1) * boxW + offsetW - 2, group.XAXISy - 5])
        .attr({
            'stroke-width': 2,
            stroke: group.color
        })
        .add();
        
        // vertical line on y-axis
        chart.renderer.path(['M', group.YAXISx + 5, offsetH - group.start * boxH - 5, 'L', group.YAXISx + 5, offsetH - (group.end + 1) * boxH + 5])
        .attr({
            'stroke-width': 2,
            stroke: group.color
        })
        .add();
        
        
        //text and rectangles
		
        (function() {
            if (group.grouping === 'World') return;
            
            var text = chart.renderer.text(group.grouping,offsetW+group.start*boxW+(group.end+1-group.start)*boxW/2,group.XAXISy+100) //(text,x,y)
            .attr({
                zIndex: 5,
                'text-anchor': 'middle'
            })
            .css({
                textAlign: 'center',
                color: 'white'
            })
            .add();
            box = text.getBBox();
        
            chart.renderer.rect(box.x - 5, box.y - 5, box.width + 10, box.height + 10, 5)
            .attr({
                fill: group.color,
                stroke: 'gray',
                'stroke-width': 1,
                zIndex: 4
            })
            .add();
        })();


        //Draw a box around the square - TOP -> BOT -> LEFT -> RIGHT
        var paths = [];
        paths[0] = ['M',group.xLeft,group.yTop,'H',group.xRight]; //top-left to top-right
        paths[1] = ['M',group.xLeft,group.yBottom,'H',group.xRight]; //bottom-left to bottom-right
        paths[2] = ['M',group.xLeft,group.yBottom,'V',group.yTop]; //bottom-left to top-left
        paths[3] = ['M',group.xRight,group.yBottom,'V',group.yTop]; //bottom-right to top-right

        for (i=0;i<paths.length;i++) {
            chart.renderer.path(paths[i])
            .attr({
                'stroke-width': 2,
                "zIndex": 5,
                "stroke": group.color
            })
            .add();
        }
        
        //Region text in center of box
        fontSize = Math.round( (group.xRight-group.xLeft)/5,0 );
        if (fontSize < 6) {
            
        } else {
            if (fontSize < 8) fontSize = 8;
            if (fontSize > 20) fontSize = 20;

            chart.renderer.text(group.groupname.replace(' ','<br>'),(group.xLeft+group.xRight)/2,(group.yTop+group.yBottom)/2) 
            .attr({
                zIndex: 6,
                'text-anchor': 'middle'
            })
            .css({
                "textAlign": 'center',
                "color": group.color,
                "opacity": 0.8,
                //'text-shadow': '-0.05em 0 black, 0 0.05em black, 0.05em 0 black, 0 -0.05em ' + 'black',
                'font-size': fontSize + 'px'
            })
            .add();
        }
        
    });
}


/*** ***/
function updateCharts(chartHM,chartHMDates) {
    var timeStart = new Date().getTime();

    var data = getData();
  
    if (data.hmDates === undefined || data.playIndex === undefined) return;
    var date = data.hmDates[data.playIndex];
    updatePlotLine(chartHMDates,new Date(date).getTime());
    

    var ajaxGetHistCorrel = getAJAX(
                                    ['get_hist_correl_by_date'],[],['tagsCorrel',],
                                    {"date": date, "category": data.dataInfo.category, "corr_type": data.dataInfo.corr_type, "freq": data.dataInfo.freq, "trail": data.dataInfo.trail},
                                    20000,'disabled');

    ajaxGetHistCorrel.done(function(res) {
            if (JSON.parse(res).tagsCorrel.length == null) return;
            
            var tagsCorrelDate = JSON.parse(res).tagsCorrel;
            var hm = drawHeatMap(data.tagsSeries,tagsCorrelDate,1);
            
            for (j=0;j<hm.data.length;j++) {
                chartHM.series[0].data[j].update(hm.data[j],false);
            }
            chartHM.redraw();
            $('#heatmap-subtitle-date').text(Highcharts.dateFormat('%m/%d/%Y',new Date(date).getTime()));
            
                      
            //If at end or beginning, auto-pause
            
            if (data.playIndex <= 0 ) {
              data.playState = 'pause';
              data.playIndex = 0;
            }
            
            else if (data.playIndex >= data.hmDates.length - 1) {
              data.playState = 'pause';
              data.playIndex = data.hmDates.length - 1;
            }
            
            else {
              if (data.playState === 'forward')  data.playIndex = data.playIndex + 5; //skip by week
              else data.playIndex = data.playIndex - 5; //skip by week
            }
            
            setData(data);
            
            updateHMButtons();
            var timeEnd = new Date().getTime();
            var timeWait = timeEnd-timeStart < 500 ? 500 - (timeEnd-timeStart) : 500;
          
            if (data.playState !== 'pause') setTimeout(function() { updateCharts(chartHM,chartHMDates); }, timeWait);
            
    });
}