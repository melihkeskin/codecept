//<reference path="../steps.d.ts" />
const I = actor();

module.exports = {
  smartActions: require('../fragments/smartActions'),

  open(version) {
    this.clickOnVersionAction(version, '#openVersion');
  },
  revertTo(version) {
    this.clickOnVersionAction(version, '#revertVersion');
  },
  compareTo(version) {
    this.clickOnVersionAction(version, '#compare');
  },
  clickOnVersionAction(version, actionSelector) {
    this.smartActions.openSub('#history');
    var versionFact = locate('.timeline-box').withChild(locate('.item-description').withText(version));
    I.waitForVisible(versionFact, 10);
    I.click(locate(actionSelector).inside(versionFact));
  },
  seeFactFor(version) {
    this.smartActions.openSub('#history');
    let locator = locate('.component-history .timeline-item .item-description').withText('a créé la version ' + version);
    I.waitForVisible(locator, 10);
  },
  dontSeeFact() {
    this.smartActions.openSub('#history');
    I.waitForElement('.component-history .timeline-item .item-description');
    I.dontSeeElement(locate('.item-description').withText('version'));
  }
}