// var App = require('./components/app.vue');

// Vue.component('task', {
// 	template: '<div>Hallo</div>'
// });

var app = new Vue({
	el: '#app',
	data: {
		streets: [],
		chosenStreet: '',
		disposalDates: [],
		MONTHS: ['btMCMonth1', 'btMCMonth2', 'btMCMonth3', 'btMCMonth4', 'btMCMonth5', 'btMCMonth6', 'btMCMonth7', 'btMCMonth8', 'btMCMonth9', 'btMCMonth10', 'btMCMonth11', 'btMCMonth12'],
		DEFAULT_DURATION: 750,
		ELEMENT_OFFSET: 30,
		ANIMATION_OFFSET: 50
	},
	methods: {
		onChangeStreet: function(event) {
			console.log('event', streets);
			if(event) {
				let streetId = event.target.value;
				this.chosenStreet = this.streets.filter(street => street.id === +streetId)[0];
				this.updateStreetDates();
			}
		},
		updateStreetDates: function() {
			let self = this;
			console.log('update street dates');

			let id = this.chosenStreet.id;
			let streetName = this.chosenStreet.streetName;
			let currentDate = new Date();

			let filename = id + ' ' + streetName + '.json';
			let uri = 'data/potsdam/dates/' + filename;

			$.ajax(uri, function(data) { }).done(function(disposalObj) {
				let currentMonth = currentDate.getMonth();
				let disposalMonth = self.MONTHS[currentMonth];
				let selectedStreet = disposalObj[streetName];
				let disposalDates = [];

				self.MONTHS.forEach(month => disposalDates.push(selectedStreet[month]));
				self.disposalDates = [].concat.apply([], disposalDates);

				self.updateDisposalDates();
			});
		},
		updateDisposalDates: function() {
			this.disposalDates = this.disposalDates.filter(d => {
				let date = new Date(d.date);
				let today = new Date();

				return date >= today && this.daysTo(date) <= 31;
			});

			//	TODO: sort by date

			//	Filter for selected disposal types
			// disposalDates = disposalDates.filter(d => {
			// 	let descriptions = d.descr.split(',');

			// 	descriptions = descriptions.map(descr => descr.trim() );

			// 	console.log(descriptions);
			// 	return true; // descriptions.includes('Restabfall 2-wöchentl.');
			// });

			let nextDisposalDate = this.disposalDates.slice(0, 1);
			let upcomingDisposalDates = this.disposalDates.slice(1, this.disposalDates.length);

			console.log('all', this.disposalDates);
			console.log('next', nextDisposalDate);
			console.log('upcoming', upcomingDisposalDates);

			this.updateNextDisposalDate(nextDisposalDate);
			this.updateUpcomingDisposalDates(upcomingDisposalDates);
		},
		updateNextDisposalDate: function(data) {
			let disposal = d3.select('div.disposal-dates.next')
					.selectAll('div.disposal-date')
					.data(data, function(d) { return d.date + " - " + d.descr; });

			this.createRow(disposal);
		},
		updateUpcomingDisposalDates: function(data) {
			let disposals = d3.select('div.disposal-dates.upcoming')
					.selectAll('div.disposal-date')
					.data(data, function(d) { return d.date + " - " + d.descr });

			this.createRow(disposals);
		},
		createRow: function(element) {
			let self = this;
			console.log('element', element);

			let dateFormat = d3.timeFormat("%d.%m.");

			//	EXIT
			element
				.exit()
				.transition()
				.duration(this.DEFAULT_DURATION)
				.style('top', function(d, i) {
					return self.ELEMENT_OFFSET * i + "px";
				})
				.style('left', function(d, i) {
					return (-self.ANIMATION_OFFSET) + "px";
				})
				.style('opacity', 0)
				.remove();

			//
			//	ENTER
			//
			let enteredDisposals = element.enter()
				.append('div')
					.attr('class', 'disposal-date')
					.style('position', 'absolute')
					.style('top', function(d, i) {
						return self.ELEMENT_OFFSET*i + "px";
					})
					.style('left', function(d, i) {
						return self.ANIMATION_OFFSET + "px";
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
							return self.daysToStr(d.date);
						});

				//	Description
				enteredDisposals.append('span')
						.attr('class', 'descr')
						.text(function(d) { return d.descr; });

			enteredDisposals
				.transition()
				.duration(this.DEFAULT_DURATION)
				.style('left', function(d, i) {
					return "0px";
				})
				.style('top', function(d, i) {
					return this.ELEMENT_OFFSET*i+ "px";
				})
				.style('opacity', 1);

			//
			//	UPDATE
			//
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
					.text(function(d) { return self.daysToStr(d.date); });

				spans
					.select('span.descr')
					.text(function(d) { return d.descr; });
		},
		daysTo: function(date) {
			let today = new Date();
			let toDate = new Date(date);
			let days = Math.ceil(Math.round(toDate - today) / (1000*60*60*24));

			return days;
		},
		daysToStr: function(date) {
			let days = this.daysTo(date);

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
	},
	mounted: function () {
        let self = this;

		let uriStreets = 'data/potsdam/streets.json';
		$.ajax(uriStreets, function(data) { }).done(function(data) {
			let streets = data;
			self.streets = data;

			streets.forEach(street => {
			    $('#streets').append($('<option>', {
			        value: street.id,
			        text : street.streetName
			    }));
			});
		});

    }
});