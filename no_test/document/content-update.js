//<reference path="../../steps.d.ts" /> 

Feature('Document');

let doc = {};
Before(({ I }) => { // or Background
    doc = { 'file': 'data/simple.pdf', 'acl': 'acl-document' };
});

Scenario('I create document then update its content', async ({ I, data, document, notification }) => {
    await I.login('admin');
    await I.createAndOpenDocument(doc);

    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);

    I.attachFile('form .gwt-FileUpload', 'data/multi-pages.pdf');
    notification.waitForVisible('Le fichier multi-pages.pdf a été ajouté au document.');
    document.viewer.seeSelected("multi-pages.pdf", 4);
}).tag('document').tag('arender');

Scenario('I have ADD_CONTENT and DELETE_CONTENT permission, then I try to update document content, I see update content action', async ({ I, data, document, notification }) => {
    await I.login('phu');
    await I.createAndOpenDocument(doc);

    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);
    document.smartActions.see("#replaceContent");
    I.attachFile('form .gwt-FileUpload', 'data/multi-pages.pdf');
    notification.waitForVisible('Le fichier multi-pages.pdf a été ajouté au document.');
    document.viewer.seeSelected("multi-pages.pdf", 4);
}).tag('document').tag('security');

Scenario('I have UPDATE_CONTENT permission, then I try to update document content, I see update content action', async ({ I, data, document, notification }) => {
    await I.login('jna')
    await I.createAndOpenDocument(doc);

    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);
    document.smartActions.see("#replaceContent");
    I.attachFile('form .gwt-FileUpload', 'data/multi-pages.pdf');
    notification.waitForVisible('Le fichier multi-pages.pdf a été ajouté au document.');
    document.viewer.seeSelected("multi-pages.pdf", 4);
}).tag('document').tag('security');

Scenario("Given that I only have ADD_CONTENT permission when I open document then I don't see update content action", async ({ I, data, document }) => {
    await I.login('sto');
    await I.createAndOpenDocument(doc);

    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);
    document.smartActions.dontSee("#replaceContent");
}).tag('document').tag('security');

Scenario("I only have DELETE_CONTENT permission, then I try to update document content, I don't see update content action", async ({ I, data, document }) => {
    await I.login('rh');
    await I.createAndOpenDocument(doc);

    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);
    document.smartActions.dontSee("#replaceContent");
}).tag('document').tag('security');

Scenario("I don't have permission to ADD_CONTENT, DELETE_CONTENT nor UPDATE_CONTENT,then I try to update document content, I don't see update content action", async ({ I, data, document }) => {
    await I.login('sto');
    await I.createAndOpenDocument(doc);

    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);
    document.smartActions.dontSee("#replaceContent");
}).tag('document').tag('security');