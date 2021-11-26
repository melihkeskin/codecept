//<reference path="../steps.d.ts" />

const I = actor();
const arender = require('../fragments/arender.js');
const notification = require('../fragments/notification.js');
const document = require('../pages/document.js');

module.exports = {

  root: '.attachment-container',
  glassPanel: require('./glassPanel'),

  attachDocumentLegacy(attachment, file) {
    I.say('I attach ' + file + ' as ' + attachment);
    I.waitForElement(this.root, 5);
    const actionSelector = attachment + ' form.upload-attached input';
    I.waitForElement(this.root + ' ' + actionSelector, 3);
    I.attachFile(this.root + ' ' + actionSelector, file);

    this.glassPanel.waitForInvisible();
    arender.waitForDocumentLoading();
  },
  attachNewDocument(attachment, file) {
    this.startAttachment(attachment, file);
    this.endAttachment(file, false);
  },
  openAttachment: function (id) {
    I.say('I open attachment ' + id);
    I.waitForElement(this.root + ' .parent-task-container' + id + ' .task-attachment', 30);
    I.click(this.root + ' .parent-task-container' + id + ' .task-attachment');
    this.glassPanel.waitForInvisible();
  },
  editAttachment: function (id) {
    I.say('I open attachment ' + id);
    I.waitForElement(this.root + ' .parent-task-container' + id + ' .task-attachment');
    I.click(this.root + ' .parent-task-container' + id + ' #edit');
    this.glassPanel.waitForInvisible();
  },
  deleteAttachment: function (id) {
    I.say('I delete attachment ' + id);
    I.waitForVisible(this.root + ' .parent-task-container' + id + ' #delete-attached', 5);
    I.click(this.root + ' .parent-task-container' + id + ' #delete-attached');
    this.glassPanel.waitForInvisible();
  },
  updateAttachment: function (id, file, form) {
    I.waitForElement(this.root, 5);
    const actionSelector = id + ' ' + form;
    I.waitForElement(actionSelector, 5);
    I.attachFile(actionSelector, file);
    I.waitForInvisible(form, 5);
  },
  startAttachment: function (id, file) {
    I.say('I attach ' + file + ' as ' + id);
    I.waitForVisible(this.root + ' .parent-task-container' + id + ' #create-attached', 5)
    I.click(this.root + ' .parent-task-container' + id + ' #create-attached');
    I.waitForVisible('.modal-dialog.component-creation', 3);
  },
  endAttachment: function (file, hasViewer) {
    var fileForm = '.component-creation.document .custom-file-input';
    I.waitForElement(fileForm, 5);
    I.attachFile(fileForm, file);
    notification.waitForVisible('a été chargé avec succès');

    this.glassPanel.waitForInvisible();
    document.form.create();
    this.glassPanel.waitForInvisible();

    if (hasViewer) {
      arender.waitForDocumentLoading();
    }
  },
  seeAttachment: function (index) {
    I.waitForVisible(this.root + ' .parent-task-container .content >div:nth-of-type(' + index + ')');
  },
  seeAttachmentTitle: function (selector, title) {
    I.waitForText(title, 30, selector + ' .attachment-label');
  }
}