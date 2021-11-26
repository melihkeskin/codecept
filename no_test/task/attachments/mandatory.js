//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Task / Mandatory attachment');

Scenario('I cannot answer to but can save a task if an attachment is missing', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);

    task.footer.seeEnabled('#saveAndQuit');
    task.footer.seeDisabled('#Valider');
    task.footer.seeDisabled('#Refuser');
    task.footer.seeDisabled('#Reassign');
    task.footer.seeDisabled('#Inform');
    task.footer.seeDisabled('#Valider');
}).tag('task');