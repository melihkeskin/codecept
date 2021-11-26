//<reference path="../steps.d.ts" />

const I = actor();
const smartActions = require('../fragments/smartActions');
const objectPicker = require('../fragments/objectPicker');
const glassPanel = require('./glassPanel');

module.exports = {
  root: '.modal-dialog.save-search ',
  frenchLabelField: ' .i18n-labels .FR .string-input',
  pickerContainer: '.modal-dialog.hierarchical-field.picker-container',

  rename: function (name) {
    smartActions.root = '.smart-actions';
    smartActions.openSub('#renameSearch');
    smartActions.root = '.smart-actions.component-header-actions';

    I.waitForVisible('.modal-content');
    I.fillField(this.root + this.frenchLabelField, name);
    if (name == "") { I.pressKey('Delete'); }
    I.click('#validate');
  },
  shareTo: function (type, name, displayName) {
    smartActions.root = '.smart-actions';
    smartActions.openSub('#shareSearch');
    smartActions.root = '.smart-actions.component-header-actions';

    I.waitForVisible('.modal-content');
    I.click('#shareTo' + type);

    I.waitForVisible('.modal-content');
    objectPicker.search(name);
    objectPicker.selectFirst();
    I.waitForVisible('.modal-content');
    within(this.pickerContainer, () => {
      I.click('#validate');
    });
    glassPanel.waitForInvisible();

    I.waitForText(displayName, 5);
    I.click('#validate');
    glassPanel.waitForInvisible();
    I.wait(2);
  },
  seeShareTo: function (name) {
    smartActions.root = '.smart-actions';
    smartActions.openSub('#shareSearch');
    smartActions.root = '.smart-actions.component-header-actions';
    I.waitForText(name, 5, '.modal-content');
  },
  dontShareTo: function (name) {
    smartActions.root = '.smart-actions';
    smartActions.openSub('#shareSearch');
    smartActions.root = '.smart-actions.component-header-actions';

    I.waitForVisible('.modal-content');
    const nameLocation = locate('.col .name').withText(name);
    const rowLocation = locate('.object-card .row').withDescendant(nameLocation);
    I.click('#delete', rowLocation);
    glassPanel.waitForInvisible();

    I.dontSee(name);
    I.click('#validate');
    glassPanel.waitForInvisible();
  },
  cantStopShareTo: function (name) {
    smartActions.root = '.smart-actions';
    smartActions.openSub('#shareSearch');
    smartActions.root = '.smart-actions.component-header-actions';

    I.waitForVisible('.modal-content');
    const nameLocation = locate('.col .name').withText(name);
    const rowLocation = locate('.object-card .row').withDescendant(nameLocation);
    I.dontSeeElement('#delete', rowLocation);

    I.click('#cancel');
    glassPanel.waitForInvisible();
  },
  seeAction: function (selector) {
    smartActions.root = '.smart-actions';
    smartActions.see(selector);
    smartActions.root = '.smart-actions.component-header-actions';
  },
  dontSeeAction: function (selector) {
    smartActions.root = '.smart-actions';
    smartActions.dontSee(selector);
    smartActions.root = '.smart-actions.component-header-actions';
  },
  delete: function () {
    smartActions.root = '.smart-actions';
    smartActions.openSub('#deleteSearch');
    smartActions.root = '.smart-actions.component-header-actions';

    I.waitForVisible('.modal-content');
    I.click('#yes');
  },
  open: function () {
    I.click('#saveSearch');
  },
  save: function (name) {
    I.say('I save search ' + name);
    I.fillField(this.root + this.frenchLabelField, name);
    if (name == "") { I.pressKey('Delete'); }
    I.click('#validate');
    I.wait(2);
  },
  seeDisabled(selector) {
    I.waitForElement('.modal-footer .actions ' + selector + '.disabled', 5);
  },
  cancel: function () {
    I.click('#cancel');
  }
}