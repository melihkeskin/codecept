//<reference path="../steps.d.ts" />
const I = actor();
module.exports = {

  root: '.viewerFrame',

  see: function (name) {
    I.say("I see '" + name + "' in ARender contextual menu");
    this.open();
    within({
      frame: this.root
    }, () => {
      I.waitForText(name, 10, '#ContextualMenuView .popupContent .popup-item');
      I.click('.PageView')
    });
  },
  dontSee: function (name) {
    I.say("I don't see '" + name + "' in ARender contextual menu");
    this.open();
    within({
      frame: this.root
    }, () => {
      I.dontSee(name, '#ContextualMenuView .popupContent .popup-item');
      I.click('.PageView')
    });
  },
  open: function () {
    within({
      frame: this.root
    }, async () => {
      await this.doOpen(0);
    });
  },
  doOpen: async function (tryNB) {
    I.rightClick('.PageView');
    let menuOpened = await I.executeScript(() => {
      return document.getElementById('ContextualMenuView') != undefined;
    });
    if (!menuOpened && tryNB < 10) {
      I.wait(0.1);
      await this.doOpen(tryNB + 1);
    } else {
      I.waitForVisible('#ContextualMenuView');
    }
  }
}
