//<reference path="../steps.d.ts" />

const I = actor();

module.exports = {
		
  notification: require('./notification'),

  root : '.class-admin ',  
  saveButton:'#save',

  openTab: function (name) {
    I.waitForElement(locate('ul[role="tablist"]'), 15);
    within(locate('ul[role="tablist"]'), ()=>{
      I.waitForElement(locate('li').withText(name), 15);
      I.click(locate('li').withText(name));
    })
  }, 
  openComponentCreation(expectedTitle) {
    I.click(this.root + ' .create');
    I.waitForElement(locate('.modal-content .modal-header .title-container h4').withText(expectedTitle));
  },
  save() {
	   I.click(this.root + this.saveButton);
	   this.notification.waitForVisible(" avec succès", 10);
  }
  
}
