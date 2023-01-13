/*
import dayjs from './libs/dayjs/dayjs'
import timezone from './libs/dayjs/timezone'
import utc from './libs/dayjs/utc'
import Highcharts from './libs/highcharts/highstock';

dayjs.extend(utc)
dayjs.extend(timezone)
*/

async function getApi(endpoint, timeout = 10, verbose = false) {
		
	const timerStart = Date.now();
	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), timeout * 1000)
	
	const jwt =  ('; '+document.cookie).split(`; 1ma023mb22d1ampz2yzamqldff2=`).pop().split(';')[0];

	const fetchRequest = fetch('https://api.econscale.com/v0/' + endpoint, {
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
	document.querySelector('#overlay .spinner-border').style.display = 'none';
	document.querySelector('#overlay h4').textContent = 'Sorry, it seems like there was an error loading the data! Please refresh or try back later.';
	return;
}


function init() {

	dayjs.extend(window.dayjs_plugin_utc);
	dayjs.extend(window.dayjs_plugin_timezone);
	dayjs.extend(window.dayjs_plugin_minMax);

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

	const hc_theme = {
		chart: {
			style: {
				fontFamily: 'var(--bs-font-sans-serif)',
				color: '#000000'
			}
		},
		title: {
			align: 'center',
			style: {
				fontFamily: 'var(--bs-font-sans-serif)',
				color: 'var(--bs-dark)',
				fontSize: '1.1rem'
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
		tooltip: {
			backgroundColor: "#FFFFFF",
			borderColor: "#76c0c1",
			style: {
				color: "#000000"
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
		maskColor: "rgba(255,255,255,0.3)"
	};
	
	Highcharts.setOptions({
		chart: {
			style: {
				fontFamily: 'var(--bs-font-sans-serif)'
			}
		},
		time: {
			//timezone: 'America/New_York'
			getTimezoneOffset: function(timestamp) {
				const zone = 'US/Eastern';
            	// const timezoneOffset = -moment.tz(timestamp, zone).utcOffset();
				const timezoneOffset = -dayjs.unix(timestamp).tz(zone).utcOffset();
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
				fill: 'var(--bs-sky-light)',
				style: {
					color: 'white'
				},
				states: {
					hover: {
						fill: 'var(--bs-sky-dark)',
						style: {
							transition: '.2s'
						}
					},
					select: {
						fill: 'var(--bs-sky)',
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
	// Apply the theme
	Highcharts.setOptions(hc_theme);


}