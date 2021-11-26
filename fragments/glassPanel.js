//<reference path="../steps.d.ts" />

const I = actor();

module.exports = {

  waitForInvisible() {
    I.waitForInvisible('.glass-panel-icon', 120);
    I.waitForInvisible('.cancelRequestPopup', 45);
  }
}