//<reference path="../../steps.d.ts" />

Feature('Search / Criterion picker');

Before({ login } => {
    login('admin');
});

Scenario('I select criterion then do not see it in criteria picker then I remove criterion and see it again in criteria picker.', async ({ I, search }) => {
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.selectCustomCriterion('DateCourrier');
    I.click(search.form.addCriterionAction);
    search.form.picker.dontSee('DateCourrier');
    search.form.picker.validate();
    search.form.removeCustomCriterion('DateCourrier');
    search.form.dontSeeCriterion('DateCourrier');
}).tag('search');

Scenario('I do not see fixed criterion in additional criteria', async ({ I, search }) => {
    search.open('.pliSearchTab');
    I.click(search.form.addCriterionAction);
    search.form.picker.dontSee('ServiceDestinataire');
}).tag('search');

Scenario('I search in criteria picker then see available criteria restricted according to input', async ({ I, search }) => {
    search.openDefault();
    search.form.openAdvancedSearch();
    I.click(search.form.addCriterionAction);

    search.form.picker.search('client');
    search.form.picker.see('NomClient');
    search.form.picker.dontSee('Enabled');
}).tag('search');

Scenario('I search in criteria picker then clear search input and see all criteria are available', async ({ I, search }) => {
    search.openDefault();
    search.form.openAdvancedSearch();
    I.click(search.form.addCriterionAction);
    search.form.picker.search('client');
    search.form.picker.see('NomClient');
    search.form.picker.dontSee('Enabled');
    search.form.picker.search(' ');
    search.form.picker.see('Enabled');
}).tag('search');

Scenario('Given I am on a folder with only 2 document classes available as children, when I open criteria picker then I see only criteria according to these 2 document classes', async ({ I, folder }) => {
    let rootFolder = await I.haveFolder({ 'classId': 'twoDocumentClassesChildren' });
    folder.open(rootFolder.id);
    folder.form.seeFieldTitle(rootFolder.name);

    let doc = await folder.documents.addDocument();
    I.waitForFoundable('DOCUMENT', doc.name, 'name');

    I.refreshActivity();

    folder.documents.openFilters();
    I.click(folder.documents.searchForm.root + ' #add');
    folder.documents.searchForm.picker.see('CanalEntree');
    folder.documents.searchForm.picker.dontSee('Enabled');
}).tag('search');