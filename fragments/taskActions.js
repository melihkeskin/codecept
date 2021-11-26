//<reference path="../steps.d.ts" />
const I = actor();

module.exports = {
		
  root: '.smart-actions.component-taskclass',
  menu: '.dropdown-menu',

  open() {
    I.waitForElement(this.root, 15);
    I.click(this.root + ' .dropdown-button');
  },
  openSub(name) {
    I.say('I execute task action ' + name);
    this.open();
    within(this.root + ' ' + this.menu, () => {
      I.waitForVisible('.menu-item[title="' + name + '"]', 15);
      I.seeElement('.menu-item[title="' + name + '"]');
      I.click('.menu-item[title="' + name + '"] .label');
    });
    I.wait(1);
  },
  see(name) {
    I.say('I see task action ' + name);
    this.open();
    within(this.menu, () => {
      I.see(name);
    });
  },
  dontSee(name) {
    I.say('I do not see task action ' + name);
    within(this.menu, () => {
      I.dontSee(name);
    });
  }
}
