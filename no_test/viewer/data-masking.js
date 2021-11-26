//<reference path="../../steps.d.ts" />
Feature('ARender / Obfuscation')

Before({ login } => {
    login('admin');
});

Scenario('Given a document with CREATE_DATA_MASKING permission When I open it Then I see data masking actions', async ({ I, document }) => {
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf', 'acl': 'acl-create-data-masking' });
    document.viewer.waitForDocumentLoading();
    document.viewer.topPanel.see(".obfuscateZoneButton");
    document.viewer.topPanel.see(".obfuscateButton");
    document.viewer.seeSearchAndRedactAction();
}).tag('obfuscation');

Scenario('Given a document with CREATE_DATA_MASKING permission and READ_DATA_MASKING When I create a mask then I can see masked data and delete it', async ({ I, document }) => {
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf', 'acl': 'acl-create-data-masking' });
    document.viewer.waitForDocumentLoading();
    document.viewer.topPanel.see(".obfuscateZoneButton");
    document.viewer.topPanel.see(".obfuscateButton");
    document.viewer.advancedSearch.open();
    document.viewer.advancedSearch.obfuscate('test');
    document.viewer.advancedSearch.seeOneResult();

    I.refreshActivity();
    document.viewer.waitForDocumentLoading();
    document.viewer.advancedSearch.open();
    document.viewer.advancedSearch.search('test');
    document.viewer.advancedSearch.seeOneResult();
    document.viewer.deleteAnnotation();
}).tag('obfuscation');

Scenario('Given a document with CREATE_DATA_MASKING permission but no READ_DATA_MASKING When I create a mask then I cannot see data masked', async ({ I, document }) => {
    var doc = await I.createDocument({ 'file': 'data/simple.pdf', 'acl': 'acl-create-data-masking' });
    await I.login('phu');

    document.open(doc.id);
    document.viewer.waitForDocumentLoading();
    document.viewer.topPanel.see(".obfuscateZoneButton");
    document.viewer.topPanel.see(".obfuscateButton");

    document.viewer.seeSearchAndRedactAction();
    document.viewer.advancedSearch.open();
    document.viewer.advancedSearch.search('test');
    document.viewer.advancedSearch.seeOneResult();
    document.viewer.advancedSearch.obfuscate('test');

    I.refreshActivity();
    document.viewer.waitForDocumentLoading();
    document.viewer.advancedSearch.search('test');
    document.viewer.advancedSearch.dontSeeResult();
}).tag('obfuscation');

Scenario('Given a document without CREATE_DATA_MASKING and READ_DATA_MASKING permissions on annotations when I open it I cannot see masked data neither data masking actions', async ({ I, document }) => {
    var doc = await I.createDocument({ 'file': 'data/simple.pdf', 'acl': 'acl-creation' });
    await document.open(doc.id);
    document.viewer.seeSearchAndRedactAction();
    document.viewer.advancedSearch.open();
    document.viewer.advancedSearch.obfuscate('test');
    document.viewer.advancedSearch.seeOneResult();
    await I.login('phu');
    await document.open(doc.id);
    document.viewer.waitForDocumentLoading();
    document.viewer.topPanel.dontSee(".obfuscateZoneButton");
    document.viewer.topPanel.dontSee(".obfuscateButton");
    document.viewer.dontSeeSearchAndRedactAction();
    document.viewer.advancedSearch.open();
    document.viewer.advancedSearch.search('test');
    document.viewer.advancedSearch.dontSeeResult();
}).tag('obfuscation');

Scenario('Given a document with CREATE_DATA_MASKING permission but not CREATE_ANNOTATION When I open it Then I do not see data masking actions', async ({ I, document }) => {
    var doc = await I.createDocument({ 'file': 'data/simple.pdf', 'acl': 'acl-create-data-masking-only' });
    await I.login('phu');

    document.open(doc.id);
    document.viewer.waitForDocumentLoading();
    document.viewer.topPanel.dontSee(".obfuscateZoneButton");
    document.viewer.topPanel.dontSee(".obfuscateButton");
    document.viewer.dontSeeSearchAndRedactAction();

}).tag('obfuscation');

