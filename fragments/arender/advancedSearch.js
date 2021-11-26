const { search } = require("../objectPicker");

//<reference path="../steps.d.ts" />
const I = actor();
module.exports = {
  root: '.viewerFrame',
  searchPanel: '.gwt-TabLayoutPanelContentContainer>div:nth-child(6) .documentExplorerTab.gwt-TabLayoutPanelContent ',

  ensureSearchPanelId() {
    I.executeScript(function () {
      var index = $('.viewerFrame').contents().find('.advancedSearchExplorerButton').parent().parent().index();
      var searchPanel = $('.viewerFrame').contents().find('.gwt-TabLayoutPanelContentContainer>div:nth-child(' + (index + 2) + ') .documentExplorerTab.gwt-TabLayoutPanelContent');
      searchPanel.attr('id', 'search-panel');
    });
    within({
      frame: this.root
    }, () => {
      I.waitForVisible('#search-panel .searchBoxEnabled', 10);
    });
  },
  open: function () {
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      I.waitForVisible('.advancedSearchExplorerButton', 10);
      I.click('.advancedSearchExplorerButton');
    });
    this.ensureSearchPanelId();
  },
  search: function (text) {
    this.fillTextBox(text);
    within({
      frame: this.root
    }, () => {
      I.pressKey('Enter');
    });
  },
  obfuscate: function (text) {
    this.fillTextBox(text);
    within({
      frame: this.root
    }, () => {
      var searchAndRedact = locate('#search-panel .advancedSearchOptions-container .buttonSample').withText('Chercher et biffer');
      I.waitForVisible(searchAndRedact, 10);
      I.click(searchAndRedact);
    });
  },
  fillTextBox: function (text) {
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      I.waitForVisible('.advancedSearchExplorerButton', 10);
      I.click('.advancedSearchExplorerButton');
      //pause();
      I.waitForVisible('#search-panel .searchBoxEnabled', 120);
      I.click('#search-panel .searchBoxEnabled');
      I.wait(0.3);
      I.fillField('#search-panel .searchBoxEnabled', text);
    });
  },
  seeOneResult() {
    this.seeResults(1);
  },
  seeResults(count) {
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      I.waitForElement('#search-panel .stackPanel-content .searchStackPanel .stackPanel-secondaryHeaderTitle', 10)
      I.waitForText('Résultat(s) de la recherche: ' + count, 10, '#search-panel .searchStackPanel .stackPanel-secondaryHeaderTitle');
    });
  },
  seeEnglishResults(count) {
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      I.waitForElement('#search-panel .stackPanel-content .searchStackPanel .stackPanel-secondaryHeaderTitle', 10)
      I.waitForText('Search result(s): ' + count, 10, '#search-panel .searchStackPanel .stackPanel-secondaryHeaderTitle');
    });
  },
  dontSeeResult() {
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      I.waitForVisible('#search-panel .empty-commentExplorer', 5);
    });
  }

}
