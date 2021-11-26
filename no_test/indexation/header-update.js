//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Indexation / Class change');

Scenario('Given I create task in popup, when I update class, then I see icon, title and description are updated', async ({ I, task }) => {
    await I.executeScript(function () {
        var task = new Task();
        JSAPI.get().getPopupAPI().buildComponentCreation(task).show();
    });

    I.waitForVisible('.modal-dialog.component-creation', 5);
    I.waitForElement('.modal-dialog .modal-header .fab.fa-stumbleupon', 5);
    I.seeTextEquals('Tâche', '.modal-header .title-container > h4');
    I.seeTextEquals('', '.modal-header .description');

    task.form.changeClass('Processus de traitement');
    I.waitForElement('.modal-dialog .modal-header .far.fa-envelope', 5);
    I.seeTextEquals('Processus de traitement', '.modal-header .title-container > h4');
    I.seeTextEquals("Lancement d'un processus de traitement de courrier", '.modal-header .description');

    task.form.changeClass('EmptyTask');
    I.waitForElement('.modal-dialog .modal-header .fab.fa-stumbleupon', 5);
    I.seeTextEquals('Tâche', '.modal-header .title-container > h4');
    I.seeTextEquals('', '.modal-header .description');
}).tag('task');

Scenario('Given in task indexation with custom icon and no name, when I change class, then I see icon, title and description are updated', async ({ I, breadcrumb, task }) => {
    await task.open("emptyTask");
    task.form.seeHeader('EmptyTask', '.fab.fa-stumbleupon', "");
    breadcrumb.see(['Accueil', 'EmptyTask']);

    task.form.changeClass('Copie de courrier');
    task.form.seeHeader('Copie de courrier', '.fa-clone', "Copier un courrier pour qu'il puisse être traité par un autre service");
    breadcrumb.see(['Accueil', 'Copie de courrier']);


    task.form.changeClass('Processus de traitement');
    task.form.seeHeader('Processus de traitement', '.far.fa-envelope', "Lancement d'un processus de traitement de courrier");
    breadcrumb.see(['Accueil', 'Processus de traitement']);
});

Scenario('Given a document with editable title, when I change class, then I see title is not updated and well saved', async ({ I, document, breadcrumb, data }) => {
    let doc = await I.haveMail();
    document.open(doc.id);
    document.form.seeFieldTitle(doc.name);
    breadcrumb.see(['Accueil', doc.name]);

    document.form.changeClass('Courrier Sortant');
    document.form.seeFieldTitle(doc.name);
    breadcrumb.see(['Accueil', doc.name]);

    var updatedName = data.faker.lorem.words();
    document.form.changeTitle(updatedName);

    document.form.changeClass('Document');
    document.form.seeFieldTitle(updatedName);
    breadcrumb.see(['Accueil', doc.name]);


    document.form.saveWithConfirmation();
    document.open(doc.id);

    document.form.seeFieldTitle(updatedName);
    breadcrumb.see(['Accueil', updatedName]);

});