//<reference path="../steps.d.ts" />
const I = actor();
const searchForm = require('./searchForm');

module.exports = {
  root: '.modal-dialog.folder-browser ',

  selectFolder: function (name) {
    I.say('I select folder ' + name + ' within browser');
    I.seeTextEquals(name, this.root + '.root.tree-item .gwt-TreeItem a');
    var checkbox = this.root + 'span.checkbox > input';
    I.waitForElement(checkbox, 5);
    I.click(checkbox);
  },
  validate: function () {
    I.say('I folder browser selection');
    I.waitForElement(this.root + '#validate', 5);
    I.click(this.root + '#validate');
  },
  cancel: function () {
    I.waitForElement(this.root + '#cancel', 5);
    I.click(this.root + '#cancel');
  },
  /* findElementInBrowse: function(name){
       within(this.root, function() {
           I.waitForElement('.root.tree-item  a[title="'+name+'"]',5);
           let xpath =  I.executeScript(getPathTo(name));
           I.amOnPage(xpath);
           I.click('span.checkbox > input');
           });
   },*/
}