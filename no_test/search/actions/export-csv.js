//<reference path="../../steps.d.ts" />

Before({ login } => {
	login('admin');
	search.results.smartActions.root = '.search-results .smart-actions';
});

const search = require('../../../pages/search');
const data = require('../../../data/data');

Feature('Search / CSV export');

Scenario('I export search results as CSV within custom search form', async ({ I, search }) => {
	let customer = await I.haveCustomerFolder(true);
	search.open('.dossierClientSearchTab');
	search.form.launchQuick(customer.lastName);
	search.results.waitForTable();

	I.handleDownloads();
	search.results.smartActions.openSub("#download");
	I.amInPath('output/downloads');
	I.retry({
		retries: 20,
		minTimeout: 1000
	}).seeFile('Dossiers Clients.csv');
});

Data(data.categories()).Scenario('I export search results as CSV within default search', ({ I, current, search }) => {
	search.openDefault();
	search.form.category.select(current.label);
	if (current.label == "Dossier") {
		search.form.launchQuick(' ');
	} else {
		search.form.launchQuick('Jean');
	}
	I.waitForGlassPanelHidden();

	search.results.waitForTable();

	I.handleDownloads();
	search.results.smartActions.openSub("#download");
	I.amInPath('output/downloads');
	I.retry({
		retries: 60,
		minTimeout: 1000
	}).seeFile('Recherche.csv');
});

Scenario('I export CSV search results and see french labels', ({ I, search }) => {
	const className_fr = 'Configuration d\'un annuaire d\'entreprise';
	search.openDefault();
	search.form.category.select('Document');
	exportCSVAndVerifyTranslatedLabel(I, search, className_fr, "Recherche.csv");
});

Scenario('I export CSV search results with EN locale and see english labels', async ({ I, search }) => {
	const className_en = 'Configuration of LDAP';
	var scope = await I.getCurrentScope();
	I.amOnPage('/?scope=' + scope + '&locale=EN#Search:%7B%22t%22:%22DefaultSearch%22,%22r%22:%7B%22s%22:0,%22m%22:0%7D%7D');
	exportCSVAndVerifyTranslatedLabel(I, search, className_en, "Search.csv");
});

Scenario('I export CSV search results with UNKNOWN locale and see english labels', async ({ I, search }) => {
	const className_en = 'Configuration of LDAP';
	await I.login('admin', 'UNKNOWN');

	var scope = await I.getCurrentScope();
	I.amOnPage('/?scope=' + scope + '&locale=UNKNOWN#Search:%7B%22t%22:%22DefaultSearch%22,%22r%22:%7B%22s%22:0,%22m%22:0%7D%7D');
	exportCSVAndVerifyTranslatedLabel(I, search, className_en, "Search.csv");
});

function exportCSVAndVerifyTranslatedLabel(I, search, className, fileName) {
	search.form.openAdvancedSearch();
	search.form.fillListCriterion('classid', className);
	search.form.launchSearch();
	search.results.waitForTable();

	I.handleDownloads();
	search.results.smartActions.openSub("#download");
	I.amInPath('output/downloads');
	I.retry({
		retries: 60,
		minTimeout: 1000
	}).seeFile(fileName);
	I.seeInThisFile(className);
}

Scenario('I select additional columns, then see them in exported CSV file', ({ I, search }) => {
	search.openDefault();
	search.form.category.select('Document');
	search.form.launchQuick('Jean');
	search.results.waitForTable();

	const column1 = 'Canal';
	const column2 = 'Type de courrier';
	search.results.addColumn(column1);
	search.results.seeColumn(column1);
	search.results.toggleColumnSelector();
	search.results.addColumn(column2);
	search.results.seeColumn(column2);
	search.results.toggleColumnSelector();

	I.handleDownloads();
	search.results.smartActions.openSub("#download");
	I.amInPath('output/downloads');
	I.retry({
		retries: 60,
		minTimeout: 1000
	}).seeFile('Recherche.csv');

	I.seeInThisFile(column1);
	I.seeInThisFile(column2);
});

Scenario('I sort results then see ordered rows within exported CSV file', ({ I, search }) => {
	search.openDefault();
	search.form.category.select('Document');
	search.form.launchQuick('Jean');

	search.results.sort('Date de création');

	I.handleDownloads();
	search.results.smartActions.openSub("#download");
	I.amInPath('output/downloads');
	I.retry({
		retries: 60,
		minTimeout: 1000
	}).seeFile('Recherche.csv');

	I.seeInThisFile('\"name\";\"Type\";\"creationDate\"' +
		'\n\"Facture 1\";\"Courrier Entrant\";\"2017-10-11 09:28:33.788 +0200\"' +
		'\n\"Facture 2\";\"Courrier Entrant\";\"2017-10-11 10:28:33.788 +0200\"' +
		'\n\"Facture 3\";\"Courrier Entrant\";\"2017-10-11 11:28:33.788 +0200\"' +
		'\n\"Facture 4\";\"Courrier Entrant\";\"2017-10-11 12:28:33.788 +0200\"' +
		'\n\"AssuranceHabitation_DUPONT.pdf\";\"Courrier Entrant\";\"2017-10-11 14:28:33.788 +0200\"');
});

Scenario('Given I export search results of a stored search, I see stored search name as file name', async ({ I, notification, data }) => {
	var name = data.faker.lorem.words();
	search.openDefault();
	search.form.openAdvancedSearch();
	search.form.classSelector.select('Courrier Entrant');
	search.savedSearch.open();
	search.savedSearch.save(name);
	search.openMine(name);
	search.results.waitForTable();

	I.handleDownloads();
	search.results.smartActions.openSub("#download");

	notification.waitForVisible('Le téléchargement commence automatiquement');
	I.amInPath('output/downloads');
	I.retry({
		retries: 10,
		minTimeout: 3000,
		maxTimeout: 3000
	}).seeFile(name + '.csv')
});

Scenario('Given a document search when I export search results without READ permission on one of result then I do not have it in csv export', async ({ I, notification, data }) => {
	let doc = await I.createDocument({ 'acl': 'acl-create' }, true);
	search.openMine('storedSearch');
	search.results.seeFirst(doc.name);

	I.login('phu');
	search.openShared('storedSearch');
	search.results.dontSeeInResults(doc.name);
	I.handleDownloads();
	search.results.smartActions.openSub("#download");
	I.amInPath('output/downloads');
	I.retry({
		retries: 60,
		minTimeout: 1000
	}).seeFile('storedSearch.csv');

	I.dontSeeInThisFile('\n\"' + doc.name + '\";\"Document\";');
});