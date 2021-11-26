//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Search results');

Scenario('Display search results as thumbnails', ({ I, search }) => {
    search.openDefault(true);
    I.waitForVisible('.icon[title="Afficher les miniatures"]');
    I.click('.icon[title="Afficher les miniatures"]');
    I.waitForVisible('.card-img-top', 3);

    search.resetForms();
});

Scenario('Display search results as thumbnails and restore table view', ({ I, search }) => {
    search.openDefault(true);

    I.waitForVisible('.icon[title="Afficher les miniatures"]');
    I.click('.icon[title="Afficher les miniatures"]');
    I.waitForVisible('.card-img-top', 3);

    I.seeElement('.icon[title="Afficher en liste"]');
    I.click('.icon[title="Afficher en liste"]');
    I.waitForVisible('.search-results-container .table-responsive', 3);

    search.resetForms();
});

Scenario('Given I switched to thumbnails view, when I refresh page, then I always see thumbnails view', ({ I, search }) => {
    search.openDefault(true);

    I.waitForVisible('.icon[title="Afficher les miniatures"]');
    I.click('.icon[title="Afficher les miniatures"]');
    I.waitForVisible('.card-img-top', 10);

    I.refreshPage();
    I.waitForVisible('.card-img-top', 10);
    
    search.resetForms();
});