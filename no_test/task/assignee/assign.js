//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});


Feature('Task / Assignation');

Scenario('I assign a task to somebody', async ({ I, task, objectPicker, confirmationPopup, notification }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);

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
}).tag('task').tag('assignee');

Scenario('Given a task When I assign it Then I retrieve the new assignee', async ({ I, data }) => {
    let mail = await I.haveMail(true);
    let assignee = data.faker.name.firstName() + '.' + data.faker.name.lastName();

    I.executeScriptX(({ id, assignee, done }) => {
        JSAPI.get().task().assign([id], assignee, function () {
            JSAPI.get().task().get([id], function (tasks) {
                window.task = tasks[0];
                done();
            });
        });
    }, mail.task, assignee);
    I.test(function (id, assignee) {
        assertEquals(id, task.getId());
        assertEquals(assignee, task.getAssignee());
    }, mail.task, assignee);
}).tag('task').tag('assignee').tag('jsapi');

Scenario('I open a readonly task then add attachment, then I cannot save it after tab change', async ({ I, task, objectPicker, confirmationPopup, notification, sidemenu, breadcrumb }) => {
    await openReadOnlyTaskThenAddAttachment(I, task, objectPicker, confirmationPopup, notification);
    sidemenu.open('Accueil');
    breadcrumb.see('Accueil');
});

Scenario('I open a readonly task then add attachment, then I cannot save it after cancel', async ({ I, task, objectPicker, confirmationPopup, notification, breadcrumb }) => {
    await openReadOnlyTaskThenAddAttachment(I, task, objectPicker, confirmationPopup, notification);
    task.form.cancel();
    breadcrumb.see('Accueil');
});

async function openReadOnlyTaskThenAddAttachment(I, task, objectPicker, confirmationPopup, notification) {
    let mail = await I.haveMail(true);
    await task.open(mail.task);

    task.smartActions.openSub("#assign");

    objectPicker.search('jna');
    objectPicker.select('jna');
    objectPicker.click('#assign');
    confirmationPopup.confirm();
    notification.waitForVisible('La tâche a été assignée avec succès');

    await I.login('phu');
    await task.open(mail.task);
    I.waitForVisible('.Reponse .attachment-label', 3);
    I.executeScript(function (mail) {
        var doc = new Document();
        doc.setName("Document attaché");
        doc.setClassId("CourrierEntrant");
        doc.setId("296b816c-ba95-11ea-b3de-0242ac130004");

        var event = new AddTaskAttachmentEvent("Reponse", doc);
        var formAPI = JSAPI.get().getLastComponentFormAPI();
        formAPI.fireEvent(event);
        $("#wrapper").append($("<p id='lock-" + mail.random + "'/>"));
    }, mail);
    I.waitForElement('#lock-' + mail.random, 120);
    I.seeTextEquals('Document attaché', '.Reponse .attachment-label');
}

Scenario('I cannot answer to a task assigned to another user', async ({ I, task, search }) => {
    let mail = await I.haveMail(true);
    task.open(mail.task);

    task.footer.see('#saveAndQuit');
    task.footer.see('#Valider');
    task.footer.see('#Refuser');
    task.footer.see('#Reassign');
    task.footer.see('#Inform');
    task.footer.see('#Valider');

    //await I.createIncognitoBrowser();
    await I.login('phu');
    task.open(mail.task);
    task.footer.dontSee('#saveAndQuit');
    task.footer.dontSee('#Valider');
    task.footer.dontSee('#Refuser');
    task.footer.dontSee('#Reassign');
    task.footer.dontSee('#Inform');
    task.footer.dontSee('#Valider');
}).tag('task');

Scenario('I register before then I open a task and assign to someone from task', async ({ I, data, task, objectPicker, confirmationPopup, notification }) => {
    let envelope = await I.haveEnvelope(data.envelope());
    task.open(envelope.id);
    registerBeforeAssign(I, envelope);
    task.smartActions.openSub("#assign");

    objectPicker.search('phu');
    objectPicker.select('phu');
    objectPicker.click('#assign');
    confirmationPopup.confirm();
    I.waitAndRemoveLock(envelope.id);
    let taskAssigneeRegister = await I.executeScript(function () {
        return taskAssigneeBefore;
    });
    notification.waitForVisible('La tâche a été assignée avec succès');
    await I.waitForFoundable('TASK', envelope.id, false, [{ 'name': 'assignee', 'value': 'phu' }]);

    let assignee = await task.getAssignee(envelope.id);
    I.test(function (taskAssigneeRegister, assignee) {
        assertNull(taskAssigneeRegister);
        assertEquals('phu', assignee);
    }, taskAssigneeRegister, assignee);
}).tag('task').tag('assignation').tag('JSAPI');

