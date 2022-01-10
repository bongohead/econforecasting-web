document.addEventListener("DOMContentLoaded", function(event) {

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
	})();
	
	const hc_theme = {
		colors: ['#E10033', '#000000', '#767676', '#E4E4E4'],
		chart: {
		backgroundColor: "#FFF3E6",
			style: {
				fontFamily: 'var(--bs-font-sans-serif)',
				color: '#000000'
			}
		},
		title: {
			align: 'center',
			style: {
				fontFamily: 'var(--bs-font-sans-serif)',
				color: 'var(--bs-cmefi-green)',
				fontSize: '1.2rem'
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
			timezone: 'America/New_York'
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
				fill: 'var(--bs-cmefi-blue)',
				style: {
					color: 'white'
				},
				states: {
					hover: {
						fill: 'var(--bs-cmefi-dark-blue)'
					},
					select: {
						fill: 'var(--bs-cmefi-light-blue)',
						style: {
							color: 'white'
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
});






