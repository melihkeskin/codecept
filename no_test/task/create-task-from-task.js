//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Task / Creation from another task');

Scenario('I create a task from an opened task then open created one', async ({ I, search, task }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);

    task.form.smartActions.root = '.smart-actions.component-taskclass';
    task.form.smartActions.openSub('#GEC_Copie');
    task.form.smartActions.root = '.smart-actions.component-header-actions';

    task.form.clickAction('#Initiate', false);

    task.form.cancel();
    I.waitForGlassPanelHidden();

    search.openDefault();
    search.form.category.select('Tâche');
    checkCreatedCopyTask(search, task, mail, mail.routing.service);
}).tag('task');


Scenario('I create a task from a found task then open created one', async ({ I, search, task, notification, data }) => {
    let mail = data.mail();
    mail.routing = data.routing[0];
    await I.haveMail(true, false, mail);
    search.openDefault();
    search.form.category.select('Tâche');
    search.form.launchQuick(mail.firstName + ' ' + mail.lastName);

    search.results.selectAndShowContextualMenu(1);
    search.results.contextualMenu.click('Copie de courrier');

    let routing = data.routing[2];
    task.form.fillListTag('.ServiceDestinataire', routing.service.value);
    task.form.fillTextTag('.Commentaire', data.faker.lorem.paragraph() + mail.routing.service.value);
    task.form.clickAction('#Initiate', false);
    notification.waitForVisible('La tâche a été créée avec succès.', 5);
    checkCreatedCopyTask(search, task, mail, routing.service);
}).tag('task');

function checkCreatedCopyTask(search, task, mail, service) {
    search.form.launchQuick(mail.firstName + ' ' + mail.lastName + ' copie');
    search.results.seeAndOpenFirst('2-A traiter (Copie)');
    task.waitForOpen();

    task.form.seeListTag('.ServiceDestinataire', service.label);
    task.form.seeTag('.NomClient', mail.lastName);
    task.form.seeTag('.PrenomClient', mail.firstName);
    task.form.seeListTag('.CanalEntree', mail.channelCode.label);
}