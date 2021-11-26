//<reference path="../steps.d.ts" />
const I = actor();
const confirmation = require('./confirmationPopup');
module.exports = {
  root: '.smart-actions.component-header-actions',

  open() {
    I.waitForElement(this.root + ' .dropdown-button', 5);
    I.click(this.root + ' .dropdown-button');
  },
  openSub(selector, confirm) {
    I.say('I execute smart action ' + selector);
    let visibleSelector = selector + ':not(.d-none)';
    this.open();
    I.waitForVisible(this.root + ' .dropdown-menu', 5);
    within(this.root, () => {
      I.waitForVisible(visibleSelector, 5);
      I.seeElement(visibleSelector);
      I.click(visibleSelector);
    });
    //I.wait(1);
    if (confirm) {
      confirmation.confirm();
    }
  },
  see(selector, icon) {
    I.say('I see smart action ' + selector);
    this.open();
    within(this.root, () => {
      if (icon !== undefined) {
        I.seeElement(selector + ' ' + icon);
      }
      else {
        I.seeElement(selector);
      }
    });
    this.open();
  },
  dontSee(selector, dropdown) {
    I.say('I do not see smart action ' + selector);
    if (!dropdown) {
      within(this.root, () => {
        I.dontSeeElement(selector);
      });
    }
    else {
      this.open();
      within(this.root, () => {
        I.dontSeeElement(selector);
      });
      this.open();
    }
  }
}