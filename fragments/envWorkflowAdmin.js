//<reference path="../steps.d.ts" />
const I = actor();
module.exports = {

  root: '#myFrame',
  addButton: "#env-button",


  open : function () {
    I.click(this.addButton);
    within({
        frame: this.root
      }, () => {
        I.waitForElement('#form',30);
      });
  },
  openTab: function(position, tabId) {
    within({
        frame: this.root
      }, () => {
        I.click(locate('.nav-link').at(position));
        I.waitForElement(tabId);
    });
  }
}