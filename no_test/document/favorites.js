//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Favorites / Document');

Scenario('Given that I bookmarked document when I open right bar and I click on link then I open it', async ({ I, document, rightBar }) => {
    let bookmarked = await I.createAndOpenDocument();
    document.form.bookmark();
    I.goBack();
    await rightBar.open();
    rightBar.see(bookmarked.name, "favorites");
    rightBar.openFavorite(bookmarked.name);

    document.waitForOpen();
    document.form.seeFieldTitle(bookmarked.name);
    document.form.unbookmark();
}).tag('favorites');

Scenario('Given that I bookmarked document with empty name when I open right bar then I see its class display name within favorites', async ({ I, document, rightBar }) => {
    await I.createAndOpenDocument({ 'name': '', 'classId': "DocumentManualVersion" });
    document.form.bookmark();
    I.goBack();
    await rightBar.open();
    rightBar.see("Versioning manuel", "favorites");
    rightBar.openFavorite("Versioning manuel");

    document.waitForOpen();
    document.form.unbookmark();
}).tag('favorites');

Scenario('Given that I bookmarked document when I open favorite popup and I click on link then I open it', async ({ I, document, rightBar }) => {
    let bookmarked = await I.createAndOpenDocument();
    document.form.bookmark();
    I.goBack();
    await rightBar.open();
    rightBar.seeElement("#favorites-section");
    I.click('#favorites-section .dropdown-item');

    I.waitForVisible('.modal-content', 5);

    var locator = locate('.modal-content #favorites-section a').withDescendant(locate('span').withText(bookmarked.name));
    I.waitForVisible(locator, 10);
    I.click(bookmarked.name, locator);

    document.waitForOpen();
    document.form.seeFieldTitle(bookmarked.name);

    document.form.unbookmark();
}).tag('favorites');

Scenario('Given that I bookmarked document when I delete it then I do not see it within favorite section', async ({ I, document, rightBar }) => {
    let bookmarked = await I.createAndOpenDocument();
    document.form.bookmark();
    I.goBack();
    document.open(bookmarked.id);
    document.form.deleteLogically();

    await rightBar.open();
    rightBar.waitForAllSectionsOpened(true, false);
    within('.right-bar', function () {
        I.dontSee(bookmarked.name);
    });
}).tag('favorites');

Scenario('Given that I  bookmarked and deleted document when I restore it then I see it again within favorites', async ({ I, document, admin, rightBar }) => {
    let bookmarked = await I.createAndOpenDocument();
    document.form.bookmark();
    I.goBack();
    document.open(bookmarked.id);
    document.form.deleteLogically();

    admin.bins.documents.open();
    admin.bins.documents.restore(bookmarked.name);
    admin.bins.documents.quit();

    I.refreshPage();
    await rightBar.open();
    rightBar.see(bookmarked.name, "favorites");

    await document.open(bookmarked.id);
    document.form.unbookmark();
}).tag('favorites');

Scenario('Given that I bookmarked document by admin when I log in as user then I do not see bookmark', async ({ I, document, rightBar }) => {
    let bookmarked = await I.createAndOpenDocument();
    document.form.bookmark();
    I.goBack();
    await I.login('phu');

    await rightBar.open();
    rightBar.dontSeeElement('.favorites');

    await I.login('admin');
    document.open(bookmarked.id);
    document.waitForOpen();
    document.form.unbookmark();
}).tag('favorites');