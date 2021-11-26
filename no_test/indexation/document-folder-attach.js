//<reference path="../../steps.d.ts" />
const faker = require('faker');

Before({ login } => {
    login('admin');
});

Feature('Document / Attach to folder');

Scenario('I attach a document to a folder using quick search to find it', async ({ I, search, document }) => {
    let doc = await I.createDocument();
    let folder = await I.haveFolder({ 'classId': 'NoCaseFolder' }, true);
    document.open(doc.id);
    document.smartActions.openSub("#attach");

    document.folderAttacher.quickSearch(folder.name);
    search.results.seeAndSelect(folder.name, 1);
    document.folderAttacher.validateSelection();
    document.folderAttacher.folderBrowser.selectFolder(folder.name);
    document.folderAttacher.folderBrowser.validate();
    document.footer.click('#saveAndQuit', 'Le document a été mis à jour avec succès.');

    await I.waitForFoundable('FOLDER', folder.name, 'name', [{ 'name': 'children.id_value', 'value': doc.id }])

    await document.open(doc.id);
    document.form.openParentFolder(folder.name);
    document.form.seeFieldTitle(folder.name);
}).tag('folder').tag('document').tag('attach');

Scenario('I attach a document to a folder using advanced search to find it', async ({ I, search, document }) => {
    let doc = await I.createDocument();
    let folder = await I.haveFolder({}, true);
    document.open(doc.id);
    document.smartActions.openSub("#attach");

    document.folderAttacher.advancedSearch();
    search.form.launchQuick(folder.name);
    search.results.seeAndSelect(folder.name, 1);
    document.folderAttacher.validateSelection();
    document.folderAttacher.folderBrowser.selectFolder(folder.name);
    document.folderAttacher.folderBrowser.validate();
    document.footer.click('#saveAndQuit', 'Le document a été mis à jour avec succès.');

    await I.waitForFoundable('FOLDER', folder.name, 'name', [{ 'name': 'children.id_value', 'value': doc.id }])

    await document.open(doc.id);
    document.form.openParentFolder(folder.name);
    document.form.seeFieldTitle(folder.name);
}).tag('folder').tag('document').tag('attach');

/*Scenario('Attach to folder by Browse', (I , search,smartActions,sidemenu,folderBrowser)=>{
   const name = faker.lorem.word();
    I.createFolderInRoot(name);  
    I.searchAndOpenFirstFoundDocument(search);
    smartActions.openSub('#attach');
    I.wait(3);
    folderBrowser.open('#browseFolder');
    folderBrowser.findElementInBrowse(name);
}).tag('folder').tag('document').tag('attach');*/

Scenario('I attach a document to a new folder', async ({ I, data, document, folder, notification }) => {
    let doc = await I.createDocument();
    document.open(doc.id);
    document.smartActions.openSub("#attach");

    document.folderAttacher.newFolder();
    document.form.root = ".modal-dialog.component-creation.folder";
    document.form.changeClass("NoCaseFolder");
    document.form.root = "";
    I.waitForGlassPanelHidden();

    let folderName = data.faker.lorem.word();
    I.fillField('.modal-header .title-container .string-input', folderName);
    folder.form.create();
    notification.waitForVisible('Le dossier a été créé avec succès.', 10);
    document.footer.click('#saveAndQuit', 'Le document a été mis à jour avec succès.');

    await I.waitForFoundable('FOLDER', folderName, 'name', [{ 'name': 'children.id_value', 'value': doc.id }])

    await document.open(doc.id);
    document.form.openParentFolder(folderName);
    document.form.seeFieldTitle(folderName);
}).tag('folder').tag('document');

Scenario('I attach a document to a folder, then I cannot open a folder by a simple left click', async ({ I, document, search }) => {
    let mail = await I.haveMail();
    await document.open(mail.id);
    document.smartActions.openSub("#attach");
    document.folderAttacher.quickSearch("");
    search.results.open(1);

    I.seeElement(".modal-dialog.component-search .fa-folder-open");
}).tag('search').tag('popup');

Scenario('I attach a document to a folder, then I can open the contextual menu to open the folder', async ({ I, document, search }) => {
    let mail = await I.haveMail();
    await document.open(mail.id);
    document.smartActions.openSub("#attach");
    document.folderAttacher.quickSearch("");
    search.results.selectAndShowContextualMenu(1);
}).tag('search').tag('popup');

Scenario('I attach a document to a folder, then I can open the folder by double click', async ({ I, document, search }) => {
    let mail = await I.haveMail();
    let folder = await I.haveFolder({}, true);
    await document.open(mail.id);
    document.smartActions.openSub("#attach");
    document.folderAttacher.quickSearch("");
    search.results.doubleClick(1, folder.name);
    I.waitForInvisible(".modal-dialog.component-search", 5);
    document.folderAttacher.seeSelectable(folder.name);
}).tag('search').tag('popup');