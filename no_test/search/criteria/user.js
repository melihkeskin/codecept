//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Search / User criteria');

//TODO FIXME Manage loader timing for slow LDAP which can cause failure due to high loading time values
Scenario('Search with User criterion and EQUALS_TO operator', async ({ I, search, data }) => {
    let document = await I.createDocument({}, true);

    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.selectFreeCriterionOperator('owner');
    search.form.fillListCriterion('owner', 'Administrat');
    search.form.launchSearch();

    search.results.seeFirst(document.name);
}).tag('search').tag('user').tag('equalsTo');