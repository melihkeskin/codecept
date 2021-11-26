//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Search / Icon criteria');

Scenario('I search on difference of icon tag then do not found document', async ({ I, search }) => {
    let mail = await I.haveMail(true);

    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.selectFreeCriterionOperator('CanalEntree', 'DIFFERENT');
    search.form.fillListCriterion('CanalEntree', mail.channelCode.label);
    search.form.launchSearch();

    search.results.dontSeeInResults(mail.name);
}).tag('search').tag('icon').tag('different');

Scenario('I search on equality of icon tag then find document', async ({ I, search }) => {
    let mail = await I.haveMail(true);

    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.selectFreeCriterionOperator('CanalEntree', 'EQUALS_TO');
    search.form.fillListCriterion('CanalEntree', mail.channelCode.label);
    search.form.launchSearch();

    search.results.seeFirst(mail.name);
}).tag('search').tag('icon');