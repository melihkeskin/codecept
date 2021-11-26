const { searchResults } = require("../searchResults");
const { Activity } = require("./Activity");
const glassPanel = require('../glassPanel');

//<reference path="../../steps.d.ts" />
const { I } = inject();

class BinActivity extends Activity {
    constructor(type) {
        super('/bins/' + type);
        this.results = new searchResults();
    }
    purge(text) {
        I.say("I purge '" + text + "'")
        this.results.waitForTable();
        this.results.seeAndSelectFirst(text);
        this.purgeSelection();
        glassPanel.waitForInvisible();
    }
    restore(text) {
        I.say("I restore '" + text + "'");
        this.results.waitForTable();
        this.results.seeAndSelectFirst(text);
        this.restoreSelection();
        glassPanel.waitForInvisible();
    }
    purgeSelection() {
        I.say('I purge selected components');
        I.click('#purgeSelected');
        I.click('#yes');
        glassPanel.waitForInvisible();
    }
    restoreSelection() {
        I.say('I restore selected components');
        I.click('#restoreSelected');
        I.click('#yes');
    }
}

// For inheritance
module.exports = new BinActivity();
module.exports.BinActivity = BinActivity;