$(document).ready(function() {

	const MONTHS = ['btMCMonth1', 'btMCMonth2', 'btMCMonth3', 'btMCMonth4', 'btMCMonth5', 'btMCMonth6', 'btMCMonth7', 'btMCMonth8', 'btMCMonth9', 'btMCMonth10', 'btMCMonth11', 'btMCMonth12'];
	const DEFAULT_DURATION = 750;
	const ELEMENT_OFFSET = 30;

	let dateFormat = d3.timeFormat("%d.%m.");
	let streetName;

	let $select = $('#streets').selectize({
		placeholder: 'Hier Straße wählen...',
	    valueField: 'id',
	    labelField: 'name',
	    searchField: 'name',
	    options: [],
	    create: false,
	    render: {
	        option: function(item, escape) {
	            return '<div>' +
	                '<span>' + item.name + '</span>' +
	            '</div>';
	        }
	    }
	});

	let selectize = $select[0].selectize;
	let uriStreets = 'data/potsdam/streets.json';

	$.ajax(uriStreets, function(data) { }).done(function(data) {
			let streets = data;
			streets.forEach(street => selectize.addOption({id: street.id, name: street.streetName}));
			selectize.refreshOptions();
		});

	selectize.on("change", (value) => {
		let street = selectize.getItem(value);
		updateDatesFor(street);
	});

	/**
	 * [updateDatesFor description]
	 * @param  {[type]} street [description]
	 * @return {[type]}        [description]
	 */
	function updateDatesFor(street) {
		let id = street.data().value;
		streetName = street.text();
		let currentDate = new Date();

		console.log('streetName', streetName);

		let filename = id + ' ' + streetName + '.json';
		let uri = 'data/potsdam/dates/' + filename;

		$.ajax(uri, function(data) { }).done(function(disposalObj) {
			let currentMonth = currentDate.getMonth();
			let disposalMonth = MONTHS[currentMonth];
			let selectedStreet = disposalObj[streetName];
			let disposalDates = [];

			MONTHS.forEach(month => disposalDates.push(selectedStreet[month]));
			disposalDates = [].concat.apply([], disposalDates);

			updateDisposalDates(disposalDates);
		});
	}

	/**
	 * [updateDisposalDates description]
	 * @param  {[type]} disposalDates [description]
	 * @return {[type]}               [description]
	 */
	function updateDisposalDates(disposalDates) {
		disposalDates = disposalDates.filter(d => {
			let date = new Date(d.date);
			let today = new Date();

			return date >= today && daysTo(date) <= 31;
		});

		let nextDisposalDate = disposalDates.slice(0, 1);
		let upcomingDisposalDates = disposalDates.slice(1, disposalDates.length);

		console.log('all', disposalDates);
		console.log('next', nextDisposalDate);
		console.log('upcoming', upcomingDisposalDates);

		updateNextDisposalDate(nextDisposalDate);
		updateUpcomingDisposalDates(upcomingDisposalDates);
	}

	/**
	 * [updateNextDisposalDate description]
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	function updateNextDisposalDate(data) {
		let disposal = d3.select('div.disposal-dates.next')
				.selectAll('div.disposal-date')
				.data(data, function(d) { return d.date + " - " + streetName; });

		createRow(disposal);
	}

	/**
	 * [updateUpcomingDisposalDates description]
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	function updateUpcomingDisposalDates(data) {
		console.log('selec', streetName);
		let disposals = d3.select('div.disposal-dates.upcoming')
				.selectAll('div.disposal-date')
				.data(data, function(d) { return d.date + " - " + streetName });

		createRow(disposals);
	}

	/**
	 * [createRow description]
	 * @param  {[type]} element [description]
	 * @return {[type]}         [description]
	 */
	function createRow(element) {
		console.log('element', element);

		//	EXIT
		element
			.exit()
			.transition()
			.duration(DEFAULT_DURATION)
			.style('opacity', 0)
			.remove();

		//	UPDATE
		let spans = element
			.selectAll('span');

			spans
				.select('span.date')
				.text(function(d) {
					let date = new Date(d.date);
					return dateFormat(date);
				});

			spans
				.select('span.days')
				.text(function(d) { return daysToStr(d.date); });

			spans
				.select('span.descr')
				.text(function(d) { return d.descr; });

		//
		//	ENTER
		//
		let enteredDisposals = element.enter()
			.append('div')
				.attr('class', 'disposal-date')
				.style('position', 'absolute')
				.style('top', function(d, i) {
					return ELEMENT_OFFSET*i + "px";
				})
				.style('opacity', 0);

			//	Date
			enteredDisposals
				.append('span')
					.attr('class', 'date')
					.text(function(d) {
						let date = new Date(d.date);
						return dateFormat(date);
					});

			//	Days
			enteredDisposals
				.append('span')
					.attr('class', 'days')
					.text(function(d) {
						return daysToStr(d.date);
					});

			//	Description
			enteredDisposals.append('span')
					.attr('class', 'descr')
					.text(function(d) { return d.descr; });

		enteredDisposals
			.transition()
			.duration(DEFAULT_DURATION)
			.style('top', function(d, i) {
				return ELEMENT_OFFSET*i+ "px";
			})
			.style('opacity', 1);
	}

	/**
	 * [daysToStr description]
	 * @param  {[type]} date [description]
	 * @return {[type]}      [description]
	 */
	function daysTo(date) {
		let today = new Date();
		let toDate = new Date(date);
		let days = Math.ceil(Math.round(toDate - today) / (1000*60*60*24));

		return days;
	}

	function daysToStr(date) {
		let days = daysTo(date);

		let str = '';
		if(days > 2)
			str = `in ${days} Tagen`;
		else if(days === 2)
			str = 'übermorgen';
		else if(days === 1)
			str = 'morgen';
		else if(days === 0)
			str = 'heute;'

		return str;
	}
});