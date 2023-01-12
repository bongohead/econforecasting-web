async function getApi(endpoint, timeout = 10, verbose = false) {
		
	const timerStart = Date.now();
	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), timeout * 1000)
	
	const jwt =  ('; '+document.cookie).split(`; 1ma023mb22d1ampz2yzamqldff2=`).pop().split(';')[0];

	const fetchRequest = fetch('https://api.econscale.com/v0/' + endpoint, {
			method: 'get',
			headers: new Headers({
				'X-Requested-With': 'XMLHttpRequest',
				'Authorization': 'Bearer ' + jwt
			}),
			// Note: do not pass content-type with formData!
			//body: formData,
			signal: controller.signal  // Eventually migrate to AbortSignal https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout
		}).then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			clearTimeout(timeoutId);
			if (verbose) console.log('Fetch: '+ (Date.now() - timerStart));
			return response.json();
		});

	return fetchRequest;
}

function getData(k) {
	if (sessionStorage.getItem('data') === null) return null;
	const data = JSON.parse(sessionStorage.getItem('data'));
	return data[k];
}
 
function setData(k, d) {
	var data;
	if (sessionStorage.getItem('data') === null) data = {};
	else data = JSON.parse(sessionStorage.getItem('data'));
	
	data[k] = d;
	sessionStorage.setItem('data', JSON.stringify(data));
}

function getAllData() {
	const raw = sessionStorage.getItem('data');
	const res = isJson(raw) ? JSON.parse(raw) : {};
	return res;
}


function setAllData(data) {
	sessionStorage.setItem('data', JSON.stringify(data));
}

function modifyData(data = {}) {
	const newData = $.extend(true, getAllData(), data);
	setAllData(newData);
	return newData;
}


function isJson(str) { 
	try { 
		return (JSON.parse(str) && !!str); 
	} catch (e) { 
		return false; 
	}
}


function getColorArray() {
    return ['#4572A7', '#AA4643', '#0ba828', '#80699B', '#3D96AE','#DB843D', '#92A8CD', '#A47D7C', '#B5CA92',"#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"];
}

function ajaxError(e) {
	console.log('Error: ', e);
	document.querySelector('#overlay .spinner-border').style.display = 'none';
	document.querySelector('#overlay h4').textContent = 'Sorry, it seems like there was an error loading the data! Please refresh or try back later.';
	return;
}