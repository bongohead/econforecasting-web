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
	loadHomepageSnapshot();

});

const getDir = function(page_obj) {
	window.location.href = (page_obj.url);
}

const homepageDayFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
	timeZone: 'UTC',
});

const homepageDayYearFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	day: 'numeric',
	year: 'numeric',
	timeZone: 'UTC',
});

const homepageMonthFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	year: 'numeric',
	timeZone: 'UTC',
});

const homepagePercentFormatter = new Intl.NumberFormat('en-US', {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

const homepageAxisPercentFormatter = new Intl.NumberFormat('en-US', {
	minimumFractionDigits: 1,
	maximumFractionDigits: 1,
});

const homepageHorizons = [1, 3, 12, 48];

const parseHomepageDate = function(value) {
	if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

	const date = new Date(`${value}T00:00:00Z`);
	return Number.isNaN(date.getTime()) ? null : date;
}

const formatHomepagePercent = function(value) {
	if (value == null || value === '') return '—';

	const number = Number(value);
	return Number.isFinite(number) ? `${homepagePercentFormatter.format(number)}%` : '—';
}

const formatHomepageAxisPercent = function(value) {
	const number = Number(value);
	return Number.isFinite(number) ? `${homepageAxisPercentFormatter.format(number)}%` : '—';
}

const formatHomepageChange = function(value) {
	if (value == null || value === '') return '—';

	const change = Number(value);
	if (!Number.isFinite(change)) return '—';

	const roundedChange = Math.abs(change) < 0.005 ? 0 : change;
	if (roundedChange === 0) return '—';

	const direction = roundedChange > 0 ? '↑' : '↓';
	return `${direction} ${homepagePercentFormatter.format(Math.abs(roundedChange))}%`;
}

const setHomepageField = function(card, field, value) {
	const element = card.querySelector(`[data-field="${field}"]`);
	if (element) element.textContent = value;
}

const setHomepageChangeField = function(card, field, value) {
	const element = card.querySelector(`[data-field="${field}"]`);
	if (!element) return;

	const change = formatHomepageChange(value);
	element.textContent = change;
	element.classList.remove('text-slate-400', 'text-sky-dark');
	element.classList.add(change === '—' ? 'text-slate-400' : 'text-sky-dark');
}

const setHomepageSnapshotField = function(field, value) {
	const element = document.querySelector(`[data-field="${field}"]`);
	if (element) element.textContent = value;
}

const setHomepageSparklineUnavailable = function(card) {
	const sparkline = card.querySelector('[data-field="sparkline"]');
	const line = card.querySelector('[data-field="sparkline-line"]');
	const endpoint = card.querySelector('[data-field="sparkline-end"]');

	if (line) line.removeAttribute('d');
	if (endpoint) {
		endpoint.removeAttribute('cx');
		endpoint.removeAttribute('cy');
	}
	setHomepageField(card, 'sparkline-maximum', '—');
	setHomepageField(card, 'sparkline-minimum', '—');
	if (sparkline) sparkline.classList.add('invisible');
}

const setHomepageCardUnavailable = function(card) {
	homepageHorizons.forEach((horizon) => {
		setHomepageField(card, `forecast-${horizon}`, '—');
		setHomepageChangeField(card, `change-${horizon}`, null);
	});
	setHomepageSparklineUnavailable(card);
}

const getHomepagePathPoints = function(path) {
	if (!Array.isArray(path)) return [];

	return path
		.filter((point) => point?.forecast_value != null && point.forecast_value !== '')
		.map((point) => ({
			date: parseHomepageDate(point?.forecast_date),
			value: Number(point?.forecast_value),
		}))
		.filter((point) => point.date && Number.isFinite(point.value))
		.sort((a, b) => a.date - b.date);
}

const getHomepageSparklineDomain = function(points) {
	const values = points.map((point) => point.value);
	const minimum = Math.min(...values);
	const maximum = Math.max(...values);
	const midpoint = (minimum + maximum) / 2;
	const displayedSpan = Math.max(maximum - minimum, 0.1);
	const padding = displayedSpan * 0.1;

	return {
		minimum: midpoint - displayedSpan / 2 - padding,
		maximum: midpoint + displayedSpan / 2 + padding,
		pathMinimum: minimum,
		pathMaximum: maximum,
	};
}

const populateHomepageSparkline = function(card, path) {
	const sparkline = card.querySelector('[data-field="sparkline"]');
	const line = card.querySelector('[data-field="sparkline-line"]');
	const endpoint = card.querySelector('[data-field="sparkline-end"]');
	const points = getHomepagePathPoints(path);
	const domain = points.length >= 2 ? getHomepageSparklineDomain(points) : null;

	if (!sparkline || !line || !endpoint || !domain || points.length < 2) {
		setHomepageSparklineUnavailable(card);
		return;
	}

	const width = 200;
	const height = 36;
	const padding = 3;
	const firstDate = points[0].date.getTime();
	const lastDate = points.at(-1).date.getTime();
	const dateRange = lastDate - firstDate;
	const valueRange = domain.maximum - domain.minimum;

	if (!Number.isFinite(dateRange) || dateRange <= 0 || !Number.isFinite(valueRange) || valueRange <= 0) {
		setHomepageSparklineUnavailable(card);
		return;
	}

	const coordinates = points.map((point) => ({
		x: padding + ((point.date.getTime() - firstDate) / dateRange) * (width - padding * 2),
		y: padding + ((domain.maximum - point.value) / valueRange) * (height - padding * 2),
	}));

	line.setAttribute('d', coordinates.map((point, index) => (
		`${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`
	)).join(' '));

	const lastPoint = coordinates.at(-1);
	endpoint.setAttribute('cx', lastPoint.x.toFixed(2));
	endpoint.setAttribute('cy', lastPoint.y.toFixed(2));
	setHomepageField(card, 'sparkline-maximum', formatHomepageAxisPercent(domain.pathMaximum));
	setHomepageField(card, 'sparkline-minimum', formatHomepageAxisPercent(domain.pathMinimum));
	sparkline.setAttribute(
		'aria-label',
		`Forecast path from ${formatHomepagePercent(points[0].value)} to ${formatHomepagePercent(points.at(-1).value)}, ranging from ${formatHomepagePercent(domain.pathMinimum)} to ${formatHomepagePercent(domain.pathMaximum)}`,
	);
	sparkline.classList.remove('invisible');
}

const getCommonHomepageDate = function(values) {
	if (values.length === 0 || values.some((value) => typeof value !== 'string')) return null;

	const uniqueValues = [...new Set(values)];
	return uniqueValues.length === 1 ? parseHomepageDate(uniqueValues[0]) : null;
}

const getHomepageDateRange = function(values) {
	if (values.length === 0) return null;

	const dates = values.map(parseHomepageDate);
	if (dates.some((date) => date === null)) return null;

	const timestamps = dates.map((date) => date.getTime());
	return {
		minimum: new Date(Math.min(...timestamps)),
		maximum: new Date(Math.max(...timestamps)),
	};
}

const formatHomepageDateRange = function(range) {
	if (!range) return null;

	const { minimum, maximum } = range;
	if (minimum.getTime() === maximum.getTime()) return homepageDayFormatter.format(minimum);

	const sameYear = minimum.getUTCFullYear() === maximum.getUTCFullYear();
	const sameMonth = sameYear && minimum.getUTCMonth() === maximum.getUTCMonth();
	if (sameMonth) {
		return `${homepageDayFormatter.format(minimum)}–${maximum.getUTCDate()}`;
	}
	if (sameYear) {
		return `${homepageDayFormatter.format(minimum)}–${homepageDayFormatter.format(maximum)}`;
	}

	return `${homepageDayYearFormatter.format(minimum)}–${homepageDayYearFormatter.format(maximum)}`;
}

const populateHomepageSnapshotMetadata = function(series) {
	const forecastVintage = formatHomepageDateRange(
		getHomepageDateRange(series.map((row) => row.forecast_vintage)),
	);
	setHomepageSnapshotField(
		'snapshot-updated',
		forecastVintage ? `Updated ${forecastVintage}` : 'Latest available',
	);

	homepageHorizons.forEach((months) => {
		const forecastDate = getCommonHomepageDate(series.map((row) => (
			Array.isArray(row.horizons)
				? row.horizons.find((item) => Number(item.horizon_months) === months)?.forecast_date
				: null
		)));
		setHomepageSnapshotField(
			`snapshot-date-${months}`,
			forecastDate ? homepageMonthFormatter.format(forecastDate) : 'Date varies',
		);
	});
}

const populateHomepageCard = function(row) {
	const card = document.querySelector(`[data-home-series="${row.series_id}"]`);
	if (!card) return false;

	const horizons = Array.isArray(row.horizons) ? row.horizons : [];

	homepageHorizons.forEach((months) => {
		const horizon = horizons.find((item) => Number(item.horizon_months) === months);
		setHomepageField(card, `forecast-${months}`, formatHomepagePercent(horizon?.forecast_value));
		setHomepageChangeField(card, `change-${months}`, horizon?.change);
	});
	populateHomepageSparkline(card, row.path);

	return horizons.length > 0;
}

const loadHomepageSnapshot = async function() {
	const cards = [...document.querySelectorAll('[data-home-series]')];

	try {
		const response = await getApi('homepage-snapshot');
		if (!Array.isArray(response?.series) || response.series.length === 0) {
			throw new Error('Invalid homepage snapshot response');
		}

		populateHomepageSnapshotMetadata(response.series);

		const populatedSeries = new Set(
			response.series
				.filter(populateHomepageCard)
				.map(row => row.series_id),
		);

		cards
			.filter(card => !populatedSeries.has(card.dataset.homeSeries))
			.forEach(setHomepageCardUnavailable);
	} catch (error) {
		setHomepageSnapshotField('snapshot-updated', 'Unavailable');
		homepageHorizons.forEach((months) => {
			setHomepageSnapshotField(`snapshot-date-${months}`, '—');
		});
		cards.forEach(setHomepageCardUnavailable);
		console.warn('Homepage snapshot unavailable:', error instanceof Error ? error.message : 'Unknown error');
	}
}
