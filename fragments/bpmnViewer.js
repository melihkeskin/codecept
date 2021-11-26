//<reference path="../steps.d.ts" />
const I = actor();
module.exports = {

  root: '#modeler',

  seeDiagram: function (processId) {
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      I.waitForElement(locate('.viewport .layer-base').withAttr({ 'data-element-id': processId }), 120);
    });
  },
  seeActive(taskName) {
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      I.waitForVisible(locate('.highlight .djs-label').withText(taskName), 10);
    });
  },
  dontSeeActive() {
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      I.dontSeeElement(locate('.highlight .djs-label'));
    });
  },
  dontSeeDiagram(processId) {
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      I.dontSeeElement(locate('.viewport .layer-base').withAttr({ 'data-element-id': processId }));
    });
  },
}