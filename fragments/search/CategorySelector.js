//<reference path="../../steps.d.ts" />
const { I } = inject();

class CategorySelector {
    constructor(root) {
        this.root = root;
    }
    select(category) {
        I.say('I select ' + category + ' category');
        within(this.root + ' .filter-container', () => {
            I.checkOption(category);
        });
    }
    async see(category) {
        I.say('I see selected category ' + category);
        const selected = await I.grabTextFrom(this.root + ' .filter-container input[checked] + label');
        I.test(function (expected, actual) {
            assertEquals(expected, actual);
        }, selected, category);
    }
}
// For inheritance
module.exports = new CategorySelector();
module.exports.CategorySelector = CategorySelector;