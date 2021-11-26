//<reference path="../../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Task / Legacy attachment');

Scenario('I attach a document then cancel', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    I.executeScript(function () {
        LegacyDocumentAttachmentCreationStrategy.registerStrategy(function (task, attachment) {
            if ("Reponse" == attachment.getId()) {
                return true;
            }
            return false;
        });
    });
    await task.open(mail.task);
    task.attachments.attachDocumentLegacy('.Reponse', 'data/multi-pages.pdf');
    task.viewer.seeSelected('multi-pages.pdf', 4);
    task.viewer.seeDocumentCount(1);
    task.viewer.dontSeeActionsForReadOnlyDocument();
    task.form.cancel();

    await task.open(mail.task);
    task.viewer.dontSee();
}).tag('task').tag('legacy');

Scenario('I attach a document then save', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    I.executeScript(function () {
        LegacyDocumentAttachmentCreationStrategy.registerStrategy(function (task, attachment) {
            if ("Reponse" == attachment.getId()) {
                return true;
            }
            return false;
        });
    });
    task.open(mail.task);
    task.attachments.attachDocumentLegacy('.Reponse', 'data/multi-pages.pdf');
    task.form.save();

    task.open(mail.task);
    task.waitForOpen();
    task.viewer.seeSelected('multi-pages.pdf', 4);
    task.viewer.seeDocumentCount(1);
    task.viewer.seeActionsForModifyDocument();
}).tag('task').tag('legacy');