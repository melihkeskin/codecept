//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Folder / ZIP Export');

Scenario('I open empty folder then export it as ZIP and see error', async ({ I, folder, notification }) => {
    let created = await I.haveFolder({ 'classId': 'NoCaseFolder' });
    folder.open(created.id);

    I.handleDownloads();
    folder.smartActions.openSub("#componentContentArchiveAction");
    notification.waitForVisible('Le téléchargement commence automatiquement');
    notification.popup.waitForShow();
    notification.popup.seeWarning("Le téléchargement a échoué");
    notification.popup.close();
}).tag('folder').tag('export-zip');

Scenario('I open folder with child folder then export it as ZIP and see error', async ({ I, folder, notification }) => {
    let created = await I.haveFolder({ 'classId': 'NoCaseFolder' });
    folder.open(created.id);
    folder.createChildFolder(-1, 'sub folder');
    I.refreshActivity();

    I.handleDownloads();
    folder.smartActions.openSub("#componentContentArchiveAction");
    notification.waitForVisible('Le téléchargement commence automatiquement');
    notification.popup.waitForShow();
    notification.popup.seeWarning("Le téléchargement a échoué");
    notification.popup.close();
}).tag('folder').tag('export-zip');

Scenario('I open folder with content then export it as ZIP', async ({ I, folder, document, notification }) => {
    let created = await I.haveFolder({ 'classId': 'NoCaseFolder' });
    folder.open(created.id);
    folder.createChildDocument(-1, created.name + '-child1', document);
    I.refreshActivity();

    I.handleDownloads();
    folder.smartActions.openSub("#componentContentArchiveAction");
    notification.waitForVisible('Le téléchargement commence automatiquement');
    I.amInPath('output/downloads');
    I.retry({
        retries: 10,
        minTimeout: 3000,
        maxTimeout: 3000
    }).seeFile(created.name + '.zip')
}).tag('folder').tag('export-zip');