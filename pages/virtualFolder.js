//<reference path="../steps.d.ts" />
const I = actor();

module.exports = {
    form: require('../fragments/form'),
    viewer: require('../fragments/arender'),
    searchResults: require('../fragments/searchResults'),
    smartActions: require('../fragments/smartActions'),
    glassPanel: require('../fragments/glassPanel'),
    util: require('../fragments/util'),

    open(id) {
        this.util.executeScriptX((id, done) => {
            JSAPI.get().registerForComponentChange(function (componentFormAPI, component, phase) {
                if (component.getId() == id) {
                    done();
                }
            });
            JSAPI.get().getNavigationAPI().goToComponentPlace('VIRTUAL_FOLDER', id, false);
        }, id);
        this.waitForOpen();
    },
    waitForOpen() {
        I.waitForElement(this.form.tagContainer, 45);
        this.glassPanel.waitForInvisible();
    },
    switchToTable() {
        this.switchDisplay('.virtual-folder-leaf-explorer');
        this.waitForOpen();
        I.waitForVisible('.virtual-folder-tab', 30);
        this.searchResults.waitForTable();
    },
    switchToViewer() {
        this.switchDisplay('.virtual-folder-tab');
        this.waitForOpen();
        I.waitForVisible('.virtual-folder-leaf-explorer', 30);
    },
    switchDisplay(actual) {
        if (actual) {
            I.waitForVisible('.virtual-folder-browser' + actual, 30);
        }
        let switcher = '.virtual-folder-children-switcher';
        I.waitForVisible(switcher, 30);
        I.click(switcher);
        this.glassPanel.waitForInvisible();
    },
    openFirstLevel: function (first, hasSecondLevel) {
        I.waitForText(first, 10);
        I.wait(0.3);
        I.click(first)
        if (hasSecondLevel) {
            I.waitForElement('.active-node', 10);
        } else {
            I.waitForElement('.active', 10);
        }
        this.glassPanel.waitForInvisible();
    },
    openSecondLevel: function (first, second) {
        this.openFirstLevel(first, true)
        I.waitForText(second, 10);
        I.click(second);
        this.glassPanel.waitForInvisible();
    },
    clickOnTreeItem: function (title) {
        let locator = locate('.virtual-folder-browser .tree-link').withAttr({ title: title });
        I.waitForVisible(locator, 10);
        I.retry(2).click(locator);
        this.glassPanel.waitForInvisible();
    }
}