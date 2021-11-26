//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Task / Tracking');

Scenario('Given I have a document linked to task, when I open task tracking, then I see linked task and its icon', async ({ I, document }) => {
    let mail = await I.haveMail(true);

    document.open(mail.id);
    document.smartActions.openSub('#read_task_history');

    I.waitForElement('.component-history .timeline-item .item-description', 5);

    I.waitForText('a déclenché un processus Gestion Electronique de Courriers', 5, '.component-history .timeline-item .item-description')
    I.seeElement('.component-history .fa.fa-hand-pointer');
}).tag('task').tag('taskTracking');

Scenario('Given no icon is defined on task class, when I open task tracking, then I see default task icon ', async ({ I, document, task }) => {
    let doc = await I.createDocument();
    document.open(doc.id);

    document.form.smartActions.root = '.smart-actions.component-taskclass';
    document.form.smartActions.open();
    I.click('#EmptyTask');

    task.footer.root = '.modal-dialog.EmptyTask .modal-footer .actions';
    task.footer.click('#Validate', 'La tâche a été créée avec succès.');

    await I.waitForFoundable('TASK', doc.id, 'children.id_value');

    task.footer.root = '.content-page .footer .actions';
    document.form.smartActions.root = '.smart-actions.component-header-actions';
    document.smartActions.openSub('#read_task_history');

    I.waitForElement('.component-history .timeline-item .item-description', 5);

    I.waitForText('a créé une tâche de EmptyTask', 5, '.component-history .timeline-item .item-description')
    I.seeElement('.component-history .fab.fa-stumbleupon');
}).tag('task').tag('taskTracking');
