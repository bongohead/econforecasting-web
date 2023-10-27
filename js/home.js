init();

document.addEventListener('DOMContentLoaded', function() {
	
	const page_list = [
		{group: 'Forecast', fullname: 'Federal Funds Rate (FFR)', url: 'forecast-ffr'},
		{group: 'Forecast', fullname: 'Secured Overnight Financing Rate (SOFR)', url: 'forecast-sofr'},
		{group: 'Forecast', fullname: '3-Month Treasury Yield', url: 'forecast-t03m'},
		{group: 'Forecast', fullname: '6-Month Treasury Yield', url: 'forecast-t06m'},
		{group: 'Forecast', fullname: '1-Year Treasury Yield', url: 'forecast-t01y'},
		{group: 'Forecast', fullname: '2-Year Treasury Yield', url: 'forecast-t02y'},
		{group: 'Forecast', fullname: '5-Year Treasury Yield', url: 'forecast-t05y'},
		{group: 'Forecast', fullname: '10-Year Treasury Yield', url: 'forecast-t10y'},
		{group: 'Forecast', fullname: '20-Year Treasury Yield', url: 'forecast-t20y'},
		{group: 'Forecast', fullname: '30-Year Treasury Yield', url: 'forecast-t30y'},
		{group: 'Forecast', fullname: '30-Year Mortgage Rate', url: 'forecast-mort30y'},
		{group: 'Forecast', fullname: '15-Year Mortgage Rate', url: 'forecast-mort15y'},
		{group: 'Forecast', fullname: 'BSBY Rate', url: 'forecast-bsby'},
		{group: 'Forecast', fullname: 'AMERIBOR', url: 'forecast-ameribor'},
		{group: 'Forecast', fullname: 'Sterling Overnight Rate (SONIA)', url: 'forecast-sonia'},
		{group: 'Forecast', fullname: 'Euro Short-Term Rate (ESTR)', url: 'forecast-estr'},
		{group: 'Forecast', fullname: 'Bank of England Base Rate', url: 'forecast-ukbankrate'},

		{group: 'US Economy', fullname: 'Gross Domestic Product (GDP)', url: 'forecast-gdp'},
		{group: 'US Economy', fullname: 'Personal Consumption (PCE)', url: 'forecast-pce'},
		
		{group: 'Sentiment', fullname: 'Social Media Financial Sentiment Index', url: 'sentiment'},
		{group: 'Sentiment', fullname: 'Traditional Media Financial Sentiment Index', url: 'sentiment'},
		{group: 'Sentiment', fullname: 'Social Media Labor Market Sentiment Index', url: 'sentiment'},
		{group: 'Sentiment', fullname: 'Social Media News Sentiment Index', url: 'sentiment'}
		
	];
	
	// API Basic Configuration Object
	const autocomplete_config = {
		placeHolder: 'Type an economic variable name (e.g. "Treasury Yield")',
		data: {
			cache: false,
			// Weird bug - can't be empty 
			src: page_list.map(x => ({'Forecast': 'poop', 'US Economy': 'poop', 'Sentiment': 'poop', ...{[x.group]: x.fullname}})),
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
		//console.log(autoCompleteJS.input.value);
		autoCompleteJS.start(' ');
		autoCompleteJS.input.value = null;
	});
	
	
	
}); 

const getDir = function(page_obj) {
	// Simulate an HTTP redirect:
	// console.log('clicked', page_obj);

	window.location.replace(page_obj.url);
	//window.location.href = page_obj.url
}