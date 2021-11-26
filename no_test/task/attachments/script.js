//<reference path="../../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Task / Attachment & script');

Scenario('Give a task When I attach a document using JS API Then I the document is attached', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    let attachment = await I.createDocument({
        'classId': 'CourrierSortant',
        'tags': {
            'CanalEntree': mail.channelCode.value,
            'DateCourrier': '0',
            'ObjetCourrier': mail.object,
            'RefClient': mail.refClient,
            'PrenomClient': mail.firstName,
            'NomClient': mail.lastName
        }
    });

    I.executeScriptX(({ mail, attachment, done }) => {
        JSAPI.get().task().get([mail.task], function (tasks) {
            let task = tasks[0];
            task.addAttachment('Reponse', attachment.id, 'DOCUMENT');
            JSAPI.get().task().update([task], function (updated) {
                window.task = updated[0];
                done();
            });
        });
    }, mail, attachment);

    I.test(function (id, attachment) {
        assertEquals(id, task.getId());
        assertEquals([attachment.id], task.getAttachmentIds('Reponse'));
    }, mail.task, attachment);
}).tag('task').tag('assignee').tag('jsapi');

Scenario('Give a task When I attach two documents using JS API Then I the document is attached', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    let attachment1 = await I.createDocument();
    let attachment2 = await I.createDocument();

    I.executeScriptX(({ mail, attachment1, attachment2, done }) => {
        JSAPI.get().task().get([mail.task], function (tasks) {
            let task = tasks[0];
            task.addAttachments('Appendices', [attachment1.id, attachment2.id], 'DOCUMENT');
            JSAPI.get().task().update([task], function (updated) {
                window.task = updated[0];
                done();
            });
        });
    }, mail, attachment1, attachment2);

    I.test(function (id, attachment1, attachment2) {
        assertEquals(id, task.getId());
        assertEquals([attachment1.id, attachment2.id], task.getAttachmentIds('Appendices'));
    }, mail.task, attachment1, attachment2);
}).tag('task').tag('assignee').tag('jsapi');