Scenario('I register after then I open a task and assign to someone from task', async ({ I, data, task, objectPicker, confirmationPopup, notification }) => {
    let envelope = await I.haveEnvelope(data.envelope());
    task.open(envelope.id);
    registerAfterAssign(I, envelope);
    task.smartActions.openSub("#assign");

    objectPicker.search('phu');
    objectPicker.select('phu');
    objectPicker.click('#assign');
    confirmationPopup.confirm();

    I.waitAndRemoveLock(envelope.id);
    let taskAssigneeRegister = await I.executeScript(function () {
        return taskAssigneeAfter;
    });
    I.test(function (taskAssigneeRegister) {
        assertEquals('phu', taskAssigneeRegister);
    }, taskAssigneeRegister);
}).tag('task').tag('assignation').tag('JSAPI');

Scenario('I register before then I assign a task to someone from a search', async ({ I, data, search, task }) => {
    let envelope = await I.haveEnvelope(data.envelope(), true);
    registerBeforeAssign(I, envelope);
    search.open('.pliSearchTab');
    search.results.select(1);
    search.results.actions.clickNativeAction("M'assigner");
    I.waitAndRemoveLock(envelope.id);
    let taskAssigneeRegister = await I.executeScript(function () {
        return taskAssigneeBefore;
    });

    await I.waitForFoundable('TASK', envelope.id, false, [{ 'name': 'assignee', 'value': 'fadmin' }]);

    let assignee = await task.getAssignee(envelope.id);
    
    I.test(function (taskAssigneeRegister, assignee) {
        assertNull(taskAssigneeRegister);
        assertEquals('fadmin', assignee);
    }, taskAssigneeRegister, assignee);
}).tag('task').tag('assignation').tag('JSAPI');

Scenario('I register after then I assign a task to someone from a search', async ({ I, data, search, task }) => {
    let envelope = await I.haveEnvelope(data.envelope(), true);
    registerAfterAssign(I, envelope);
    search.open('.pliSearchTab');
    search.results.select(1);
    search.results.actions.clickNativeAction("M'assigner");
    I.waitAndRemoveLock(envelope.id);

    let taskAssigneeRegister = await I.executeScript(function () {
        return taskAssigneeAfter;
    });
    I.test(function (taskAssigneeRegister) {
        assertEquals('fadmin', taskAssigneeRegister);
    }, taskAssigneeRegister);
}).tag('task').tag('assignation').tag('JSAPI');

function registerBeforeAssign(I, envelope) {
    I.executeScript(function (envelope) {
        JSAPI.get().task().registerBeforeAssign(function (tasks, assignee, executor) {
            executor.hold();
            $.ajax({
                type: "GET",
                url: "./plugins/rest/tasks/" + envelope.id,
                success: function (result) {
                    jsonResult = JSON.stringify(result);
                    taskAssigneeBefore = JSON.parse(jsonResult)[0].assignee;
                    $("#wrapper").append($("<p id='lock-" + envelope.id + "'/>"));
                    executor.resume();
                }
            });
        });
    }, envelope);
}

function registerAfterAssign(I, envelope) {
    I.executeScript(function (envelope) {
        JSAPI.get().task().registerAfterAssign(function (tasks, assignee, executor) {
            executor.hold();
            $.ajax({
                type: "GET",
                url: "./plugins/rest/tasks/" + envelope.id,
                success: function (result) {
                    jsonResult = JSON.stringify(result);
                    taskAssigneeAfter = JSON.parse(jsonResult)[0].assignee;
                    $("#wrapper").append($("<p id='lock-" + envelope.id + "'/>"));
                    executor.resume();
                }
            });
        });
    }, envelope);
}
