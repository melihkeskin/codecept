//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Search / FreeList criteria');

Scenario('Search with Lookup criterion and DIFFERENT operator', async ({ I, search, data }) => {
    let mail = await I.haveMail(true);

    search.open('.pliSearchTab');
    I.waitForGlassPanelHidden();
    search.form.selectOperator('RefClient', 'DIFFERENT');
    search.form.fillListCriterion('RefClient', mail.refClient);
    search.form.launchSearch();

    search.results.dontSeeInResults(mail.object.substring(0, 80));
}).tag('search').tag('lookup').tag('different');

Scenario('Search with Lookup criterion and EQUALS_TO operator', async ({ I, search, data }) => {
    let mail = await I.haveMail(true);

    search.open('.pliSearchTab');
    I.waitForGlassPanelHidden();
    search.form.selectOperator('RefClient', 'EQUALS_TO');
    search.form.fillListCriterion('RefClient', mail.refClient);
    search.form.launchSearch();

    search.results.seeFirst(mail.object);
}).tag('search').tag('lookup').tag('equalsTo');