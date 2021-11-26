//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Virtual folder');

Scenario('I open virtual folder then export its content as a ZIP', async ({ I, virtualFolder, notification }) => {
    let mail = await I.haveMail(true, 'data/simple.pdf');
    await virtualFolder.open(mail.refClient);

    I.handleDownloads();
    virtualFolder.smartActions.openSub("#componentContentArchiveAction");
    let name = await I.executeScript(function () {
        return JSAPI.get().getLastComponentFormAPI().getComponent().getName();
    });

    notification.waitForVisible('Le téléchargement commence', 15);
    I.amInPath('output/downloads');
    I.retry({
        retries: 10,
        minTimeout: 3000,
        maxTimeout: 3000
    }).seeFile(name + '.zip')
}).tag('virtualFolder').tag('export-zip');

Scenario('Given I am on a virtual folder result table, then export results as a ZIP, I see VF Name as zip name', async ({ I, virtualFolder, notification }) => {
    let mail = await I.haveMail(true, 'data/simple.pdf');
    await virtualFolder.open(mail.refClient);
    virtualFolder.switchToTable();
    virtualFolder.searchResults.waitForTable();

    I.handleDownloads();
    virtualFolder.searchResults.smartActions.root = '.search-results .smart-actions';
    virtualFolder.searchResults.smartActions.openSub("#download-archive");
    let name = await I.executeScript(function () {
        return JSAPI.get().getLastComponentFormAPI().getComponent().getName();
    });

    notification.waitForVisible('Le téléchargement commence', 15);
    I.amInPath('output/downloads');
    I.retry({
        retries: 10,
        minTimeout: 3000,
        maxTimeout: 3000
    }).seeFile(name + '.zip')
}).tag('virtualFolder').tag('export-zip');

Scenario('Given I am on a virtual folder result table, then export results as a ZIP, I see VF Name as zip name', async ({ I, virtualFolder, notification }) => {
    let mail = await I.haveMail(true, 'data/simple.pdf');
    await virtualFolder.open(mail.refClient);
    virtualFolder.switchToTable();
    virtualFolder.searchResults.waitForTable();

    I.handleDownloads();
    virtualFolder.searchResults.smartActions.root = '.search-results .smart-actions';
    virtualFolder.searchResults.smartActions.openSub("#download");
    let name = await I.executeScript(function () {
        return JSAPI.get().getLastComponentFormAPI().getComponent().getName();
    });

    notification.waitForVisible('Le téléchargement commence', 15);
    I.amInPath('output/downloads');
    I.retry({
        retries: 10,
        minTimeout: 3000,
        maxTimeout: 3000
    }).seeFile(name + '.csv')
}).tag('virtualFolder').tag('export-csv');