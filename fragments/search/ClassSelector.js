//<reference path="../../steps.d.ts" />
const { I } = inject();

class ClassSelector {
    constructor(root) {
        this.root = root;
    }
    select(className) {
        I.say('I change component class to ' + className);
        I.click(this.root + ' .multi-valued-box-list');
        I.waitForElement(locate('.list-field-picker .list-field-picker-content label').withText(className), 5);
        I.wait(1);

        I.click(locate('.list-field-picker .list-field-picker-content label').withText(className));
        I.click('#cancel');
    }

    see(value) {
        I.say('I see ' + value + ' criterion');
        I.waitForText(value, 10, '.advanced-search .advanced-search.class-selector .criterion .field-value');
    }
    dontSee(value) {
        I.say('I see ' + value + ' criterion');
        I.waitForVisible(this.root + ' .advanced-search .advanced-search.class-selector .criterion .field-value', 10);
        I.dontSee(value, this.root + ' .advanced-search .advanced-search.class-selector .criterion .field-value');
    }
}
// For inheritance
module.exports = new ClassSelector();
module.exports.ClassSelector = ClassSelector;