//<reference path="../steps.d.ts" />

const { I } = inject();
const { TypeSelector } = require('../fragments/TypeSelector');

class dashletPopup {
    constructor() {
        this.notification = require('../fragments/notification');
        this.root = '.modal-dialog';
        this.typeSelector = new TypeSelector(this.root);
    }
    changeType(value) {
        this.typeSelector.select(value);
    }
    changeType2(value) {
        let selector = this.root + ' .combo-editor';
        I.waitForVisible(selector);
        I.executeScript(function (selector, value) {
            $(selector + " select").val(value).trigger('change');
        }, selector, value);
    }
    openCreationPopup() {
        I.waitForElement('#create-dashlet');
        I.click('#create-dashlet');
        I.waitForVisible('.modal-content .dashlet-editor');
    }
    fillFields(title, description, optionid, type) {
        within(this.root, () => {
            I.fillField('[id~=Libellé] .string-input', title);
            I.fillField('[id~=Description] .string-input', description);
        });
        switch (type) {
            case "HISTO":
                this.fillAggregation(optionid, 1);
                this.fillAggregation(optionid, 2);
                break;
            case "DONUT":
                this.fillAggregation(optionid);
                break;
            default:
                this.fillDisplay(optionid);
                break;
        }
    }
    fillAggregation(optionid, index) {
        (index === undefined) ? I.click('.modal-content [id~=Agrégation] .select2-selection') : I.click('.modal-content [id~=Agrégation][id~=n°' + index + '] .select2-selection');
        I.click(".//*[contains(@id, '" + optionid + "')]");
    }
    fillDisplay(optionid) {
        I.click('.modal-content [id~=Afficher] .select2-selection');
        I.click(".//*[contains(@id, '" + optionid + "')]");
    }
    changeStep(value) {
        I.click('.actions #step' + value);
    }
    validate() {
        I.click('.actions #validate');
        this.notification.waitForVisible('Le dashlet a été créé avec succès.');
        I.waitForInvisible(".glass-panel-icon", 45);
    }
    goStep2(type) {
        this.changeType(type);
        this.changeStep(2);
    }
}

// For inheritance
module.exports = new dashletPopup();
module.exports.dashletPopup = dashletPopup;