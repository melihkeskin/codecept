//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Document / Deletion / Physical');

Scenario('I delete a document from form then purge it', async ({ I, document, sidemenu, admin, notification }) => {
    let doc = await I.createDocument({}, true);
    await document.open(doc.id);
    document.form.deleteLogically();
    notification.waitForVisible('Le document a été supprimé avec succès.');

    admin.bins.documents.open();
    admin.bins.documents.purge(doc.name);
    await I.waitForNotFoundable('DOCUMENT', doc.id, false, [{ 'name': 'status', 'value': 'DELETED' }]);
}).tag('document').tag('physicalDeletion');

Scenario('I delete a document from search action then purge it', async ({ I, search, admin, notification }) => {
    let doc = await I.createDocument({}, true);
    search.openDefault();
    search.form.searchById(doc.id);
    search.results.waitForTable();

    search.results.seeAndSelectFirst(doc.name);
    search.results.actions.clickNativeAction('Supprimer', true);
    notification.waitForVisible('Le document a été supprimé avec succès.');
    I.waitForGlassPanelHidden();

    admin.bins.documents.open();
    admin.bins.documents.purge(doc.name);
    await I.waitForNotFoundable('DOCUMENT', doc.id, false, [{ 'name': 'status', 'value': 'DELETED' }]);
}).tag('document').tag('physicalDeletion');

Scenario('I delete a document from contextual menu then purge it', async ({ I, search, admin, notification }) => {
    let doc = await I.createDocument({}, true);
    search.openDefault();
    search.form.searchById(doc.id);
    search.results.waitForTable();

    search.results.seeAndSelectFirst(doc.name);
    search.results.selectAndShowContextualMenu(1);
    search.results.contextualMenu.clickAndConfirm('Supprimer');
    notification.waitForVisible('Le document a été supprimé avec succès.');
    I.waitForGlassPanelHidden();

    admin.bins.documents.open();
    admin.bins.documents.purge(doc.name);
    await I.waitForNotFoundable('DOCUMENT', doc.id, false, [{ 'name': 'status', 'value': 'DELETED' }]);
}).tag('document').tag('physicalDeletion');