$(document).ready(function() {

	(function(){
		
		var pathname = window.location.pathname;
			
		/* Highlights navigation bar menu item if it's active */
		$("#header > .nav-item > a").each(function(){
			var a = $(this);
			var link = a.attr("href");
			if (link == pathname) a.addClass('active');
		});
		
		// Enables tooltips
		$('[data-toggle="tooltip"]').tooltip();
	})();
	
});


/*** Loads initial data ***/
/*
	This function returns/modifies the sessionStorage userData.
	@_addDefaultState (function) that takes returned newData0 and returns an object of state values to set on initial page load, these will be appended to userData
	@_forceReload (boolean) that forces a reload of models, scenarios, params
*/
function init (_addDefaultState = (newData0) => ({}), _forceReload = false) {
	
	// Create new promise for full function
	const initDfd = $.Deferred();
	// First get user data
	const userData = getAllData();
	
	// Now create secondary deferred object for getting data
	const getNewData = $.Deferred(function(getNewDataDfd) {
		// Skip if: _forceReload = TRUE, userData has never been set, or data has already been updated within last 5 minutes
		if (_forceReload === false && !$.isEmptyObject(userData) && new Date() - new Date(userData.lastUpdated) <= 5 * 60 * 1000) {
			console.log('Recycling userData');
			const newData = userData;
			getNewDataDfd.resolve(userData);
		}
		else {
			const getAccounts = $.Deferred(function(dfd) {
				getAJAX('getAccounts', toScript = ['accounts']).done(function(ajaxRes) {
					// Recursive CTE already returns the correct order [descendants immediately following their parents]
					const accounts0 =
						JSON.parse(ajaxRes).accounts
						.map(function(x, i) {
							x.id_path = x.id_path.split(' > ').map(x => parseInt(x));
							x.name_path = x.name_path.split(' > ');
							x.full_order = i;
						 return x;
						});

					// Get family relations	
					const accounts =
						accounts0.map(function(x) {
							x.children = accounts0.filter(y => y.id !== x.id && y.id_path[y.id_path.length - 2] === x.id).map(y => y.id);
							x.siblings = accounts0.filter(y => y.id_path.length >= 2 && y.id !== x.id && y.id_path[y.id_path.length - 2] === x.id_path[x.id_path.length - 2]).map(y => y.id); // Get siblings
							x.parent = x.id_path[x.id_path.length - 2];
							x.descendants = accounts0.filter(y => y.id !== x.id && y.id_path.includes(x.id)).map(y => y.id);
							return(x);
						});
					dfd.resolve({accounts: accounts});
				});
				return dfd.promise();
			});
			
			const getTransactions = $.Deferred(function(dfd) {
				getAJAX('getTransactions', toScript = ['transactions']).done(function(ajaxRes) {
					const transactions = JSON.parse(ajaxRes).transactions.map(function(x) {
						x.date = (x.date);
						x.value = parseFloat(x.value);
						return x;
					});
					dfd.resolve({transactions: transactions});
				});
				return dfd.promise();
			});
			
			
			// Get all sim runs & active sim run
			const calculateBalances = $.Deferred(function(dfd) {
				$.when(getAccounts, getTransactions).done(function(r1, r2) {
					const accounts = r1.accounts;
					const transactions = r2.transactions;
					const dates = [...new Set(transactions.map(x => x.date))];
					
					// Get daily credit & debit changes at all dates (does not sum up to top-level elements)
					const dailyBalChangeNested = dates.map(function(date) {
						const dailyTransactions = transactions.filter(x => x.date === date);
						const res =
							accounts.map(function(account) {
							return {
								id: account.id,
								descendants: account.descendants,
								debit: dailyTransactions.filter(x => x.debit === account.id).map(x => x.value).reduce((a, b) => a + b, 0),
								credit: dailyTransactions.filter(x => x.credit === account.id).map(x => x.value).reduce((a, b) => a + b, 0)
								}
							});
						return (res);
					});
					
					// Sum up to top-level elements
					const dailyBalChange0 = dailyBalChangeNested.map(function(accountsByDate) {
						return accountsByDate.map(function(account) {
							return {
								id: account.id,
								descendants: account.descendants,
								// Sum up over debit/credit values of descendants
								debit: account.debit + accountsByDate.filter(x => account.descendants.includes(x.id)).map(x => x.debit).reduce((a, b) => a + b, 0),
								credit: account.credit + accountsByDate.filter(x => account.descendants.includes(x.id)).map(x => x.credit).reduce((a, b) => a + b, 0)
							}
						});
					});
					
					
					// Get daily balances instead of debit/credit daily change -> accounts and dates indices must be same in dailyBalChange as in date and accounts constants
					let dailyBals = dailyBalChange0;
					for (d = 0; d < dates.length; d++) {
						for (a = 0; a < accounts.length; a++) {
							dailyBals[d][a].debit = Math.round(((d > 0 ? dailyBals[d - 1][a].debit : 0) + dailyBalChange0[d][a].debit) * 100)/100
							dailyBals[d][a].credit = Math.round(((d > 0 ? dailyBals[d - 1][a].credit : 0) + dailyBalChange0[d][a].credit) * 100)/100
							dailyBals[d][a].bal = Math.round((dailyBals[d][a].debit * accounts[a].debit_effect + dailyBals[d][a].credit * accounts[a].debit_effect * -1) * 100)/100;
							dailyBals[d][a].balChange = Math.round((dailyBals[d][a].bal - (d > 0 ? dailyBals[d - 1][a].bal : 0)) * 100)/100;
							dailyBals[d][a].date = dates[d];
						}
					}
					dailyBals = dailyBals.flat(1);
					dfd.resolve({dailyBals: dailyBals, dates: dates});
				});
				return dfd.promise();
			});


			// Finally update user data and UI
			$.when(getAccounts, getTransactions, calculateBalances).done(function(r1, r2, r3) {
				const newData = $.extend(true, r1, r2, r3, {lastUpdated: new Date()});
				getNewDataDfd.resolve(newData);
			});

		}
		return getNewDataDfd.promise();
	});
	
	
	// Once new data has been pulled, merge it with the default state variables, store the result in sessionStorage and set the UI
	$.when(getNewData).done(function(newData) {
		const finalData = $.extend(true, newData, _addDefaultState(newData));

		setAllData(finalData);
		const accountsSidebarHtml =
			finalData.accounts.map(account => 
				'<a class="list-group-item list-group-item-action bg-none py-1 text-truncate" href="/transactions?account=' + account.id + '">' +
					'<span class="menu-collapsed" style="margin-left: ' + Math.round((account.nest_level - 1) * 1) + 'rem">' +  account.name /*(account.name.length >= 25 ? account.name.substr(0, 25) + '...' : account.name)*/ + '</span>' +
				'</a>'
			).join('\n');
			
		$(accountsSidebarHtml).appendTo('#transactions-links')
			/*
			$(`<a class="list-group-item list-group-item-action bg-none" href="/transactions?id=${account.id}"><span class="menu-collapsed">${name}</span></a>`)
				.appendTo('#transactions-links')
*/
		//$('#model-selected').text('Active Model: ' + finalData.activeModel.name);
		/*
		$.map(finalData.scenarios, function(scenario, index) {
			$(`<a class="list-group-item list-group-item-action bg-none" href="/scenario?id=${scenario.id}"><span class="menu-collapsed">${scenario['long_name']}</span></a>`)
				.appendTo('#sc-list')
		});
		*/
		
		// Copy sidebar to navbar
		/*
		const sidebar = $('nav.sidebar');
		sidebar.find('ul > a')
		$('#sidebar-replacement-div')
		
		<a class="dropdown-item" href=""> Action</a>
		*/
		const accountsNavbarHtml =
			finalData.accounts.map(account => 
				'<a class="dropdown-item" href="/transactions?account=' + account.id + '">' +
					'<span style="margin-left: ' + Math.round((account.nest_level - 1) * 1) + 'rem">' +  account.name + '</span>' +
				'</a>'
			).join('\n');
		$('#navbar-detailed-accounts').html(accountsNavbarHtml);

		
		console.log('finalData', finalData);

		initDfd.resolve(finalData);
	});
	
	return initDfd.promise();
}







