//<reference path="../steps.d.ts" />
const I = actor();
const confirmationPopup = require('./confirmationPopup');
const notification = require('../fragments/notification');
const glassPanel = require('./glassPanel');

module.exports = {

  root: '.content-page .footer .actions',

  seeEnabled(selector) {
    I.waitForElement(this.root + ' button' + selector, 5);
  },
  seeDisabled(selector) {
    I.waitForElement(this.root + ' button' + selector + '.disabled', 5);
  },
  see(selector) {
    I.waitForElement(this.root + ' button' + selector);
    //I.see(this.root + ' button[title="' + selector + '"]');
  },
  dontSee(selector) {
    I.waitForInvisible(this.root + ' button' + selector, 5);
  },
  waitForActionEnabled: function (selector) {
    I.waitForFunction((selector) => $(selector).hasClass('disabled') == false, [selector], 3);
  },
  click: function (selector, notifications, skipWaitForGlassPanel) {
    this.waitForActionEnabled(selector);
    I.wait(1);
    I.click(this.root + ' button' + selector);
    if (notifications) {
      notification.waitForVisible(notifications);
    }
    if (!skipWaitForGlassPanel) {
      glassPanel.waitForInvisible();
    }
  },
  clickAndConfirm: function (selector, notifications) {
    this.click(selector, false, true);
    confirmationPopup.confirm();
    if (notifications) {
      notification.waitForVisible(notifications);
    }
    glassPanel.waitForInvisible();
  },
  reafecterListCirterion(criterion, value) {
    I.say('I fill list criterion');
    I.click(".footer .actions #Reaffecter");
    I.click(criterion + ' > div.view-container');
    I.checkOption(value)

    I.wait(1);
    I.click("#Réaffecter")
    
  }
}