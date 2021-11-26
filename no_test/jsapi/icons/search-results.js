//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('JSAPI / Icon / Search');

Scenario('Given I have a custom icon for task class, when I see task creation action in document contextual menu, then I see custom icon in icon column', async ({ I, utils, search }) => {
    utils.jsapi.icon.addForClass('GEC_Step0_Creation', 'fa fa-search');

    search.openDefault();
    search.form.category.select('Document');
    search.form.openAdvancedSearch();
    search.form.classSelector.select('Courrier Entrant');
    search.form.launchSearch();
    search.results.selectAndShowContextualMenu(1);

    search.results.seeTaskAction('Processus de traitement', '.fa.fa-search');
}).tag('jsapi').tag('icon').tag('task').tag('search');


Scenario('Given I have a custom icon for task class, when I launch search, then I see custom icon in icon column', async ({ I, utils, search }) => {
    utils.jsapi.icon.addForClass('GEC_Step2_ATraiter', 'fa fa-search');

    search.openDefault();
    search.form.category.select('Tâche');
    search.form.openAdvancedSearch();
    search.form.classSelector.select('Courrier à traiter');
    search.form.launchSearch();

    search.results.seeIconColumn('.fa.fa-search', 1);
}).tag('jsapi').tag('icon').tag('task').tag('search');

Scenario('Given I have a custom icon for tag value, when I launch search, then I see custom icon in icon column', async ({ I, utils, search }) => {
    utils.jsapi.icon.addForTag('fa fa-search', 'TypeCourrier', 'Contrat');

    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.selectCustomCriterion('TypeCourrier');
    search.form.fillFieldCriterion('TypeCourrier', 'Contrat');
    search.form.launchSearch();

    search.results.seeIconColumn('.fa.fa-search', 1);
}).tag('jsapi').tag('icon').tag('tag').tag('search');

Scenario('Given I have a custom icon for document class, when I launch search, then I see custom icon in icon column', ({ I, utils, search }) => {
    utils.jsapi.icon.addForClass('CourrierEntrant', 'fa fa-search');

    search.open('.documentSearchTab');
    search.form.launchSearch();

    search.results.seeIconColumn('.fa.fa-search', 1);
}).tag('jsapi').tag('icon').tag('document').tag('search');

Scenario('Given I have a custom icon for folder class, when I launch search, then I see custom icon in icon column', ({ I, utils, search }) => {
    utils.jsapi.icon.addForClass('Folder', 'fa fa-search');

    search.openDefault();
    search.form.category.select('Dossier');
    search.form.openAdvancedSearch();
    search.form.classSelector.select('Dossier');
    search.form.launchSearch();

    search.results.seeIconColumn('.fa.fa-search', 1);
}).tag('jsapi').tag('icon').tag('folder').tag('search');

Scenario('Given I have a custom icon for virtual folder class, when I launch search, then I see custom icon in icon column', ({ I, utils, search }) => {
    utils.jsapi.icon.addForClass('DossierClient', 'fa fa-search');

    search.open('.dossierClientSearchTab');
    search.form.launchSearch();

    search.results.seeIconColumn('.fa.fa-search', 1);
}).tag('jsapi').tag('icon').tag('virtualFolder').tag('search');