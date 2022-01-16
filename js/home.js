window.addEventListener('DOMContentLoaded', () => {
	
	const page_list = [
		{group: 'Interest Rates', fullname: 'Federal Funds Rate (FFR)', url: 'rates-model-ffr'},
		{group: 'Interest Rates', fullname: 'Secured Overnight Financing Rate (SOFR)', url: 'rates-model-sofr'}
	];
	
	// API Basic Configuration Object
	const autocomplete_config = {
		placeHolder: "Search for Economic Variables...",
		data: {
			keys: [...new Set(page_list.map(x => x.group))],
			src: page_list.map(x => ({[x.group]: x.fullname}))
		},
		resultsList: {
			tag: "ul",
			id: "autoComplete_list",
			class: "results_list",
			destination: "#autoComplete",
			position: "afterend",
			maxResults: 5,
			noResults: true,
			element: (list, data) => {
				list.setAttribute("data-parent", "food-list");
			},
		},
		resultItem: {
			highlight: {
				render: true
			}
		}
	}
	
	const autoCompleteJS = new autoComplete(autocomplete_config);
	
	autoCompleteJS.input.addEventListener("selection", function (event) {
		const feedback = event.detail;
		autoCompleteJS.input.blur();
		// Prepare User's Selected Value
		const selection = feedback.selection.value[feedback.selection.key];
		// Render selected choice to selection div
		// document.querySelector(".selection").innerHTML = selection;
		// Replace Input value with the selected value
		autoCompleteJS.input.value = selection;
		// Console log autoComplete data feedback
		//console.log(feedback);
		getDir(page_list.filter(x => x.fullname == selection)[0]);
	});
	
	
}); 

const getDir = function(page_obj) {
	console.log(page_obj);
}