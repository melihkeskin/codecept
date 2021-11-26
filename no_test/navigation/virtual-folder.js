//<reference path="../../steps.d.ts" />   

Before({ login } => {
	login('admin');
});

Feature('Navigation / VirtualFolder');

Scenario('Given a VF, when I go to page 2 and refresh, then I see page 2', async ({ I, data, virtualFolder, navBar }) => {
	let mail = data.mail();
	mail.routing = data.routing[5];
	mail.refClient = '123456';
	virtualFolder.open(mail.refClient);
	virtualFolder.openFirstLevel("Contrat", false);
	virtualFolder.switchDisplay();
	virtualFolder.searchResults.waitForTable();
	virtualFolder.searchResults.changePageSize('10');
	virtualFolder.searchResults.changePage('2');
	await virtualFolder.searchResults.seePage(2);

	I.refreshPage();
	await virtualFolder.searchResults.seePage(2);
}).tag('navigation').tag('virtualFolder');

Scenario('Given a VF, when I go to page 2 and sort, then I see first page', async ({ I, data, virtualFolder }) => {
	let mail = data.mail();
	mail.routing = data.routing[5];
	mail.refClient = '123456';
	virtualFolder.open(mail.refClient);
	virtualFolder.openFirstLevel("Contrat", false);
	virtualFolder.switchDisplay();
	virtualFolder.searchResults.waitForTable();
	virtualFolder.searchResults.changePageSize('10');
	virtualFolder.searchResults.changePage('2');
	await virtualFolder.searchResults.seePage(2);

	virtualFolder.searchResults.sort('Date de création');
	await virtualFolder.searchResults.seePage(1);
}).tag('navigation').tag('virtualFolder');

Scenario('Given a VF, when I go to page 2, refresh and sort, then I see first page', async ({ I, data, virtualFolder }) => {
	let mail = data.mail();
	mail.routing = data.routing[5];
	mail.refClient = '123456';
	virtualFolder.open(mail.refClient);
	virtualFolder.openFirstLevel("Contrat", false);
	virtualFolder.switchDisplay();
	virtualFolder.searchResults.waitForTable();
	virtualFolder.searchResults.changePageSize('10');
	virtualFolder.searchResults.changePage('2');
	await virtualFolder.searchResults.seePage(2);

	I.refreshPage();
	virtualFolder.searchResults.sort('Date de création');
	await virtualFolder.searchResults.seePage(1);
}).tag('navigation').tag('virtualFolder');

Scenario('Given a VF, when I go to page 2, open task and go back and refresh, then I see page 2', async ({ I, data, virtualFolder }) => {
	let mail = data.mail();
	mail.routing = data.routing[5];
	mail.refClient = '123456';
	virtualFolder.open(mail.refClient);
	virtualFolder.openFirstLevel("Contrat", false);
	virtualFolder.switchDisplay();
	virtualFolder.searchResults.waitForTable();
	virtualFolder.searchResults.changePageSize('10');
	virtualFolder.searchResults.changePage('2');
	await virtualFolder.searchResults.seePage(2);

	virtualFolder.searchResults.openFirst();
	I.goBack();
	await virtualFolder.searchResults.seePage(2);
}).tag('navigation').tag('virtualFolder');
