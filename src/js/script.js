$(document).ready(function() {

	const MONTHS = ['btMCMonth1', 'btMCMonth2', 'btMCMonth3', 'btMCMonth4', 'btMCMonth5', 'btMCMonth6', 'btMCMonth7', 'btMCMonth8', 'btMCMonth9', 'btMCMonth10', 'btMCMonth11', 'btMCMonth12'];

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

	$.ajax("data/potsdam/streets.json", function(data) { }).done(function(data) {
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

		$.ajax("data/potsdam/dates/1 Aalsteig.json", function(data) { }).done(function(disposalObj) {
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
		d3.select('.disposal-dates')
				.selectAll('div.disposal-date')
				.data(disposalDates)
				.enter()
			.append('div')
				.attr('class', 'disposal-date')
			.append('span')
				.attr('class', 'date')
				.text(function(d) { return d.date; })
			.append('span')
				.attr('class', 'descr')
				.text(function(d) { return d.descr; });

		console.log(disposalDates);
	}



});