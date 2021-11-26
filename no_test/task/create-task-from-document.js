//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Task / Creation from document');

Scenario('Given I have selected a document in search, when I click on task action in contextual menu, then I see this document attached to task to create in indexation form', async ({ search, task }) => {
    search.open('.documentSearchTab');
    search.form.launchSearch();
    search.results.select(1);
    search.results.clickTaskAction("Pour information");

    task.waitForOpen(false);
    task.footer.see('#saveAsDraft');
    task.footer.see('#Valider');
    task.footer.dontSee('#saveAndQuit');
    task.attachments.seeAttachment(1);
}).tag('task');

Scenario('Given I have a task class with wildcard as attachment, when I open contextual menu from document search, then I see task creation available', async ({ search }) => {
    search.open('.documentSearchTab');
    search.form.launchSearch();
    search.results.select(1);
    search.results.selectAndShowContextualMenu(1);
    search.results.seeTaskAction("EmptyTask", '.fab.fa-stumbleupon');

    search.openDefault();
    search.form.category.select('Document');
    search.form.openAdvancedSearch();
    search.form.classSelector.select('Document');
    search.form.launchSearch();
    search.results.select(1);
    search.results.selectAndShowContextualMenu(1);
    search.results.seeTaskAction("EmptyTask", '.fab.fa-stumbleupon');
}).tag('task');

Scenario('Given I have selected 2 documents in search, when I open contextual menu, then I see only allowed task actions with multivalued attachments', async ({ search }) => {
    search.open('.documentSearchTab');
    search.form.launchSearch();
    search.results.select(1);
    search.results.select(2);
    search.results.selectAndShowContextualMenu(2);
    search.results.seeTaskAction("Pour information");
    search.results.dontSeeTaskAction("Processus de traitement");
}).tag('task');

Scenario('Given I have selected 2 documents in search, when I click on task action in contextual menu, then I see these 2 documents attached to task to create in indexation form', async ({ search, task }) => {
    search.open('.documentSearchTab');
    search.form.launchSearch();
    search.results.select(1);
    search.results.select(2);
    search.results.clickTaskAction("Pour information");

    task.waitForOpen(false);
    task.footer.see('#saveAsDraft');
    task.footer.see('#Valider');
    task.footer.dontSee('#saveAndQuit');
    task.attachments.seeAttachment(1);
    task.attachments.seeAttachment(2);
}).tag('search').tag('task');

Scenario('Given I am in document indexation, I click on task creation action then creation task form is in popup', async ({ I, document, task, search }) => {
    search.open('.documentSearchTab');
    search.form.launchSearch();
    search.results.openFirst();

    document.waitForOpen(false);
    document.form.smartActions.root = '.smart-actions.component-taskclass';
    document.form.smartActions.see('#GEC_Step0_Creation', '.fa.fa-envelope');
    document.form.smartActions.openSub('#GEC_Step0_Creation');
    document.form.smartActions.root = '.smart-actions.component-header-actions';

    I.seeElement('.modal-dialog.GEC_Step0_Creation', 5);
    task.footer.root = '.modal-dialog.GEC_Step0_Creation .modal-footer .actions';
    task.footer.see('#saveAsDraft');
    task.footer.see('#Initiate');
    task.footer.dontSee('#saveAndQuit');
    task.footer.root = '.content-page .footer .actions';
});

Scenario('Given a task class without icon, when I open task creation contextual menu I see default icon', async ({ I, search, document }) => {
    search.open('.documentSearchTab');
    search.form.launchSearch();
    search.results.openFirst();
    document.waitForOpen(false);

    document.form.smartActions.root = '.smart-actions.component-taskclass';
    document.form.smartActions.see('#EmptyTask', '.fab.fa-stumbleupon');
    document.form.smartActions.root = '.smart-actions.component-header-actions';
});

Scenario('Given I am in task creation in activity, when I click on Initiate answer action, then creation and answer application is launched', async ({ I, data, search, task }) => {
    search.open('.documentSearchTab');
    search.form.launchSearch();
    search.results.select(1);
    search.results.clickTaskAction("Processus de traitement");

    task.waitForOpen(false);
    task.footer.see('#saveAsDraft');
    task.footer.see('#Initiate');
    task.footer.dontSee('#saveAndQuit');
    task.attachments.seeAttachment(1);

    const mail = data.mail();
    task.form.fillListTag('.CanalEntree', mail.channelCode.value);
    task.form.fillTag('.ObjetCourrier', mail.object);
    task.form.clickAction('#Initiate', false);

    let taskId = await I.waitForFoundable('TASK', mail.object, 'ObjetCourrier');
    task.open(taskId);
    task.form.seeTitle("1-A distribuer");
    task.form.seeTag('.ObjetCourrier', mail.object);
}).tag('task');

Scenario('Given I am in task creation in activity, when I click on other than Initiate answer action, then creation only is launched', async ({ I, search, task }) => {
    let mail = await I.haveMail(true);
    search.openDefault();
    search.form.searchById(mail.id);
    search.results.select(1);
    search.results.clickTaskAction("Pour information");
    task.waitForOpen(false);
    task.footer.see('#saveAsDraft');
    task.footer.see('#Valider');
    task.footer.dontSee('#saveAndQuit');
    task.attachments.seeAttachment(1);

    task.footer.clickAndConfirm('#Valider');

    await I.waitForFoundable('TASK', mail.refClient, 'RefClient', [{ 'name': 'classid', 'value': 'GEC_Step2_ALire' }]);
}).tag('task');