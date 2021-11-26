//<reference path="../../steps.d.ts" /> 

const confirmationPopup = require("../../../fragments/confirmationPopup");
const NEW_CONTENT_NAME = 'multi-pages.pdf';
Before({ login } => {
    login('admin');
});

Feature('Document / Automatic versioning');

Scenario('Given that versioning is automatic when I change document content then I see version fact within history', async ({ I, document }) => {
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf', 'classId': "DocumentAutomaticVersion" });
    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);
    document.changeContent(NEW_CONTENT_NAME);
    document.viewer.seeSelected(NEW_CONTENT_NAME, 4);
    document.versions.seeFactFor('0.1');
}).tag('document').tag('versioning').tag('automatic');

Scenario('Given that versioning is automatic when I change document content then I can save document', async ({ I, document, notification }) => {
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf', 'classId': "DocumentAutomaticVersion" });
    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);
    document.changeContent(NEW_CONTENT_NAME);
    document.viewer.seeSelected(NEW_CONTENT_NAME, 4);
    document.form.save('DOCUMENT');
}).tag('document').tag('versioning').tag('automatic');

Scenario('Given that versioning is automatic when I change document content and I refresh page then I visualize new content', async ({ I, document }) => {
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf', 'classId': "DocumentAutomaticVersion" });
    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);
    document.changeContent(NEW_CONTENT_NAME);
    I.refreshActivity();
    document.viewer.seeSelected(NEW_CONTENT_NAME, 4);
}).tag('document').tag('versioning').tag('automatic');

Scenario('Given that versioning is automatic when I change the document content and I open version then I visualize version content', async ({ I, document }) => {
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf', 'classId': "DocumentAutomaticVersion" });
    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);
    document.changeContent(NEW_CONTENT_NAME);
    document.versions.open('0.1');

    document.viewer.seeNameAndPageCount("simple.pdf", 1);
}).tag('document').tag('versioning').tag('automatic');


Scenario('Given that versioning is automatic when I change document content and I compare it then I see differences within viewer', async ({ I, document }) => {
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf', 'classId': "DocumentAutomaticVersion" });
    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);
    document.changeContent(NEW_CONTENT_NAME);

    document.versions.compareTo('0.1');

    I.wait(5);
    I.switchToNextTab();

    I.seeInCurrentUrl('/ARender');
    I.waitForText("simple.pdf", 120);
    I.waitForText("multi-pages.pdf", 30);
    I.waitForVisible('.synchronizeDocumentScrollingButton', 30)
    I.waitNumberOfVisibleElements('.changesThumbLabel', 5, 120);
    await I.closePage(1);
}).tag('document').tag('versioning').tag('automatic');

Scenario('Given that versioning is automatic when I change document content and I revert to version then I visualize restored version', async ({ I, document }) => {
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf', 'classId': "DocumentAutomaticVersion" });
    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);
    document.changeContent(NEW_CONTENT_NAME);

    document.versions.revertTo('0.1');
    confirmationPopup.confirm();

    document.viewer.seeNameAndPageCount("simple.pdf", 1);
}).tag('document').tag('versioning').tag('manual');