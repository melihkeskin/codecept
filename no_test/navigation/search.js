//<reference path="../../steps.d.ts" />

const data = require('../../data/data');

Before({ login } => {
	login('admin');
});

Feature('Navigation / Search');

Data(data.categories()).Scenario('Keep quick search value and table category selected', ({ I, search, data, current }) => {
	const name = data.faker.system.commonFileName();
	search.openDefault();
	search.form.category.select(current.label);
	search.form.launchQuick(name);
	search.results.waitForTable();

	I.refreshPage();
	search.results.waitForTable();

	search.form.seeQuick(name);
	search.results.seeTableOf(current.value);
}).tag('navigation').tag('search');

Scenario('Given a search, when I go to page 2, then I do not see component from first page', async ({ I, search }) => {
	let doc = await I.createDocument();
	search.openDefault();
	search.form.launchSearch();
	search.results.seeFirst(doc.name);
	search.results.changePage('2');
	search.results.dontSeeInResults(doc.name);

	I.refreshPage();
	search.results.waitForTable();

	search.results.dontSeeInResults(doc.name);
	await search.results.seePage(2);
}).tag('navigation').tag('search');

Scenario('Given a search, when I go to page 2 and refresh, then I see page 2', async ({ I, search }) => {
	let doc = await I.createDocument();
	search.openDefault();
	search.form.launchSearch();
	search.results.seeFirst(doc.name);
	search.results.changePage('2');
	search.results.dontSeeInResults(doc.name);

	I.refreshPage();
	search.results.waitForTable();

	search.results.dontSeeInResults(doc.name);
	await search.results.seePage(2);
}).tag('navigation').tag('search');

Scenario('Given a search, when I go to page 2, click on search menu again and refresh, then I see page 2', async ({ I, search }) => {
	let doc = await I.createDocument();
	search.openDefault();
	search.form.launchSearch();
	search.results.seeFirst(doc.name);
	search.results.changePage('2');
	search.results.dontSeeInResults(doc.name);

	search.openDefault();
	I.refreshPage();
	search.results.waitForTable();

	search.results.dontSeeInResults(doc.name);
	await search.results.seePage(2);
}).tag('navigation').tag('search');

Scenario('Given a search, when I go to page 2 and sort, then I see first page', async ({ I, search }) => {
	let doc = await I.createDocument();
	search.openDefault();
	search.form.launchSearch();
	search.results.seeFirst(doc.name);
	search.results.changePage('2');
	search.results.dontSeeInResults(doc.name);
	await search.results.seePage(2);

	search.results.sort('Date de création');
	await search.results.seePage(1);
}).tag('navigation').tag('search');

Scenario('Given a search, when I go to page 2, refresh and sort, then I see first page', async ({ I, search }) => {
	let doc = await I.createDocument();
	search.openDefault();
	search.form.launchSearch();
	search.results.seeFirst(doc.name);
	search.results.changePage('2');
	search.results.dontSeeInResults(doc.name);
	await search.results.seePage(2);

	I.refreshPage();
	search.results.waitForTable();

	search.results.sort('Date de création');
	await search.results.seePage(1);
}).tag('navigation').tag('search');

Scenario('Given a search, when I go to page 2, open document and go back and refresh, then I see page 2', async ({ I, search }) => {
	let doc = await I.createDocument();
	search.openDefault();
	search.form.launchSearch();
	search.results.seeFirst(doc.name);
	search.results.changePage('2');
	search.results.dontSeeInResults(doc.name);
	await search.results.seePage(2);

	search.results.openFirst();
	I.goBack();
	search.results.dontSeeInResults(doc.name);
	await search.results.seePage(2);

	//without cached searchPresenter
	I.refreshPage();
	search.results.waitForTable();

	search.results.dontSeeInResults(doc.name);
	await search.results.seePage(2);
}).tag('navigation').tag('search');

Scenario('Given a search, when I go to page 2 and launch search again, then I see first page', async ({ I, search }) => {
	let doc = await I.createDocument();
	search.openDefault();
	search.form.launchSearch();
	search.results.seeFirst(doc.name);
	search.results.changePage('2');
	search.results.dontSeeInResults(doc.name);
	await search.results.seePage(2);

	search.form.launchSearch();
	search.results.seeFirst(doc.name);
	await search.results.seePage(1);
}).tag('navigation').tag('search');

