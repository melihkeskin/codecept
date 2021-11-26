//<reference path="../../steps.d.ts" />

Feature('Search / Columns');

Before({ login } => {
    login('admin');
});

var column = 'Date de mise à jour';

Scenario('I display a new column in search results', ({ search }) => {
    search.openDefault();
    search.form.category.select('Document');
    search.form.launchQuick('');
    search.results.dontSeeColumn(column)
    search.results.addColumn(column);
    search.results.seeColumn(column)
}).tag('search');

Scenario('I display a new column then remove it in search results', ({ search }) => {
    search.openDefault();
    search.form.category.select('Document');
    search.form.launchQuick('');
    search.results.addColumn(column);
    search.results.toggleColumnSelector();
    search.results.removeColumn(column)
    search.results.dontSeeColumn(column)
}).tag('search');