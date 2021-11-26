//<reference path="../steps.d.ts" />

const { I } = inject();
const { TypeSelector } = require('../fragments/TypeSelector');

class stampPopup {
    constructor() {
        this.glassPanel = require('./glassPanel');
        this.root = '.modal-dialog';
        this.notification = require('../fragments/notification');
        this.typeSelector = new TypeSelector(this.root);
    }
    selectColor(value) {
        within(this.root, () => {
            let selector = this.root + ' .step.active .select-wrapper '
            I.waitForElement(selector + 'input');
            I.waitForElement(selector + 'select');
            I.selectOption(selector + 'select', value);
        });
    }

    check(name) {
        I.waitForVisible(this.root, 5);
        within(this.root, () => {
            const label = locate('.gwt-Label').withText(name);
            const formGroup = locate('.formGroup').withChild(label);
            I.checkOption('.modal-body .step.active .switch', formGroup);
        });
    }

    fillTitle(value) {
        I.waitForVisible(this.root, 5);
        within(this.root, () => {
            I.fillField(locate('.field-string .string-input').first(), value);
        });
    }

    addFile(file) {
        I.waitForVisible(this.root, 5);
        within(this.root, () => {
            const actionSelector = '.modal-body .step.active input[type=file]';
            I.waitForElement(this.root + ' ' + actionSelector, 3);
            I.attachFile(this.root + ' ' + actionSelector, file);
            this.glassPanel.waitForInvisible();
        });
    }

    goToStep(value) {
        let selector = this.root + ' .actions #step' + value;
        I.waitForVisible(selector, 5);
        I.click(selector);
    }

    validate() {
        I.waitForVisible(this.root, 5);
        within(this.root, () => {
            I.click('.actions #validate');
        });
        this.notification.waitForVisible('Le tampon a été créé avec succès');
        this.glassPanel.waitForInvisible();
    }
    createTextualStamp(title, color, border) {
        this.typeSelector.select('Textual');
        this.goToStep(2);
        this.fillTitle(title);
        if (color != null) {
            this.selectColor(color);
        }
        if (border === true) {
            this.check('Bordure');
        }
        if (title && title.length > 0) {
            this.validate();
        }
    }
    createImageStamp(title, file) {
        this.typeSelector.select('Image');
        this.goToStep(2);
        this.addFile(file);
        this.fillTitle(title);
        if (file && file.length > 0) {
            this.validate();
        }
    }
    seeDisabledAction(action) {
        I.seeElement('#' + action + '.disabled');
    }
}

// For inheritance
module.exports = new stampPopup();
module.exports.stampPopup = stampPopup;