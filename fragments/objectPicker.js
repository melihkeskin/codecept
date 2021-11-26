//<reference path="../steps.d.ts" />
const I = actor();

module.exports = {
  root: '.modal-dialog.picker-container',
  picker: '.modal-dialog.picker-container .object-picker',

  search(value) {
    within(this.picker, function () {
      let selector = '.picker-selection .search-textbox input';
      I.waitForVisible(selector, 5);
      I.fillField(selector, value);
    });
  },
  select(value) {
    within(this.picker, function () {
      I.waitForInvisible('.user-content .loading');
      let selector = '.user-content .result.value-' + value;
      I.waitForVisible(selector, 5);
      I.click(selector + ' input');
    });
  },
  selectFirst() {
    within(this.picker, function () {
      I.waitForInvisible('.user-content .loading');
      let selector = '.user-content .result';
      I.waitForVisible(selector);
      I.click(locate(selector + ' input').first());
      I.waitForInvisible('.user-content .loading');
    });
  },
  see(value) {
    within(this.picker, function () {
      I.waitForInvisible('.user-content .loading');
      I.waitForVisible('.user-content .result.value-' + value, 5);
    });
  },
  dontSee(value) {
    within(this.picker, function () {
      I.waitForInvisible('.user-content .loading');
      I.dontSeeElement('.user-content .result.value-' + value);
    });
  },
  click(action) {
    within(this.root, function () {
      let selector = '.actions button' + action;
      I.waitForInvisible(selector + '.disabled');
      I.waitForVisible(selector);
      I.click(selector);
    });
  },
  validate() {
    within(this.root, function () {
      I.click('#validate');
    });
  }
}