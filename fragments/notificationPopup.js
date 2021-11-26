//<reference path="../steps.d.ts" />

const I = actor();

module.exports = {

  root: '.modal-dialog.notification',

  waitForShow: function () {
    I.say('I wait for notification popup');
    I.waitForElement(this.root, 5);
  },
  seeInformation: function (message) {
    this.see(message, "");
  },
  seeError: function (message) {
    this.see(message, ".error");
  },
  seeWarning: function (message) {
    this.see(message, ".warning");
  },
  see: function (message, type) {
    I.waitForText(message, 5, this.root + type + " .notification-label");
  },
  close: function () {
    I.waitForVisible(this.root, 5);
    within(this.root, () => {
      I.click('OK', '.actions');
    });
  }
}