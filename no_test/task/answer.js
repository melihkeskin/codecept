//<reference path="../../steps.d.ts" />

Before(({ login }) => {
    login('admin');
});

Feature('Task / Answer');

Scenario('I asynchronously apply answer', async ({ I, task, notification }) => {
    I.executeScript(function () {
        JSAPI.get().getHelperFactory().getTaskAnswerExecutionAPI().registerForAsyncAnswerResolution(function (tasks, answer, callback) {
            callback.onSuccess(true);
        });
    });

    let mail = await I.haveMail(true);

    await task.open(mail.task);
    task.form.seeTitle("2-A traiter");
    attachAndSeeDoc(task, '.Reponse', 'multi-pages.pdf', '4');
    task.footer.clickAndConfirm('#Valider', [
        "La réponse Traiter est en cours",
        "La tâche a été mise à jour avec succès.",
        "La réponse Traiter a bien été appliquée sur la tâche."
    ]);

    await task.open(mail.task);
    task.form.seeTitle("3-Courrier traité");
    task.form.seeListTag('.ServiceDestinataire', mail.routing.service.label);
    task.form.seeTag('.NomClient', mail.lastName);
    task.form.seeTag('.PrenomClient', mail.firstName);
    task.form.seeListTag('.CanalEntree', mail.channelCode.label);
}).tag('task').tag('jsapi');

Scenario('I synchronously apply answer', async ({ I, task, notification }) => {
    I.executeScript(function () {
        JSAPI.get().getHelperFactory().getTaskAnswerExecutionAPI().registerForAsyncAnswerResolution(function (tasks, answer, callback) {
            callback.onSuccess(false);
        });
    });

    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.form.seeTitle("2-A traiter");
    attachAndSeeDoc(task, '.Reponse', 'multi-pages.pdf', '4');
    task.footer.clickAndConfirm('#Valider', [
        "La tâche a été mise à jour avec succès.",
        "La réponse Traiter a bien été appliquée sur la tâche."
    ]);
    await task.open(mail.task);
    task.form.seeTitle("3-Courrier traité");
    task.form.seeListTag('.ServiceDestinataire', mail.routing.service.label);
    task.form.seeTag('.NomClient', mail.lastName);
    task.form.seeTag('.PrenomClient', mail.firstName);
    task.form.seeListTag('.CanalEntree', mail.channelCode.label);
}).tag('task').tag('jsapi');

Scenario('I apply answer with default behavior', async ({ I, task, notification }) => {
    I.executeScript(function () {
        JSAPI.get().getHelperFactory().getTaskAnswerExecutionAPI().registerForAsyncAnswerResolution(function (tasks, answer, callback) {
            callback.onSuccess(null);
        });
    });

    let mail = await I.haveMail(true);

    await task.open(mail.task);
    task.form.seeTitle("2-A traiter");
    attachAndSeeDoc(task, '.Reponse', 'multi-pages.pdf', '4');
    task.footer.clickAndConfirm('#Valider', [
        "La tâche a été mise à jour avec succès.",
        "La réponse Traiter a bien été appliquée sur la tâche."
    ]);

    await task.open(mail.task);
    task.form.seeTitle("3-Courrier traité");
    task.form.seeListTag('.ServiceDestinataire', mail.routing.service.label);
    task.form.seeTag('.NomClient', mail.lastName);
    task.form.seeTag('.PrenomClient', mail.firstName);
    task.form.seeListTag('.CanalEntree', mail.channelCode.label);
}).tag('task').tag('jsapi');

Scenario('Give a task When I apply an answer Then the task is updated by operation handler', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    I.executeScriptX(({ mail, done }) => {
        JSAPI.get().task().get([mail.task], function (tasks) {
            let task = tasks[0];
            task.addTag('Commentaire', '', false);
            task.addTag('LastCommentaire', '', false);
            JSAPI.get().task().update([task], function (tasks) {
                done();
            });
        });
    }, mail);

    I.executeScriptX(({ mail, done }) => {
        JSAPI.get().task().answer([mail.task], new Answer('Valider'), function () {
            JSAPI.get().task().get([mail.task], function (tasks) {
                window.task = tasks[0];
                done();
            });
        });
    }, mail);

    I.test(function (id) {
        assertEquals(id, task.getId());
        assertEquals('3-Courrier traité', task.getName());
        assertEquals('GEC_Step3_CourrierTraite', task.getClassId());
        assertEquals('GEC', task.getWorkflow());
    }, mail.task);
}).tag('task').tag('answer').tag('jsapi');

function attachAndSeeDoc(task, attachmentType, file, pageNumber) {
    task.attachments.attachNewDocument(attachmentType, 'data/' + file, true);
    //task.viewer.waitForDocumentLoading();
    //task.viewer.seeSelected(file, pageNumber);
}