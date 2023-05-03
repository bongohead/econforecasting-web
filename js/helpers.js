/*
import dayjs from './libs/dayjs/dayjs'
import utc from './libs/dayjs/utc'
import timezone from './libs/dayjs/timezone'
import Highcharts from './libs/hc/highstock';

dayjs.extend(utc)
dayjs.extend(timezone)

*/

async function getApi(endpoint, timeout = 10, verbose = false) {
		
	const timerStart = Date.now();
	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), timeout * 1000)
	
	const jwt =  ('; '+document.cookie).split(`; 1ma023mb22d1ampz2yzamqldff3=`).pop().split(';')[0];

	const ep = (window.location.href.includes('dev') ? 'https://dev-api.macropredictions.com/external/' : 'https://api.macropredictions.com/external/');

	const fetchRequest = fetch(ep + endpoint, {
			method: 'get',
			headers: new Headers({
				'X-Requested-With': 'XMLHttpRequest',
				'Authorization': 'Bearer ' + jwt
			}),
			// Note: do not pass content-type with formData!
			//body: formData,
			signal: controller.signal  // Eventually migrate to AbortSignal https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout
		}).then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			clearTimeout(timeoutId);
			if (verbose) console.log('Fetch: '+ (Date.now() - timerStart));
			return response.json();
		});

	return fetchRequest;
}

function getData(k) {
	if (sessionStorage.getItem('data') === null) return null;
	const data = JSON.parse(sessionStorage.getItem('data'));
	return data[k];
}
 
function setData(k, d) {
	var data;
	if (sessionStorage.getItem('data') === null) data = {};
	else data = JSON.parse(sessionStorage.getItem('data'));
	
	data[k] = d;
	sessionStorage.setItem('data', JSON.stringify(data));
}

function getAllData() {
	const raw = sessionStorage.getItem('data');
	const res = isJson(raw) ? JSON.parse(raw) : {};
	return res;
}


function setAllData(data) {
	sessionStorage.setItem('data', JSON.stringify(data));
}

function modifyData(data = {}) {
	const newData = $.extend(true, getAllData(), data);
	setAllData(newData);
	return newData;
}

function isJson(str) { 
	try { 
		return (JSON.parse(str) && !!str); 
	} catch (e) { 
		return false; 
	}
}


function getColorArray() {
    return ['#4572A7', '#AA4643', '#0ba828', '#80699B', '#3D96AE','#DB843D', '#92A8CD', '#A47D7C', '#B5CA92',"#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"];
}

function ajaxError(e) {
	console.log('Error: ', e);
	/*
	document.querySelector('#overlay .spinner-border').style.display = 'none';
	document.querySelector('#overlay h4').textContent = 'Sorry, it seems like there was an error loading the data! Please refresh or try back later.';
	*/
	document.querySelectorAll('.loader-container > span').forEach(x => {
		x.textContent = 'Sorry, it seems like there was an error loading the data! Please refresh or try back later.'
		return;
	});
	document.querySelectorAll('.loader-container > div').forEach(x => x.style.display = 'none');
	
	return;
}


function init() {

	dayjs.extend(window.dayjs_plugin_utc);
	dayjs.extend(window.dayjs_plugin_timezone);
	dayjs.extend(window.dayjs_plugin_minMax);
	dayjs.extend(window.dayjs_plugin_advancedFormat);

	const pathname = window.location.pathname;
	const navbar = document.querySelector('nav.navbar');

	if (navbar) {
		navbar.querySelectorAll('a').forEach(function(x) {
			if (x.getAttribute('href') == pathname) {
				x.classList.add('activepage');
				if (x.closest('.dropdown-menu')) {
					x.closest('.dropdown-menu').parentNode.querySelector('a.nav-link').classList.add('activepage');
				}
				};
			return;
		});
	}
	
	const sidebar = document.querySelector('nav.sidebar');
	if (sidebar) {
		sidebar.querySelectorAll('a').forEach(function(x) {
			if (x.getAttribute('href') == pathname) x.classList.add('activepage');
			return;
		})
	}

	Highcharts.setOptions({
		chart: {
			style: {
				fontFamily: 'var(--bs-font-sans-serif)',
			}
		},
		title: {
			align: 'center',
			style: {
				fontFamily: 'var(--bs-font-sans-serif)',
				color: 'var(--slate-900)',
				fontSize: '1.1rem',
				fontWeight: 'bolder'
			}
		},
		subtitle: {
			align: 'center',
			style: {
				fontFamily: 'var(--bs-font-sans-serif)',
				color: '#000000'
			}
		},
		xAxis: {
			lineColor: "#000000",
			lineWidth: 2,
			tickColor: "#000000",
			tickWidth: 2,
			labels: {
				style: {
					color: "black"
				}
			},
			title: {
				style: {
					color: "black"
				}
			}
		},
		yAxis: {
			gridLineDashStyle: 'Dot',
			gridLineWidth: 2,
			gridLineColor: "#CEC6B9",
			lineColor: "#CEC6B9",
			minorGridLineColor: "#CEC6B9",
			labels: {
				style: {
					color: "black"
				}
			},
			tickLength: 0,
			tickColor: "#CEC6B9",
			tickWidth: 1,
			title: {
				style: {
					color: "black"
				}
			}
		},
		legend: {
			layout: "horizontal",
			align: "left",
			verticalAlign: "top",
			itemStyle: {
				color: "#3C3C3C"
			}
		},
		credits: {
			style: {
				color: "#666"
			}
		},
		labels: {
			style: {
				color: "#D7D7D8"
			}
		},
		navigation: {
			buttonOptions: {
				symbolStroke: "#DDDDDD",
				theme: {
					fill: "#505053"
				}
			}
		},
		legendBackgroundColor: "rgba(0, 0, 0, 0.5)",
		background2: "#505053",
		dataLabelsColor: "#B0B0B3",
		textColor: "#C0C0C0",
		contrastTextColor: "#F0F0F3",
		maskColor: "rgba(255,255,255,0.3)",

		time: {
			getTimezoneOffset: function(timestamp) {
				const zone = 'US/Eastern';
            	// const timezoneOffset = -moment.tz(timestamp, zone).utcOffset();
				const timezoneOffset = -dayjs.unix(timestamp/1000).tz(zone).utcOffset();
				return timezoneOffset;
			}
		},
		credits: {
			enabled: true,
			text: 'econforecasting.com',
			href: 'https://econforecasting.com'
        },
		lang: {
			rangeSelectorZoom: 'Display:'
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
				fill: 'var(--sky-light)',
				style: {
					color: 'white'
				},
				states: {
					hover: {
						fill: 'var(--sky-dark)',
						style: {
							transition: '.2s'
						}
					},
					select: {
						fill: 'var(--sky)',
						style: {
							color: 'white',
							fontWeight: 'normal',
							transition: '.5s'
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

}


// Decorator to add load el
function withLoader(id, fn){
	return function(){
		fn_res = fn.apply(this, arguments);
		document.querySelector(`#${id} > .loader-container`).style.opacity = 0;
		document.querySelector(`#${id} > .loadee-container`).style.opacity = 1;
		return fn_res;
	};
};