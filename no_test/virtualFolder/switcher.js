//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Virtual folder / Switcher');

Scenario('Given a virtual folder when I switch to table mode and I open a document and I go back then the state is restored to table mode', async ({ I, virtualFolder, searchResults }) => {
    let mail = await I.haveMail(true);
    await virtualFolder.open(mail.refClient);
    virtualFolder.switchToTable();
    searchResults.seeAndOpenFirst(mail.object);
    I.goBack();
    virtualFolder.waitForOpen();
    searchResults.seeFirst(mail.object);
});

Scenario('Given a virtual folder when I switch to table mode and I switch to viewer mode and I open a document and I go back then the state is restored to viewer mode', async ({ I, data, virtualFolder, searchResults, document }) => {
    let mail1 = await I.haveMail(true, 'data/simple.pdf');

    let mail2 = data.mail();
    mail2.refClient = mail1.refClient;
    mail2.routing = mail1.routing;
    await I.haveMail(true, 'data/multi-pages.pdf', mail2);

    await virtualFolder.open(mail1.refClient);
    virtualFolder.switchToTable();
    virtualFolder.switchToViewer();

    virtualFolder.clickOnTreeItem(mail2.object);
    document.viewer.seeSelected('multi-pages.pdf', 4);
    document.viewer.seeDocumentCount(1);

    await document.open(mail1.id);
    I.goBack();
    virtualFolder.waitForOpen();
    document.viewer.seeSelected('multi-pages.pdf', 4);
    document.viewer.seeDocumentCount(1);
});

Scenario('Given a virtual folder when I switch to table mode and I switch to viewer mode then I visualize documents', async ({ I, data, virtualFolder }) => {
    let mail1 = await I.haveMail(true, 'data/simple.pdf');

    let mail2 = data.mail();
    mail2.refClient = mail1.refClient;
    mail2.routing = mail1.routing;
    await I.haveMail(true, 'data/multi-pages.pdf', mail2);

    await virtualFolder.open(mail1.refClient);
    virtualFolder.clickOnTreeItem(mail2.object);
    virtualFolder.switchToTable();
    virtualFolder.searchResults.waitForRow(2);

    virtualFolder.switchToViewer();
    virtualFolder.viewer.seeSelected('multi-pages.pdf', 4);
    virtualFolder.viewer.seeDocumentCount(2);
});

Scenario('I open a leaf, then I switch to table mode and see bucket according to the selected leaf, then switch to viewer mode and see the bucket opened', async ({ I, data, virtualFolder, searchResults, document }) => {
    let mail1 = await I.haveMail(true, 'data/simple.pdf');

    let mail2 = data.mail();
    mail2.refClient = mail1.refClient;
    mail2.routing = mail1.routing;
    await I.haveMail(true, 'data/multi-pages.pdf', mail2);

    await virtualFolder.open(mail1.refClient);
    virtualFolder.clickOnTreeItem(mail1.routing.type.label);
    virtualFolder.switchToTable();
    searchResults.seeFirst(mail2.object);

    virtualFolder.switchToViewer();
    document.viewer.seeSelected('multi-pages.pdf', 4);
    document.viewer.seeDocumentCount(2);
});

Scenario('I open an empty branch in viewer mode then switch to aggregation mode then go back, and I dont see the result table.', async ({ I, virtualFolder, searchResults, document }) => {
    let mail1 = await I.haveMail(true, 'data/simple.pdf');
    await virtualFolder.open(mail1.refClient);
    virtualFolder.clickOnTreeItem('Réponses');
    document.viewer.dontSee();
    virtualFolder.switchToTable();
    searchResults.seeNoResults();

    virtualFolder.switchToViewer();
    I.waitForInvisible('#searchView', 5);
    document.viewer.dontSee();
});

Scenario('I open an empty branch on aggreagtion mode, then I refresh the page, then I switch to the viewer mode, and I dont see the result table.', async ({ I, virtualFolder, document }) => {
    let mail = await I.haveMail(true);
    await virtualFolder.open(mail.refClient);

    virtualFolder.switchToTable();
    virtualFolder.clickOnTreeItem('Réponses');

    I.refreshPage();
    virtualFolder.waitForOpen();
    virtualFolder.switchToViewer();
    I.dontSeeElement('#searchView');
    document.viewer.dontSee();
});

Scenario('I open all branche then open a document on viewer mode, then I refresh page, then I switch to aggregation mode, and I still see the result table', async ({ I, virtualFolder, searchResults, document }) => {
    let mail = await I.haveMail(true, 'data/simple.pdf');
    await virtualFolder.open(mail.refClient);

    virtualFolder.clickOnTreeItem(mail.routing.type.label);
    virtualFolder.clickOnTreeItem('Réponses');

    virtualFolder.clickOnTreeItem(mail.object);
    document.viewer.seeSelected('simple.pdf', 1);
    document.viewer.seeDocumentCount(1);

    I.refreshPage();
    virtualFolder.waitForOpen();
    virtualFolder.switchToTable();
});

Scenario('Given a virtual folder containing documents when I open it then I see the switcher icon', async ({ I, search, virtualFolder }) => {
    let mail = await I.haveMail(true);
    await virtualFolder.open(mail.refClient);
    I.seeElement('.virtual-folder-children-switcher');
}).tag('virtualFolder').tag('switcher');

Scenario('Given a virtual folder containing only tasks when I open it then I dont see the switcher icon', async ({ I, sidemenu }) => {
    sidemenu.open('Tous les courriers');
    I.waitForGlassPanelHidden();
    I.dontSeeElement('.virtual-folder-children-switcher');
}).tag('virtualFolder').tag('switcher');
