// <reference path="../steps.d.ts" />
const { I } = inject();

const { ClassSelector } = require('./search/ClassSelector');
const { CategorySelector } = require('./search/CategorySelector');
const util = require('./util');

class searchForm {
  constructor(root) {
    this.root = root ? root : '.search-criteria';
    this.quick = '.quick-search';
    this.addCriterionAction = '.search-criteria #add';
    this.picker = require('../fragments/objectPicker');
    this.classSelector = new ClassSelector(this.root);
    this.category = new CategorySelector(this.root);
  }

  launchQuick(text) {
    I.say('I launch quick search with input: ' + text);
    within(this.quick, () => {
      I.fillField('input', text);
      this.launchSearch();
    });
  }
  searchById(id) {
    this.searchByString('id_value', id);
  }
  searchByString(name, value) {
    this.openAdvancedSearch();
    this.selectCustomCriterion(name);
    this.fillFieldCriterion(name, value);
    this.launchSearch();
  }
  seeQuick(text) {
    I.say('I see ' + text + ' within quick search input');
    within(this.quick, () => {
      I.seeInField('input', text);
    });
  }
  fillListCriterion(criterion, value, monovalued) {
    I.say('I fill list criterion');
    I.click(this.root + ' .advanced-search .' + criterion + ' .field-value');
    I.wait(0.3);

    I.waitForElement('.list-field-picker', 5);
    within('.list-field-picker', () => {
      I.waitForElement('.picker-selection input', 5);
      I.fillField('.picker-selection input', value);
      I.wait(0.3);
      I.waitForElement('.result.checkbox  input', 5);
      I.checkOption('.result.checkbox  input');
    });

    if (monovalued == undefined || !monovalued) {
      I.click('.list-field-picker #cancel');
    }
    I.waitForInvisible('.list-field-picker', 10);
  }
  async clearMultiValuedCriterion(criterion, index) {
    I.say('I clear multi-valued criterion');
    const valueSelectorHead = '.advanced-search .' + criterion + ' .multi-valued-box-list span';
    if (index != null) {
      I.click(valueSelectorHead + ':nth-child(' + index + ')' + ' span.remove');
    }
    else {
      const numVisible = await I.grabNumberOfVisibleElements(valueSelectorHead + ' span.remove');
      var i;
      var valueSelector;
      for (i = numVisible; i > 0; i--) {
        valueSelector = valueSelectorHead + ':nth-child(' + i + ')' + ' span.remove';
        I.click(valueSelector);
        I.waitForInvisible(valueSelector);
      }
    }
  }
  fillDateCriterion(from, to) {
    I.say('I fill date criterion with ' + from + ", " + to);
    if (from != null) {
      I.fillField('.date-box.from > input', from);
    } else if (from == ' ') {
      I.clearField('.date-box.from > input');
    }
    if (to != null) {
      I.fillField('.date-box.to > input', to);
    } else if (to == ' ') {
      I.clearField('.date-box.to > input');
    }
  }
  clearToDateCriterion() {
    I.waitForVisible('.date-box.to .clear-button', 5);
    I.click('.date-box.to .clear-button');
  }
  clearFromDateCriterion() {
    I.waitForVisible('.date-box.from .clear-button', 5);
    I.click('.date-box.from .clear-button');
  }
  selectDayFromDateCriterionPicker(from, to, open) {
    I.say('I fill date criterion with ' + from + ", " + to);
    if (from != null) {
      if (open) {
        I.click('.date-box.from > input');
      }
      I.waitForVisible('.dateBoxPopup', 10);
      let day = locate('.datePickerDay').withText(from);
      I.click(day)
    }
    if (to != null) {
      if (open) {
        I.click('.date-box.to > input');
      }
      I.waitForVisible('.dateBoxPopup', 10);
      let day = locate('.datePickerDay').withText(to);
      I.click(day);
    }
  }
  fillBooleanCriterion(criterion) {
    I.say('I fill boolean criterion');
    I.click(".advanced-search .actions #add");
    I.checkOption('.list-field-picker .object-picker .user-content .value-' + criterion.replace('.', '') + ' input', 5);
    I.click("#validate")
   // I.checkOption(this.root + ' .advanced-search .' + criterion + ' .field-value input');
  }
  fillFieldCriterion(criterion, value) {
    I.say('I fill string criterion');
    I.click(this.root + ' .advanced-search ' + criterion + ' .field-value');
    I.wait(0.3);

    I.waitForElement('.object-picker', 5);
    within('.object-picker', () => {
      I.waitForElement('.picker-selection input', 5);
      I.fillField('.picker-selection input', value);
      I.wait(0.3);
      I.click('.material-icons');
      I.waitForElement('.result.checkbox  input', 5);
      I.checkOption('.result.checkbox  input');
    });
    I.click('.list-field-picker #cancel');
    I.waitForInvisible('.list-field-picker', 10);
  }
   removeFieldCriterion(criterion, value) {
    I.say('I fill string criterion');
    I.click(this.root + ' .advanced-search ' + criterion + ' .field-value');
    I.wait(0.3);

    I.waitForElement('.object-picker', 5);
    within('.object-picker', () => {
      I.waitForElement('.picker-selection input', 5);
      I.fillField('.picker-selection input', value);
      I.wait(0.3);
      I.click('.material-icons');
      I.waitForElement('.result.checkbox  input', 5);
      I.uncheckOption('.result.checkbox  input');
    });
    I.click('.list-field-picker #cancel');
    I.waitForInvisible('.list-field-picker', 10);
  }
  fillSuggestionFieldCriterion(criterion, value) {
    I.say('I fill string criterion');
    I.click(this.root + ' .advanced-search .' + criterion + ' .field-value');
    I.waitForVisible('.gwt-SuggestBoxPopup', 10);
    I.click(value, '.gwt-SuggestBoxPopup .suggestPopupContent .item');
    I.waitForInvisible('.gwt-SuggestBoxPopup', 10);
  }
  fillTextAreaCriterion(criterion, value) {
    I.say('I fill text criterion');
    I.fillField(this.root + ' .advanced-search .' + criterion + ' .field-value  textarea', value);
  }
  fillStringCriterion(criterion, value) {
    I.say('I fill text criterion');
    I.fillField(this.root + ' .advanced-search .' + criterion + ' .field-value  input', value);
  }
  seeCriterion(criterion, value) {
    I.say('I see ' + value + ' criterion');
    I.waitForText(value, 10, this.root + ' .advanced-search .' + criterion + ' .field-value');
  }
  dontSeeCriterion(criterion) {
    I.dontSeeElement(this.root + ' .advanced-search .' + criterion);
  }
  seeInputCriterion(criterion, value) {
    I.say('I see ' + value + ' criterion');
    I.retry(2).seeInField(this.root + ' .advanced-search .' + criterion + ' .field-value input', value);
  }
  seeFromDateCriterion(criterion, value) {
    this.seeDateCriterion(criterion, value, true);
  }
  seeToDateCriterion(criterion, value) {
    this.seeDateCriterion(criterion, value, false);
  }
  seeDateCriterion(criterion, value, isFrom) {
    let fromOrTo = (isFrom ? 'from' : 'to');
    I.say('I see ' + value + ' ' + fromOrTo + ' date criterion');
    I.seeInField(this.root + ' .advanced-search .' + criterion + ' .field-value .' + fromOrTo + ' input', value);
  }
  seeListAdvanceCriterion(listName)
  {
    I.click(".advanced-search .actions #add");
    for(var i = 0; i<listName;i++)
      I.waitForElement('.list-field-picker .object-picker .user-content .value-' + listName[i].replace('.', '') + ' input', 5);
    
    I.pressKey("Escape");
  }
  launchSearch(name) {
    if (name != undefined) {
      //I.waitForVisible(this.root + " #search[title='" + name + "']", 5);
      I.click(name, this.root + " .buttons-row");
    } else {
      I.click(this.root + ' #search');
    }
  }
  waitForActionEnabled(selector) {
    I.waitForFunction((selector) => $(selector).hasClass('disabled') == false, [selector], 3);
  }
  openAdvancedSearch() {
    I.waitForVisible('.advanced-search', 5);
    util.executeScriptX((done) => {
      let fn = function () {
        if ($('.advanced-search .advanced-criteria-disclosure.gwt-DisclosurePanel-open').length == 0) {
          $('.advanced-search .header td:nth-of-type(2)').click();
          setTimeout(function () { fn.apply(null); }, 100);
        } else {
          done();
        }
      }
      fn.apply(null);
    });
    I.waitForVisible('.advanced-search .content', 2);
  }
  selectCustomCriterion(name) {
    I.click(this.addCriterionAction);
    this.picker.select(name);
    this.picker.validate();
  }
  removeCustomCriterion(name) {
    I.click('.search-criteria .' + name + ' #delete');
  }
  selectFreeCriterionOperator(criterion, operator) {
    I.say('I select ' + operator + ' operator for ' + criterion + ' criterion');
    this.selectCustomCriterion(criterion);
    if (operator) {
      I.waitForVisible('.content > div:nth-child(3) .operator-selector .label');
      I.click('.content > div:nth-child(3) .operator-selector .label');
      this.picker.select(operator);
      this.picker.validate();
    }
  }
  selectOperator(criterion, operator) {
    I.say("I select operator " + operator + " for criterion " + criterion);
    I.waitForVisible('.' + criterion + ' .operator-selector .label');
    I.click('.' + criterion + ' .operator-selector .label');

    this.picker.select(operator);
    this.picker.validate();
  }
}
module.exports = new searchForm();
module.exports.searchForm = searchForm;