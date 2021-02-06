$(document).ready(function() {

	(function(){
		
		const pathname = window.location.pathname;
		
		const navbar = document.querySelector('nav.navbar');

		if (navbar) {
			navbar.querySelectorAll('a').forEach(function(x) {
				if (x.getAttribute('href') == pathname) {
					x.classList.add('activepage');
					if (x.parentElement.parentElement.classList.contains('dropdown-menu')) {
						x.parentElement.parentElement.parentElement.childNodes[1].classList.add('activepage');
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
		// Enables tooltips
		//$('[data-toggle="tooltip"]').tooltip();
	})();
	
});






