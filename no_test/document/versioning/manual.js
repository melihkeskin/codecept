//<reference path="../../steps.d.ts" /> 

const confirmationPopup = require("../../../fragments/confirmationPopup");
const NEW_CONTENT_NAME = 'multi-pages.pdf';

Before({ login } => {
    login('admin');
});

Feature('Document / Manual versioning');

Scenario('Given that versioning is manual when I change its content then I see new content and do not see version fact', async ({ I, document }) => {
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf', 'classId': "DocumentManualVersion" });
    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);
    document.changeContent(NEW_CONTENT_NAME);
    I.refreshActivity();

    document.viewer.seeSelected(NEW_CONTENT_NAME, 4);

    document.versions.dontSeeFact();
}).tag('document').tag('versioning').tag('manual');

Scenario('Given that a document with manually created version when I open history then I see the version fact', async ({ I, document }) => {
    let doc = await I.createAndOpenDocument({ 'file': 'data/simple.pdf', 'classId': "DocumentManualVersion" });
    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);
    await document.createNewVersion(doc.id, "firstVersion");
    I.refreshActivity();
    document.versions.seeFactFor('firstVersion');
}).tag('document').tag('versioning').tag('manual');

Scenario('Given that a document with manually created version when I change the document content and open version then I visualize version content', async ({ I, document }) => {
    let doc = await I.createAndOpenDocument({ 'file': 'data/simple.pdf', 'classId': "DocumentManualVersion" });
    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);
    await document.createNewVersion(doc.id, "firstVersion");

    document.changeContent(NEW_CONTENT_NAME);
    document.versions.open('firstVersion');

    document.viewer.seeNameAndPageCount("simple.pdf", 1);
}).tag('document').tag('versioning').tag('manual');

Scenario('Given that a document has a version created manually when I change document content and I compare it then I see differences within viewer', async ({ I, document }) => {
    let doc = await I.createAndOpenDocument({ 'file': 'data/simple.pdf', 'classId': "DocumentManualVersion" });
    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);
    await document.createNewVersion(doc.id, "firstVersion");
    document.changeContent(NEW_CONTENT_NAME);

    document.versions.compareTo('firstVersion');
    I.wait(5);

    I.switchToNextTab();
    I.seeInCurrentUrl('/ARender');
    I.waitForText("simple.pdf", 120);
    I.waitForText("multi-pages.pdf", 30);
    I.waitForVisible('.synchronizeDocumentScrollingButton', 30)
    I.waitNumberOfVisibleElements('.changesThumbLabel', 5, 120);
    await I.closePage(1);
}).tag('document').tag('versioning').tag('manual');

Scenario('Given that a document has a version created manually when I change document content and I revert to version then I visualize restored version', async ({ I, document }) => {
    let doc = await I.createAndOpenDocument({ 'file': 'data/simple.pdf', 'classId': "DocumentManualVersion" });
    document.waitForOpen();
    document.viewer.seeNameAndPageCount("simple.pdf", 1);
    await document.createNewVersion(doc.id, "firstVersion");
    document.changeContent(NEW_CONTENT_NAME);

    document.versions.revertTo('firstVersion');
    confirmationPopup.confirm();

    document.viewer.seeNameAndPageCount("simple.pdf", 1);
}).tag('document').tag('versioning').tag('manual');
