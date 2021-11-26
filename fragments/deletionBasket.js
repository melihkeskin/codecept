//<reference path="../steps.d.ts" />

const I = actor();

module.exports = {
  results: require('../fragments/searchResults'),

  purgeSelection: function () {
    I.say('I purge selected components');
    I.click('#purgeSelected');
    I.click('#yes');
  },
  restoreSelection: function () {
    I.say('I restore selected components');
    I.click('#restoreSelected');
    I.click('#yes');
  },
}