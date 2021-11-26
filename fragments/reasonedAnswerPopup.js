//<reference path="../steps.d.ts" />

const { form } = require('./form');

const { I } = inject();

class reasonedAnswerPopup {
  constructor() {
    this.root = '.reasoned-answer';
    this.form = new form();
    this.form.root = this.root;
    this.form.tagContainer = '';

    this.actions = require('../fragments/footerActions');
  }
  waitForShow() {
    I.say('I wait for reasoned answer popup');
    I.waitForElement(this.root, 5);
  }
  click(selector) {
    I.say('I click on ' + selector + ' action within reasoned answer popup');
    this.actions.root = this.root + ' .modal-footer .actions';
    this.actions.click(selector);
    this.actions.root = '.footer .actions';
  }
  cancel() {
    this.click('Annuler');
  }
}

// For inheritance
module.exports = new reasonedAnswerPopup();
module.exports.reasonedAnswerPopup = reasonedAnswerPopup;