Scenario('Given I am on the last search result page, when I delete all results from current page and refresh then I see previous page results', async ({ I, search, notification }) => {
	let doc = await I.createDocument();
	search.openMine("oneResultPerPage");
	search.form.launchSearch();
	search.results.sort('Date de création');
	let pages = await search.results.seeNumberOfResults();
	search.results.changePage(pages);
	search.results.seeAndSelectFirst(doc.name);

	search.results.actions.clickNativeAction('Supprimer', true);

	notification.waitForVisible('Le document a été supprimé avec succès.');
	I.refreshPage();
	search.results.waitForTable();

	search.results.dontSeeInResults(doc.name);
	await search.results.seePage(pages - 1);
	search.results.waitForRow(1);
}).tag('navigation').tag('search');


Scenario('Given I have only one page from search result, when I delete all results from current page and refresh then I see no results found message', async ({ I, search, notification }) => {
	let doc = await I.createDocument();
	search.openMine("oneResultPerPage");
	search.form.searchById(doc.id);
	await search.results.seePage(1);
	search.results.seeAndSelectFirst(doc.name);

	search.results.actions.clickNativeAction('Supprimer', true);

	notification.waitForVisible('Le document a été supprimé avec succès.');
	I.refreshPage();
	I.waitForGlassPanelHidden();

	search.results.seeNoResults();
}).tag('navigation').tag('search');

Scenario('Given I am on the last search result page with thumbnails search displayed, when I delete all results from current page and refresh then I see previous page results', async ({ I, search, document, notification }) => {
	let doc = await I.createDocument();
	search.openMine("oneResultPerPage");
	search.form.launchSearch();
	search.results.sort('Date de création');
	let pages = await search.results.seeNumberOfResults();
	search.results.changePage(pages);
	search.results.switchDisplay();
	search.results.waitForCards();
	search.results.seeAndOpenFirstCard(doc.name);
	document.smartActions.openSub('#delete', true);
	notification.waitForVisible('Le document a été supprimé avec succès.');

	await I.waitForNotFoundable('DOCUMENT', doc.id);
	I.refreshPage();
	search.results.waitForCards();

	await search.results.seePage(pages - 1);
}).tag('navigation').tag('search').tag('card');


Scenario('Given I am on the last search result page  with thumbnails search displayed, when I launch search then I return to page 1', async ({ I, search }) => {
	search.openDefault();
	search.form.launchSearch();
	search.results.switchDisplay();
	search.results.changePage('2');
	await search.results.seePage(2);
	search.form.launchSearch();
	search.results.waitForCards();
	await search.results.seePage(1);
}).tag('navigation').tag('search').tag('card');

Scenario('Given I am on the last search result page  with thumbnails search displayed, when I refresh then I still am on page 2', async ({ I, search }) => {
	search.openDefault();
	search.form.launchSearch();
	search.results.switchDisplay();
	search.results.changePage('2');
	await search.results.seePage(2);

	I.refreshPage();
	search.results.waitForCards();

	await search.results.seePage(2);
}).tag('navigation').tag('search').tag('card');

Scenario('Given I have only one page from search result with thumbnails displayed, when I delete all results from current page and refresh then I see no results found message', async ({ I, search, document, notification }) => {
	let doc = await I.createDocument();
	search.openMine("oneResultPerPage");
	search.results.switchDisplay();
	search.form.searchById(doc.id);
	search.results.waitForCards();
	await search.results.seePage(1);
	//To avoid ninja click before history has been updated
	await I.waitInUrl(doc.id, 5);
	search.results.seeAndOpenFirstCard(doc.name);
	document.smartActions.openSub('#delete', true);
	notification.waitForVisible('Le document a été supprimé avec succès.');

	await I.waitForNotFoundable('DOCUMENT', doc.id);
	search.results.waitForResultsContainer();

	I.refreshPage();
	I.waitForGlassPanelHidden();

	search.results.seeNoResults();
}).tag('navigation').tag('search').tag('card');

Scenario('Given I am on the last search result page and I have a custom icon for document class, when I delete all results from current page and refresh then I see previous page results with custom icon', async ({ I, search, notification, utils }) => {
	await I.haveMail();
	let doc = await I.createDocument();
	search.openMine("oneResultPerPage");
	search.form.launchSearch();
	search.results.sort('Date de création');
	let pages = await search.results.seeNumberOfResults();
	search.results.changePage(pages);
	utils.jsapi.icon.addForClass('CourrierEntrant', 'fa fa-search');
	search.results.seeAndSelectFirst(doc.name);

	search.results.actions.clickNativeAction('Supprimer', true);

	notification.waitForVisible('Le document a été supprimé avec succès.');
	I.refreshActivity();
	search.results.waitForTable();
	search.results.dontSeeInResults(doc.name);
	search.results.seePage(pages - 1);
	search.results.waitForRow(1);
	search.results.seeIconColumn('.fa.fa-search', 1);
}).tag('navigation').tag('search');