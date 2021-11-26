//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Plugins / MSOffice Template');

Scenario('Given a task with document generator, when I launch document from template generation, then I see downloaded file with resolved variable', async ({ I, task }) => {
    let mail = await I.haveMail(true);
    task.open(mail.task);
    await I.waitForFoundable('TASK', mail.task, false, [{ 'name': 'assignee', 'value': 'fadmin' }]);
    I.waitForGlassPanelHidden();
    I.waitForElement('.Reponse .task-attachment .actions #generateDocumentFromModel', 10)
    I.handleDownloads();
    I.click('#generateDocumentFromModel');
    I.amInPath('output/downloads');
    I.retry({ retries: 10, minTimeout: 1000 }).seeFile('model-reponse.docx');

    task.attachments.attachNewDocument('.Reponse', 'output/downloads/model-reponse.docx');

    task.viewer.waitForDocumentLoading();
    task.viewer.advancedSearch.open();
    task.viewer.advancedSearch.search(mail.refClient);
    task.viewer.advancedSearch.seeOneResult();
}).tag('plugins').tag('msoffice').tag('template');
