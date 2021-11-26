//<reference path="../steps.d.ts" />
const I = actor();
module.exports = {
  root: '.viewerFrame',

  see: function (name) {
    I.say("I see '" + name + "' in ARender top panel");
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      I.waitForElement('.toppanel', 10);
      I.waitForVisible('.standardButton' + name, 30);
    });
  },
  dontSee: function (name) {
    I.say("I don't see '" + name + "' in ARender top panel");
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      I.waitForElement('.toppanel', 10);
      I.waitForInvisible('.toppanel .standardButton' + name, 10);
    });
  },
  seeInSubMenu: function (selector) {
    I.say("I see '" + selector + "' in ARender top panel sub menu");
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      I.waitForElement('.topPanelSubMenu', 10);
      I.waitForVisible('.topPanelSubMenu .standardButton' + selector, 3);
    });
  },
  dontSeeInSubMenu: function (selector) {
    I.say("I don't see '" + selector + "' in ARender top panel sub menu");
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      I.waitForElement('.topPanelSubMenu', 10);
      I.waitForInvisible('.topPanelSubMenu .standardButton' + selector, 3);
    });
  },
  openShowMore: function () {
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      I.moveCursorTo('.showMoreButton');
    });
  },
  openSubMenu: function (selector) {
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, async () => {
      I.moveCursorTo(selector);
    });
  }
}
