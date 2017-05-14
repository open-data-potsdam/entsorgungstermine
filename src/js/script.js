$(document).ready(function() {

	const MONTHS = ['btMCMonth1', 'btMCMonth2', 'btMCMonth3', 'btMCMonth4', 'btMCMonth5', 'btMCMonth6', 'btMCMonth7', 'btMCMonth8', 'btMCMonth9', 'btMCMonth10', 'btMCMonth11', 'btMCMonth12'];
	let dateFormat = d3.timeFormat("%d.%m.");

	let $select = $('#streets').selectize({
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

	var selectize = $select[0].selectize;
	let uriStreets = 'data/potsdam/streets.json';

	$.ajax(uriStreets, function(data) { }).done(function(data) {
			let streets = data;
			streets.forEach(street => selectize.addOption({id: street.id, name: street.streetName}));
			selectize.refreshOptions();
		});

	selectize.on("change", (value) => {
		var street = selectize.getItem(value);
		updateDatesFor(street);
	});

	/**
	 * [updateDatesFor description]
	 * @param  {[type]} street [description]
	 * @return {[type]}        [description]
	 */
	function updateDatesFor(street) {
		let id = street.data().value;
		let streetName = street.text();
		let currentDate = new Date();

		console.log('streetName', streetName);

		let filename = id + ' ' + streetName + '.json';
		let uri = 'data/potsdam/dates/' + filename;

		$.ajax(uri, function(data) { }).done(function(disposalObj) {
			let currentMonth = currentDate.getMonth();
			let disposalMonth = MONTHS[currentMonth];
			let disposalDates = disposalObj[streetName][disposalMonth];

			updateDisposalDates(disposalDates);
		});
	}

	/**
	 * [updateDisposalDates description]
	 * @param  {[type]} disposalDates [description]
	 * @return {[type]}               [description]
	 */
	function updateDisposalDates(disposalDates) {
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
		let disposal = d3.select('div#next-disposal-date')
				.selectAll('div.disposal-date')
				.data(data, function(d) { return d; });

		//	EXIT
		disposal.exit()
			.transition()
			.duration(1000)
			.style('opacity', 0)
			.remove();

		//	UPDATE
		let date = disposal
			.select('span.date')
			.text(function(d) {
				let date = new Date(d.date);
				return dateFormat(date);
			});

		disposal
			.select('span.descr')
			.text(function(d) { return d.descr; });

		//	ENTER
		var enteredDisposal = disposal.enter()
			.append('div')
					.attr('class', 'disposal-date')
					.style('opacity', 0);

		//	Date
		enteredDisposal
			.append('span')
				.attr('class', 'date')
				.text(function(d) {
					let date = new Date(d.date);
					return dateFormat(date);
				});

		//	Days
		enteredDisposal
			.append('span')
				.attr('class', 'days')
				.text(function(d) {
					return daysTo(d.date);
				});

		//	Description
		enteredDisposal.append('span')
				.attr('class', 'descr')
				.text(function(d) { return d.descr; });

		enteredDisposal
			.transition()
			.duration(1000)
			.style('opacity', 1);
	}

	/**
	 * [updateUpcomingDisposalDates description]
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	function updateUpcomingDisposalDates(data) {
		let disposals = d3.select('div#upcoming-disposal-dates')
				.selectAll('div.disposal-date')
				.data(data, function(d) { return d; });

		//	EXIT
		disposals.exit()
			.transition()
			.duration(1000)
			.style('opacity', 0)
			.remove();

		//	UPDATE
		disposals
			.select('span.date')
			.text(function(d) {
				let date = new Date(d.date);
				return dateFormat(date);
			});

		disposals
			.select('span.days')
			.text(function(d) { return daysTo(d.date); });

		disposals
			.select('span.descr')
			.text(function(d) { return d.descr; });

		//
		//	ENTER
		//
		var enteredDisposals = disposals.enter()
			.append('div')
					.attr('class', 'disposal-date')
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
					return daysTo(d.date);
				});

		//	Description
		enteredDisposals.append('span')
				.attr('class', 'descr')
				.text(function(d) { return d.descr; });

		enteredDisposals
			.transition()
			.duration(1000)
			.style('opacity', 1);
	}

	function daysTo(date) {
		let today = new Date();
		let toDate = new Date(date);
		let days = Math.ceil(Math.round(toDate - today) / (1000*60*60*24));

		return 'in ' + days + ' Tagen';
	}
});