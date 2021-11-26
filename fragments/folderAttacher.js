//<reference path="../steps.d.ts" />
const I = actor();
const searchForm = require('./searchForm');

module.exports = {
  folderBrowser: require('../fragments/folderBrowser'),
  root: '.folder-attachment .modal-body ',
  searchPopup: '.modal-dialog.component-search ',

  waitForOpen() {
    I.waitForVisible(this.root, 45);
  },
  advancedSearch() {
    this.waitForOpen();
    I.waitForVisible(this.root + '#advancedSearch', 5);
    I.click(this.root + '#advancedSearch');
  },
  newFolder() {
    this.waitForOpen();
    I.waitForElement(this.root + '#newFolder', 5);
    I.click(this.root + '#newFolder');
  },
  quickSearch: function (text) {
    this.waitForOpen();
    I.waitForVisible(this.root + 'input[type="text"]');
    I.fillField(this.root + 'input[type="text"]', text);
    I.click(this.root + '#rapidSearch');
    this.launchSearch();
  },
  launchSearch: function () {
    I.waitForVisible(this.searchPopup, 3);
    I.waitForVisible(this.searchPopup + 'button#search', 3);
    I.click(this.searchPopup + 'button#search');
  },
  validateSelection: function () {
    let selector = this.searchPopup + '#validate';
    I.waitForVisible(selector, 5);
    I.click(selector);
  },
  seeSelectable(name) {
    let selector = '.modal-dialog.folder-browser.folder-selector';
    I.waitForVisible(selector, 5);
    I.waitForText(name, 5, selector + ' .tree-link')
  }
}