//multi-content not supported yet
// Scenario('Given a multi-content document without CREATE_DATA_MASKING permission and READ_DATA_MASKING on annotations When I open it Then I do not see data masking actions neither masked data', async (I, document) => {
//     var doc = await I.createDocument({
//         'file': ['data/simple.pdf', 'data/multi-pages.pdf'],
//         'acl': 'acl-create-data-masking'
//     });
//     document.open(doc.id);
//     document.viewer.seeSearchAndRedactAction();
//     document.viewer.searchAndBiff('test', 'Résultat(s) de la recherche: 1');
//     await I.login('jna');
//     document.open(doc.id);
//     document.viewer.waitForDocumentLoading();
//     document.viewer.topPanel.dontSee(".obfuscateZoneButton");
//     document.viewer.topPanel.dontSee(".obfuscateButton");
//     document.viewer.dontSeeSearchAndRedactAction();
// }).tag('data-masking');

Scenario('Given a document without READ_DATA_MASKING permission on annotations When I download it Then I download it in pdf format', async ({ I, document }) => {
    await I.login('phu');
    var doc = await I.createAndOpenDocument({ 'file': 'data/light.txt', 'acl': 'acl-create-data-masking' });
    document.viewer.advancedSearch.open();
    document.viewer.advancedSearch.obfuscate('lorem');
    document.viewer.advancedSearch.seeOneResult();
    I.handleDownloads();
    document.smartActions.openSub('#download');
    I.amInPath('output/downloads');
    I.retry({ retries: 10, minTimeout: 1000 }).seeFile('light.pdf');
}).tag('obfuscation');

Scenario('Given a task without CREATE_DATA_MASKING and READ_DATA_MASKING permission on annotations When I open it Then I cannot see masked data neither data masking actions', async ({ I, task }) => {
    let mail = await I.haveMail(true, 'data/simple.pdf');
    task.open(mail.task);
    task.viewer.advancedSearch.open();
    task.viewer.advancedSearch.obfuscate('test');
    task.viewer.advancedSearch.seeOneResult();

    await I.login('phu');

    task.open(mail.task);
    task.viewer.waitForDocumentLoading();
    task.viewer.topPanel.dontSee(".obfuscateZoneButton");
    task.viewer.topPanel.dontSee(".obfuscateButton");
    task.viewer.dontSeeSearchAndRedactAction();
    task.viewer.advancedSearch.open();
    task.viewer.advancedSearch.search('test');
    task.viewer.advancedSearch.dontSeeResult();
}).tag('obfuscation');

Scenario('Given a virtual folder with document without CREATE_DATA_MASKING and READ_DATA_MASKING permission on annotations When I open it Then I cannot see masked data neither data masking actions', async ({ I, virtualFolder }) => {
    let mail = await I.haveMail(true, 'data/simple.pdf');
    await virtualFolder.open(mail.refClient);

    virtualFolder.viewer.advancedSearch.open();
    virtualFolder.viewer.advancedSearch.obfuscate('test');
    virtualFolder.viewer.advancedSearch.seeOneResult();
    await I.login('phu');

    await virtualFolder.open(mail.refClient);
    virtualFolder.viewer.waitForDocumentLoading();
    virtualFolder.viewer.topPanel.dontSee(".obfuscateZoneButton");
    virtualFolder.viewer.topPanel.dontSee(".obfuscateButton");
    virtualFolder.viewer.dontSeeSearchAndRedactAction();
    virtualFolder.viewer.advancedSearch.open();
    virtualFolder.viewer.advancedSearch.search('test');
    virtualFolder.viewer.advancedSearch.dontSeeResult('test', null);
}).tag('obfuscation');