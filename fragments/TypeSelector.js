
//<reference path="../steps.d.ts" />

const { I } = inject();

class TypeSelector {
    constructor(root) {
        this.root = root;
    }
    select(value) {
        let selector = this.root + ' .combo-editor';
        I.waitForVisible(selector);
        I.executeScript(function (selector, value) {
            $(selector + " select").val(value).trigger('change');
        }, selector, value);
    }
}
// For inheritance
module.exports = new TypeSelector();
module.exports.TypeSelector = TypeSelector;