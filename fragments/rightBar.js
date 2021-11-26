//<reference path="../steps.d.ts" />
const I = actor();
const confirmationPopup = require('./confirmationPopup');
const util = require('./util');
const stampPopup = require('./stampPopup');
const faker = require('faker');
module.exports = {

  root: '.right-bar',
  glassPanel: require('./glassPanel'),

  async open() {
    I.waitForVisible('.avatar-container .user-initials', 10);
    util.executeScriptX((done) => {
      console.info('Opening right bar');
      let fn = function () {
        if ($('.right-bar-enabled').length > 0) {
          done();
          return;
        }
        $('.avatar-container.nav-link').click();
        setTimeout(function () {
          fn.apply(null);
        }, 200);
      };
      fn.apply(null);
    });

    I.waitForVisible(".right-bar-enabled", 10);
    I.waitForVisible(".right-bar-avatar", 10);
  },
  seeElement(element) {
    I.waitForElement(this.root, 10);
    let selector = this.root + ' ' + element;
    I.waitForVisible(selector, 15);
    I.seeElement(selector, 10);
  },
  dontSeeElement(element) {
    I.waitForElement(this.root, 10);
    I.waitForInvisible(this.root + ' ' + element, 5);
  },
  add(section) {
    I.waitForVisible(section, 20);
    I.waitForInvisible(section + ' .loading', 10)
    let addButton = section + ' .flower-button.fa.fa-plus';
    I.waitForVisible(addButton, 20);
    I.wait(0.1);
    I.waitForVisible(addButton, 20);
    I.click(addButton);
    I.waitForVisible('.modal-dialog', 10);
  },

  see(title, section, icon) {
    I.waitForVisible(this.root, 10);
    let sectionSelector = '#' + section + '-section';
    I.waitForVisible(sectionSelector, 120);

    let locator = locate(sectionSelector + ' .text-truncate').withText(title)
    if (icon) {
      let favoriteDiv = locate('.d-flex').withDescendant(icon);
      locator = locator.inside(favoriteDiv);
    }
    I.waitForVisible(locator, 120);
  },
  dontSee(title, section) {
    I.waitForVisible(this.root, 10);
    let selector = '#' + section + '-section';
    I.waitForVisible(selector, 120);
    I.retry({ retries: 3, minTimeout: 100 }).dontSee(title, selector);
  },
  async createTextualStamp(color, border) {
    await this.open();
    this.add("#stamps-section");
    let title = faker.lorem.words();
    stampPopup.createTextualStamp(title, color, border);
    this.close();
    return title;
  },
  async deleteStamp(title) {
    await this.open();
    this.see(title, 'stamps');
    const stampTitleLocation = locate('.text-truncate.material-label').withText(title);
    const stampLocation = locate('#stamps-section .d-block.item').withDescendant(stampTitleLocation);
    I.click('#delete', stampLocation);
    confirmationPopup.confirm();
    this.glassPanel.waitForInvisible();
  },
  close() {
    I.waitForVisible(".right-bar-avatar", 10);
    I.click('.right-bar-toggle .mdi-close');
  },
  update(title) {
    const stampTitleLocation = locate('.text-truncate.material-label').withText(title);
    const stampLocation = locate('#stamps-section .d-block.item').withDescendant(stampTitleLocation);
    I.click('#edit', stampLocation);
    I.waitForVisible('.modal-dialog', 10);
  },
  openFavorite(title) {
    I.waitForVisible('#favorites-section', 20);
    within('#favorites-section', function () {
      I.click(title);
    });
  },
  waitForAllSectionsOpened(stamps, favorites) {
    within(this.root, function () {
      I.waitForVisible('#given-delegations-section', 20);
      if (stamps) { I.waitForVisible('#stamps-section', 20); }
      if (favorites) { I.waitForVisible('#favorites-section', 20); }
    });
  }
}