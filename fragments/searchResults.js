const { I } = inject();

class searchResults {
  constructor() {
    this.actions = require('../fragments/searchActions');
    this.contextualMenu = require('../fragments/contextualMenu');
    this.glassPanel = require('./glassPanel');
    this.smartActions = require('../fragments/smartActions');
    this.downloadPopup = require('../fragments/downloadPopup');

    this.root = '.search-results';
    this.resultsBody = '.table-responsive .table tbody';
    this.cardsBody = '.search-card-container .response-content';

    this.resultsHeader = '.table-responsive .table thead';
    this.searchHeader = '.search-header';
    this.searchFooter = '.search-footer';
    this.pageSize = '.search-features.search .gwt-ListBox';
    this.pageNumber = '.pagination .gwt-ListBox';
    this.container = '';
    this.displaySelector = '.search-header .display-selector';
    this.footerActions = '.footer-actions';
  }
  waitForResultsContainer() {
    I.waitForElement(this.root, 30);
  }
  seeFirst(name) {
    I.say('I see ' + name + ' as first search result');
    this.see(name, 1);
  }
  openFirst() {
    I.say('I open first search result');
    this.open(1);
  }
  openFirstCard() {
    I.say('I open first search result');
    this.openCard(1);
  }
  open(index) {
    I.say('I open search result n°' + index);
    this.waitForTable();
    I.waitForElement(this.resultsBody + '> tr:nth-of-type(' + index + ') > td.check', 5);
    I.click(this.resultsBody + ' tr:nth-of-type(' + index + ') >  td:nth-of-type(2)');
    this.glassPanel.waitForInvisible();
  }
  openCard(index) {
    I.say('I open search result n°' + index);
    I.waitForVisible(this.cardsBody + " .home-card:nth-of-type(" + index + ") .card-caption", 30);
    I.click(this.cardsBody + " .home-card:nth-of-type(" + index + ") .card-caption");
    this.glassPanel.waitForInvisible();
  }
  doubleClick(index, name) {
    I.say('I open with double click search result n°' + index);
    var truncated = this.truncate(name);
    this.waitForTable();
    I.waitForElement(this.resultsBody + '> tr:nth-of-type(' + index + ')', 5);
    I.doubleClick(truncated, this.resultsBody + ' tr:nth-of-type(' + index + ')');
    this.glassPanel.waitForInvisible();
  }
  seeAndOpenFirst(name) {
    this.seeFirst(name);
    this.openFirst();
  }
  seeAndOpenFirstCard(name) {
    this.seeCard(name, 1);
    this.openFirstCard();
  }
  seeInRow(name, row) {
    I.say('I see ' + name + ' within search result n°' + row);
    var truncated = this.truncate(name);
    within(this.resultsBody, () => {
      I.waitForElement('tr:nth-of-type(' + row + ')', 5);
      I.retry({
        retries: 10,
        minTimeout: 100
      }).see(truncated, 'tr:nth-of-type(' + row + ')');
    });
  }
  seeFieldValueInRow(fieldName, fieldValue, row) {
    I.say('I see ' + fieldValue + ' within search result n°' + row + ' and cell' + fieldName);
    var truncated = this.truncate(fieldValue);
    within(this.resultsBody, () => {
      I.waitForElement('tr:nth-of-type(' + row + ') ' + fieldName, 5);
      I.retry({
        retries: 10,
        minTimeout: 100
      }).seeTextEquals(truncated, 'tr:nth-of-type(' + row + ') ' + fieldName);
    });
  }
  seeAndSelectFirst(name) {
    this.seeFirst(name);
    I.say('I select first search result');
    I.checkOption(this.resultsBody + ':nth-child(3) > tr div > span > input[type="checkbox"]');
  }
  seeAndSelect(name, index) {
    this.see(name, index);
    this.select(index)
  }
  select(index) {
    I.say('I select search result n°' + index);
    I.waitForElement('tr > td.check', 10);
    I.checkOption('tr:nth-child(' + index + ') > td.check > div > span > input');
  }
  selectAndShowContextualMenu(index) {
    I.say('I select and open contextual menu for search result n°' + index);
    let selector = 'tr:nth-child(' + index + ') > td.check > div > span > input';
    I.waitForVisible(selector, 10);
    I.rightClick(selector);
  }
  see(name, index) {
    var truncated = this.truncate(name);
    I.say('I see truncated string ' + truncated + ' within search result n°' + index);
    this.waitForRow(index);
    I.waitForText(truncated, 10, this.resultsBody + ' > tr:nth-of-type(' + index + ')');
  }
  seeCard(name, index) {
    var truncated = this.truncate(name);
    I.say('I see truncated string ' + truncated + ' within search result n°1');
    I.waitForText(truncated, 10, this.cardsBody + " .home-card:nth-of-type(" + index + ") .card-caption");
  }
  seeIconColumn(icon, index) {
    I.say('I see icon ' + icon + ' within search result n°' + index);
    this.waitForRow(index);
    I.seeElement(this.resultsBody + ' > tr:nth-of-type(' + index + ') > td > div .circle-icon-cell ' + icon);
  }
  dontSeeFieldValueInRow(fieldName, fieldValue, row) {
    I.say('I see ' + fieldValue + ' within search result n°' + row + ' and cell' + fieldName);
    var truncated = this.truncate(fieldValue);
    within(this.resultsBody, () => {
      I.waitForElement('tr:nth-of-type(' + row + ') ' + fieldName, 5);
      I.retry({
        retries: 10,
        minTimeout: 100
      }).dontSee(truncated, 'tr:nth-of-type(' + row + ') ' + fieldName);
    });
  }
  dontSeeInResults(name) {
    var truncated = this.truncate(name);
    this.waitForTable();
    I.say('I do not see truncated string ' + truncated + ' within search results');
    I.dontSee(truncated, this.resultsBody);
  }
  dontSee(name, index) {
    var truncated = this.truncate(name);
    I.say('I do not see ' + truncated + ' within search result n°' + index);
    this.waitForRow(index);
    I.dontSee(truncated, this.resultsBody + ' > tr:nth-of-type(' + index + ') > td > div');
  }
  waitForTable() {
    I.say('I wait for search result table');
    this.glassPanel.waitForInvisible();
    I.waitForInvisible(this.root + ' .table-responsive.loading', 60);
    I.waitForElement(this.resultsBody, 60);
  }
  waitForRow(count) {
    this.waitForTable();
    I.waitForElement(this.resultsBody + ' > tr:nth-of-type(' + count + ') > td.check', 10);
  }
  waitForCards() {
    I.say('I wait for search result card');
    this.glassPanel.waitForInvisible();
    I.waitForElement(this.cardsBody, 60);
    I.waitForInvisible('.search-card-container .loading', 60);
  }
  seeTableOf(category) { }
  changePageSize(number) {
    I.say('I change page size to ' + number);
    I.waitForElement(this.searchHeader, 5);
    within(this.searchHeader, () => {
      I.selectOption(this.pageSize, number);
    });
    this.waitForTable();
  }
  changePage(number) {
    I.say('I change page to ' + number);
    I.waitForElement(this.searchFooter, 5);
    within(this.searchFooter, () => {
      I.selectOption(this.pageNumber, number);
    });
  }
  async seePageSize(number) {
    I.say('I see ' + number + ' as page size');
    this.waitForTable();
    let selector = this.searchHeader + " " + this.pageSize;
    I.waitForVisible(selector, 5);

    I.waitForFunction((selector, count) => parseInt($(selector).val()) == parseInt(count), [selector, number], 5);
    I.wait(1);
  }
  async seePage(number) {
    I.say('I see ' + number + ' as current page');
    this.glassPanel.waitForInvisible();
    let selector = this.searchFooter + " " + this.pageNumber;
    I.waitForVisible(selector, 10);

    I.waitForFunction((selector, count) => parseInt($(selector).val()) == parseInt(count), [selector, number], 5);
    I.wait(1);
  }
  async seeNumberOfResults() {
    var resultsNumber = ".search-results .card-header .header-title .badge-pill";
    I.waitForElement(resultsNumber, 10);
    const found = await I.grabTextFrom(resultsNumber);
    return found;
  }
  sort(name) {
    this.waitForTable();
    I.click(locate(this.resultsHeader + ' th').withText(name));
    this.waitForTable();
  }
  toggleColumnSelector() {
    I.say('I toggle column selector');
    I.click(this.displaySelector);
  }
  addColumn(name) {
    I.say('I add ' + name + ' column to search results');
    I.click(this.displaySelector);
    I.waitForText(name, 5, this.displaySelector);
    I.click(name, this.displaySelector);
    this.glassPanel.waitForInvisible();
  }
  seeColumn(name) {
    I.waitForText(name, 10, this.resultsHeader);
  }
  dontSeeColumn(name) {
    I.dontSee(name, this.resultsHeader);
  }
  removeColumn(name) {
    I.say('I remove ' + name + ' column from search results');
    I.click(this.displaySelector);
    I.click(name, this.displaySelector);
  }
  seeContent(content) {
    within(this.container, () => {
      I.waitForText(content, 5);
      I.seeTextEquals(content);
    });
  }
  dontSeeContent(content) {
    within(this.container, () => {
      I.dontSee(content);
    });
  }
  clickFooterAction(name, container) {
    I.waitForElement(this.footerActions);
    if (container != undefined) {
      I.waitForText(name, 5, container + " " + this.footerActions);
      I.click(name, container + " " + this.footerActions);
    } else {
      I.waitForText(name, 5, this.footerActions);
      I.click(name, this.footerActions);
    }
  }
  seeOpenAction() {
    this.seeAction('native', 'Ouvrir');
  }
  seeOpenExternalAction() {
    this.seeAction('native', 'Ouvrir dans une nouvelle fenêtre');
  }
  seeAttachAction() {
    this.seeAction('native', 'Attacher à un dossier');
  }
  dontSeeAttachAction() {
    this.dontSeeAction('native', 'Attacher à un dossier');
  }
  seeDeleteAction() {
    this.seeAction('native', 'Supprimer');
  }
  dontSeeDeleteAction() {
    this.dontSeeAction('native', 'Supprimer');
  }
  seeDownloadAction() {
    this.seeAction('native', 'Télécharger');
  }
  dontSeeDownloadAction() {
    this.dontSeeAction('native', 'Télécharger');
  }
  seeCompareAction() {
    this.seeAction('viewer', 'Comparer');
  }
  dontSeeCompareAction() {
    this.dontSeeAction('viewer', 'Comparer');
  }
  seeVisualizeAction() {
    this.seeAction('viewer', 'Visualiser');
  }
  dontSeeVisualizeAction() {
    this.dontSeeAction('viewer', 'Visualiser');
  }
  seeAppropriateAction() {
    this.seeAction('native', "M'assigner");
  }
  seeAssignAction() {
    this.seeAction('native', "Assigner à quelqu'un");
  }
  seeAnswerAction(label, icon) {
    this.seeAction('answers', label, icon);
  }
  dontSeeAnswerAction(label) {
    this.dontSeeAction('answers', label);
  }
  clickTaskAction(label) {
    this.actions.clickTaskAction(label);
  }
  seeTaskAction(label, icon) {
    this.seeAction('tasks', label, icon);
  }
  dontSeeTaskAction(label) {
    this.dontSeeAction('tasks', label);
  }
  seeAction(group, label, icon) {
    I.say('I see ' + label + ' ' + group + ' action within bar and contextual menu');
    if (group == 'native') {
      this.actions.seeNative(label, icon);
    } else if (group == 'viewer') {
      this.actions.seeViewer(label, icon);
    } else if (group == 'answers') {
      this.actions.seeAnswer(label, icon);
    } else if (group == 'tasks') {
      this.actions.seeTask(label, icon);
    } else {
      this.actions.see(group, label);
    }
    this.contextualMenu.see(label);
  }
  dontSeeAction(group, label) {
    I.say("I don't see " + label + ' action within bar and contextual menu');
    if (group == 'native') {
      this.actions.dontSeeNative(label);
    }
    else if (group == 'viewer') {
      this.actions.dontSeeViewer(label);
    } else if (group == 'answers') {
      this.actions.dontSeeAnswer(label);
    } else if (group == 'tasks') {
      this.actions.dontSeeTask(label);
    } else {
      this.actions.dontSee(group, label);
    }
    this.contextualMenu.dontSee(label);
  }
  truncate(value) {
    return value.substring(0, 50)
  }
  switchDisplay() {
    let switcher = '#searchView .card-widgets .fa-th';
    I.waitForVisible(switcher, 10);
    I.click(switcher);
    this.glassPanel.waitForInvisible();
  }
  seeNoResults() {
    this.glassPanel.waitForInvisible();
    I.waitForVisible('.no-result-message', 30);
  }
}
// For inheritance
module.exports = new searchResults();
module.exports.searchResults = searchResults;