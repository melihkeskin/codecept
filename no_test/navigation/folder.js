//<reference path="../../steps.d.ts" />   

Before({ login } => {
    login('admin');
});

Feature('Navigation / Folder');

Scenario('Given a folder, when I filter results and refresh page, then I still see criterion after refresh', async ({ I, folder }) => {
    let rootFolder = await I.haveFolder({ 'classId': 'NoCaseFolder' });
    folder.open(rootFolder.id);
    folder.form.seeFieldTitle(rootFolder.name);
    let doc = await folder.documents.addDocument();
    I.waitForFoundable('DOCUMENT', doc.name, 'name');

    I.refreshActivity();
    folder.documents.openFilters();
    folder.documents.searchForm.seeCriterion("name", "");
    folder.documents.searchForm.classSelector.see("");
    folder.documents.searchForm.classSelector.select("Document");
    folder.documents.searchForm.launchSearch();
    folder.documents.results.seeFirst(doc.name);

    I.refreshActivity();
    folder.documents.openFilters();
    folder.documents.searchForm.seeCriterion("name", "");
    folder.documents.searchForm.classSelector.see("Document");
}).tag('navigation').tag('folder');

Scenario('Given a I visualize a sub folder, when I filter results and refresh page, then I do not see criterion after refresh', async ({ I, folder, data, document }) => {
    let rootFolder = await I.haveFolder({ 'classId': 'NoCaseFolder' });
    folder.open(rootFolder.id);
    folder.form.seeFieldTitle(rootFolder.name);
    let doc = await folder.documents.addDocument();
    I.waitForFoundable('DOCUMENT', doc.name, 'name');
    const folderName = data.faker.lorem.word();
    folder.createChildFolder(-1, folderName);
    folder.createChildDocument(0, folderName + '-child1', document);
    I.waitForFoundable('DOCUMENT', folderName + '-child1', 'name');

    folder.documents.results.waitForTable();
    folder.select(0, folderName);

    folder.documents.openFilters();
    folder.documents.searchForm.seeCriterion("name", "");
    folder.documents.searchForm.classSelector.see("");
    folder.documents.searchForm.classSelector.select("Document");
    folder.documents.searchForm.launchSearch();
    folder.documents.results.waitForTable();
    folder.documents.results.seeFirst(folderName + '-child1');

    I.refreshActivity();
    folder.documents.openFilters();
    folder.documents.searchForm.classSelector.dontSee("Document");
}).tag('navigation').tag('folder');