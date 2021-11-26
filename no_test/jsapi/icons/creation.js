//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('JSAPI / Icon / Component creation');

Scenario('Given a document creation popup with custom icon based on classId, when I update class, then I see icon and description are updated', async ({ insert, utils, document }) => {
    utils.jsapi.icon.addForClass('CourrierSortant', 'fa fa-search');

    insert.open();
    insert.addFile('data/simple.pdf');
    insert.openIndexation();

    document.waitForOpen();
    document.form.seeHeaderIcon('.far.fa-file-alt');
    document.form.seeDescription("Classe de document utilisée pour matérialiser un document");

    document.form.changeClass('Courrier Sortant');
    document.form.seeHeaderIcon('.fa.fa-search');
    document.form.seeDescription("Document sortant à fournir à la chaîne d'éditique");
}).tag('jsapi').tag('icon').tag('document');

Scenario('Given a task creation popup with custom icon based on classId, when I update class, then I see icon, title and description are updated', async ({ I, utils, task }) => {
    utils.jsapi.icon.addForClass('GEC_Step0_Creation', 'fa fa-search');

    await I.executeScript(function () {
        var task = new Task();
        JSAPI.get().getPopupAPI().buildComponentCreation(task).show();
    });

    I.waitForVisible('.modal-dialog.component-creation', 5);
    I.waitForElement('.modal-dialog .modal-header .fab.fa-stumbleupon', 5);
    I.seeTextEquals('Tâche', '.modal-header .title-container > h4');
    I.seeTextEquals('', '.modal-header .description');

    task.form.changeClass('Processus de traitement');
    I.waitForElement('.modal-dialog .modal-header .fa.fa-search', 5);
    I.seeTextEquals('Processus de traitement', '.modal-header .title-container > h4');
    I.seeTextEquals("Lancement d'un processus de traitement de courrier", '.modal-header .description');

    task.form.changeClass('EmptyTask');
    I.waitForElement('.modal-dialog .modal-header .fab.fa-stumbleupon', 5);
    I.seeTextEquals('Tâche', '.modal-header .title-container > h4');
    I.seeTextEquals('', '.modal-header .description');
}).tag('jsapi').tag('icon').tag('task');