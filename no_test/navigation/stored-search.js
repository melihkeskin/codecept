//<reference path="../../steps.d.ts" />

Before({ login } => {
	login('admin');
});

Feature('Navigation / Stored search');

const STORED_SEARCH_NAME = 'storedSearch';

Scenario('Given a stored search, when I go to page 2, then I do not see component from first page', async ({ I, search }) => {
	let doc = await I.createDocument();
	search.openMine(STORED_SEARCH_NAME);
	search.form.launchSearch();
	search.results.seeFirst(doc.name);
	search.results.changePage('2');
	search.results.dontSeeInResults(doc.name);

	I.refreshPage();
	search.results.dontSeeInResults(doc.name);
	await search.results.seePage(2);
}).tag('navigation').tag('storedSearch');

Scenario('Given a stored search, when I go to page 2, click on search menu again and refresh, then I see page 2', async ({ I, search }) => {
	let doc = await I.createDocument();
	search.openMine(STORED_SEARCH_NAME);
	search.form.launchSearch();
	search.results.seeFirst(doc.name);
	search.results.changePage('2');
	search.results.dontSeeInResults(doc.name);

	search.openMine(STORED_SEARCH_NAME);
	I.refreshPage();
	search.results.dontSeeInResults(doc.name);
	await search.results.seePage(2);
}).tag('navigation').tag('storedSearch');

Scenario('Given a stored search, when I go to page 2 and refresh, then I see page 2', async ({ I, search }) => {
	let doc = await I.createDocument();
	search.openMine(STORED_SEARCH_NAME);
	search.form.launchSearch();
	search.results.seeFirst(doc.name);
	search.results.changePage('2');
	search.results.dontSeeInResults(doc.name);

	I.refreshPage();
	search.results.dontSeeInResults(doc.name);
	await search.results.seePage(2);
}).tag('navigation').tag('storedSearch');

Scenario('Given a stored search, when I go to page 2 and sort, then I see first page', async ({ I, search }) => {
	let doc = await I.createDocument();
	search.openMine(STORED_SEARCH_NAME);
	search.form.launchSearch();
	search.results.seeFirst(doc.name);
	search.results.changePage('2');
	search.results.dontSeeInResults(doc.name);
	await search.results.seePage(2);

	search.results.sort('Date de création');
	await search.results.seePage(1);
}).tag('navigation').tag('storedSearch');

Scenario('Given a stored search, when I go to page 2, refresh and sort, then I see first page', async ({ I, search }) => {
	let doc = await I.createDocument();
	search.openMine(STORED_SEARCH_NAME);
	search.form.launchSearch();
	search.results.seeFirst(doc.name);
	search.results.changePage('2');
	search.results.dontSeeInResults(doc.name);
	await search.results.seePage(2);

	I.refreshPage();
	search.results.sort('Date de création');
	await search.results.seePage(1);
}).tag('navigation').tag('storedSearch');

Scenario('Given a stored search, when I go to page 2, open document and go back and refresh, then I see page 2', async ({ I, search }) => {
	let doc = await I.createDocument();
	search.openMine(STORED_SEARCH_NAME);
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
	search.results.dontSeeInResults(doc.name);
	await search.results.seePage(2);
}).tag('navigation').tag('storedSearch');

Scenario('Given a stored search, when I go to page 2 and launch search again, then I see first page', async ({ I, search }) => {
	let doc = await I.createDocument();
	search.openMine(STORED_SEARCH_NAME);
	search.form.launchSearch();
	search.results.seeFirst(doc.name);
	search.results.changePage('2');
	search.results.dontSeeInResults(doc.name);
	await search.results.seePage(2);

	search.form.launchSearch();
	search.results.seeFirst(doc.name);
	await search.results.seePage(1);
}).tag('navigation').tag('storedSearch');

Scenario('Given I add a column to stored search with Document category selected, when I refresh page from another place and come to stored search, then I see added column', async ({ I, search, sidemenu }) => {
	let columnName = 'Date de mise à jour';

	search.openMine(STORED_SEARCH_NAME);
	search.results.waitForTable();
	search.results.addColumn(columnName);

	sidemenu.open("Accueil");
	I.refreshPage();

	search.openMine(STORED_SEARCH_NAME);
	search.results.waitForTable();

	search.results.seeColumn(columnName);
}).tag('navigation').tag('storedSearch');

Scenario('Given I add a column to stored search with Folder category selected, when I refresh page from another place and come to stored search, then I see added column', async ({ I, search, sidemenu }) => {
	let columnName = 'Date de mise à jour';
	let storedSearchName = 'folderStoredSearch';

	search.openMine(storedSearchName);
	search.results.waitForTable();
	search.results.addColumn(columnName);

	sidemenu.open("Accueil");
	I.refreshPage();

	search.openMine(storedSearchName);
	search.results.waitForTable();

	search.results.seeColumn(columnName);
}).tag('navigation').tag('storedSearch');