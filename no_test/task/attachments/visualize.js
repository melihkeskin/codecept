//<reference path="../../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Task / Attachment visualization');

Scenario('I attach a document then cancel', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);

    task.attachments.attachNewDocument('.Reponse', 'data/multi-pages.pdf');
    task.viewer.seeSelected('multi-pages.pdf', 4);
    task.viewer.seeDocumentCount(1);
    task.viewer.dontSeeActionsForReadOnlyDocument();
    task.form.cancel();

    await task.open(mail.task);
    task.viewer.dontSee();
}).tag('task');

Scenario('I attach a document then save', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.attachments.attachNewDocument('.Reponse', 'data/multi-pages.pdf');
    task.form.save();

    await task.open(mail.task);
    task.viewer.seeDocumentCount(1);
    task.viewer.seeSelected('multi-pages.pdf', '4');
}).tag('task');

Scenario('I attach a document then detach it', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.attachments.attachNewDocument('.Reponse', 'data/multi-pages.pdf');
    task.viewer.seeDocumentCount(1);
    task.viewer.seeSelected('multi-pages.pdf', 4);

    task.attachments.deleteAttachment('.Reponse');
    task.viewer.dontSee();
}).tag('task');

Scenario('I attach a document then update then cancel', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.attachments.attachNewDocument('.Reponse', 'data/simple.pdf');
    task.form.save();

    await task.open(mail.task);
    task.attachments.updateAttachment('.Reponse', 'data/multi-pages.pdf', 'form.upload-version input');
    task.viewer.waitForDocumentLoading();
    task.viewer.seeSelected('multi-pages', '4');
    task.form.cancel();

    await task.open(mail.task);
    task.attachments.openAttachment('.Reponse');
    task.viewer.seeSelected('simple.pdf', '1');
}).tag('task');


Scenario('I attach a document then visualized document changes', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);

    task.attachments.attachNewDocument('.Reponse', 'data/simple.pdf');
    task.viewer.waitForDocumentLoading();
    task.viewer.seeSelected('simple.pdf', '1');

    task.attachments.attachNewDocument('.Appendices', 'data/multi-pages.pdf');
    task.viewer.waitForDocumentLoading();
    task.viewer.seeSelected('multi-pages.pdf', '4');
}).tag('task');
