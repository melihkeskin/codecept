//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Process / Delegates / File');

Scenario('As a process When I download a file and convert it as PDF Then I visualize it', async ({ I, document }) => {
    let task = await I.haveTask({ 'classId': 'GetAndConvertFile_Start', 'workflow': 'GetAndConvertFile' });
    let documentId = await I.waitForFoundable('DOCUMENT', task.id, 'name');
    document.open(documentId);
    document.waitForOpen(true);
    document.viewer.seePageCount(1);
}).tag('process').tag('delegates').tag('file');
