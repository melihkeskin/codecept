//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('History');

Scenario('I add an attachment to a task then see it in history', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.attachments.attachNewDocument('.Reponse', 'data/multi-pages.pdf');
    task.form.save();

    await task.open(mail.task);
    I.retry(20).seeInHistory(task, ' a modifié la tâche.');
}).tag('task').tag('history').tag('history');

Scenario("I delete a task attachment then see it in history", async ({ I, task }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.attachments.attachNewDocument('.Reponse', 'data/multi-pages.pdf');
    task.attachments.attachNewDocument('.Appendices', 'data/multi-pages.pdf');
    task.form.save();

    await task.open(mail.task);
    task.attachments.deleteAttachment('.Appendices');
    task.form.save();

    await task.open(mail.task);
    I.retry(20).seeInHistory(task, ' a modifié la tâche.');
}).tag('task').tag('history');

Scenario("I update task attachments then see it in history", async ({ I, task }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.attachments.attachNewDocument('.Reponse', 'data/multi-pages.pdf');
    task.form.save();

    await task.open(mail.task);
    task.attachments.deleteAttachment('.Reponse');
    task.attachments.attachNewDocument('.Reponse', 'data/simple.pdf');
    task.form.save();

    await task.open(mail.task);
    I.retry(20).seeInHistory(task, ' a modifié la tâche.');
}).tag('task').tag('history');

Scenario('Given a task with attachment, when I update attached component and open component history, then I see updated attachment display name', async ({ I, document, task, data }) => {
    let mail = await I.haveMail(true);
    await document.open(mail.id);
    document.form.fillTag('.ObjetCourrier', data.faker.system.commonFileName());
    document.form.saveWithConfirmation();

    await task.open(mail.task);
    I.retry(20).seeInHistory(task, ' a modifié la pièce jointe de');
    I.see("Courrier entrant", '.component-history .timeline-item .item-description');
}).tag('task').tag('history').tag("attachment");

Scenario('Given a task class without display name on attachment definition, when I update attached component and open component history, then I see attachment id', async ({ I, task, document, data }) => {
    let created = await I.haveTask({ 'classId': 'EmptyTask' }, true);
    await task.open(created.id);

    task.attachments.startAttachment('.EmptyTaskAttachment', 'data/simple.pdf');
    I.waitForText('Classe', 5);
    document.form.root = ".modal-dialog.component-creation.document";
    document.form.changeClass("Document");
    document.form.root = "";
    task.attachments.endAttachment('data/simple.pdf', true);
    task.form.save();

    await task.open(created.id);
    task.attachments.editAttachment('.EmptyTaskAttachment');
    let newTitle = created.id + data.faker.system.commonFileName();
    document.form.changeTitle(newTitle);
    document.form.save();
    document.form.confirm();
    await I.waitForFoundable('DOCUMENT', newTitle, "name");

    I.refreshPage();
    I.retry(20).seeInHistory(task, ' a modifié la pièce jointe de');
    I.see("EmptyTaskAttachment", '.component-history .timeline-item .item-description');
}).tag('task').tag('history').tag("attachment");

Scenario('I answer to a task then see answer in history', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.attachments.attachNewDocument('.Reponse', 'data/multi-pages.pdf');
    task.footer.clickAndConfirm('#Valider', [
        "La tâche a été mise à jour avec succès.",
        "La réponse Traiter a bien été appliquée sur la tâche."
    ]);

    await I.waitForFoundable('TASK', mail.task, false, [{ 'name': 'classid', 'value': 'GEC_Step3_CourrierTraite' }]);
    await task.open(mail.task);
    I.retry(20).seeInHistory(task, ' a appliqué la réponse');
    I.seeElement('.component-history .fa-hand-pointer');
}).tag('task').tag('history').tag("answer");

Scenario('Given no icon is defined on task class, when I open component history with answer, then I see default task icon for answer', async ({ I, task, search, data }) => {
    const userName = data.faker.name.firstName() + "." + data.faker.name.lastName();
    const material = data.randomElement(data.material);
    let order = await I.sendOrder({ "userName": userName, 'material': material });

    await task.open(order.id);
    task.footer.click('#Validate', [
        "La tâche a été mise à jour avec succès."
    ]);

    let taskId = await I.waitForFoundable('TASK', userName, "Username", [{ 'name': 'classid', 'value': 'check_stock' }]);

    task.open(taskId);
    I.retry(20).seeInHistory(task, ' a appliqué la réponse');
    I.seeElement('.component-history .fab.fa-stumbleupon');
}).tag('task').tag('history').tag("answer");

