//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Home / LocalStorage Widget');

Scenario('I open a customer folder then see it on home page', async ({ I, virtualFolder }) => {
    let folder = await I.haveCustomerFolder(true);
    await virtualFolder.open(folder.id);
    I.click('.logo-box');
    const widgetName = ".user-search-widget.dossierClientSearch";
    I.waitForElement(widgetName + ' .document-name', 15);
    I.seeElement(widgetName + ' .document-name', folder.refClient + '-' + folder.lastName + ' ' + folder.firstName);
});