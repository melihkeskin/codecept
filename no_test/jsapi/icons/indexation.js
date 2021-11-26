//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('JSAPI / Icon / Component indexation');

Scenario('Given I have custom icon on task class, when I open task, then I see custom icon', ({ I, utils, task, search }) => {
    utils.jsapi.icon.addForClass('GEC_Step2_ATraiter', 'fa fa-search');

    search.openDefault();
    search.form.category.select('Tâche');
    search.form.openAdvancedSearch();
    search.form.classSelector.select('Courrier à traiter');
    search.form.launchSearch();
    search.results.openFirst();

    task.form.seeHeaderIcon('.fa.fa-search');
}).tag('icon').tag('task');

Scenario('Given I have custom icon on document class, when I open document, then I see custom icon', ({ I, utils, document, search }) => {
    utils.jsapi.icon.addForClass('CourrierEntrant', 'fa fa-search');

    search.open('.documentSearchTab');
    search.form.launchSearch();
    search.results.openFirst();

    document.form.seeHeaderIcon('.fa-search');
}).tag('icon').tag('document');

Scenario('Given I have custom icon on folder class, when I open folder, then I see custom icon', ({ I, utils, folder, search }) => {
    utils.jsapi.icon.addForClass('Folder', 'fa fa-search');

    folder.open('root');

    folder.form.seeHeaderIcon('.fa-search');
}).tag('icon').tag('folder');

Scenario('Given I have custom icon on virtual folder class, when I open virtual folder, then I see custom icon', ({ I, utils, virtualFolder, search }) => {
    utils.jsapi.icon.addForClass('DossierClient', 'fa fa-search');

    virtualFolder.open('123456');

    virtualFolder.form.seeHeaderIcon('.fa-search');
}).tag('icon').tag('virtualFolder');

Scenario('Given I have custom icon on tag value, when I open component with this tag value, then I see custom icon', ({ I, utils, document, search }) => {
    utils.jsapi.icon.addForTag('fa fa-search', 'TypeCourrier', 'Contrat');

    search.open('.documentSearchTab');
    search.form.selectCustomCriterion('TypeCourrier');
    search.form.fillFieldCriterion('TypeCourrier', 'Contrat');
    search.form.launchSearch();
    search.results.openFirst();

    document.form.seeHeaderIcon('.fa.fa-search');
}).tag('icon').tag('document');

Scenario('Given I have custom icon for tag value, when I open component without this tag value, then I see default icon.', ({ I, utils, document, search }) => {
    utils.jsapi.icon.addForTag('fa fa-search', 'TypeCourrier', 'Contrat');

    search.open('.documentSearchTab');
    search.form.selectCustomCriterion('TypeCourrier');
    search.form.fillFieldCriterion('TypeCourrier', 'Contrat');
    search.form.selectOperator('TypeCourrier', 'DIFFERENT');
    search.form.launchSearch();
    search.results.openFirst();

    document.form.seeHeaderIcon('.far.fa-file-alt');
}).tag('icon').tag('document');

Scenario('Given I have custom icon on task class, when I open task creation menu, then I see the custom icon ', async ({ I, utils, search, document }) => {
    utils.jsapi.icon.addForClass('GEC_Step0_Creation', 'fa fa-search');

    search.open('.documentSearchTab');
    search.form.launchSearch();
    search.results.openFirst();

    document.waitForOpen(false);
    document.form.smartActions.root = '.smart-actions.component-taskclass';
    document.form.smartActions.see('#GEC_Step0_Creation', '.fa.fa-search');
});

Scenario('Given in task indexation with custom icon and no name, when I change class, then I see icon, title and description are updated', async ({ I, utils, task }) => {
    utils.jsapi.icon.addForClass('GEC_Step0_Creation', 'fa fa-search');

    await task.open("emptyTask");
    task.form.seeHeader('EmptyTask', '.fab.fa-stumbleupon', "");

    task.form.changeClass('Copie de courrier');
    task.form.seeHeader('Copie de courrier', '.fa-clone', "Copier un courrier pour qu'il puisse être traité par un autre service");


    task.form.changeClass('Processus de traitement');
    task.form.seeHeader('Processus de traitement', '.fa.fa-search', "Lancement d'un processus de traitement de courrier");
});

Scenario('Given in document indexation with custom icon, when I change class, then I see icon, title and description are updated', async ({ I, utils, document }) => {
    utils.jsapi.icon.addForClass('CourrierEntrant', 'fa fa-search');
    utils.jsapi.icon.addForTag('far fa-envelope', 'CanalEntree', '3');

    let doc = await I.createDocument({}, true);
    await document.open(doc.id);
    document.form.seeHeader(doc.name, '.fa-file-alt', "Classe de document utilisée pour matérialiser un document", true);

    document.form.changeClass('Courrier Entrant');
    document.form.seeHeader(doc.name, '.fa-search', "Document entrant issu de la chaîne d'acquisition", true);
    document.form.fillListTag('.CanalEntree', '3');


    document.form.changeClass('Courrier Sortant');
    document.form.seeHeader(doc.name, '.far.fa-envelope', "Document sortant à fournir à la chaîne d'éditique", true);
});
