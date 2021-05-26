$(document).ready(function() {
/* ac-assets.js and ac-regions.js are the same except for initialization */

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
					usage: 'reg'
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
		const getAcIndexDfd = getAcIndex(usage = ud.usage);

		$.when(getAcIndexDfd).done(function(acIndex) {
			setData(
				'userData',
				{
					...getData('userData'),
					...{
						acIndex: acIndex
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
		drawChart(ud.acIndex);
		drawTable(ud.acIndex);
		$('#overlay').hide();
	});
	
	
});


/*** Get index data ***/
function getAcIndex(usage) {
	const dfd = $.Deferred();
	getAJAX('getAcIndex', toScript = ['acIndex'], fromAjax = {usage: usage}).done(function(ajaxRes) {
		const acIndex = JSON.parse(ajaxRes).acIndex;
		dfd.resolve(acIndex);
		});
	return dfd.promise();
}

/*** Draw chart ***/
function drawChart(acIndex) {
	console.log('acIndex', acIndex);
	
	const acIndexParsed =
		acIndex.map(function(x) {
			const z = {
				x: parseInt(moment(x.date).format('x')),
				y: parseFloat(x.value) * 100;
			};
			return z;
		});
	
	const o = {
        chart: {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            marginRight: 50,
            marginLeft: 50
        },
        credits: {
            enabled: false  
        },
        title: {
            text: 'Cross-Region Correlation Index'
        },
		subtitle: {
			text: 'Last updated ' + moment(acIndex[acIndex.length - 1].date).format('MM/DD/YYYY')
		},
		caption: {
			text: 'Shaded areas indicate recessions'
		},
        plotOptions: {
			series: {
				dataGrouping: {
					enabled: true,
					units: [['day', [1]]]
				}
				/*
				cursor: 'pointer',
				point: {
					events: {
						click: function () {
							var data = getData();
							var d = new Date(this.x).toISOString().split('T')[0];
							if (data.hmDates.indexOf(d) === -1) return;
							
							$.extend(true,data,{
								"playIndex": data.hmDates.indexOf(d),
								"playState": "pause"
							});
							setData(data);

							updateCharts($('#heatmap').highcharts(),this.series.chart);
						}
					}
				}
				*/
			}
        },
        tooltip: {
            useHTML: true,
            formatter: function () {
                return '<h6 class="text-center;" style="font-weight:bold">'+ Highcharts.dateFormat('%b \ %e \ %Y', this.points[0].x) + '</h6></br>' +
                'Asset Correlation Index: ' + Highcharts.numberFormat(this.points[0].y,4);
            },
            shared: true
        },
        yAxis: {
            /*max: 1,//max,
            min: -1,//min,
			*/
            startOnTick: false,
            endOnTick: false,
            opposite:false,
            showLastLabel: true,
            labels: {
                formatter: function () {
                    return this.value.toFixed(1);
                }
            }/*,
            plotLines: [{
                value: 0,
                width: 1,
                color: 'black',
                dashStyle: 'Dash',
                zIndex: 2
                },{
                value: 1,
                width: 1,
                color: 'rgba(10, 24, 66,1)',
                zIndex: 5
                },{
                value: -1,
                width: 1,
                color: 'rgba(10, 24, 66,1)',
                zIndex: 5
                }
            ]*/
        },
        xAxis: {
            dateTimeLabelFormats: {
                day: "%m-%d-%Y",
                week: "%m-%d-%Y"
            },
			plotBands: [{
				color: '#ffd9b3',
				from: Date.UTC(2020, 2, 1),
				to: Date.UTC(2021, 2, 1)
			}]
        },
        navigator: {
            enabled: false
        },
        series: [{
            data: acIndexParsed,
            turboThreshold: 0,
            id: 's01',
            type: 'line',
            color: '#333',
            marker: {
                enabled: false
            },
            zIndex: 1,

        }]
	};
		
		
	const chart = Highcharts.stockChart('chart-container', o);
	return;
}


function drawTable(acIndex) {
	
	const acIndexParsed =
		acIndex.map(function(x) {
			const z = {
				x: x.date,
				y: parseFloat(x.value) * 100;
			};
			return z;
		});

	
	const dtCols =
		[
			{title: 'Date', data: 'date'},
			{title: 'Index Value', data: 'value'},
		].map(function(x, i) {
			return {...x, ...{
				visible: true,
				orderable: true,
				ordering: true,
				type: (x.title === 'Date' ? 'date' : 'num'),
				className: 'dt-center'
			}};
		});
		
	const o = {
		data: acIndex,
		columns: dtCols,
		iDisplayLength: 50,
		dom:
			"<'row justify-content-end'<'col-auto'B>>" +
			"<'row justify-content-center'<'col-auto'tr>>" +
			"<'row justify-content-end'<'col-auto'p>>",
		buttons: [
			{extend: 'copyHtml5', text: 'Copy', exportOptions: {columns: [0, 1]}, className: 'btn btn-sm btn-secondary'},
			{extend: 'csvHtml5', text: 'Download', exportOptions: {columns: [0, 1]}, className: 'btn btn-sm btn-secondary'}
		],
		order: [[0, 'asc']],
		language: {
			search: "",
			searchPlaceholder: "Filter by description",
			info: "_START_ - _END_ (_TOTAL_ total dates)"
		},
		order: [[0, 'desc']],
		paging: true,
		info: true
	}
	
	$('#table-container').DataTable(o).draw();
	return;
}

