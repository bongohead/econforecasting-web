document.addEventListener('DOMContentLoaded', function() {

	
	const page_list = [
		{group: 'Interest Rates', fullname: 'Federal Funds Rate (FFR)', url: 'forecast/ffr'},
		{group: 'Interest Rates', fullname: 'Secured Overnight Financing Rate (SOFR)', url: 'forecast/sofr'},
		{group: 'Interest Rates', fullname: 'AMERIBOR Overnight Rate', url: 'forecast/ameribor'},
		{group: 'Interest Rates', fullname: 'Sterling Overnight Rate (SONIA)', url: 'forecast/sonia'},
		{group: 'Interest Rates', fullname: 'Euro Short-Term Rate (ESTR)', url: 'forecast/estr'},
		{group: 'Interest Rates', fullname: 'Euribor 3-Month Rate', url: 'forecast/euribor03m'},
		{group: 'Interest Rates', fullname: 'Bank of England Base Rate', url: 'forecast/ukbankrate'},

		{group: 'Interest Rates', fullname: 'Treasury Yield Curve', url: 'treasury-curve'},
		{group: 'Interest Rates', fullname: '1-Month Treasury Yield', url: 'forecast/t01m'},
		{group: 'Interest Rates', fullname: '2-Month Treasury Yield', url: 'forecast/t02m'},
		{group: 'Interest Rates', fullname: '3-Month Treasury Yield', url: 'forecast/t03m'},
		{group: 'Interest Rates', fullname: '6-Month Treasury Yield', url: 'forecast/t06m'},
		{group: 'Interest Rates', fullname: '1-Year Treasury Yield', url: 'forecast/t01y'},
		{group: 'Interest Rates', fullname: '2-Year Treasury Yield', url: 'forecast/t02y'},
		{group: 'Interest Rates', fullname: '5-Year Treasury Yield', url: 'forecast/t05y'},
		{group: 'Interest Rates', fullname: '10-Year Treasury Yield', url: 'forecast/t10y'},
		{group: 'Interest Rates', fullname: '20-Year Treasury Yield', url: 'forecast/t20y'},
		{group: 'Interest Rates', fullname: '30-Year Treasury Yield', url: 'forecast/t30y'},
		{group: 'Interest Rates', fullname: '10 Year - 2 Year Treasury Spread', url: 'forecast/t10yt02yspread'},
		{group: 'Interest Rates', fullname: '10 Year - 3 Month Treasury Spread', url: 'forecast/t10yt03mspread'},

		{group: 'Interest Rates', fullname: 'Real Treasury Curve (TIPS Curve)', url: 'real-treasury-curve'},
		{group: 'Interest Rates', fullname: '3-Month Real Treasury Yield', url: 'forecast/rt03m'},
		{group: 'Interest Rates', fullname: '6-Month Real Treasury Yield', url: 'forecast/rt06m'},
		{group: 'Interest Rates', fullname: '1-Year Real Treasury Yield', url: 'forecast/rt01y'},
		{group: 'Interest Rates', fullname: '2-Year Real Treasury Yield', url: 'forecast/rt02y'},
		{group: 'Interest Rates', fullname: '5-Year Real Treasury Yield', url: 'forecast/rt05y'},
		{group: 'Interest Rates', fullname: '10-Year Real Treasury Yield/TIPS', url: 'forecast/rt10y'},
		{group: 'Interest Rates', fullname: '20-Year Real Treasury Yield/TIPS', url: 'forecast/rt20y'},
		{group: 'Interest Rates', fullname: '30-Year Real Treasury Yield/TIPS', url: 'forecast/r30y'},
		{group: 'Interest Rates', fullname: 'Real 10 Year - 2 Year Treasury Spread', url: 'forecast/rt10yt02yspread'},

		{group: 'Interest Rates', fullname: '30-Year US Fixed-Rate Mortgage Rate', url: 'forecast/mort30y'},
		{group: 'Interest Rates', fullname: '15-Year US Fixed-Rate Mortgage Rate', url: 'forecast/mort15y'},
		{group: 'Interest Rates', fullname: '30-Year Mortgage Spread', url: 'forecast/mort30yt10yspread'},

		{group: 'US Macro', fullname: 'CPI Inflation', url: 'forecast/cpi'},
		
	];
	
	// API Basic Configuration Object
	const autocomplete_config = {
		placeHolder: 'Type an economic variable name (e.g. "mortgage rate")',
		data: {
			cache: false,
			// Weird bug - can't be empty 
			src: page_list.map(x => ({[x.group]: x.fullname})),
			keys: [...new Set(page_list.map(x => x.group))]
		},
		wrapper: false,
		resultsList: {
			tag: "ul",
			id: "autoComplete_list",
			class: "results_list",
			destination: "#autoComplete",
			position: "afterend",
			maxResults: 5,
			noResults: true
		},
		resultItem: {
			element: (item, data) => {
				item.style = "display: flex; justify-content: space-between;";
				item.innerHTML = `
				<span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">${data.match}</span>
				<span style="display: flex; align-items: center; font-size: 13px; font-weight: 100; text-transform: uppercase; color: rgba(0,0,0,.2);">
					${data.key}
				</span>`;
				
			},
			highlight: {
				render: true
			}
		}
	};
	
	const autoCompleteJS = new autoComplete(autocomplete_config);
	
	autoCompleteJS.input.addEventListener("selection", function (event) {
		const feedback = event.detail;
		autoCompleteJS.input.blur();
		const selection = feedback.selection.value[feedback.selection.key];
		autoCompleteJS.input.value = selection;
		getDir(page_list.filter(x => x.fullname == selection)[0]);
	});
	
	document.querySelector("#autoComplete").addEventListener("close", function (event) {
		// "event.detail" carries the autoComplete.js "feedback" object
		// console.log(event.detail);
		autoCompleteJS.input.value = null;
	});
	
	document.querySelector("#autoComplete").addEventListener("click", function (event) {
		autoCompleteJS.start(' ');
		autoCompleteJS.input.value = null;
	});
	
	
	
}); 

const getDir = function(page_obj) {
	window.location.href = (page_obj.url);
}