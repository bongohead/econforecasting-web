const getApi = async function(endpoint, timeout = 10, verbose = false) {
		
	const timerStart = Date.now();
	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), timeout * 1000)
	
	const jwt =  ('; '+document.cookie).split(`; 1gasdog=`).pop().split(';')[0];

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
				return response.text().then(text => {throw new Error(`HTTP error: ${response.status} - ${text}`)})
			}
			clearTimeout(timeoutId);
			if (verbose) console.log('Fetch: '+ (Date.now() - timerStart));
			return response.json();
		});

	return fetchRequest;
}

const getData = function(k) {
	if (sessionStorage.getItem('data') === null) return null;
	const data = JSON.parse(sessionStorage.getItem('data'));
	return data[k];
}
 
const setData = function(k, d) {
	var data;
	if (sessionStorage.getItem('data') === null) data = {};
	else data = JSON.parse(sessionStorage.getItem('data'));
	
	data[k] = d;
	sessionStorage.setItem('data', JSON.stringify(data));
}

const getAllData = function() {
	const raw = sessionStorage.getItem('data');
	const res = isJson(raw) ? JSON.parse(raw) : {};
	return res;
}


const isJson = function (str) { 
	try { 
		return (JSON.parse(str) && !!str); 
	} catch (e) { 
		return false; 
	}
}


const getColorArray = function() {
    return [
		'#0ba828', '#AA4643', '#4572A7', '#80699B', '#3D96AE','#DB843D', '#92A8CD', '#A47D7C', '#B5CA92',"#7cb5ec", "#434348", 
		"#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"
	];
}


function getColor(i) {
	const colors = [
		'#0ba828', '#AA4643', '#4572A7', '#80699B', '#3D96AE','#DB843D', '#92A8CD', '#A47D7C', '#B5CA92',"#7cb5ec", "#434348", 
		"#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"
	];
	return colors[i % colors.length];
 }

const ajaxError = function(e) {

	console.log('Error: ', e);

	document.querySelectorAll('.loader-container > span').forEach(x => {
		x.textContent = 'Sorry, it seems like there was an error loading the data! Please refresh or try back later.'
		return;
	});
	document.querySelectorAll('.loader-container > div').forEach(x => x.style.display = 'none');
	
	return;
}


