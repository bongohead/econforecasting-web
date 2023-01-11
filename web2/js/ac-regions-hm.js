$(document).ready(function() {
/*** ac-assets-hm.js and ac-regions-hm.js are identical except for initialization & width/height multiplier (30 for assets, 20 for regions) ***/


	/********** INITIALIZE **********/
	$('div.overlay').show();
	
	/*** Set Default Data ***/
	/* Use previous options if set, otherwise use default options stated above.
	 * Also change roll window to currently selected value
	 */ 
	(function() {
		const udPrev = getAllData().userData || {};
		const ud = {
			...udPrev,
			... {
					usage: 'reg',
					method: udPrev.method || 'p',
					roll: udPrev.roll || 30
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
		const getAcSeriesDatesDfd = getAcSeriesDates(usage = ud.usage);
		const getAcFundDfd = getAcFund(usage = ud.usage);
		const getAcFundSeriesMapDfd = getAcFundSeriesMap(usage = ud.usage, method = ud.method, roll = ud.roll);

		$.when(getAcSeriesDatesDfd, getAcFundDfd, getAcFundSeriesMapDfd).done(function(acSeriesDates, acFund, acFundSeriesMap) {
			/* Add order key to each fund */
			const acFundOrdered = acFund.map((x, i) => ({...x, ...{order: i}}));
			/* Create object to map between fund ID and order ID: {fundID1: orderID2, fundID2: orderID2, ..} */
			const fundIdOrderMap = acFundOrdered.reduce((obj, item) => Object.assign(obj, { [item.id]: item.order }), {});
			/* Add order1 and order2 to each acFundSeriesMap object */
			const acFundSeriesMapOrdered = acFundSeriesMap.map(x => ({...x, ...{order1: fundIdOrderMap[x.fk_fund1], order2: fundIdOrderMap[x.fk_fund2]}}));
			/* Now get series data - use last date */
			const acActiveDate = moment.max(...(acSeriesDates.map(x => moment(x)))).format('YYYY-MM-DD');
			
			const getAcSeriesDfd = getAcSeries(acActiveDate, acFundSeriesMapOrdered.map(x => x.id), fundIdOrderMap).done(function(acSeries) {
				setData(
					'userData',
					{
						...getData('userData'),
						...{
							acFund: acFundOrdered,
							fundIdOrderMap: fundIdOrderMap,
							acFundSeriesMap: acFundSeriesMapOrdered,
							acSeriesDates: acSeriesDates,
							acActiveDate: acActiveDate,
							acSeries: acSeries,
							playState: 'pause',
							playIndex: acSeriesDates.length - 1
						}
					}
				);
				dfd.resolve();
			});
		});
		return dfd.promise();
	});
	
	
	
	/********** DRAW CHARST **********/
	loadData.done(function() {
		const ud = getData('userData');
		drawHeatmap(ud.acFund, ud.acFundSeriesMap, ud.acSeries, ud.acActiveDate);
		$('#overlay').hide();
	});
	
	
	
	
	/********** EVENT LISTENERS FOR PLAYING **********/
	$('#heatmap-container').on('click', '#heatmap-subtitle-group > button.heatmap-subtitle', function() {
		const ud = getData('userData');
		const clickedPlayDirection = $(this).data('dir');
		if (ud.playState == null) return;
           
		if (clickedPlayDirection === 'pause') {
			var newPlayState = 'pause';
			var newPlayIndex = ud.playIndex;
		}
		else if (clickedPlayDirection === 'start' || clickedPlayDirection === 'end') {
			var newPlayState = 'pause';
			var newPlayIndex = (clickedPlayDirection === 'start') ? 0 : ud.acSeriesDates.length - 1;
		}
		/* If click back & index greater than 5, head back by 5, otherwise 0 */
		else if (clickedPlayDirection === 'back' || clickedPlayDirection === 'forward') {
			var newPlayState = clickedPlayDirection;
			if (clickedPlayDirection === 'back') var newPlayIndex = (ud.playIndex >= 5) ? ud.playIndex - 5 : 0;
			else var newPlayIndex = (ud.playIndex + 5 <= ud.acSeriesDates.length - 1) ? ud.playIndex + 5 : ud.acSeriesDates.length;
		}
		console.log('clicked', clickedPlayDirection, newPlayState, newPlayIndex);
				           
		setData('userData', {...getData('userData'), ...{playState: newPlayState, playIndex: newPlayIndex}});
		if (clickedPlayDirection !== 'pause') updateHeatmap();
		else updateButtons(newPlayState, newPlayIndex, ud.acSeriesDates);
		
		return;
    });
	
	
	
	/********** EVENT LISTENER FOR CORRELATION TYPE **********/
	/*document.querySelector('#roll').addEventListener('change', (event) => {
		console.log('changed', event.target.value);
		setData('userData', {...getData('userData'), ...{roll: parseInt(event.target.value)}});
		location.reload(true);
	});
	*/
	document.querySelector('#heatmap-container').addEventListener('click', (event) => {
		const clickedElement = event.target.classList;
		console.log(clickedElement);
		if (event.target.classList.contains('roll-select')) {
			setData('userData', {...getData('userData'), ...{roll: parseInt(event.target.innerText)}});
			location.reload(true);
		}
	});

});

/*** Get series dates as array ***/
function getAcSeriesDates(usage) {
	const dfd = $.Deferred();
	getAJAX('getAcSeriesDates', toScript = ['acSeriesDates'], fromAjax = {usage: usage}).done(function(ajaxRes) {
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

/*** Get historical data ***/
/* @param acActiveDate: date of data pull
 * @param fundSeriesMapIds: array of fundSeriesMap IDs for the historical series to pull
 * @param fundIdOrderMap: object of {fundID1: orderID2, fundID2: orderID2, ..} to give an order assignment to each data point
 */
function getAcSeries(acActiveDate, fundSeriesMapIds, fundIdOrderMap) {

	const dfd = $.Deferred();
	const sendData = {acActiveDate: acActiveDate, fundSeriesMapIds: '{' + fundSeriesMapIds.join() + '}'};
	getAJAX('getAcSeries', toScript = ['acSeries'], fromAjax = sendData).done(function(ajaxRes) {
		//console.log('ajaxRes', ajaxRes);
		//console.log('fundIdOrderMap', fundIdOrderMap);
		const acSeries0 = JSON.parse(ajaxRes).acSeries.map(function(x) {
			x.order1 = fundIdOrderMap[x.fk_fund1];
			x.order2 = fundIdOrderMap[x.fk_fund2];
			x.value = parseFloat(x.value);
			return x;
		});
		// Fill in inverse of series
		const acSeries1 = acSeries0.map(function(x) {return {fk_fund1: x.fk_fund2, fk_fund2: x.fk_fund1, order1: x.order2, order2: x.order1, value: x.value, date: x.date}; });
		// Fill in diagonal
		const acSeries2 = Object.entries(fundIdOrderMap).map(x => x[1]).map(function(x) {
			return {
				order1: x,
				order2: x,
				value: null,
				color: 'rgba(20,20,20,.1)'
			} 
		});
		//console.log(acSeries0, acSeries1);
		const acSeries = acSeries0.concat(acSeries1).concat(acSeries2);
		dfd.resolve(acSeries);
	});
	return dfd.promise();
}




/*** Get series data - from fund data ***/
function drawHeatmap(acFund, acFundSeriesMap, acSeries, acActiveDate) {
	
	$('#heatmap-subtitle-group').find('button.heatmap-subtitle').prop('disabled', true);
	 
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
	
	console.log('acActiveDate', acActiveDate);
	Highcharts.AST.allowedAttributes.push('data-dir');
	Highcharts.AST.allowedAttributes.push('data-bs-toggle');

	const chart = Highcharts.chart('heatmap-container', {
		chart: {
			height: Math.floor(acFund.length * 22),
			width: Math.floor(acFund.length * 22) + 80,
			marginTop: 110,
			marginRight: 100,
			marginBottom: 150,
			marginLeft: 150,
			plotBorderWidth: 1,
			backgroundColor: null,
			style: {
				fontFamily: 'Open Sans'
			}
		},
		title: {
			text: 
			`<div class="input-group">
			  <span class="input-group-text bg-transparent py-0" style="font-size:1.1rem">Cross-Asset Correlation by Region (</span>
			  <button class="btn btn-outline-secondary dropdown-toggle py-0" type="button" data-bs-toggle="dropdown">${acFundSeriesMap[0].roll}</button>
			  <ul class="dropdown-menu dropdown-menu-end">
				<li><a class="dropdown-item roll-select">30</a></li>
				<li><a class="dropdown-item roll-select">90</a></li>
				<li><a class="dropdown-item roll-select">180</a></li>
			  </ul>
			  <span class="input-group-text bg-transparent py-0" style="font-size:1.1rem">-day rolling window)</span>
			</div>`,
			useHTML: true
		},
		subtitle: {
			enabled: true,
			useHTML: true,
			style: {
				width: '100%',
				"z-index": 1
			},
			text: 
			'<div class="row text-center justify-content-center">'+
				'<div class="alert alert-primary my-0 py-1" style="max-width:360px">*data as of&nbsp;<h5 class="d-inline" id="heatmap-subtitle-date">'+ moment(acActiveDate).format('MMM D YY') +'</h5></div>'+
			'</div>'+
			'<div class="row text-center"><div class="col-12 btn-group d-inline-block" role="group" id="heatmap-subtitle-group">' +
				'<button class="btn btn-secondary btn-sm" style="font-size:.8rem" type="button" disabled>Click to show changes over time&nbsp;</button>'+
				'<button class="btn btn-primary btn-sm heatmap-subtitle" style="font-size:.8rem" type="button" data-dir="start" style="letter-spacing:-2px">&#10074;&#9664;&#9664;</button>' +
				'<button class="btn btn-primary btn-sm heatmap-subtitle" style="font-size:.8rem" type="button" data-dir="back">&#9664;</button>' +
				'<button class="btn btn-primary btn-sm heatmap-subtitle" style="font-size:.8rem" type="button" data-dir="pause" disabled>&#10074;&#10074;</button>' +
				'<button class="btn btn-primary btn-sm heatmap-subtitle" style="font-size:.8rem" type="button" data-dir="forward" disabled>&#9654;</button>' +
				'<button class="btn btn-primary btn-sm heatmap-subtitle" style="font-size:.8rem" type="button" data-dir="end" style="letter-spacing:-2px" disabled>&#9654;&#9654;&#10074;</button>' +
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
					return '<span style="color:' + color + '">' + this.value  + '</span>';
				},
				rotation: -90,
				y:15
				//x:10
			},
			tickWidth: 0

		},
		yAxis: {
			categories: categories,
			title: null,
			gridLineDashStyle: 'Solid',
			gridLineWidth: 0,
			min: 0,
            labels: {
				formatter: function () {
					const color = groups.filter(x => x.countries.includes(this.value))[0].color;
					return '<span style="color:' + color + '">' + this.value  + '</span>';
				},
                rotation: 0
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
			symbolHeight: 300,
			y: 90,
			title: {
				text: 'Correlation'
			}
		},
		tooltip: {
			useHTML: true,
			style: {
				"z-index": 10 
			},
			formatter: function () {
				const pt = this.point;
				//console.log(pt);
				if (pt.x !== pt.y) {
					var text =
						'<table>' +
						'<tr><td style="text-align:center;font-weight:600">' +
							'Trailing correlation between ' +
							'<span style="font-weight:700;">' + pt.series.xAxis.categories[pt.x] + '</span>' +
							' and ' +
							'<span style="font-weight:700;">' + pt.series.yAxis.categories[pt.y] + '</span>' +
							' : ' +
							'<span style="font-weight:700;color:' +  (pt.value > 0 ? 'rgba(255,0,0,1)' : 'rgba(0,0,255,1)') + '">' + (pt.value > 0 ? '+' : '') + pt.value + '</span>' +
						'</td></tr>' +
						'</table>';
					//console.log(text);
					return text;
				}
				else return false;
			}
		},
		series: [{
			name: 'Correlation',
			borderColor: 'rgba(255,255,255,0)',
			borderWidth: 1,
			type: 'heatmap',
			animation: {
				duration: 2000
			},
			data: acSeries.map(x => [x.order1, x.order2, x.value]),
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


/*** Update Heatmap ***/
function updateHeatmap() {
	const ud = getData('userData');
	const hm = $('#heatmap-container').highcharts();
	/* Return if playstate = paused; this is necessary to shut off the auto-repeating nature of this function */
	if (ud.acSeriesDates === undefined || ud.playIndex === undefined) return;
	const timeStart = new Date().getTime();
  
	/* Get the new active date */
    const acActiveDate = ud.acSeriesDates[ud.playIndex];
    
	/* Update data */
	console.log('Updating data...', acActiveDate);
	hm.showLoading();
	const getAcSeriesDfd = getAcSeries(acActiveDate, ud.acFundSeriesMap.map(x => x.id), ud.fundIdOrderMap);
	
	getAcSeriesDfd.done(function(acSeries) {
		if (acSeries == null) return;
		console.log('acseries', acSeries); 
		/* Update chart data */
		hm.series[0].setData(acSeries);
		
		/* Update chart title*/
		$('#heatmap-subtitle-date').text(moment(acActiveDate).format('MMM D YY'));

		/* Handle pause/unpause */
		//If at end or beginning, auto-pause
		if (ud.playIndex <= 0 ) {
		  ud.playState = 'pause';
		  ud.playIndex = 0;
		}
		else if (ud.playIndex >= ud.acSeriesDates.length - 1) {
		  ud.playState = 'pause';
		  ud.playIndex = ud.acSeriesDates.length - 1;
		}
		else {
		  if (ud.playState === 'forward')  ud.playIndex = ud.playIndex + 5; //skip by week
		  else ud.playIndex = ud.playIndex - 5; //skip by week
		}
		
		updateButtons(ud.playState, ud.playIndex, ud.acSeriesDates);

		/* Hide loading */
		hm.hideLoading(0);
		
		console.log('ud', ud);

		/* Update userdata */
		setData('userData', {...ud, ...{acActiveDate: acActiveDate}});
		
		const timeEnd = new Date().getTime();
		const timeWait = 2000 /*timeEnd - timeStart < 5000 ? 5000 - (timeEnd - timeStart) : 5000*/;
	  
		if (ud.playState !== 'pause') setTimeout(function() {updateHeatmap();}, timeWait);
		return;
	});
	return;
}


function updateButtons(playState, playIndex, acSeriesDates) {
	
	/* Update buttons */
	const buttons = $('#heatmap-subtitle-group').find('button.heatmap-subtitle').removeClass('active').prop('disabled', false).end();
	console.log('updateButtons', playState, playIndex, acSeriesDates.length - 1, buttons);

	if (playIndex === 0) buttons.find('[data-dir="start"],[data-dir="back"]').prop('disabled', true);
	else if (playIndex === acSeriesDates.length - 1) buttons.find('[data-dir="end"],[data-dir="forward"]').prop('disabled', true);
	else if (playState === 'pause') buttons.find('[data-dir="pause"]').addClass('active', true);
	else if (playState === 'back') buttons.find('[data-dir="back"]').addClass('active', true);
	else if (playState === 'forward') buttons.find('[data-dir="forward"]').addClass('active', true);
	else buttons.find('[data-dir="forward"]').addClass('active', true);
}