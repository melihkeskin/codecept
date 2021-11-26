//<reference path="../../steps.d.ts" /> 

const NEW_CONTENT_NAME = 'multi-pages.pdf';

Before({ login } => {
    login('admin');
});

Feature('Document / No versioning');

Scenario('Given that versioning is disabled when I change its content then I see new content and do not see version fact', async ({ I, document }) => {
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf', 'classId': "Document" });
    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);
    document.changeContent(NEW_CONTENT_NAME);
    I.refreshActivity();

    document.viewer.seeSelected(NEW_CONTENT_NAME, 4);

    document.versions.dontSeeFact();
}).tag('document').tag('versioning').tag('none');


Scenario('Given that versioning is disabled when I change its content then I see new content and I can save document', async ({ I, document, notification }) => {
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf', 'classId': "Document" });
    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);
    document.changeContent(NEW_CONTENT_NAME);
    document.viewer.seeSelected(NEW_CONTENT_NAME, 4);
    document.form.save('DOCUMENT');
}).tag('document').tag('versioning').tag('none');

// Fix it
//Scenario('Given that versioning is disabled when I promote document I do not see version fact', async (I, document) => {
//    let doc = await I.createAndOpenDocument({ 'file': 'data/simple.pdf', 'classId': "Document" });
//    document.waitForOpen();
//    document.viewer.seeNameAndPageCount("simple.pdf", 1);
//    await document.createNewVersion(doc.id, "firstVersion");
//    document.changeContent(NEW_CONTENT_NAME);
//    I.refreshActivity();

//    document.viewer.seeSelected(NEW_CONTENT_NAME, 4);

//    document.versions.dontSeeFact();
//}).tag('document').tag('versioning').tag('none');
