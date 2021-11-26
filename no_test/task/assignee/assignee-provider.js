//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Task / Assignee provider');

Scenario('I assign a task to somebody using assignee provider with a fake profile', async ({ I, task, objectPicker }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.registerCustomProviderFor('Toto');

    task.smartActions.openSub("#assign");
    objectPicker.search('fadmin');
    objectPicker.dontSee('fadmin');
}).tag('task').tag('assignee').tag('provider');

Scenario('I assign a task to somebody using assignee provider with a real profile', async ({ I, task, objectPicker, confirmationPopup, notification }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.registerCustomProviderFor('Arondor');

    task.smartActions.openSub("#assign");
    objectPicker.search('phu');
    objectPicker.select('phu');
    objectPicker.click('#assign');
    confirmationPopup.confirm();
    notification.waitForVisible('La tâche a été assignée avec succès');

    let assignee = await task.getAssignee(mail.task);
    I.test(function (assignee) {
        assertEquals('phu', assignee);
    }, assignee);
}).tag('task').tag('verification');