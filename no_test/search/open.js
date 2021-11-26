//<reference path="../../steps.d.ts" />
Before({ login } => {
    login('admin');
});

Feature('Search / Open result');

Scenario('I find a document then open it with double click', async ({ I, search, document }) => {
    let mail = await I.haveMail(true);

    search.openDefault();
    search.form.category.select('Document');
    search.form.launchQuick(' ');
    search.results.doubleClick(1, mail.name);

    document.waitForOpen();
    document.form.seeFieldTitle(mail.name);
});

Scenario('I find a document then open it with click on its category icon', async ({ I, search, document }) => {
    let mail = await I.haveMail(true);
    search.openDefault();
    search.form.category.select('Document');
    search.form.launchQuick(' ');
    search.results.open(1);

    document.waitForOpen();
    document.form.seeFieldTitle(mail.name);
});

Scenario('I find a document then open it from contextual menu', async ({ I, search, document }) => {
    let mail = await I.haveMail(true);
    search.openDefault();
    search.form.category.select('Document');
    search.form.launchQuick(' ');
    search.results.selectAndShowContextualMenu(1);
    search.results.contextualMenu.click('Ouvrir');

    document.waitForOpen();
    document.form.seeFieldTitle(mail.name);
});

Scenario('Given a folder When I click on child document Then the document is opened', async ({ I, document, folder, data }) => {
    let created = await I.haveFolder({ 'classId': 'NoCaseFolder' });
    folder.open(created.id);
    let documentName = data.faker.system.commonFileName();
    folder.createChildDocument(-1, documentName, document);
    I.refreshActivity();

    folder.documents.results.open(1);
    document.waitForOpen();
    document.form.seeFieldTitle(documentName);
});

Scenario('I open a folder then I go back to search results and I still can open a folder by left click on icon', async ({ I, search, folder }) => {
    search.openDefault();
    search.form.category.select('Dossier');
    search.form.launchQuick("");
    search.results.openFirst();
    I.waitForVisible('.page-icon .fa-folder-open');
    folder.form.cancel();
    search.results.openFirst();
    I.waitForVisible('.page-icon .fa-folder-open');
});