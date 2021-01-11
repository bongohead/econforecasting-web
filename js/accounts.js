$(document).ready(function() {

	/********** Initialize **********/
	$('div.overlay').show();
	const initialize = init(_addDefaultState = function(newData) {
		// @loadInstance gives an indicator of page load: 0 = initial load, 1 = later load
		return {page: {
			useDate: newData.dates[newData.dates.length - 1],
			loadInstance: 0
			}};
	}, true).done((userData) => updateUi(userData));
	
	
	
	/********** Attach Table Event Listener to Expand/Collapse Rows **********/
	$('#accounts-table').on('click', 'a.expandable', function(event) {
		const dt = $('#accounts-table').DataTable();
		const thisRow = dt.row($(this).closest('tr'));
		const thisRowData = thisRow.data();
		let newRowData = thisRowData;
		newRowData['childrenState'] = thisRowData['childrenState'] === 1 ? 0 : 1;
		thisRow.data(newRowData);
		dt.draw();
	});
	
	/********** Attach Table Event Listener to Show/Hide All Accounts **********/
	$('#main').on('click', '#show-all-accounts > label', function(event) {
		const dt = $('#accounts-table').DataTable();
		const showAllAccounts = parseInt($('#show-all-accounts > label.active > input').val());
		dt.rows().every(function (rowIdx, tableLoop, rowLoop) {
			let rowData = this.data();
			rowData.showAllAccounts = showAllAccounts;
			this.data(rowData);
		});
		dt.draw();
		console.log(showAllAccounts);
	});

	
	
	/********** Attach Table Event Listener to Create Editing Modal **********/
	$('#accounts-table').on('click', 'button.edit-account', function(event) {
		const dt = $('#accounts-table').DataTable();
		const thisRowData = dt.row($(this).closest('tr')).data();
		const modal = $('#edit-account-modal');
		$('#edit-account-id').val(thisRowData.id);
		$('#edit-account-name').val(thisRowData.name);
		
		$('#edit-account-parent-id').html(
			dt.rows().data().toArray()
				.map(account =>
					'<option value="'+account.id+'" ' + (account.id === thisRowData.id_path[thisRowData.id_path.length - 2] ? 'selected' : '') + ' ' + (account.id === thisRowData.id ? 'disabled' : '') + '>' + '&nbsp;'.repeat(account.id_path.length) + account.name + '</option>'
				)
				.join('\n')
			);

		$('#edit-account-rel-order').html(
			dt.rows().data().toArray()
			.filter(x => thisRowData.siblings.includes(x.id) || thisRowData.id === x.id) // Get siblings
			.map((x, i) => '<option value="'+(i + 1)+'" ' + (thisRowData.rel_order === i + 1 ? 'selected' : '') + '>' + (i + 1) + '</option>')
			.join('\n')
			);
			
		$('input[name="edit-account-debit-effect"]')
			.each(function() {
				console.log($(this));
				if (parseInt($(this).val()) === thisRowData.debit_effect) {
					$(this).parent('label').addClass('active');
				} else {
					$(this).parent('label').removeClass('active');
				}
			});
		
		// Set default onload toggle for editing modal
		$('#edit-account-is-open').bootstrapToggle(thisRowData.is_open === true ? 'on' : 'off');

		modal.modal('show');
	});
	
	/********** Attach Modal Event Listener to Editing Parents Affect on ID **********/
	$('#edit-account-parent-id').on('change', function(event) {
		const accounts = getData('accounts');
		const thisAccount = accounts.filter(x => x.id === parseInt($('#edit-account-id').val()))[0];
		const newParentAccount = accounts.filter(x => x.id === parseInt($('#edit-account-parent-id').val()))[0];
		//console.log($('#edit-account-id').val(), thisAccount, newParentAccount);
		
		$('#edit-account-rel-order').html(
			seq(1, newParentAccount.children.length + 1).map(i => '<option value ="' + i + '">' + i + '</option>')
			);
	});
		
	/********** Attach Modal Event Listener to Submit Editing Modal **********/
	$('#edit-account-submit').on('click', function(event) {
		console.log('submitted');
		const id = parseInt($('#edit-account-id').val());
		const name = $('#edit-account-name').val();
		const rel_order = parseInt($('#edit-account-rel-order > option:selected').val());
		const parent_id = parseInt($('#edit-account-parent-id > option:selected').val());
		const debit_effect = parseInt($('#edit-account-debit-effect > label.active > input').val());
		const is_open = $('#edit-account-is-open').prop('checked') ? 1 : 0;
		console.log('inputs', id, name, rel_order, parent_id, debit_effect, is_open);
				
		getAJAX('editAccount', toScript = ['updatedAccounts'], fromAjax = {id: id, name: name, rel_order: rel_order, parent_id: parent_id, debit_effect: debit_effect, is_open: is_open}).done(function(ajaxRes) {
			console.log(ajaxRes);
			if (JSON.parse(ajaxRes).updatedAccounts === 1) {
				$('#edit-account-modal').modal('hide');
				$('div.overlay').show();
				init(_addDefaultState = function(newData) {
					return {page: {useDate: newData.dates[newData.dates.length - 1], loadInstance: 1}};
				}, true).done((userData) => updateUi(userData));
			} else {
				$(this).closest('form').find('.invalid-feedback').text('SQL Error').show();
			}
		});
	});
	
	
	
	/********** Attach Button Event Listener to New Account **********/
	$('#add-account-open').on('click', function(event) {
		const modal = $('#add-account-modal');		
		modal.modal('show');
		$('#add-account-parent-id').html(
			getData('accounts')
				.map(account =>
					'<option value="'+account.id+'" >' + '&nbsp;'.repeat(account.id_path.length) + account.name + '</option>'
				)
				.join('\n')
			);

		modal.modal('show');
	});
	
	/********** Attach Modal Event Listener to Editing Parents Effect on Order **********/
	$('#add-account-parent-id').on('change', function(event) {
		const accounts = getData('accounts');
		const newParentAccount = accounts.filter(x => x.id === parseInt($('#add-account-parent-id').val()))[0];			
		$('#add-account-rel-order').html(
			seq(1, newParentAccount.children.length + 1).map(i => '<option value ="' + i + '" ' + (newParentAccount.children.length + 1 === i ? 'selected' : '') + '>' + i + '</option>').join('\n')
			);
	});
	
	/********** Attach Modal Event Listener to Submit New Account **********/
	$('#add-account-submit').on('click', function(event) {
		const form = $(this).closest('form');
		form.find('.is-invalid').removeClass('is-invalid');
		form.find('.invalid-feedback').hide().text('');
		
		/*
		const name_html = $('#add-account-name');
		const parent_id_html = $('#add-account-parent-id > option:selected');
		const rel_order_html = $('#add-account-rel-order > option:selected');
		const debit_effect_html = $('#add-account-debit-effect > label.active > input');
		*/
		
		const name = $('#add-account-name').val();
		const parent_id = parseInt($('#add-account-parent-id > option:selected').val());
		const rel_order = parseInt($('#add-account-rel-order > option:selected').val());
		const debit_effect = parseInt($('#add-account-debit-effect > label.active > input').val());
	
		if (typeof(name) !== 'string' || name.length < 1) {
			$('#add-account-name').addClass('is-invalid');
			form.find('.invalid-feedback').text('Invalid Account Name').show();
			return;
		}
				
		if (typeof(parent_id) !== 'number' || isNaN(parent_id)) {
			$('#add-account-parent-id').addClass('is-invalid');
			form.find('.invalid-feedback').text('Invalid Parent Account').show();
			return;
		}
		if (typeof(rel_order) !== 'number'|| isNaN(rel_order)) {
			$('#add-account-rel-order').addClass('is-invalid');
			form.find('.invalid-feedback').text('Invalid Order').show();
			return;
		}
		if (debit_effect !== 1 && debit_effect !== -1) {
			form.find('.invalid-feedback').text('Choose a Valid Debit Effect').show();
			return;
		}
		console.log('submitted', name, parent_id, rel_order, debit_effect);

		getAJAX('addAccount', toScript = ['addedAccounts'], fromAjax = {name: name, rel_order: rel_order, parent_id: parent_id, debit_effect: debit_effect}).done(function(ajaxRes) {
		console.log(ajaxRes);
			if (JSON.parse(ajaxRes).addedAccounts === 1) {
				$('#add-account-modal').modal('hide');
				$('div.overlay').show();
				init(_addDefaultState = function(newData) {
					return {page: {useDate: newData.dates[newData.dates.length - 1], loadInstance: 1}};
				}, true).done((userData) => updateUi(userData));
			} else {
				form.find('.invalid-feedback').text('SQL Error').show();
			}
		});

	});
	

});


