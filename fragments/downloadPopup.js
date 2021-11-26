//<reference path="../steps.d.ts" />

const I = actor();

module.exports = {
    form: require('../fragments/form'),
    actions: require('../fragments/footerActions'),

    root: '.modal-dialog.download',

    waitForShow: function () {
        I.say('I wait for download popup');
        I.waitForElement(this.root, 5);
    },
    selectType: function (type) {
        I.say('I click on ' + type);
        I.checkOption(type);
    },
    click: function (selector) {
        this.actions.root = this.root + ' .modal-footer .actions';
        this.actions.click(selector);
        this.actions.root = '.footer .actions';
    },
    cancel: function () {
        this.click('#cancel');
    },
    validate: function () {
        this.click('#validate');
    }
}