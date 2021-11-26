//<reference path="../steps.d.ts" />

const { I } = inject();
const confirmationPopup = require('./confirmationPopup');

//TODO: add this.root for each functions to ensure no conflict with use of reasonedAnswerPopup custom root selector
class form {
  constructor() {
    this.root = '.fields-container';
    this.createAction = '.actions #create';
    this.saveAction = '.actions #saveAndQuit';
    this.cancelAction = '.actions #cancel';
    this.tagContainer = '.tag-container ';
    this.componentFolders = '.component-folders';
    this.smartActions = require('./smartActions');
    this.glassPanel = require('./glassPanel');
    this.notification = require('../fragments/notification');
  }

  changeClass(name) {
    I.say('Changing component class to ' + name);
    I.waitForElement(this.root + ' .component-class-data', 60);
    I.click(this.root + ' .component-class-data .multi-valued-box-list');
    I.wait(0.2);
    I.waitForElement(locate('.list-field-picker .list-field-picker-content label').withText(name), 5);
    I.wait(1);
    I.click(locate('.list-field-picker .list-field-picker-content label').withText(name));
  }
  changeTitle(value) {
    I.say('Changing component title to ' + value);
    I.waitForElement('.page-title .field-string .string-input', 60);
    I.fillField('.page-title .field-string .string-input', value);
  }
  seeTitle(value) {
    I.waitForElement('.page-title', 60);
    I.retry(2).see(value, '.page-title');
  }
  seeFieldTitle(value) {
    I.waitForElement('.page-title', 60);
    I.retry(2).seeInField('.page-title .string-input', value);
  }
  seeHeaderIcon(icon) {
    I.waitForElement('.page-title', 60);
    I.retry(2).waitForVisible('.page-title ' + icon);
  }
  seeDescription(description) {
    I.waitForElement('.content-page .description', 60);
    I.retry(2).see(description, '.content-page .description');
  }
  seeHeader(title, icon, description, editableTitle) {
    if (editableTitle) {
      this.seeFieldTitle(title);
    } else {
      this.seeTitle(title);
    }
    this.seeHeaderIcon(icon);
    this.seeDescription(description);
  }
  fillTag(name, value) {
    I.wait(4);
    I.fillField('.tags ' + name + ' .string-input', value)
  }
  fillTagId(id, value) {
    I.wait(4);
    I.fillField('.tags .' + id + ' .string-input', value)
  }
  fillTextTag(name, value) {
    I.wait(4);
    I.fillField('.tag' + name + ' textarea', value)
  }
  fillListTag(name, value, multivaluedTag) {
    this.openListPicker(name);
    I.wait(0.5);
    I.waitForElement('.list-field-picker .list-field-picker-content .value-' + value + ' input', 5);
    I.checkOption('.list-field-picker .list-field-picker-content .value-' + value + ' input');
    I.wait(0.5);
    if (multivaluedTag) {
      I.click('.list-field-picker #cancel');
    }
  }
  fillListTagWithSearch(name, value, search, multivaluedTag) {
    this.openListPicker(name);
    I.wait(4);
    I.fillField(".search-textbox", search);
    I.waitForElement('.list-field-picker .list-field-picker-content .value-' + value + ' input', 5);
    I.checkOption('.list-field-picker .list-field-picker-content .value-' + value + ' input');
    I.wait(4);
    if (multivaluedTag) {
      I.click('.list-field-picker #cancel');
    }
  }
  validationRequest(name, value, search) {
    let selector = ".modal-content " + name + ' .multi-valued-box-list';
    I.waitForElement(selector);
    I.click(selector);
    I.wait(0.2);
    I.fillField(".search-textbox", search);
    I.waitForElement('.list-field-picker .list-field-picker-content .value-' + value + ' input', 5);
    I.checkOption('.list-field-picker .list-field-picker-content .value-' + value + ' input');

  }
  seeListPossibleValues(nameTag, tags) {
    this.openListPicker(tags.get(nameTag).id);

    Object.keys(tags.get(nameTag)).forEach(k => {
      if (tags.get(nameTag)[k] != tags.get(nameTag).id)
        I.waitForElement('.list-field-picker .list-field-picker-content .value-' + tags.get(nameTag)[k] + ' input', 5);
    });
    this.cancel();
  }
  openListPicker(name) {
    let selector = this.root + ' .tag' + name + ' .multi-valued-box';
    I.waitForElement(selector);
    I.wait(0.4);
    I.click(selector);
    I.wait(0.4);
  }
  seeTag(name, value) {
    I.waitForElement(this.tagContainer + name + ' input')
    I.retry(2).seeInField(this.tagContainer + name + ' input', value);
  }
  seeTagValue(name) {
    I.waitForElement(this.tagContainer + name + ' input')
    var id = I.grabValueFrom(this.tagContainer + name + ' input');
    id.then(function (result) {
      return result // "Some User token"
    })
  }
  seeReadOnlyTag(name) {
    I.seeElement(locate(this.tagContainer + name + ' .view-container.disabled'), 15);
  }
  seeTextTag(name, value) {
    I.waitForElement(this.tagContainer + name + ' textarea')
    I.retry(2).seeInField(this.tagContainer + name + ' textarea', value);
  }
  seeListTag(name, value) {
    I.waitForText(value, 5, this.root + ' .tag' + name);
  }
  seeListTagValue(name, value) {
    let selector = this.root + ' .tag' + name + ' .multi-valued-box';
    I.waitForElement(selector);
    I.waitForElement(selector + " .value-" + value);
  }
  seeValidTag(name) {
    let selector = this.root + ' ' + this.tagContainer + ' .tag.' + name;
    I.waitForVisible(selector);
    I.waitForInvisible(selector + ' .dateBoxFormatError');
  }
  seeInvalidTag(name) {
    I.waitForVisible(this.root + ' ' + this.tagContainer + ' .tag.' + name + ' .dateBoxFormatError');
  }
  seeInvalidTags(count) {
    I.seeNumberOfElements(this.tagContainer + '.dateBoxFormatError', count);
  }
  seeMandatoryTags(count) {
    I.seeNumberOfVisibleElements(this.tagContainer + ' .mandatory-marker', count);
  }
  create(notifications) {
    this.waitForActionEnabled(this.createAction);
    I.click('Créer', this.createAction);
    if (notifications) {
      this.notification.waitForVisible(notifications);
    }
    this.glassPanel.waitForInvisible();
  }
  save(category) {
    this.waitForActionEnabled(this.saveAction);
    let notificationCategory = category;
    if (!notificationCategory) {
      notificationCategory = I.executeScript(() => {
        return JSAPI.get().getLastComponentFormAPI().getComponent().getCategory();
      });
    }

    I.click('Sauvegarder', this.saveAction);
    if (category == 'DOCUMENT') {
      this.notification.waitForVisible('Le document a été mis à jour avec succès.');
    } else if (category == 'TASK') {
      this.notification.waitForVisible('La tâche a été mise à jour avec succès');
    } else if (category == 'FOLDER') {
      this.notification.waitForVisible('Le dossier a été mis à jour avec succès.');
    } else if (category == 'VIRTUAL_FOLDER') {
      this.notification.waitForVisible('Le dossier a été mis à jour avec succès.');
    }

    this.glassPanel.waitForInvisible();
  }
  cancel() {
    I.say('I cancel form');
    this.waitForActionEnabled(this.cancelAction);
    I.click('Annuler', this.cancelAction);
    this.glassPanel.waitForInvisible();
  }
  clickAction(name, confirm, notification) {
    this.waitForActionEnabled(name);
    I.click(name);
    if (confirm) {
      this.confirm();
    }
    if (notification) {
      this.notification.waitForVisible(notification);
    }
    this.glassPanel.waitForInvisible();
  }
  attach() {
    I.wait(1);
    smartActions.openSub("#attach");
  }
  saveWithConfirmation() {
    this.save();
    this.confirm();
  }
  confirm() {
    confirmationPopup.confirm();
  }
  waitForActionEnabled(selector) {
    I.waitForVisible(selector, 3);
    I.waitForFunction((selector) => $(selector).hasClass('disabled') == false, [selector], 3);
  }
  waitForActionDisabled(selector) {
    I.waitForVisible(selector, 3);
    I.waitForFunction((selector) => $(selector).hasClass('disabled') == true, [selector], 3);
  }
  openParentFolder(name) {
    if (name == undefined) {
      name = '';
    }
    I.waitForVisible(this.componentFolders, 10);
    //I.scrollTo(this.componentFolders);
    within(this.componentFolders, () => {
      const selector = '.component-parent .link[title="Ouvrir le dossier ' + name + '"]';
      I.waitForElement(selector, 5);
      I.click(selector);
    });
    this.glassPanel.waitForInvisible();
  }
  deleteLogically() {
    this.smartActions.openSub('#delete');
    this.confirm();
  }
  bookmark() {
    I.waitForInvisible('.loading', 120);
    this.clickAction('#favorite');
    I.waitForInvisible('.loading', 60);
    I.waitForVisible('.fas.fa-star', 10);
  }
  unbookmark() {
    I.waitForInvisible('.loading', 120);
    this.clickAction('#favorite');
    I.waitForInvisible('.loading', 60);
    I.waitForVisible('.far.fa-star', 10);
  }
}
// For inheritance
module.exports = new form();
module.exports.form = form;