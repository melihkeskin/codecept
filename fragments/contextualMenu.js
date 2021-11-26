//<reference path="../steps.d.ts" />
const I = actor();

const confirmationPopup = require('./confirmationPopup');

module.exports = {
  see: function (action) {
    I.seeNumberOfVisibleElements('.contextual-menu .menu-item .label[title="' + action + '"]', 1)
  },
  dontSee: function (action) {
    I.dontSee(action, '.contextual-menu .menu-item .label');
  },
  click: function (action) {
    this.see(action);
    I.click('div[title="' + action + '"]');
  },
  clickAndConfirm: function (action) {
    this.click(action);
    confirmationPopup.confirm();
  },
}