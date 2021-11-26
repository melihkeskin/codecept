//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Document / Deletion / Logical');

Scenario('Given that a document when I search it and I delete it then I cannot found it', async ({ I, search, notification }) => {
    let doc = await I.createDocument({}, true);
    searchById(search, doc.id)
    search.results.seeAndSelectFirst(doc.name);
    search.results.actions.clickNativeAction('Supprimer', true);

    notification.waitForVisible('Le document a été supprimé avec succès.');
    search.results.waitForTable();
    await I.waitForNotFoundable('DOCUMENT', doc.id);

    I.refreshActivity();
    search.results.waitForTable();
    search.results.dontSeeInResults(doc.name);
}).tag('document').tag('logicalDeletion');

Scenario('Given that a document when I open it and I delete it then I cannot found it', async ({ I, document, search, notification }) => {
    let doc = await I.createDocument();
    document.open(doc.id);
    document.smartActions.openSub('#delete', true);
    notification.waitForVisible('Le document a été supprimé avec succès.');
    await I.waitForNotFoundable('DOCUMENT', doc.id);

    searchById(search, doc.id)
    search.results.dontSeeInResults(doc.name);
}).tag('document').tag('logicalDeletion');

Scenario('Given that a document when I open it and I delete it as admin then I cannot open it as simple user', async ({ I, document, notification }) => {
    let doc = await I.createDocument();
    document.open(doc.id);
    document.smartActions.openSub('#delete', true);
    notification.waitForVisible('Le document a été supprimé avec succès.');

    await I.login('phu');
    I.executeScript(({ id }) => {
        JSAPI.get().getNavigationAPI().goToComponentPlace('DOCUMENT', id, false);
    }, doc.id);
    I.waitForGlassPanelHidden();

    I.waitForText('Impossible de récupérer le document.', 5, '.modal-content');
    I.dontSee(doc.name);
}).tag('document').tag('logicalDeletion');


Scenario('Given that a deleted document when I restore it then I can found it', async ({ I, document, notification, search, admin }) => {
    let doc = await I.createDocument();
    document.open(doc.id);
    document.smartActions.openSub('#delete', true);
    notification.waitForVisible('Le document a été supprimé avec succès.');

    await I.waitForNotFoundable('DOCUMENT', doc.id);

    admin.bins.documents.open();
    admin.bins.documents.restore(doc.name);
    await I.waitForFoundable('DOCUMENT', doc.id);
    await admin.bins.documents.quit();

    searchById(search, doc.id)
    search.results.seeFirst(doc.name);
}).tag('document').tag('logicalDeletion').tag('restore');

Scenario('Given that a deleted document when I restore it then I can open it as simple user', async ({ I, document, notification, admin }) => {
    let doc = await I.createDocument();
    document.open(doc.id);
    document.smartActions.openSub('#delete', true);
    notification.waitForVisible('Le document a été supprimé avec succès.');

    await I.waitForNotFoundable('DOCUMENT', doc.id);
    admin.bins.documents.open();
    admin.bins.documents.restore(doc.name);

    await I.login('phu');
    document.open(doc.id);
    document.form.seeFieldTitle(doc.name);
}).tag('document').tag('logicalDeletion').tag('restore');

function searchById(search, id) {
    search.openDefault();
    search.form.searchById(id);
    search.results.waitForTable();
}