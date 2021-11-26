//<reference path="../../steps.d.ts" />

Before({ I } => {
    I.login('admin');
});

Feature('Search / Choicelist criteria');

Scenario('Search with ChoiceList criterion and DIFFERENT operator', async ({ I, search }) => {
    let mail = await I.haveMail(true);

    search.open('.pliSearchTab');
    await search.form.clearMultiValuedCriterion('ServiceDestinataire');
    search.form.selectOperator('ServiceDestinataire', 'DIFFERENT');
    search.form.fillListCriterion('ServiceDestinataire', mail.routing.service.label);
    search.form.launchSearch();

    search.results.dontSeeInResults(mail.object);
}).tag('search').tag('choicelist').tag('different');


Scenario('Search with ChoiceList criterion and EQUALS_TO operator', async ({ I, search }) => {
    let mail = await I.haveMail(true);

    search.open('.pliSearchTab');
    await search.form.clearMultiValuedCriterion('ServiceDestinataire');
    search.form.selectOperator('ServiceDestinataire', 'EQUALS_TO');
    search.form.fillListCriterion('ServiceDestinataire', mail.routing.service.label);
    search.form.launchSearch();

    search.results.seeFirst(mail.object);
}).tag('search').tag('choicelist').tag('equalsTo');