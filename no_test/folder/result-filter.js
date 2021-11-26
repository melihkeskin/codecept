//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature("Folder / Filters");

Scenario('Given I have an empty folder, when I open it, then I do not see filters', async ({ I, folder }) => {
    let rootFolder = await I.haveFolder({ 'classId': 'NoCaseFolder' });
    folder.open(rootFolder.id);
    folder.form.seeFieldTitle(rootFolder.name);

    folder.documents.seeDropZone();
    folder.documents.dontSeeFilters("DOCUMENT");
}).tag('folder').tag('filter');

Scenario('Given I have a folder with a document, when I open it, then I see document filters', async ({ I, folder }) => {
    let rootFolder = await I.haveFolder({ 'classId': 'NoCaseFolder' });
    folder.open(rootFolder.id);
    folder.form.seeFieldTitle(rootFolder.name);

    let doc = await folder.documents.addDocument();
    I.waitForFoundable('DOCUMENT', doc.name, 'name');

    I.refreshActivity();

    folder.documents.searchForm.seeCriterion("name", "");
}).tag('folder').tag('filter');

Scenario('Given I have a folder with only one document class authorized as children, when add a children ,then I see document filters without class selector', async ({ I, folder }) => {
    let rootFolder = await I.haveFolder({ 'classId': 'OneDocumentChildClass' });
    folder.open(rootFolder.id);
    folder.form.seeFieldTitle(rootFolder.name);

    let doc = await folder.documents.addDocument();
    I.waitForFoundable('DOCUMENT', doc.name, 'name');

    I.refreshActivity();

    folder.documents.openFilters();
    folder.documents.searchForm.seeCriterion("name", "");
    folder.dontSeeClassSelector("DOCUMENT");
}).tag('folder').tag('filter');

Scenario('Given I have a folder with two document classes authorized as children, when add a children ,then I see document filters and class selector with only authorized children classes', async ({ I, folder }) => {
    let rootFolder = await I.haveFolder({ 'classId': 'twoDocumentClassesChildren' });
    folder.open(rootFolder.id);
    folder.form.seeFieldTitle(rootFolder.name);

    let doc = await folder.documents.addDocument();
    I.waitForFoundable('DOCUMENT', doc.name, 'name');

    I.refreshActivity();

    folder.documents.openFilters();
    folder.documents.searchForm.seeCriterion("name", "");
    folder.documents.searchForm.classSelector.see("");
    I.click(folder.documents.searchForm.root + ' .multi-valued-box-list');

    folder.documents.searchForm.picker.search('sortant');
    folder.documents.searchForm.picker.dontSee('CourrierSortant');
    folder.documents.searchForm.picker.search('Document');
    folder.documents.searchForm.picker.see('Document');
    folder.documents.searchForm.picker.search('entrant');
    folder.documents.searchForm.picker.see('CourrierEntrant');
}).tag('folder').tag('filter');

Scenario('Given I have a folder with all document classes authorized as children, when add a children ,then I see document filters and class selector with all document classes', async ({ I, folder }) => {
    let rootFolder = await I.haveFolder({ 'classId': 'NoCaseFolder' });
    folder.open(rootFolder.id);
    folder.form.seeFieldTitle(rootFolder.name);

    let doc = await folder.documents.addDocument();
    I.waitForFoundable('DOCUMENT', doc.name, 'name');

    I.refreshActivity();

    folder.documents.openFilters();
    folder.documents.searchForm.seeCriterion("name", "");
    folder.documents.searchForm.classSelector.see("");
    I.click(folder.documents.searchForm.root + ' .multi-valued-box-list');

    folder.documents.searchForm.picker.search('sortant');
    folder.documents.searchForm.picker.see('CourrierSortant');
}).tag('folder').tag('filter');

Scenario('Given I have a folder with several documents of different classes as children, when I filter by classId ,then I see expected document in result table', async ({ I, folder }) => {
    let rootFolder = await I.haveFolder({ 'classId': 'twoDocumentClassesChildren' });
    folder.open(rootFolder.id);
    folder.form.seeFieldTitle(rootFolder.name);

    let mail = await I.haveMail();
    I.executeScriptX(({ folder, mail, done }) => {
        var child = new ComponentReference(mail.id, "DOCUMENT");
        JSAPI.get().folder().addChildren(folder.id, [child], false, function () {
            done();
        });
    }, rootFolder, mail);
    let doc = await folder.documents.addDocument();
    I.waitForFoundable('DOCUMENT', doc.name, 'name');

    I.refreshActivity();

    folder.documents.openFilters();
    folder.documents.searchForm.seeCriterion("name", "");
    folder.documents.searchForm.classSelector.see("");
    folder.documents.searchForm.classSelector.select("Document");
    folder.documents.searchForm.launchSearch();
    folder.documents.results.seeFirst(doc.name);
    folder.documents.results.dontSeeInResults(mail.name);
}).tag('folder').tag('filter');

Scenario('Given I have a folder with several documents as children, when I filter by name ,then I see expected document in result table', async ({ I, folder }) => {
    let rootFolder = await I.haveFolder({ 'classId': 'twoDocumentClassesChildren' });
    folder.open(rootFolder.id);
    folder.form.seeFieldTitle(rootFolder.name);
    let doc1 = await folder.documents.addDocument();
    I.waitForFoundable('DOCUMENT', doc1.name, 'name');

    let doc2 = await I.createDocument();
    I.executeScriptX(({ folder, doc, done }) => {
        var child = new ComponentReference(doc.id, "DOCUMENT");
        JSAPI.get().folder().addChildren(folder.id, [child], false, function () {
            done();
        });
    }, rootFolder, doc2);

    I.refreshActivity();

    folder.documents.openFilters();
    folder.documents.searchForm.seeCriterion("name", "");
    folder.documents.searchForm.classSelector.see("");
    folder.documents.searchForm.fillStringCriterion('name', doc2.name);
    folder.documents.searchForm.launchSearch();
    folder.documents.results.seeFirst(doc2.name);

    folder.documents.results.dontSeeInResults(doc1.name);
}).tag('folder').tag('filter');
