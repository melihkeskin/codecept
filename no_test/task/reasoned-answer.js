//<reference path="../../steps.d.ts" />

Before(({ login }) => {
    login('admin');
});

Feature('Task / Reasoned answer');

Scenario('Given answer with conditional reason When I fill it Then I see updated values', async ({ I, task, notification }) => {
    let created = await I.haveTask({ 'classId': 'AccountingValidation', 'tags': { 'AccountingMainType': 'Fiscal', 'AccountingSubType': 'TaxeApprentissage' } });
    task.open(created.id);

    task.footer.click('#Change');
    task.reasonedAnswer.waitForShow();

    task.reasonedAnswer.form.fillListTag('.AccountingMainType', 'ComptabiliteControleAnnuel');
    task.reasonedAnswer.form.fillListTag('.AccountingSubType', 'E');

    task.reasonedAnswer.form.seeListTagValue('.AccountingMainType', 'ComptabiliteControleAnnuel');
    task.reasonedAnswer.form.seeListTag('.AccountingMainType', 'Comptabilité contrôle annuel');

    task.reasonedAnswer.click('#Change');
    notification.waitForVisible('La réponse Change a bien été appliquée sur la tâche');
}).tag('task').tag('answer').tag('reasoned');

Scenario('Given answer with conditional reason When it is initialized using JS API Then I see provided values', async ({ I, task, notification }) => {
    let created = await I.haveTask({ 'classId': 'AccountingValidation', 'tags': { 'AccountingMainType': 'Fiscal', 'AccountingSubType': 'TaxeApprentissage' } });
    task.open(created.id);

    I.executeScript(function () {
        JSAPI.get().registerForReasonedAnswerOpen(function (reasonedAnswerAPI, reasonedAnswerId) {
            reasonedAnswerAPI.setObjectValue('AccountingMainType', reasonedAnswerAPI.getTask().getTagValue('AccountingMainType'));
            reasonedAnswerAPI.setObjectValue('AccountingSubType', reasonedAnswerAPI.getTask().getTagValue('AccountingSubType'));
        });
    });

    task.footer.click('#Change');
    task.reasonedAnswer.waitForShow();
    task.reasonedAnswer.form.seeListTag('.AccountingMainType', "Fiscal");
    task.reasonedAnswer.form.seeListTag('.AccountingSubType', "Taxe d'apprentissage");

    task.reasonedAnswer.click('#Change');
    notification.waitForVisible('La réponse Change a bien été appliquée sur la tâche');
}).tag('task').tag('answer').tag('reasoned');