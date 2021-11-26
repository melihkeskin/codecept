//<reference path="../steps.d.ts" />

const I = actor();

module.exports = {
    
  common: require('./commonClass'),

  generalFieldClass: '.general-content .string-input',
  tagReferenceClass: '.tag-reference .card-body',
  tagCategoryClass: '.categories-content .field-string',
  attachmentLinkClass: '.attachments-content .nav-pills-tab .nav-item',
  attachmentFieldClass: '.attachments-content .attachment-definition .string-input',

  checkGeneralInfo(processId, displayName, acl, icon, description) {
    I.seeElement('span[title="' + acl + '"]');
    I.seeInField(locate(this.generalFieldClass).at(2), processId);
    I.seeInField(locate(this.generalFieldClass).at(3), icon);
    I.seeInField(locate(this.generalFieldClass).at(5), displayName);
    if (description != undefined) {
      I.seeInField(locate('.general-content textarea').last(), description);
    }
  },
  addTagReference(tagName) {
    I.click('.tags-content #add');
    I.waitForElement('.modal-content .modal-body select');
    I.selectOption('.modal-content .modal-body select', tagName);
    I.click('.modal-content #validate');
    I.waitForElement(locate(this.tagReferenceClass).withText( tagName));
  },
  changeValueOfTag: function (tagName, newValue){
	    I.waitForElement('.tag-references', 15);
	    within ('.tag-references', ()=>{
	      I.waitForElement(locate('.field-string input[type="text"]').inside(locate('.tag-reference div').withDescendant(locate('.card-title h5').withText(tagName))), 15);
	      I.fillField(locate('.field-string input[type="text"]').inside(locate('.tag-reference div').withDescendant(locate('.card-title h5').withText(tagName))), newValue);
	    })
 },
 checkTagReference(tagId, mandatory, technical, readonly, multivalued, defaultValue, pattern, order, description) {
  within(locate(this.tagReferenceClass).withText(tagId), () => {
    this.isCheckedAt(1, mandatory);
    this.isCheckedAt(2, technical);
    this.isCheckedAt(3, readonly);
    this.isCheckedAt(4, multivalued);

    this.seeInFieldAt(1, defaultValue);
    this.seeInFieldAt(2, pattern);
    this.seeInFieldAt(3, order);
    this.seeInFieldAt(5, description);
  });
 },
 isCheckedAt (index, checked) {
    if (checked) {
      I.seeElement(locate('.checkbox').at(index).find('input[checked]'));
    } else {
      I.dontSeeElement(locate('.checkbox').at(index).find('input[checked]'));
    }
 },
 async seeInFieldAt(index, value) {
  if (value != undefined) {
    I.seeInField(locate('.form-group .string-input').at(index), value);
  } 
},
seeTagCategory(tagCategoryId) {
  I.seeElement(this.tagCategoryClass + '[Title="' + tagCategoryId + '"]');
},
openAttachment(index) {
  I.click(locate(this.attachmentLinkClass).at(index));
},
checkAttachment(index, id, mandatory, readonly, multivalued, displayName, description) {
  this.openAttachment(index);
  I.seeInField(locate(this.attachmentFieldClass).at(2), id);
  I.seeInField('.attachments-content .attachment-definition textarea', description);
  I.seeInField(locate(this.attachmentFieldClass).at(5), displayName);
  this.isCheckedAt(1, readonly);
  this.isCheckedAt(3, multivalued);
  this.isAttachmentRequired(locate('.attachments-content .attachment-definition select').at(2), mandatory);
  
},
async isAttachmentRequired(locator, mandatory) {
  let required = await I.grabValueFrom(locator);
  const assert = require('assert');
  if (mandatory) {
    assert.equal(required, 'NOW');
  } else {
    assert.equal(required, 'NO');
  }
}
 
  
}
