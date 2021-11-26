//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('ARender / Stamps');

Scenario("Given a textual stamp When I delete it and I refresh page Then I don't see it", async ({ I, rightBar }) => {
    const title = await rightBar.createTextualStamp();

    rightBar.see(title, 'stamps');
    await rightBar.deleteStamp(title);

    I.refreshPage();
    I.waitForGlassPanelHidden();
    rightBar.dontSee(title, 'stamps');
});

Scenario('Given a textual stamp When I add it on a document and I refresh Then I visualize the stamp', async ({ I, document, rightBar }) => {
    const title = await rightBar.createTextualStamp();
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf' });

    document.viewer.waitForDocumentLoading();
    document.viewer.topPanel.see('.annotationManagerButton');
    document.viewer.topPanel.openSubMenu('.annotationManagerButton');
    document.viewer.topPanel.seeInSubMenu('.stampAnnotationButton');
    document.viewer.createStamp(title);

    I.refreshActivity();
    await document.viewer.seeStamp(title);

    document.viewer.deleteStamp(title);
    await rightBar.deleteStamp(title);
});

Scenario("Given a document with a textual stamp When I remove the stamp from rightbar Then I continue to see the stamp on document", async ({ I, document, rightBar }) => {
    //Refresh to ensure that workbox routing is enabled
    I.refreshPage();
    const title = await rightBar.createTextualStamp();
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf' });

    document.viewer.waitForDocumentLoading();
    document.viewer.createStamp(title);
    await rightBar.deleteStamp(title);

    I.refreshActivity();
    document.viewer.waitForDocumentLoading();
    await document.viewer.canNotCreateStamp(title);
    await document.viewer.seeStamp(title);
    document.viewer.deleteStamp(title);
});

Scenario('I create a stamp then verify that other user can not see it in his right menu nor useI create a stamp then verify that other user can not see it in his right menu nor use it', async ({ I, document, rightBar }) => {
    const title = await rightBar.createTextualStamp();

    await I.login('phu');
    await rightBar.open();
    rightBar.dontSee(title, 'stamps');
    rightBar.close();

    await I.createAndOpenDocument({ 'file': 'data/simple.pdf' });
    document.viewer.waitForDocumentLoading();
    document.viewer.topPanel.see('.annotationManagerButton');
    document.viewer.topPanel.openSubMenu('.annotationManagerButton');
    document.viewer.topPanel.dontSeeInSubMenu('.stampAnnotationButton');

    await I.login('admin');
    await rightBar.deleteStamp(title);
});

Scenario('I create a stamp and use it in a document, then verify other user can see it after open the same document in ARender', async ({ I, task, rightBar }) => {
    const title = await rightBar.createTextualStamp();

    let mail = await I.haveMail(true, 'data/simple.pdf');
    task.open(mail.task);
    task.viewer.waitForDocumentLoading();
    task.viewer.createStamp(title);

    await I.login('phu');
    task.open(mail.task);
    task.waitForOpen();
    task.viewer.waitForDocumentLoading();
    await task.viewer.seeStamp(title);

    await I.login('admin');
    await rightBar.deleteStamp(title);
});

Scenario('I create an image stamp and I use it in a document, then I delete it', async ({ I, data, stampPopup, rightBar, document }) => {
    const title = data.faker.lorem.words();
    await rightBar.open();
    rightBar.add("#stamps-section");
    stampPopup.createImageStamp(title, 'data/stamp.jpg');
    I.refreshPage();
    I.waitForGlassPanelHidden();
    await rightBar.open();
    rightBar.see(title, 'stamps');
    rightBar.close();

    await I.createAndOpenDocument({ 'file': 'data/simple.pdf' });

    document.viewer.waitForDocumentLoading();
    document.viewer.topPanel.see('.annotationManagerButton');
    document.viewer.topPanel.openSubMenu('.annotationManagerButton');
    document.viewer.topPanel.seeInSubMenu('.stampAnnotationButton');
    document.viewer.createImageStamp();

    document.viewer.deleteImageStamp();
    await rightBar.deleteStamp(title);
});

Scenario('I create a stamp with border and custom color, and I use it in a document, then I delete it', async ({ I, rightBar, document }) => {
    //Refresh to ensure that workbox routing is enabled
    I.refreshPage();
    const title = await rightBar.createTextualStamp('Rose', true);

    await I.createAndOpenDocument({ 'file': 'data/simple.pdf' });

    document.viewer.waitForDocumentLoading();
    document.viewer.createStamp(title);

    let color = 'rgb(245, 0, 87)';
    await document.viewer.seeStamp(title, color, true);
    document.viewer.deleteStamp(title);

    await rightBar.deleteStamp(title);
});

Scenario('I create a textual stamp without text, then I cannot validate', async ({ I, stampPopup, rightBar, data }) => {
    const title = data.faker.lorem.words();
    await rightBar.open();
    rightBar.add('#stamps-section');
    stampPopup.createTextualStamp('');
    stampPopup.seeDisabledAction('validate');
    stampPopup.fillTitle(title);
    I.waitForEnabled('#validate');
});

Scenario('I create an image stamp without image then I cannot validate', async ({ I, stampPopup, rightBar, data }) => {
    await rightBar.open();
    rightBar.add('#stamps-section');
    stampPopup.createImageStamp('', '');
    stampPopup.seeDisabledAction('validate');
    stampPopup.addFile('data/stamp.jpg');
    I.waitForEnabled('#validate');
});
// test fail until FD-13264 fixed
/*Scenario('I modify a stamp then verify that I can see the used previous stamp after I open a document in Arender, and I can use the updated stamp', async (I, data, stampPopup, document, rightBar) => {
    const title = data.faker.lorem.words();
    await rightBar.open();
    rightBar.add("#stamps-section");
    stampPopup.createTextualStamp(title);
    rightBar.see(title, 'stamps');
    rightBar.close();

    await I.createAndOpenDocument({ 'file': 'data/simple.pdf'});

    document.viewer.waitForDocumentLoading();
    document.viewer.topPanel.see('.annotationManagerButton');
    document.viewer.topPanel.openSubMenu('.annotationManagerButton');
    document.viewer.topPanel.seeInSubMenu('.stampAnnotationButton');
    document.viewer.createStamp(title);

    const newTitle = data.faker.lorem.words();
    await rightBar.open();
    rightBar.update(title);
    stampPopup.fillTitle(newTitle);
    stampPopup.validate();

    I.refreshPage();
    document.viewer.waitForDocumentLoading();
    document.viewer.deleteStamp(title);
    document.viewer.topPanel.openSubMenu('.annotationManagerButton');
    document.viewer.topPanel.seeInSubMenu('.stampAnnotationButton');
    document.viewer.createStamp(newTitle);

    document.viewer.deleteStamp(newTitle);
    await rightBar.open();
    rightBar.deleteStamp(newTitle);
});*/