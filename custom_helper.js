
const Helper = require('@codeceptjs/helper');
const fs = require('fs');
const insert = require('./pages/insert');

let userJSON = fs.readFileSync('./data/accounts.json');
const usersArray = JSON.parse(userJSON);
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

const I = actor(); 
//const users = new Map([["admin", ['admin', 'okidoki']], ["phu", ['phu', 'okidoki']], ["sto", ['sto', 'okidoki']], ["jna", ['jna', 'okidoki']], ["system", ['system', 'okidoki2019']], ["lho", ['lho', 'okidoki']], ["rh", ['rh', 'okidoki']]]);

class CustomHelper extends Helper {

  async _after() {
    if (this.config.isIE === true) {
      return;
    }
    // Need to go back to the main session before ending, since Puppeteer assumes it in its _after()
    //this.goToPage(0);
  }

  getCurrentScope() {
    return 'crpn';
  }

  getHelper() {
    if (this.config.isIE === true) {
      return this.helpers['WebDriver'];
    }
    return this.helpers['Puppeteer'];
  }
  async login(id, locale) {
    I.say('login..');
    let user = users.get(id);
    const helper = this.getHelper(); 
    await this.goToLoginPage(locale);
    await this.fillLoginForm(user[0], user[1]);
    await helper.waitForVisible('.logo-box', 60);
    await helper.waitForInvisible('.glass-panel-icon', 45);
    await helper.wait(1);
    await this.checkIsConnected(user[0]);
  }

  async logout() {
    const helper = this.getHelper();
    I.say('logout..');
    await helper.waitForElement(".user-initials", 10);
    await helper.click(".user-initials");
    await helper.waitForElement('.logout', 10);
    await helper.click(".logout");
    await helper.waitForElement('#yes', 10);
    await helper.click("#yes")
  }

  async goToLoginPage(locale) {
    const helper = this.getHelper();
    const scope = await this.getCurrentScope();
    var url = '/signin?scope=' + scope;
    if (locale) {
      url += '&locale=' + locale;
    }
    else {
      url += '&locale=' + 'FR';
    }
    await helper.amOnPage(url);
  }

  async goToDefaultPage(locale) {
    const helper = this.getHelper();
    var url = '/?scope=' + this.getCurrentScope();
    if (locale) {
      url += '&locale=' + locale;
    }
    await helper.amOnPage(url);
  }

  async fillLoginForm(user, password) {
    const helper = this.getHelper();
    I.say('Login as ' + user);
    await helper.waitForElement('#form-signin #username', 3);
    await helper.fillField('#form-signin #username', user);
    await helper.fillField('#form-signin #password', password);
    await helper.click('.btn');
  }

  async checkIsConnected(expected) {
    const helper = this.getHelper();
    I.say('Checking if user ' + expected + ' is connected');
    helper.executeScript(() => {
      localStorage.clear();
      /* caches
        .keys()
        .then(keys => keys.filter(key => key.endsWith('prefs')))
        .then(keys => Promise.all(keys.map(key => caches.delete(key)))) */
    });
    await helper.dontSeeElementInDOM('#form-signin');
    await helper.waitForElement('body.fixed-left', 5);
    await helper.waitForElement('.logo-box', 35);
    await helper.waitForInvisible('body.loading', 5);
    await helper.seeTextEquals(expected, '.user-id.hidden');
    I.say('User ' + expected + ' is connected!');
  }

  async seeMyElement(selector) {
    const helper = this.getHelper();
    try {
      const numVisible = await helper.grabNumberOfVisibleElements(selector);
      if (numVisible) {
        return true;
      }
      else {
        return false;
      }
    } catch (err) {
      console.log('Skipping operation as element is not visible');
    }
  }

  async goToPage(index) {
    const helper = this.getHelper();
    const openSessions = await helper.browser.pages();
    let page = openSessions[index];
    helper.withinLocator = null;
    await helper._setPage(page);
    await page.bringToFront();
  }

  async closePage(index) {
    const helper = this.getHelper();
    const openedSessions = await helper.browser.pages();
    let page = openedSessions[index];
    helper.withinLocator = null;
    await helper._setPage(page);
    await page.close();
  }

  async createIncognitoBrowser() {
    const helper = this.getHelper();
    const context = await helper.browser.createIncognitoBrowserContext();
    helper.withinLocator = null;
    const page = await context.newPage();
    await helper._setPage(page);
    await page.bringToFront();
  }

  async pageGoBack() {
    const helper = this.getHelper();
    await helper.page.goBack();
  }
}

module.exports = CustomHelper;
