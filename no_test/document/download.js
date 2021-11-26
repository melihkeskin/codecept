//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Document / Download');

Scenario('Given that a document when I open it and I download it then I see file on filesystem', async ({ I, document }) => {
    await I.createAndOpenDocument({ 'file': 'data/light.txt' });
    I.handleDownloads();
    document.smartActions.openSub('#download');
    seeDownloadedFile(I);
}).tag('document').tag('download');

Scenario('I search document then download its file from contextual menu', async ({ I, search }) => {
    var created = await I.createAndOpenDocument({ 'file': 'data/light.txt' });
    I.handleDownloads();
    search.openDefault();
    search.form.searchById(created.id);
    search.results.seeFirst(created.name);

    search.results.selectAndShowContextualMenu(1);
    search.results.contextualMenu.click('Télécharger');

    seeDownloadedFile(I);
}).tag('document').tag('download');

Scenario('I search document then download its file from actions', async ({ I, search }) => {
    var created = await I.createAndOpenDocument({ 'file': 'data/light.txt' });
    I.handleDownloads();
    search.openDefault();
    search.form.searchById(created.id);
    search.results.seeFirst(created.name);

    search.results.select(1);

    search.results.actions.clickNativeAction('Télécharger');

    seeDownloadedFile(I);
}).tag('document').tag('download');

function seeDownloadedFile(I) {
    I.amInPath('output/downloads');
    I.retry({ retries: 10, minTimeout: 1000 }).seeFile('light.txt');
    I.seeInThisFile('Lorem Ipsum', 'UTF-8');
}