$(document).ready(function() {

	(function(){
		
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
		
		
		if (pathname === '/') {
			document.querySelector('nav.navbar').classList.add('justify-content-center');
			document.querySelector('header').style.position = 'relative';
			document.querySelector('nav.navbar > div').classList.add('col-auto');
			document.querySelector('nav.navbar').style.backgroundColor = 'var(--bs-econdgreen)';
			document.querySelector('nav.navbar a.navbar-brand').remove();
			document.querySelectorAll('nav.navbar a.nav-link').forEach(x => x.style.fontSize = '1.1rem');

			const newDiv = document.createElement('div');
			newDiv.classList.add('bg-econgreen');
			const newA = document.createElement('a');
			newA.setAttribute('href', '/');
			const newImg = document.createElement('img');
			newImg.setAttribute('src', '/static/cmefi_full_inverted.png');
			newImg.setAttribute('height', '80');
			newImg.setAttribute('alt', 'Center for Macroeconomic Forecasts & Insights');
			newImg.classList.add('mx-auto');
			newImg.classList.add('d-block');
			newImg.style.imageRendering = '-webkit-optimize-contrast';

			newDiv.appendChild(newA).appendChild(newImg);
			
			document.querySelector('header').insertBefore(newDiv, document.querySelector('nav.navbar'));
			
		}
		
		
		
		// Enables tooltips
		//$('[data-toggle="tooltip"]').tooltip();
		
	})();
	
	Highcharts.setOptions({
		time: {
			timezoneOffset: 5 * 60
		}
	});
	
	Highcharts.theme = {
		colors: ['#E10033', '#000000', '#767676', '#E4E4E4'],
		chart: {
		backgroundColor: "#FFF1E0",
			style: {
				fontFamily: '"Assistant", Arial, "sans-serif"',
				color: '#000000'
			}
		},
		title: {
			align: 'center',
			style: {
				fontFamily: '"Assistant", Arial, "sans-serif"',
				color: '#000000'
			}
		},
		subtitle: {
			align: 'center',
			style: {
				fontFamily: '"Assistant", Arial, "sans-serif"',
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
	// Apply the theme
	Highcharts.setOptions(Highcharts.theme);
	
});






