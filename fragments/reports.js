//<reference path="../steps.d.ts" />
const I = actor();

module.exports = {

		root: '.sidenav',
		
		seeNumberOfReports: function (value) {
			I.say("Check number of reports");
			within(this.root, function() {
				I.seeNumberOfElements('.item-container', value);
			});
		}

		
}