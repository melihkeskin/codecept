//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Search / Boolean criteria');

Scenario('I search with filled boolean criterion and I find documents with filled boolean tag', ({ search }) => {
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.fillListCriterion('classid', 'Abonnement à une opération');
    search.form.selectFreeCriterionOperator('Enabled');
    search.form.fillBooleanCriterion('Enabled');
    search.form.launchQuick('GECActions.xls');

    search.results.seeFirst("GECActions");
}).tag('search').tag('boolean').tag('equalsTo');

Scenario('I search with not filled boolean criterion and I find documents with not filled boolean tag', ({ search }) => {
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.fillListCriterion('classid', 'Abonnement à une opération');
    search.form.selectFreeCriterionOperator('Enabled');
    search.form.launchQuick('Disabled Hook');

    search.results.seeFirst('Disabled Hook');
}).tag('search').tag('boolean').tag('equalsTo');