function updateUi(userData) {
	equityId = userData.accounts.filter(x => x.name === 'Equity')[0].id;
	equityBal = userData.dailyBals.filter(x => x.id === equityId).pop().bal + 20000;
	$('#net-worth').html(equityBal.toLocaleString('en-US', {style: 'currency', currency: 'USD'}));
	console.log('equityBal', equityBal);

	drawTable($('#accounts-table'), userData.accounts, userData.dailyBals, userData.dates, userData.page.useDate, userData.page.loadInstance);
	drawChart('accounts-chart-div', userData.accounts, userData.dailyBals, userData.page.loadInstance);
	$('div.overlay').hide();
}


	/********** Code For Creating Rel Orders in JS **********/
	/*
	UPDATE accounts AS a SET
  rel_order = a2.rel_order
FROM (VALUES
  ('Assets', 1),
  ('Equity', 2),
  ('Liabilities', 3)
) as a2(name, rel_order)
WHERE a2.name = a.name;

accounts
		.filter(x => x.id_path.length >= 2)
		.map(account => {
			const info = accounts.filter(x => x.id_path.length >= 2 && x.id_path[x.id_path.length - 2] === account.id_path[account.id_path.length - 2]) // Get siblings
			.sort((a, b) => a.full_order - b.full_order).map((x, i) => ({...x, ...{relOrder: i + 1}})) // Get relative order of siblings
			.filter(x => x.id === account.id)[0]; return `('${info.name}', ${info.relOrder})`
		}).join(',\n')
*/

