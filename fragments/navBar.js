//<reference path="../steps.d.ts" />
const I = actor();

module.exports = {

  root: '.navbar-custom',

  open(name) {
    I.waitForElement(this.root, 10);
    within(this.root, function () {
      I.click(name);
    });
  },
  seeElement(element) {
    I.waitForElement(this.root, 10);
    within(this.root, function () {
      I.seeElement(element, 5);
    });
  },
  dontSeeElement(element) {
    I.waitForElement(this.root, 10);
    within(this.root, function () {
      I.dontSeeElement(element, 5);
    });
  },
  reload() {
    I.waitForElement(this.root, 10);
    within(this.root, function () {
      I.click('.ti-reload');
    });
  }
}