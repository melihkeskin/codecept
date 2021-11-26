//<reference path="../steps.d.ts" />
const I = actor();
const sidemenu = require('../fragments/sidemenu');
const glassPanel = require("../fragments/glassPanel");

module.exports = {
    open() {
        I.wait(2);
        sidemenu.open('Insérer');
        I.wait(2);
        I.waitForElement('.fileupload', 5);
    },
    addFile(file) {
        I.wait(2);
        I.attachFile('form input[name="BrowseButton"]', file);
        I.wait(2);
        glassPanel.waitForInvisible();
        I.wait(2);
        I.waitForElement('.file .file-name', 60);
        I.wait(5);
    },
    openIndexation() {
        I.wait(2);
        I.waitForElement('#next', 5);
        I.wait(2);
        I.click('#next');
        I.wait(2);
    }
}