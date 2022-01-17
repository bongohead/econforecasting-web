window.addEventListener('DOMContentLoaded', () => {
	
	const page_list = [
		{group: 'Interest Rates', fullname: 'Federal Funds Rate (FFR)', url: 'rates-model-ffr'},
		{group: 'Interest Rates', fullname: 'Secured Overnight Financing Rate (SOFR)', url: 'rates-model-sofr'},
		{group: 'Interest Rates', fullname: '3-Month Treasury Yield', url: 'rates-model-treasury-3m'},
		{group: 'Interest Rates', fullname: '6-Month Treasury Yield', url: 'rates-model-treasury-6m'},
		{group: 'Interest Rates', fullname: '1-Year Treasury Yield', url: 'rates-model-treasury-1y'},
		{group: 'Interest Rates', fullname: '2-Year Treasury Yield', url: 'rates-model-treasury-2y'},
		{group: 'Interest Rates', fullname: '5-Year Treasury Yield', url: 'rates-model-treasury-5y'},
		{group: 'Interest Rates', fullname: '10-Year Treasury Yield', url: 'rates-model-treasury-10y'},
		{group: 'Interest Rates', fullname: '20-Year Treasury Yield', url: 'rates-model-treasury-20y'},
		{group: 'Interest Rates', fullname: '30-Year Treasury Yield', url: 'rates-model-treasury-30y'}
	];
	
	// API Basic Configuration Object
	const autocomplete_config = {
		placeHolder: 'Type an variable name (e.g. "Treasury Yield")',
		data: {
			cache: false,
			keys: [...new Set(page_list.map(x => x.group))],
			src: page_list.map(x => ({[x.group]: x.fullname}))
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
	}
	
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
		console.log(event.detail);
		autoCompleteJS.input.value = null;
	});
	
	document.querySelector("#autoComplete").addEventListener("click", function (event) {
		console.log(autoCompleteJS.input.value);
		autoCompleteJS.start(' ');
		autoCompleteJS.input.value = null;
	});
	
	
	
}); 

const getDir = function(page_obj) {
	console.log(page_obj);
}