//<reference path="../steps.d.ts" />
const I = actor();
const util = require('../fragments/util');

module.exports = {

  root: '#sidebar-menu',
  glassPanel: require('./glassPanel'),
  opened: '',

  open(name) {
    I.say('I open menu ' + name);
    I.waitForInvisible(this.root + '.loading', 10);
    I.waitForElement(this.root, 10);
    within(this.root, function () {
      I.waitForText(name, 5);
      I.click(name);
    });
    this.glassPanel.waitForInvisible();
  },
  openSub(parent, name) {
    I.waitForInvisible(this.root + '.loading', 10);
    I.waitForElement(this.root, 10);

    const args = Array.from(arguments);
    for (let i = 0; i < args.length - 1; i++) {
      let parent = args[i];
      let selector = this.root + ' .has_sub' + parent;
      I.say('should open parent=' + parent + ' using selector=' + selector);
      I.waitForElement(selector + ' .nav-second-level a', 3);
      util.executeScriptX((selector, done) => {
        let i = 0;
        let fn = function () {
          if ($(selector + ' .nav-second-level.in').length == 0) {
            $(selector + ' a').click();
          }
          if ($(selector + ' .nav-second-level.in').length == 0 && i < 20) {
            i++;
            setTimeout(fn, 50);
          } else {
            done();
          }
        };
        fn.apply(null);
      }, selector);
      I.waitForVisible(selector + ' .nav-second-level.in');
    }

    within(this.root, function () {
      let child = args[args.length - 1];
      I.say('should open child=' + child);
      if (child.indexOf('.') == 0) {
        I.waitForVisible(child, 10);
      } else {
        I.waitForText(child, 10);
      }
      I.click(child);
    });
    this.glassPanel.waitForInvisible();
  },
  seeTab(tabName) {
    within(this.root, function () {
      I.waitForText(tabName, 10);
    });
  },
  isTabSelected(tabId) {
      within(this.root, function () {
        I.seeElement("#side-menu > li.has_sub.active > a."+ tabId +".active",10);

      });
    },
  dontSeeTab(tabName) {
    within(this.root, function () {
      I.wait(1);
      I.dontSee(tabName);
    });
  }
}
