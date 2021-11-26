//<reference path="../../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Task / Attachment actions');

Scenario('I attach a document then see create action disappears and delete action appears', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.attachments.attachNewDocument('.Reponse', 'data/simple.pdf');

    I.waitForVisible('.Reponse #delete-attached');
    I.waitForInvisible('.Reponse #create-attached');
}).tag('task');

Scenario('I detach a document then see create action appears and delete action disappears', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.attachments.attachNewDocument('.Reponse', 'data/simple.pdf');
    task.attachments.deleteAttachment('.Reponse');

    I.waitForVisible('.Reponse #create-attached');
    I.waitForInvisible('.Reponse #delete-attached');
}).tag('task');

Scenario('I attach a document then save then check actions have changed', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.attachments.attachNewDocument('.Reponse', 'data/simple.pdf');
    task.form.save();

    await task.open(mail.task);
    I.waitForVisible('.Reponse #delete-attached');
    I.waitForVisible('.Reponse #upload-version');
    I.waitForVisible('.Reponse #edit');
    I.waitForInvisible('.Reponse #create-attached');

    I.waitForText('Réponse au courrier', 5, '.Reponse .description');
}).tag('task');

Scenario('I attach a document then save and upload a new one then check the upload', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.attachments.attachNewDocument('.Reponse', 'data/simple.pdf');
    task.form.save();

    await task.open(mail.task);
    task.waitForOpen();
    task.attachments.seeAttachmentTitle('.Reponse', 'simple.pdf')

    task.attachments.updateAttachment('.Reponse ', 'data/multi-pages.pdf', 'form .gwt-FileUpload');
    task.viewer.seeSelected('multi-pages.pdf', 4);
    I.waitForVisible('.Reponse #delete-version');
    I.waitForVisible('.Reponse #edit');
    I.waitForInvisible('.Reponse #upload-version');

    task.form.save();
    await task.open(mail.task);
    I.waitForVisible('.Reponse #delete-attached');
    I.waitForVisible('.Reponse #upload-version');
    I.waitForVisible('.Reponse #edit');
    I.waitForInvisible('.Reponse #delete-version');
}).tag('task');

Scenario('I open a task, then I know which actions are enabled', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.attachments.attachNewDocument('.Reponse', 'data/simple.pdf');
    task.form.save();

    I.executeScript(function (mail) {
        JSAPI.get().getCardAPI().registerForAttachment(function (card, task, attDefinition, component) {
            if (attDefinition.getId() == 'Reponse') {
                actions = {};
                actions.createVersion = card.getActions().get('create-version').isEnabled();
                actions.deleteVersion = card.getActions().get('delete-version').isEnabled();
                actions.createAttached = card.getActions().get('create-attached').isEnabled();
                actions.uploadVersion = card.getActions().get('upload-version').isEnabled();
                actions.deleteAttached = card.getActions().get('delete-attached').isEnabled();
                actions.edit = card.getActions().get('edit').isEnabled();
                actions.model = card.getActions().get("generateDocumentFromModel").isEnabled();
                $("#wrapper").append($("<p id='lock-" + mail.task + "'/>"));
            };
        });
    }, mail);
    await task.open(mail.task);
    I.waitAndRemoveLock(mail.task);

    var result = await I.executeScript(function () {
        return actions;
    });

    I.test(function (result) {
        assertEquals(false, result.createVersion);
        assertEquals(false, result.deleteVersion);
        assertEquals(false, result.createAttached);
        assertEquals(true, result.uploadVersion);
        assertEquals(true, result.deleteAttached);
        assertEquals(true, result.edit);
        assertEquals(true, result.model);
    }, result);
}).tag('task').tag('JSAPI');

