//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Languages');

Scenario('I open a document and see date displayed as French date', async ({ I, document }) => {
    await I.goToDefaultPage('FR');
    I.waitForGlassPanelHidden();
    let mail = await I.haveMail();
    await document.open(mail.id);
    document.form.seeTag('.DateCourrier', '1 janv. 1970 01:00:00');
}).tag('languages').tag('date');

Scenario('I open a document and see date displayed as English date', async ({ I, document }) => {
    await I.goToDefaultPage('EN');
    I.waitForGlassPanelHidden();
    let mail = await I.haveMail();
    await document.open(mail.id);
    document.form.seeTag('.DateCourrier', '1970 Jan 1 1:00:00 AM');
}).tag('languages').tag('date');

Scenario('I search a document and see date displayed as French date', async ({ I, search }) => {
    await I.goToDefaultPage('FR');
    I.waitForGlassPanelHidden();
    let mail = await I.haveMail(true);

    search.open('.pliSearchTab');
    I.waitForGlassPanelHidden();
    search.form.fillListCriterion('RefClient', mail.refClient);
    search.form.launchSearch();

    search.results.addColumn('Date du courrier');
    search.results.seeInRow('1 janv. 1970 01:00:00', 1);
}).tag('languages').tag('date');

Scenario('I open a document and see date picker displayed in French', async ({ I, document }) => {
    await I.goToDefaultPage('FR');
    I.waitForGlassPanelHidden();
    let mail = await I.haveMail();
    await document.open(mail.id);
    I.click('.date-box');
    I.waitForText('1970 janv.', 5, '.datePickerMonth');
}).tag('languages').tag('datePicker');

Scenario('I open a document and see date picker displayed in English', async ({ I, document }) => {
    await I.goToDefaultPage('EN');
    I.waitForGlassPanelHidden();
    let mail = await I.haveMail();
    await document.open(mail.id);
    I.click('.date-box');
    I.waitForText('1970 Jan', 5, '.datePickerMonth');
}).tag('languages').tag('datePicker');