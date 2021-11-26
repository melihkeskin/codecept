//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Search / custom criterion');

Scenario('Given I am on a search form, when I add a custom criterion then I still have it after I selected a component class allowing this tag', ({ search }) => {
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.selectCustomCriterion('CanalEntree');
    search.form.classSelector.select('Courrier Entrant');
    search.form.seeCriterion('CanalEntree', '');
}).tag('search').tag('custom criterion');

Scenario('Given I am on a search form with a custom criterion, when I delete it from the form and select a component class, then I do not see previous deleted custom criterion', ({ search }) => {
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.selectCustomCriterion('CanalEntree');
    search.form.fillListCriterion('CanalEntree', 'Email');
    search.form.seeCriterion('CanalEntree', 'Email');
    search.form.launchSearch();
    search.form.removeCustomCriterion('CanalEntree');
    search.form.classSelector.select('Courrier Entrant');
    search.form.dontSeeCriterion('CanalEntree', 'Email');
}).tag('search').tag('custom criterion');

Scenario('Given I am on a search form with a custom criterion, when change component class without custom criterion as allowed, then I do not see custom criterion', ({ search }) => {
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.selectCustomCriterion('CanalEntree');
    search.form.seeCriterion('CanalEntree', '');
    search.form.classSelector.select('Annotation');
    search.form.dontSeeCriterion('CanalEntree');
}).tag('search').tag('custom criterion');

Scenario('Given I am on a search form with a custom criterion,I change component class without custom criterion as allowed when I remove selected class, then I see custom criterion with its previous values', ({ search }) => {
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.selectCustomCriterion('CanalEntree');
    search.form.fillListCriterion('CanalEntree', 'Email');
    search.form.launchSearch();
    search.form.seeCriterion('CanalEntree', 'Email');
    search.form.classSelector.select('Annotation');
    search.form.dontSeeCriterion('CanalEntree');
    search.form.classSelector.select('Annotation');
    search.form.seeCriterion('CanalEntree', 'Email');
}).tag('search').tag('custom criterion');

Scenario('Given I am on a search form and add a custom criterion,I change component class without custom criterion as allowed when I remove it and add previous custom criterion, then I see custom criterion without its previous values', ({ search }) => {
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.selectCustomCriterion('CanalEntree');
    search.form.fillListCriterion('CanalEntree', 'Email');
    search.form.seeCriterion('CanalEntree', 'Email');
    search.form.classSelector.select('Annotation');
    search.form.dontSeeCriterion('CanalEntree');
    search.form.classSelector.select('Annotation');
    search.form.selectCustomCriterion('CanalEntree');
    search.form.seeCriterion('CanalEntree', '');
}).tag('search').tag('custom criterion');

Scenario('Given I am on a search form with a custom criterion, when I delete it from the form and refresh page, then I see previous deleted custom criterion', ({ search, I }) => {
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.selectCustomCriterion('CanalEntree');
    search.form.fillListCriterion('CanalEntree', 'Email');
    search.form.seeCriterion('CanalEntree', 'Email');
    search.form.launchSearch();
    search.form.removeCustomCriterion('CanalEntree');
    search.form.dontSeeCriterion('CanalEntree');
    I.refreshActivity();
    search.form.seeCriterion('CanalEntree', 'Email')
}).tag('search').tag('custom criterion');