function drawTable(tbl, accounts, dailyBals, dates, useDate, loadInstance) {

	const lastBals = dailyBals.filter(x => x.date === useDate);
	const lastMonthEndDate = dates.filter(y => new Date(y) <= (new Date(new Date(useDate).getFullYear(), new Date(useDate).getMonth(), 1) - (24*60*60*1000))).pop();
	const lastMonthEndBals = dailyBals.filter(x => x.date === lastMonthEndDate);
	
	const dtData =
		accounts.map(function(account) {
			return {...account, ... {
				showAllAccounts: 0,
				bal: lastBals.filter(x => x.id === account.id)[0].bal,
				childrenState: account.descendants.length > 0 ? (account.id_path.length <= 1 ? 1 : 0) : -1,
				changeThisMonth: lastBals.filter(x => x.id === account.id)[0].bal - lastMonthEndBals.filter(x => x.id === account.id)[0].bal
			}}
		});
		
	// console.log('dtData', dtData);

	if (loadInstance === 0) {
		// On load, sets the initial data -> data gets pushed to table -> table renders data including +/- -> table conducts initial filtration
		// On click, edits table data -> table renders data including +/- -> table conducts initial filtration

		const dtCols =
			[
				{title: 'Row Number', data: 'full_order'},
				{title: 'Children State', data: 'childrenState'},
				{title: 'Nest Level', data: 'nest_level'},
				{title: 'Descendants', data: 'descendants'},
				{title: 'Account', data: null},
				{title: '', data: null},
				{title: '#', data: 'id'},
				{title: 'Balance', data: 'bal'},
				{title: 'Change This Month', data: 'changeThisMonth'}
			].map(function(x, i) {
				return {...x, ...{
					visible: (!['Row Number', 'Descendants', 'Children State', 'Nest Level'].includes(x.title)),
					orderable: false,
					ordering: (x.title === 'Row Number' ? true : false),
					searchable: (x.title === 'Account'),
					type: (x.title === 'Account' ? 'html' : 'num'),
					className: (x.title === 'Account' ? 'dt-left' : 'dt-center'),
					render:
						x.title === 'Account' ? (data, type, row) => {
							/* If row itself has children & children are shown (1) - */
							/* Else if row has children & children are hidden (0) + */
							/* Else if row has no children (-1) */
							return
							'<span style="padding-left: ' + Math.round((row.nest_level - 1) * 15) + 'px">' +
							'<a style="font-size:14px;font-weight:bold" href="transactions?account=' + row.id + '">' +
								row.name +
							'</a>' +
							(row.childrenState === -1 ? '' : ('<a class="expandable" style="cursor:pointer">' + (row.childrenState === 1 ? '<span class="fa fa-minus fa-fw mx-1"></span>' : '<span class="fa fa-plus fa-fw mx-1"></span>') + '</a>'));
						}
						: x.title === '' ? (data, type, row) => (row.id_path.length === 1 ? '<button type="button" class="btn btn-primary btn-sm btn-block" disabled>Edit</button>' : '<button type="button" class="btn btn-primary btn-sm btn-block edit-account">Edit</button>')
						: x.title === 'Balance' ? (data, type, row) => '<span style="font-weight:500">' + data.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) + '</span>'
						: x.title === 'Change This Month' ?  (data, type, row) => '<span class="small">' + data.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) + '</span>'
						: false
				}};
			});
				
		const dt =
			tbl
			.DataTable({
				data: dtData,
				columns: dtCols,
				iDisplayLength: 1000,
				dom:
					"<'row'<'col-6 px-0 justify-content-left d-flex'f><'col-6 toggle-container'>>" +
					"<'row'<'px-0'tr>>" +
					"<'row'<'col-2'i><'col-10 justify-content-end d-flex'B>>", // Flex display needed for right alignment
				buttons: [ // https://datatables.net/reference/option/buttons.buttons
					{extend: 'copyHtml5', text: 'Copy to clipboard', exportOptions: {columns: seq(3, dtCols.length - 1)}, className: 'btn-sm btn-primary btn' },
					{extend: 'csvHtml5', text: 'Export to CSV', exportOptions: {columns: seq(3, dtCols.length - 1)}, className: 'btn-sm btn-primary btn'}
					//{extend: 'excelHtml5', text: 'Export to Excel', exportOptions: {columns: seq(3, dtCols.length - 1)}, className: 'btn-sm'} requires jszip
				],
				order: [[0, 'asc']],
				language: {
					search: '',
					searchPlaceholder: 'Search by Account',
					info: "_START_ - _END_ (_TOTAL_ total rows)"
				},
				//ordering: true,
				paging: false,
				info: false
				})
			.draw();
				
		// Filter: show things with parents that have childrenState = 1, and showAllAccounts = 1 or is_open = 1
		$.fn.dataTable.ext.search.push(function(settings, searchData, rowIndex, originalData, searchCounter) { // https://datatables.net/manual/plug-ins/search
			const ancestorStatuses =
				dt.rows()
				.data()
				.toArray()
				.filter(x => x['descendants'].includes(originalData['id']))
				.map(x => x['childrenState']);
			
			const show = (ancestorStatuses.length === 0 ? true : (ancestorStatuses.every(x => x === 1))) && (originalData.showAllAccounts === 1 || originalData.is_open === true);
			//console.log(originalData['name'], ancestorStatuses, show);
			return(show);
		});
		dt.draw();		
		
	} else if (loadInstance === 1) {
	
		const dt =
			tbl.DataTable()
			.clear()
			.rows.add(dtData) // Add new data
			.draw();

	}
	
	// Reloading data always resets showAllAccounts: 0 // Add justify content end for right alignment
	$('div.toggle-container').html(`
		<div class="input-group input-group-sm my-0 justify-content-end"> 
			<div class="input-group-prepend"><span class="input-group-text">Show All Accounts</div>
			<div class="btn-group btn-group-toggle" data-toggle="buttons" id="show-all-accounts">
				<label class="btn btn-info btn-sm active"><input type="radio" value="1" autocomplete="off">No</label>
				<label class="btn btn-info btn-sm"><input type="radio" value="0" autocomplete="off">Yes</label>
			</div>
		</div>
		`);

	return true;
}




