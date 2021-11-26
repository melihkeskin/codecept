//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Internationalization');

Scenario('I add FR locale url parameter to overload browser language then see sidemenu label in French', async ({ I }) => {
    I.waitForText('Accueil', 5, '.page-title');
    await I.goToDefaultPage('FR');
    I.waitForGlassPanelHidden();
    I.waitForText('Accueil', 5, '.page-title');
}).tag('locale');

Scenario('I add UNKNOWN locale url parameter to overload browser language then see sidemenu label in English', async ({ I }) => {
    I.waitForText('Accueil', 5, '.page-title');
    await I.goToDefaultPage('UNKNOWN');
    I.waitForGlassPanelHidden();
    I.waitForText('Home', 5, '.page-title');
}).tag('locale');

Scenario('I add EN locale url parameter to overload browser language then see sidemenu label in English', async ({ I }) => {
    I.waitForText('Accueil', 5, '.page-title');
    await I.goToDefaultPage('EN');
    I.waitForGlassPanelHidden();
    I.waitForText('Home', 5, '.page-title');
}).tag('locale');

Scenario('I add locale EN then see internationalized labels in left menu', async ({ I, sidemenu }) => {
    I.waitForText('Accueil', 5, '.page-title');
    await I.goToDefaultPage('EN');
    I.waitForGlassPanelHidden();
    sidemenu.seeTab('Home');
    sidemenu.dontSeeTab('Accueil');
}).tag('locale');