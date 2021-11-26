//<reference path="../steps.d.ts" />
const I = actor();

module.exports = {
  confirmation: require('./confirmationPopup'),

  see: function (action, actionType, icon) {
    I.say('I see ' + action + ' search action of type ' + actionType);
    if (icon) {
      I.waitForVisible(actionType + ' button[title="' + action + '"]' + " .icon" + icon, 10);
    }
    else {
      I.waitForVisible(actionType + ' button[title="' + action + '"]', 10);
    }
  },
  dontSee: function (action, actionType) {
    I.say("I don't see " + action + ' search action of type ' + actionType);
    I.dontSeeElement(actionType + ' button[title="' + action + '"]');
  },
  seeNative: function (action, icon) {
    this.see(action, "#native", icon);
  },
  dontSeeNative: function (action) {
    this.dontSee(action, "#native");
  },
  seeViewer: function (action, icon) {
    this.see(action, "#viewer", icon);
  },
  dontSeeViewer: function (action) {
    this.dontSee(action, "#viewer");
  },  
  seeTask: function (action, icon) {
    this.see(action, "#tasks", icon);
  },
  dontSeeTask: function (action) {
    this.dontSee(action, "#tasks");
  },  
  seeAnswer: function (action, icon) {
    this.see(action, "#answers", icon);
  },
  dontSeeAnswer: function (action) {
    this.dontSee(action, "#answers");
  },
  click: function (action, actionType) {
    this.see(action, actionType);
    I.click(actionType + ' button[title="' + action + '"]');
  },
  clickNativeAction(action, confirm) {
    this.seeNative(action);
    this.click(action, "#native");
    if (confirm) {
      this.confirmation.confirm();
    }
  },
  clickViewerAction(action) {
    this.seeViewer(action);
    this.click(action, "#viewer");
  },
  clickTaskAction(action) {
    this.seeTask(action);
    this.click(action, "#tasks");
  },
  clickAnswerAction(action) {
    this.seeAnswer(action);
    this.click(action, "#answers");
  }
}