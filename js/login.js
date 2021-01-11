$(document).ready(function() {
	
	/********** Get scenario values for table **********/
	$('#login-button').on('click', function(e) {
		e.preventDefault();
		const email = $('#inputEmail').val();
		const password = $('#inputPassword').val();
		
		getAJAX('checkLogin', toScript = ['login'], fromAjax = {email : email, password: password}, timeout = 20000).done(function(ajaxRes) {
			console.log(ajaxRes);
			if (JSON.parse(ajaxRes).login.verified === true) window.location.replace('/home');
		});
	});
	

});

