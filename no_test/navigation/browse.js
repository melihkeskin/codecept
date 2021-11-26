//<reference path="../../steps.d.ts" />   

Before({ login } => {
	login('admin');
});

Feature('Navigation / Browse');

Scenario('I open tasks from browse tab then cancel so the state is restored', async ({ I, data, sidemenu, task, browse }) => {
	let mail1 = await I.haveMail(true);
	let mail2 = data.mail();
	mail2.routing = mail1.routing;
	await I.haveMail(true, false, mail2);

	sidemenu.open('Tous les courriers');
	browse.waitForOpen();
	browse.left.openSecondLevel(mail2.routing.service.label, 'A traiter');
	browse.results.seeAndOpenFirst(mail2.lastName);
	I.waitForGlassPanelHidden();
	task.form.cancel();

	browse.results.seeFirst(mail1.lastName);
	browse.left.openSecondLevel(mail2.routing.service.label, 'En cours de traitement');

	for (var i = 0; i < 10; i++) {
		I.say('Try ' + i + ': Open and cancel ' + mail2.name);
		browse.results.dontSeeInResults(mail1.lastName);
		browse.results.seeAndOpenFirst(mail2.lastName);

		task.waitForOpen();
		task.form.cancel();
		// In order to be sure that all searches has been executed. Waiting for glass panel 
		// hidden is not efficient because it shows and hide multiple times
		I.wait(1);
	}
}).tag('navigation').tag('browse');

Scenario('I fill browse criteria then refresh the page then criteria are kept', async ({ I, browse, sidemenu }) => {
	let mail = await I.haveMail(true);

	sidemenu.open('Tous les courriers');
	browse.waitForOpen();

	browse.form.fillListCriterion('RefClient', mail.refClient);
	browse.form.fillFieldCriterion('ObjetCourrier', mail.object);

	browse.form.launchSearch();
	browse.results.waitForTable();
	I.refreshPage();
	browse.results.waitForTable();

	browse.form.seeCriterion('RefClient', mail.firstName + ' ' + mail.lastName + '(' + mail.refClient + ')');
	browse.form.seeCriterion('ObjetCourrier', mail.object);
}).tag('navigation').tag('browse');

Scenario('Given sorted search results in VF Tab, when I refresh, then sorting is kept', ({ I, sidemenu, browse }) => {
	sidemenu.open('Tous les courriers');
	browse.left.openSecondLevel('Commerce', 'A traiter');

	browse.results.sort('Date de création');
	browse.results.seeFirst('11 oct. 2017 14:33:33');
	I.refreshPage();
	browse.results.seeFirst('11 oct. 2017 14:33:33');

}).tag('navigation').tag('browse');

Data(['20', '50', '75', '100']).Scenario('Given simple VF tab When I change page size and I refresh page Then I see changed page size', async ({ I, current, sidemenu, browse }) => {
	sidemenu.open('Mes courriers');
	browse.results.changePageSize(current);
	I.refreshPage();
	await browse.results.seePageSize(current);
}).tag('navigation').tag('browse');

Data(['20', '50', '75', '100']).Scenario('Given VF tab with buckets When I change page size and I refresh page Then I see changed page size', async ({ I, current, sidemenu, browse }) => {
	sidemenu.open('Tous les courriers');
	browse.results.changePageSize(current);
	I.refreshPage();
	await browse.results.seePageSize(current);
}).tag('navigation').tag('browse');

Scenario('Given a VF tab, when I go to page 2 and refresh page, then I see  page 2', async ({ I, data, browse, sidemenu }) => {
	let mail = data.mail();
	mail.routing = data.routing[5];
	sidemenu.open('Tous les courriers');
	browse.left.openFirstLevel('Juridique', false);
	browse.results.changePage('2');
	await browse.results.seePage(2);

	I.refreshPage();
	await browse.results.seePage(2);
}).tag('navigation').tag('browse');

Scenario('Given a VF tab, when I go to page 2 and sort, then I see first page', async ({ data, browse, sidemenu }) => {
	let mail = data.mail();
	mail.routing = data.routing[5];
	sidemenu.open('Tous les courriers');
	browse.left.openFirstLevel('Juridique', false);
	browse.results.changePage('2');
	await browse.results.seePage(2);

	browse.results.sort('Date de création');
	await browse.results.seePage(1);
}).tag('navigation').tag('browse');

Scenario('Given a VF tab, when I go to page 2, refresh and sort, then I see first page', async ({ I, data, browse, sidemenu }) => {
	let mail = data.mail();
	mail.routing = data.routing[5];
	sidemenu.open('Tous les courriers');
	browse.left.openFirstLevel('Juridique', false);
	browse.results.changePage('2');
	await browse.results.seePage(2);

	I.refreshPage();
	browse.results.sort('Date de création');
	await browse.results.seePage(1);
}).tag('navigation').tag('browse');


Scenario('Given a VF tab,  when I go to page 2, open task and go back, then I see page 2', async ({ I, data, browse, sidemenu }) => {
	let mail = data.mail();
	mail.routing = data.routing[5];
	mail = await I.haveMail(true, 'data/simple.pdf', mail);
	sidemenu.open('Tous les courriers');
	browse.left.openFirstLevel('Juridique', false);
	browse.results.seeFirst(mail.object);
	browse.results.changePage('2');
	browse.results.dontSeeInResults(mail.object);
	await browse.results.seePage(2);

	browse.results.openFirst();
	I.goBack();
	await browse.results.seePage(2);
}).tag('navigation').tag('browse');

Scenario('Given a VF tab, I go to page 2 and launch search again, the I see first page', async ({ data, browse, sidemenu }) => {
	let mail = data.mail();
	mail.routing = data.routing[5];
	sidemenu.open('Tous les courriers');
	browse.left.openFirstLevel('Juridique', false);
	browse.results.changePage('2');
	await browse.results.seePage(2);

	browse.form.launchSearch();
	await browse.results.seePage(1);
}).tag('navigation').tag('browse');