const init = function() {

	dayjs.extend(window.dayjs_plugin_utc);
	dayjs.extend(window.dayjs_plugin_timezone);
	dayjs.extend(window.dayjs_plugin_minMax);
	dayjs.extend(window.dayjs_plugin_advancedFormat);
	dayjs.extend(window.dayjs_plugin_quarterOfYear);

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

		sidebar.addEventListener('hide.bs.collapse', function (e) {
			const a_el = sidebar.querySelector(`a[href="#${e.target.id}"]`);
			a_el.querySelector('.bi-chevron-right').classList.remove('d-none');
			a_el.querySelector('.bi-chevron-down').classList.add('d-none');

		});

		sidebar.addEventListener('show.bs.collapse', function (e) {
			const a_el = sidebar.querySelector(`a[href="#${e.target.id}"]`);
			a_el.querySelector('.bi-chevron-right').classList.add('d-none');
			a_el.querySelector('.bi-chevron-down').classList.remove('d-none');
		});

		sidebar.querySelectorAll('a:not(.nav-link)').forEach(function(x) {
			if (x.getAttribute('href') == pathname) {
				x.classList.add('activepage');
				const div_el = x.parentElement;
				div_el.classList.add('show');
				const a_el = sidebar.querySelector(`a[href="#${div_el.id}"]`);
				a_el.classList.remove('collapsed');
				a_el.querySelector('.bi-chevron-right').classList.add('d-none');
				a_el.querySelector('.bi-chevron-down').classList.remove('d-none');
				return;
			}
		})

	}


	Highcharts.setOptions({
		chart: {
			style: {
				fontFamily: 'var(--font-family-serif)',
			},
			spacingTop: 15,
            backgroundColor: 'rgba(255, 255, 255, 0)',
			plotBackgroundColor: '#FFFFFF'
		},
		title: {
			align: 'left',
			style: {
				color: 'var(--slate-900)',
				fontSize: '1.1rem',
				fontWeight: 'normal'
			}
		},
		subtitle: {
			align: 'center',
			style: {
				color: '#334155'
			}
		},
		xAxis: {
			lineColor: "var(--slate-800)",
			lineWidth: 2,
			tickColor: "var(--slate-800)",
			tickWidth: 2,
			labels: {
				style: {
					color: 'var(--slate-700)'
				}
			},
			title: {
				style: {
					color: 'var(--slate-700)'
				}
			}
		},
		yAxis: {
			gridLineDashStyle: 'Dot',
			gridLineWidth: 2,
			gridLineColor: "#CEC6B9",
			lineColor: "#CEC6B9",
			minorGridLineColor: "#CEC6B9",
			tickLength: 0,
			tickColor: "#CEC6B9",
			tickWidth: 1,
			labels: {
				style: {
					color: 'var(--slate-700)'
				}
			},
			title: {
				style: {
					color: 'var(--slate-700)'
				}
			},
			opposite: false
		},
		caption: {
			style: {
				fontSize: '.75rem'
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
		legendBackgroundColor: "rgba(0, 0, 0, 0.5)",
		background2: "#505053",
		dataLabelsColor: "#B0B0B3",
		textColor: "#C0C0C0",
		contrastTextColor: "#F0F0F3",
		maskColor: "rgba(255,255,255,0.3)",
		time: {
			getTimezoneOffset: function(timestamp) {
				const zone = 'US/Eastern';
				const timezoneOffset = -dayjs.unix(timestamp/1000).tz(zone).utcOffset();
				return timezoneOffset;
			}
		},
		credits: {
			enabled: false
        },
		lang: {
			rangeSelectorZoom: 'DISPLAY'
		},
		scrollbar: {
			enabled: false
		},
		tooltip: {
			style: {
				fontWeight: 'bolder',
				fontSize: '0.85rem'
			}
		},
		exporting: {
			menuItemDefinitions: {
				downloadPNG: {text: '<i class="bi bi-filetype-png me-1"></i> Image (PNG)'},
				downloadSVG: {text: '<i class="bi bi-filetype-svg me-1"></i> Image (SVG)'},
				downloadPDF: {text: '<i class="bi bi-filetype-pdf me-1"></i> PDF'},
			},
			buttons: {
				contextButton: {
					menuItems: ['downloadPNG', 'downloadSVG', 'downloadPDF'],
					text: `<span class="d-flex align-items-center text-xs"><i class="bi bi-download me-1"></i>EXPORT</span>`,
					useHTML: true,
					symbol: null,
					theme: {
						padding: 6,
						fill: 'var(--sky)',
						r:0,
						style: {fontWeight: 'normal', color: 'var(--slate-100)'},
						states: {
							hover: {
								fill: 'var(--sky-dark)',
								style: {fontWeight: 'normal', color: 'var(--slate-100)'}
							},
							select: {
								fill: 'var(--sky-darker)',
								style: {fontWeight: 'normal', color: 'var(--slate-100)'}
							}
						}
					}
				}
			}
		},
		rangeSelector: {
			enabled: true,
			verticalAlign: 'top',
			buttonSpacing: 0,
			buttonPosition: {
				align: 'center'
			},
			inputEnabled: false,
			inputPosition: {
				align: 'right',
				x: -100
			},	
			buttonTheme: {
				width: '6rem',
				padding: 5,
				fill: 'var(--sky)',
				r: 0,
				style: {fontWeight: 'normal', color: 'var(--slate-100)', fontSize: '.75rem'},
				states: {
					hover: {
						fill: 'var(--sky-dark)',
						style: {fontWeight: 'normal', color: 'var(--slate-100)'}
					},
					select: {
						fill: 'var(--sky-darker)',
						style: {fontWeight: 'normal', color: 'var(--slate-100)'}
					}
				}
			},
			inputBoxBorderColor: 'gray',
			inputStyle: {
				color: 'var(--slate-600)'
			},
			labelStyle: {
				fontSize: '.75rem',
				fontWeight: 'bold',
				color: 'var(--slate-500)',
			}
		}
	});

}


// Decorator to add load el
const withLoader = function(id, fn){
	return function(){
		fn_res = fn.apply(this, arguments);
		document.querySelector(`#${id} > .loader-container`).style.opacity = 0;
		document.querySelector(`#${id} > .loadee-container`).style.opacity = 1;
		return fn_res;
	};
};