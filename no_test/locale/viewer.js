//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Languages / ARender');

Scenario('I open a document and see ARender in French ', async ({ I, arender }) => {
    await I.goToDefaultPage('FR');
    I.waitForGlassPanelHidden();

    await I.createAndOpenDocument({ 'file': 'data/simple.pdf' });
    arender.seeLanguage('FR');
}).tag('languages').tag('viewer');

Scenario('I open a document and see ARender in English ', async ({ I, arender }) => {
    await I.goToDefaultPage('EN');
    I.waitForGlassPanelHidden();

    await I.createAndOpenDocument({ 'file': 'data/multi-pages.pdf' });
    arender.seeLanguage('EN');
}).tag('languages').tag('viewer');

Scenario('I open an email and see French header', async ({ I, arender }) => {
    await I.goToDefaultPage('FR');
    I.waitForGlassPanelHidden();

    await I.createAndOpenDocument({ 'file': 'data/mail.eml' });
    arender.seeNameAndPageCount("Email:mail ARender", 1);

    arender.advancedSearch.open();
    arender.advancedSearch.search('Envoyé');
    arender.advancedSearch.seeOneResult();
}).tag('languages').tag('viewer').tag('mail');

Scenario('I open an email and see English header', async ({ I, arender }) => {
    await I.goToDefaultPage('EN');
    I.waitForGlassPanelHidden();

    await I.createAndOpenDocument({ 'file': 'data/mail.eml' });
    arender.seeNameAndPageCount("Email:mail ARender", 1);

    arender.advancedSearch.open();
    arender.advancedSearch.search('Date');
    arender.advancedSearch.seeEnglishResults(1);
}).tag('languages').tag('viewer').tag('mail');