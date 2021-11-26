//<reference path="../steps.d.ts" />
const I = actor();

module.exports = {
    breadcrumb: require('../fragments/breadcrumb'),
    left: require('../fragments/inboxLeft'),
    results: require('../fragments/searchResults'),
    form: require('../fragments/searchForm'),
    menu: require('../fragments/sidemenu'),

    waitForOpen() {
        I.waitForInvisible('.glass-panel-icon', 45);
        I.waitForElement(this.left.root, 50);
        I.wait(1);
    }
}