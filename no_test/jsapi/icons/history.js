//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('JSAPI / Icon / History');

Scenario('Given a custom icon based on task class id, when I apply answer and open a task history, then I see the custom icon for answer', async ({ I, task, utils }) => {
    utils.jsapi.icon.addForClass('GEC_Step2_ATraiter', 'fa fa-search');
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.attachments.attachNewDocument('.Reponse', 'data/multi-pages.pdf');
    task.footer.clickAndConfirm('#Valider', [
        "La tâche a été mise à jour avec succès.",
        "La réponse Traiter a bien été appliquée sur la tâche."
    ]);

    await I.waitForFoundable('TASK', mail.task, false, [{ 'name': 'classid', 'value': 'GEC_Step3_CourrierTraite' }]);
    await task.open(mail.task);

    task.smartActions.openSub('#history');
    I.waitForElement('.component-history .timeline-item .item-description', 5);
    I.seeElement('.component-history .fa.fa-search');
}).tag('jsapi').tag('icon').tag('history');
