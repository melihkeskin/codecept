//<reference path="../steps.d.ts" />
const I = actor();

module.exports = {

  root: '.inbox-leftbar',
  glassPanel: require('./glassPanel'),

  waitForLoaded: function () {
    within(this.root, () => {
      I.waitForElement('.active', 5);
    });
  },
  openFirstLevel: function (first, hasSecondLevel) {
    I.waitForElement(this.root);
    within(this.root, () => {
      I.waitForText(first, 5);
      I.wait(0.3);
      I.click(first)
      if (hasSecondLevel) {
        I.waitForElement('.active-node', 5);
      } else {
        I.waitForElement('.active', 5);
      }
    });
    this.glassPanel.waitForInvisible();
  },
  openSecondLevel: function (first, second) {
    this.openFirstLevel(first, true)
    within(this.root + " .active-node", () => {
      I.waitForText(second, 5);
      I.click(second);
    });
    this.glassPanel.waitForInvisible();
  },
}