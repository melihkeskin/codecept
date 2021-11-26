//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Languages');

Scenario('I override locale with FR then see French labels', async ({ I }) => {
    await I.goToDefaultPage('FR');
    I.waitForGlassPanelHidden();
    I.waitForText('Accueil', 5);
}).tag('languages');

Scenario('I override locale using URL parameter then see English labels', async ({ I }) => {
    await I.goToDefaultPage('EN');
    I.waitForGlassPanelHidden();
    I.waitForText('Home', 5);
}).tag('languages');

Scenario('I define unknown locale then see default language', async ({ I }) => {
    await I.goToDefaultPage('IT');
    I.waitForGlassPanelHidden();
    I.waitForText('Home', 5);
}).tag('languages');