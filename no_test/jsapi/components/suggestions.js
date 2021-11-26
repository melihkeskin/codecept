//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('JSAPI / Suggestions');

Scenario('Given a monovalued string field with suggestions, when I focus it, then I can see expected suggestions values', async ({ I }) => {
    I.waitForElement('.shortcuts-simple', 15);
    I.click('.shortcuts-simple');
    I.waitForVisible('.modal-body .ObjetCourrier .string-input', 10);
    I.executeScriptX(({ done }) => {
        function buildSuggestion(name, value) {
            var suggestion = new LookupResult();
            suggestion.setName(name);
            suggestion.setValue(value);
            return suggestion;
        }

        var suggestions = new Array();
        suggestions[0] = buildSuggestion("name1", "value1");
        suggestions[1] = buildSuggestion("name2", "value2");
        JSAPI.get().getLastComponentFormAPI().suggest("ObjetCourrier", suggestions);
        done();
    });

    I.click('.modal-body .ObjetCourrier .string-input');
    I.waitForVisible('.gwt-SuggestBoxPopup', 10);
    I.waitForText('name1', 5, '.gwt-SuggestBoxPopup .suggestPopupContent');
    I.waitForText('name2', 5, '.gwt-SuggestBoxPopup .suggestPopupContent');

}).tag('JSAPI').tag('suggestions');

Scenario('Given a monovalued string criterion with suggestions, when I select a suggested value and launch search, then I see display name of suggested value', async ({ I, search }) => {
    I.login('jna');
    search.open('Commandes matériel');

    search.form.fillSuggestionFieldCriterion("ObjetCourrier", "name1");
    search.form.seeInputCriterion("ObjetCourrier", "name1");
    search.form.launchSearch();
    search.form.seeInputCriterion("ObjetCourrier", "name1");

    I.refreshPage();
    search.form.seeInputCriterion("ObjetCourrier", "name1");
}).tag('JSAPI').tag('suggestions'); 
