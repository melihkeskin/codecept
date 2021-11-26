// <reference path="../steps.d.ts" />
const I = actor();


module.exports = {
	
	root:'.delegation',
		
	openGivenDelegation() {
		I.click('.avatar-container');
		I.waitForVisible (' #undefined', 15);
		I.click ('.given-delegations #undefined');
		I.waitForElement('.modal-dialog' + this.root);
	},
	
	createDelegation(user, startDate, endDate, description) {
		I.fillField(locate(this.root + ' .form-control .string-input').at(4), user);
		I.fillField(locate(this.root + ' .form-control .date-box input').at(1), startDate);
		I.fillField(locate(this.root + ' .form-control .date-box input').at(2), endDate);
		I.fillField(locate(this.root + ' .form-group .field-string .string-input').at(2), description);
		I.click(this.root + ' #create');
	},
	
	seeGivenDelegation (user) {
		I.click('.avatar-container');
		I.waitForVisible('.given-delegations', 30);
		I.see(user, '.given-delegations');
	},
	
	seeReceivedDelegation (user) {
		I.click('.avatar-container');
		I.waitForVisible('.received-delegations', 30);
		I.see(user);
	},
	
	deleteFirstDelegation () {
		I.click('.avatar-container');
		I.waitForElement (this.root + ' #detach',30);
		I.click(this.root + ' #detach');
		I.waitForVisible('.modal-content .alert', 5);
		I.click('#yes');
	}

}