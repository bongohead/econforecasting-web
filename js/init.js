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

	
});






