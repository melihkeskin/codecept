const { I } = inject();

const { searchResults } = require('../fragments/searchResults');
const sidemenu = require('../fragments/sidemenu');

class search {

    constructor() {
        this.smartActions = require('../fragments/smartActions');
        this.form = require('../fragments/searchForm');
        this.results = new searchResults();

        this.savedSearch = require('../fragments/savedSearch');
    }
    openDefault(reset) {
        this.open('.DefaultSearchTab', reset);
    }
    open(name, reset) {
        if (reset) {
            this.resetForms();
        }
        I.waitForElement('.search', 20);
        sidemenu.openSub('.search', name);
        this.results.waitForTable();
    }
    openStoredSearchMenu() {
        sidemenu.openSub('.search', '.stored-search');
    }
    openSharedSearchMenu() {
        sidemenu.openSub('.search', '.shared-search');
    }
    openMine(name) {
        sidemenu.openSub('.search', '.stored-search', name);
        this.results.waitForTable();
    }
    openShared(name) {
        sidemenu.openSub('.search', '.shared-search', name);
        this.results.waitForTable();
    }
    async resetForms() {
        await I.executeScript(function () {
            JSAPI.get().getSearchFormAPI().getCache().clear();
        });
    }
}
// For inheritance
module.exports = new search();
module.exports.search = search;
