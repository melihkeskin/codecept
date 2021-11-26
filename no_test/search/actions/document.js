//<reference path="../../steps.d.ts" />
Before({ login } => {
    login('admin');
});

Feature('Search / Document actions');

Scenario('Given I select one document without content, when I display contextual menu,then I see open and not visualize and download action', async ({ I, search }) => {
    await I.haveMail(true);
    search.open('.documentSearchTab');

    search.results.select(1);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenAction();
    search.results.dontSeeDownloadAction();
    search.results.dontSeeVisualizeAction();
}).tag('search').tag('actions').tag('document');

Scenario('Given I select two document without content, when I display contextual menu,then I see open and not download action', async ({ I, search }) => {
    await I.haveMail(true);
    await I.haveMail(true);
    search.open('.documentSearchTab');

    search.results.select(1);
    search.results.select(2);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenExternalAction();
    search.results.dontSeeDownloadAction();
}).tag('search').tag('actions').tag('document');

Scenario('Given I select one document with content and not reserved, when I display contextual menu, then I see all native actions and not viewer actions', async ({ I, search }) => {
    await I.haveMail(true, 'data/simple.pdf');
    search.open('.documentSearchTab');

    search.results.select(1);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenAction();
    search.results.seeDownloadAction();
    search.results.seeAttachAction();
    search.results.seeOpenExternalAction();
    search.results.seeDeleteAction();
    search.results.dontSeeCompareAction();
    search.results.dontSeeVisualizeAction();
}).tag('search').tag('actions').tag('document');

Scenario('Given I select two documents with content and not reserved, when I display contextual menu, then I see delete, openExternal, attach, compare and visualize and download actions', async ({ I, search }) => {
    await I.haveMail(true, 'data/simple.pdf');
    await I.haveMail(true, 'data/simple.pdf');

    search.open('.documentSearchTab');

    search.results.select(1);
    search.results.select(2);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeDownloadAction();
    search.results.seeAttachAction();
    search.results.seeOpenExternalAction();
    search.results.seeDeleteAction();
    search.results.seeCompareAction();
    search.results.seeVisualizeAction();
}).tag('search').tag('actions').tag('document');

Scenario('Given I select three documents with content and not reserved, when I display contextual menu, then I see delete, openExternal, attach, visualize, download and not compare actions', async ({ I, search }) => {
    await I.haveMail(true, 'data/simple.pdf');
    await I.haveMail(true, 'data/simple.pdf');
    await I.haveMail(true, 'data/simple.pdf');

    search.open('.documentSearchTab');

    search.results.select(1);
    search.results.select(2);
    search.results.select(3);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeDownloadAction();
    search.results.seeAttachAction();
    search.results.seeOpenExternalAction();
    search.results.seeDeleteAction();
    search.results.dontSeeCompareAction();
    search.results.seeVisualizeAction();
}).tag('search').tag('actions').tag('document');

Scenario('Given I select one document reserved by another user, when I display contextual menu, then I see do not see attach and delete actions', async ({ I, search, utils }) => {
    let mail = await I.haveMail(true, 'data/simple.pdf');
    utils.rest.reserve('document', mail.id);
    await I.login('jna');
    search.open('.documentSearchTab');

    search.results.select(1);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenAction();
    search.results.seeDownloadAction();
    search.results.dontSeeAttachAction();
    search.results.seeOpenExternalAction();
    search.results.dontSeeDeleteAction();
    search.results.dontSeeCompareAction();
    search.results.dontSeeVisualizeAction();
}).tag('search').tag('actions').tag('document');

Scenario('Given I select one document reserved by me, when I display contextual menu, then I see attach and delete actions', async ({ I, search, utils }) => {
    await I.login('jna');
    let doc = await I.createDocument({ 'file': 'data/simple.pdf', 'acl': 'acl-full-control' });
    utils.rest.reserve('document', doc.id);

    search.openShared('storedSearch');
    search.form.launchQuick('');

    search.results.select(1);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenAction();
    search.results.seeAttachAction();
    search.results.seeOpenExternalAction();
    search.results.seeDeleteAction();
    search.results.dontSeeCompareAction();
    search.results.dontSeeVisualizeAction();
}).tag('search').tag('actions').tag('document');

Scenario('Given I do not have permission to CREATE task and select one document, when I display contextual menu, then I do not see task creation action', async ({ I, search }) => {
    await I.haveMail(true);
    await I.login('jna');
    search.open('.documentSearchTab');

    search.results.select(1);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenAction();
    search.results.dontSeeTaskAction('Pour information');
    search.results.seeTaskAction('EmptyTask', '.fa-stumbleupon');
}).tag('search').tag('actions').tag('document');

Scenario('Given I do not have permission DOWNLOAD_CONTENT and select one document, then I do not see download action', async ({ I, search }) => {
    await I.createDocument({ "file": 'data/simple.pdf', 'acl': 'acl-create-read' });
    await I.login('phu');
    search.openShared('storedSearch');
    search.form.launchQuick('');

    search.results.selectAndShowContextualMenu(1);
    search.results.dontSeeDownloadAction();
}).tag('search').tag('actions').tag('document');

Scenario('Given I do not have permission READ_CONTENT for one document and I select two documents, when I display contextual menu, then I do not see compare or visualize actions', async ({ I, search }) => {
    await I.createDocument({ "file": 'data/simple.pdf', 'acl': 'acl-read-content' });
    await I.createDocument({ "file": 'data/simple.pdf', 'acl': 'acl-create-read' });
    await I.login('phu');
    search.openShared('storedSearch');
    search.form.launchQuick('');

    search.results.select(1);
    search.results.select(2);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenExternalAction();
    search.results.dontSeeCompareAction();
    search.results.dontSeeVisualizeAction();
}).tag('search').tag('actions').tag('document');

Scenario('Given I select two documents and I have permission of DOWNLOAD_CONTENT, when I click on Download action, then I choose download type as ZIP and see zip downloaded', async ({ search, I, notification }) => {
    await I.haveMail(true, 'data/simple.pdf');
    await I.haveMail(true, 'data/simple.pdf');

    search.open('.documentSearchTab');

    search.results.select(1);
    search.results.select(2);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeDownloadAction();
    search.results.contextualMenu.click('Télécharger');
    I.handleDownloads();
    search.results.downloadPopup.waitForShow();
    search.results.downloadPopup.validate();

    notification.waitForVisible('Le téléchargement commence automatiquement');
    I.amInPath('output/downloads');
    I.retry({
        retries: 10,
        minTimeout: 3000,
        maxTimeout: 3000
    }).seeFile('Documents.zip')
}).tag('search').tag('actions').tag('document');

Scenario('Given I select two documents and I have permission of DOWNLOAD_CONTENT, when I click on Download action, then I can choose download type as individual and see all files downloaded as expected', async ({ search, I }) => {
    await I.haveMail(true, 'data/simple.pdf');
    await I.haveMail(true, 'data/multi-pages.pdf');

    search.open('.documentSearchTab');

    search.results.select(1);
    search.results.select(2);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeDownloadAction();
    search.results.contextualMenu.click('Télécharger');
    I.handleDownloads();
    search.results.downloadPopup.waitForShow();
    search.results.downloadPopup.selectType("Téléchargement de chaque document");
    search.results.downloadPopup.validate();

    I.amInPath('output/downloads');
    I.retry({
        retries: 10,
        minTimeout: 3000,
        maxTimeout: 3000
    }).seeFile('simple.pdf');
    I.retry({
        retries: 10,
        minTimeout: 3000,
        maxTimeout: 3000
    }).seeFile('multi-pages.pdf');
}).tag('search').tag('actions').tag('document');
