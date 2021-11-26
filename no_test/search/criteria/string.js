//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Search / String criteria');

Scenario('Search with string criterion and CONTAINS operator', async ({ I, search }) => {
    var document = await I.createDocument({ 'file': 'data/light.txt' }, true);
    search.openDefault();
    search.form.openAdvancedSearch();

    search.form.selectFreeCriterionOperator('name', 'CONTAINS');
    search.form.fillFieldCriterion('name', document.name.substring(document.name.length / 4, document.name.length / 2));
    search.form.launchSearch();

    search.results.seeFirst(document.name);
}).tag('search').tag('string').tag('contains');

Scenario('Search with string criterion and STARTS_WITH operator', async ({ I, search }) => {
    var document = await I.createDocument({ 'file': 'data/light.txt' }, true);
    search.openDefault();
    search.form.openAdvancedSearch();

    search.form.selectFreeCriterionOperator('name', 'STARTS_WITH');
    search.form.fillFieldCriterion('name', document.name.substring(0, document.name.length / 2));
    search.form.launchSearch();

    search.results.seeFirst(document.name);
}).tag('search').tag('string').tag('startsWith');

Scenario('Search with string criterion and ENDS_WITH operator', async ({ I, search }) => {
    var document = await I.createDocument({ 'file': 'data/light.txt' }, true);
    search.openDefault();
    search.form.openAdvancedSearch();

    search.form.selectFreeCriterionOperator('name', 'ENDS_WITH');
    search.form.fillFieldCriterion('name', document.name.substring(document.name.length / 4, document.name.length));
    search.form.launchSearch();

    search.results.seeFirst(document.name);
}).tag('search').tag('string').tag('endsWith');

Scenario('Search with string criterion and DIFFERENT operator', async ({ I, search }) => {
    var document = await I.createDocument({ 'file': 'data/light.txt' }, true);
    search.openDefault();
    search.form.openAdvancedSearch();

    search.form.selectFreeCriterionOperator('name', 'DIFFERENT');
    search.form.fillFieldCriterion('name', document.name);
    search.form.launchSearch();

    search.results.dontSeeInResults(document.name);
}).tag('search').tag('string').tag('different');

Scenario('Search with string criterion and EQUALS_TO operator', async ({ I, search }) => {
    var document = await I.createDocument({ 'file': 'data/light.txt' }, true);
    search.openDefault();
    search.form.openAdvancedSearch();

    search.form.selectFreeCriterionOperator('name', 'EQUALS_TO');
    search.form.fillFieldCriterion('name', document.name);
    search.form.launchSearch();

    search.results.seeFirst(document.name);
}).tag('search').tag('string').tag('equalsTo');