function drawChart(chartId, accounts, dailyBals, loadInstance) {
	
	const accountsByCategory = [
		{category: 'assets', colors: ['forestgreen', 'cadetblue'], accounts: accounts.filter(x => x.name_path[0] === 'Assets' && x.name_path.length === 2)},
		{category: 'liabilities', colors: ['firebrick', 'lightsalmon'], accounts: accounts.filter(x => x.name_path[0] === 'Liabilities' && x.name_path.length === 2)},
		{category: 'equity', colors: ['black'], accounts: accounts.filter(x => x.name_path[0] === 'Equity' && x.name_path.length === 1)}
		]
	//console.log('accountsByCategory', accountsByCategory);
		
	const chartData =
		accountsByCategory.map(function(category) {
			return category.accounts.map(function(account, i) {
				const res = {
					name: account.name,
					visible: true,
					color: (category.accounts.length >= 2 ? gradient.valToColor(i, gradient.create([0,  category.accounts.length - 1], category.colors, 'htmlcolor'), 'rgba') : category.colors[0]),
					lineWidth: (category.category !== 'equity' ? 2 : 5),
					category: category.category,
					type: (category.category !== 'equity' ? 'area' : 'line'),
					stacking: (category.category !== 'equity' ? 'normal' : false),
					stack: (category.category !== 'equity' ? category.category : false),
					data: dailyBals.filter(x => x.id === account.id).map(x => [new Date(x.date).getTime(), x.bal * (category.category === 'liabilities' ? -1 : 1)]);
				}
				return res;
			});
		}).flat();
	//console.log('chartData', chartData);

	if (loadInstance >= 0) {
	// Reload whole chart regardless
		const chartOptions = {
			chart: {
				marginRight: 10,
				backgroundColor: 'rgba(225, 233, 240,.6)',
				plotBackgroundColor: '#FFFFFF',
				plotBorderColor: '#C0C0C0',
				//plotBorderWidth: 1,
				height: 400,
				animation: false
			},
			scrollbar: {
				enabled: false
			},
			credits: {
				enabled: false
			},
			navigator: {
				enabled: false
			},
			exporting :{
				enabled: false
			},
			rangeSelector: {
				enabled: true,
				//buttonTheme: {display: 'none'}
			},
			legend: {
				enabled: false
			},
			xAxis: {
				type: 'datetime',
				dateTimeLabelFormats: { 
					day: "%b %e",
					week: "%b %e",
					month: "%b %Y"
				},
				gridLineWidth: 1,
			},
			yAxis: {
				title: {
					text: ''
				},
				opposite: false
			},
			plotOptions: {
				series: {
				}
			},
			tooltip: {
				formatter: function () {
						text = '';
						for (i = 0; i < this.points.length; i++) {
								text += '<span style="font-weight:bold;color:'+this.points[i].series.color+'">' + this.points[i].series.name + ': </span>' +
								this.points[i].y.toLocaleString('en-US', {style: 'currency',currency: 'USD'}) + '<br>';
						}
						return text;
				},
				shared: true
			},
			series: chartData,
		};
		
		const chart = new Highcharts.stockChart(chartId, chartOptions);
		
	}
	
	return true;
	//chart.xAxis[0].setExtremes(Date.UTC(2009, 12, 31), Date.UTC(2020, 12, 31))
}
