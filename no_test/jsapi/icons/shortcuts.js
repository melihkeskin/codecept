//<reference path="../../steps.d.ts" />

Before({ login } => {
	login('admin');
});

Feature('JSAPI / Icon / Shortcuts');

Scenario('Given I have floating menu and custom icon based on class, when dropdown is displayed, then I see custom icon', ({ I, utils, navBar }) => {
	utils.jsapi.icon.addForClass('CourrierEntrant', 'fa fa-search');

	I.refreshActivity();

	I.waitForElement('.floating-button', 15);
	I.click('.floating-button');
	I.waitForElement('.floating_button.shortcuts .popup_content', 5);
	I.seeElement('.floating_button.shortcuts .popup_content .menu-item .fa.fa-search');
}).tag('jsapi').tag('icon').tag('shortcut');
