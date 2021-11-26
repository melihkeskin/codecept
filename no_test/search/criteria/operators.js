//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Search / Available operators');

const selector = '.content > div:nth-child(3) .operator-selector ';

Scenario('Available operators when the criterion is a string', ({ I, search }) => {
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.category.select('Tâche');

    search.form.selectCustomCriterion('NomClient');

    I.click(selector + ' .label');
    search.form.picker.see('CONTAINS');
    search.form.picker.see('EQUALS_TO');
    search.form.picker.see('STARTS_WITH');
    search.form.picker.see('ENDS_WITH');
    search.form.picker.see('DIFFERENT');

    search.form.picker.dontSee('GREATER_THAN');
    search.form.picker.dontSee('LESS_THAN');
    search.form.picker.dontSee('BETWEEN');
}).tag('search').tag('operator');

Scenario('Available operators when the criterion is a list', ({ I, search }) => {
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.category.select('Tâche');

    search.form.selectCustomCriterion('TypeCourrier');

    I.click(selector + ' .label');

    search.form.picker.see('EQUALS_TO');
    search.form.picker.see('DIFFERENT');

    search.form.picker.dontSee('CONTAINS');
    search.form.picker.dontSee('STARTS_WITH');
    search.form.picker.dontSee('ENDS_WITH');
    search.form.picker.dontSee('GREATER_THAN');
    search.form.picker.dontSee('LESS_THAN');
    search.form.picker.dontSee('BETWEEN');
}).tag('search').tag('operator');

Scenario('Available operators when the criterion is a date', ({ I, search }) => {
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.category.select('Tâche');

    search.form.selectCustomCriterion('DateCourrier');

    I.dontSee(selector);
}).tag('search').tag('operator');

Scenario('Available operators when the criterion is a numeric type', ({ I, search }) => {
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.category.select('Tâche');

    search.form.selectCustomCriterion('DelaiTraitement');
    I.click(selector + ' .label');

    search.form.picker.see('EQUALS_TO');
    search.form.picker.see('DIFFERENT');
    search.form.picker.see('LESS_THAN');
    search.form.picker.see('GREATER_THAN');

    search.form.picker.dontSee('CONTAINS');
    search.form.picker.dontSee('STARTS_WITH');
    search.form.picker.dontSee('ENDS_WITH');
    search.form.picker.dontSee('BETWEEN');
}).tag('search').tag('operator');

Scenario('Available operators when the criterion is a user', ({ I, search }) => {
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.category.select('Tâche');

    search.form.selectCustomCriterion('assignee');

    I.dontSee(selector);
}).tag('search').tag('operator');