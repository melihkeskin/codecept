//<reference path="../steps.d.ts" />

const I = actor();

module.exports = {

  root: '.modal-dialog.confirm',

  confirm: function () {
    I.waitForVisible(this.root, 5);
    within(this.root, () => {
      I.click('Oui', '.actions');
    });
  },
  cancel: function () {
    I.waitForVisible(this.root, 5);
    within(this.root, () => {
      I.click('Non', '.actions');
    });
  }
}