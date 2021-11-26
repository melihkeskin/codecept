//<reference path="../steps.d.ts" />

const I = actor();

module.exports = {
		
  common: require('./commonClass'),
  allowedValueClass:'.allowed-value',
  conditionalValuePopup:'.popup-conditional-values',

  generalField: '.general-content .string-input',
  cardField:'.field-string input[type="text"]',

  add:' #add',
  delete:' #delete',

  createTagClass(tagId, tagLabel) {
    this.common.openComponentCreation('Création d\'une classe de tag');
    I.see('Chaîne de caractères');
    I.click('.modal-content #validate');

    I.fillField(locate(this.generalField).first(),tagId);
    I.fillField(locate(this.generalField).last(),tagLabel);
    this.common.save();
   },

   // allowed value methods
  openValuesTab() {
    this.common.openTab('Valeurs');
  },
  addAllowedValue: function (value, display) {
    I.click('.class-admin' + this.add);
    I.wait(0.2);
    within(locate(this.allowedValueClass + ' .card-body').last(), ()=>{
		  I.fillField(locate(this.cardField).first(), value);
		  I.fillField(locate(this.cardField).last(), display);
	   });  
  },
  checkAllowedValue(index, value, display, display2) {
    var locator = this.calculAllowedValueLocator(index);
    within(locator, ()=>{
      I.seeInField(locate(this.cardField).first(), value);
      I.seeInField(locate(this.cardField).at(2), display);
      if (display2 != undefined) {
        I.seeInField(locate(this.cardField).at(3), display2);
      }
  });
   },
  deleteAllowedValue(index) {
    var locator = this.calculAllowedValueLocator(index);
    I.click('#delete', locator);
   },
   calculAllowedValueLocator(index) {
    var locator =  locate(this.allowedValueClass).last();
    if (index != -1) {
      locator = locate(this.allowedValueClass ).at(index);
     }
     return locator;
   },

   // Conditional value methods
   openConditionalValue(index) {
	  finalIndex = 2 + index;
	  I.click(locate(this.allowedValueClass + " .card-widgets #edit").at(index));
	  I.waitForElement(this.conditionalValuePopup);
   },
   closeConditionalValue () {
	   I.click('.modal-footer #cancel');
   },
   saveAndCloseConditionalValue () {
    I.click('.modal-footer #add');
  },
   addConditionalValue(index, value, display) {
	   this.openConditionalValue(index);
	   within(locate(this.conditionalValuePopup + ' .card-body').last(), ()=>{
		   I.dontSeeInField(locate(this.cardField).first(), value);
		   I.dontSeeInField(locate(this.cardField).last(), display);
	   });
	   I.click(this.conditionalValuePopup + this.add);
	   I.wait(0.2);
	   within(locate(this.conditionalValuePopup + ' .card-body').last(), ()=>{
		  I.fillField(locate(this.cardField).first(), value);
		  I.fillField(locate(this.cardField).last(), display);
     });
	 this.saveAndCloseConditionalValue();
   },
   deleteConditionalValue(index) {
    I.click('#delete', locate(this.conditionalValuePopup + ' .card-body').at(index));
   },
   checkConditionalValue(index, value, display, display2) {
    within(locate(this.conditionalValuePopup + ' .card-body').at(index), ()=>{
      I.seeInField(locate(this.cardField).first(), value);
      I.seeInField(locate(this.cardField).at(2), display);
      if (display2 != undefined) {
        I.seeInField(locate(this.cardField).at(3), display2);
      }
    });
   }


  
}
