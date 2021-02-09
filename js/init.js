$(document).ready(function() {

	(function(){
		
		const pathname = window.location.pathname;
		
		const navbar = document.querySelector('nav.navbar');

		if (navbar) {
			navbar.querySelectorAll('a').forEach(function(x) {
				if (x.getAttribute('href') == pathname) {
					x.classList.add('activepage');
					x.closest('.dropdown-menu').parentNode.querySelector('a.nav-link').classList.add('activepage');
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
		
		var toastElList = [].slice.call(document.querySelectorAll('.toast'))
		var toastList = toastElList.map(function (toastEl) {
		  return new bootstrap.Toast(toastEl, option)
		})
	})();
	
});






