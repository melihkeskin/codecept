//<reference path="../../steps.d.ts" />

const data = require('../../../data/data');
Before({ login } => {
	login('admin');
	search.results.smartActions.root = '.search-results .smart-actions';
});
const search = require('../../../pages/search');
Feature('Search / ZIP Export');

Data(data.categories().filter(categories => categories.label != 'Document')).Scenario('I dont see export as ZIP for Folder/virtualFolder/Task', ({ I, current, search }) => {
	search.openDefault();
	search.form.category.select(current.label);
	search.form.launchQuick(' ');
	search.results.waitForTable();

	dontSeeArchive(I);
});

Scenario('I see export as ZIP on document search', async ({ I, search, notification }) => {
	let mail = await I.haveMail(true, 'data/simple.pdf');

	search.openDefault();
	search.form.category.select('Document');
	search.form.searchByString('RefClient', mail.refClient);
	search.results.waitForTable();

	I.handleDownloads();
	search.results.smartActions.openSub("#download-archive");

	notification.waitForVisible('Le téléchargement commence automatiquement');
	I.amInPath('output/downloads');
	I.retry({
		retries: 10,
		minTimeout: 3000,
		maxTimeout: 3000
	}).seeFile('Recherche.zip')

});

Scenario('Given I export search results of a stored search, I see stored search name as file name', async ({ I, notification, data }) => {
	let mail = await I.haveMail(true, 'data/simple.pdf');
	search.openDefault();
	search.form.openAdvancedSearch();
	search.form.classSelector.select('Courrier Entrant');
	search.form.searchByString('RefClient', mail.refClient);
	search.results.waitForTable();

	search.savedSearch.open();
	var name = data.faker.lorem.words();
	search.savedSearch.save(name);
	search.openMine(name);
	search.results.waitForTable();

	I.handleDownloads();
	search.results.smartActions.openSub("#download-archive");

	notification.waitForVisible('Le téléchargement commence automatiquement');
	I.amInPath('output/downloads');
	I.retry({
		retries: 10,
		minTimeout: 3000,
		maxTimeout: 3000
	}).seeFile(name + '.zip')
});

Scenario('Given a document search when I export search results without READ permission on one of result then I do not have it in zip export', async ({ I, notification, data }) => {
	var name = data.faker.lorem.words();
	await I.createDocument({ 'name': name, 'acl': 'acl-create', 'file': 'data/simple.pdf' });
	await I.createDocument({ 'name': name });
	I.login('phu');
	search.openShared('storedSearch');
	search.form.category.select('Document');
	search.form.openAdvancedSearch();
	search.form.selectCustomCriterion('name');
	search.form.selectOperator('name', 'EQUALS_TO');
	search.form.fillFieldCriterion('name', name);
	search.form.launchSearch();
	search.results.waitForTable();
	I.handleDownloads();
	search.results.smartActions.openSub("#download-archive");
	notification.waitForVisible('Le téléchargement commence automatiquement');
	notification.popup.seeWarning("Le téléchargement a échoué");
});

Scenario('Given a document search when I export search results without DOWNLOAD permission on one of result then I do not have it in zip export', async ({ I, notification, data }) => {
	var name = data.faker.lorem.words();
	await I.createDocument({ 'name': name, 'acl': 'acl-read-content', 'file': 'data/simple.pdf' });
	I.login('phu');
	search.openShared('storedSearch');
	search.form.category.select('Document');
	search.form.openAdvancedSearch();
	search.form.selectCustomCriterion('name');
	search.form.selectOperator('name', 'EQUALS_TO');
	search.form.fillFieldCriterion('name', name);
	search.form.launchSearch();
	search.results.waitForTable();
	I.handleDownloads();
	search.results.smartActions.openSub("#download-archive");
	notification.waitForVisible('Le téléchargement commence automatiquement');
	notification.popup.seeWarning("Le téléchargement a échoué");
});

Scenario('Given a document search when I export search results without READ_CONTENT permission on one of result then I do not have it in zip export', async ({ I, notification, data }) => {
	I.login('phu');
	var name = data.faker.lorem.words();
	await I.createDocument({ 'name': name, 'acl': 'acl-read-content', 'file': 'data/simple.pdf' });
	search.openShared('storedSearch');
	search.form.category.select('Document');
	search.form.openAdvancedSearch();
	search.form.selectCustomCriterion('name');
	search.form.selectOperator('name', 'EQUALS_TO');
	search.form.fillFieldCriterion('name', name);
	search.form.launchSearch();
	search.results.waitForTable();
	I.handleDownloads();
	search.results.smartActions.openSub("#download-archive");
	notification.waitForVisible('Le téléchargement commence automatiquement');
	notification.popup.seeWarning("Le téléchargement a échoué");
});

function dontSeeArchive(I) {
	I.waitForVisible('.search-results .smart-actions .dropdown-button');
	I.click('.search-results .smart-actions .dropdown-button');
	within('.search-results .smart-actions .dropdown-menu', function () {
		I.waitForElement('#download-archive.d-none');
	});
}