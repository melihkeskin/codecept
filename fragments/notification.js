//<reference path="../steps.d.ts" />
const I = actor();

module.exports = {
  root: '.jq-toast-wrap .jq-toast-single',
  popup: require('./notificationPopup'),

  waitForVisible: function (messages, duration) {
    duration = duration ? duration : 60;
    if (Array.isArray(messages)) {
      messages.forEach((val, index) => {
        this.waitForSingle(val, duration);
      });
    } else if (messages) {
      this.waitForSingle(messages, duration);
    }
  },
  waitForSingle: function (text, duration) {
    I.say("Waiting for notification: '" + text + "'")
    let locator = locate(this.root).withText(text);
    I.waitForVisible(locator, duration);
    this.hide(text);
    I.waitForInvisible(locator, duration);
  },
  hide: function (text) {
    I.executeScript((message) => {
      let xpath = ".//*[contains(concat(' ', normalize-space(./@class), ' '), ' jq-toast-wrap ')]//*[contains(concat(' ', normalize-space(./@class), ' '), 'jq-toast-single ')][contains(., '" + message + "')]"
      console.info('xpath=' + xpath);
      elt = document.evaluate(
        xpath,
        document.documentElement,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );

      if (elt && elt.singleNodeValue) {
        var singleNode = elt.singleNodeValue;
        singleNode.parentNode.removeChild(singleNode);
      }
    }, text);
  }
}