//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Folder / Deletion');

Scenario("Given a folder with a document When I open it Then I don't see delete action", async ({ I, folder, document, data, notification }) => {
    const folderName = data.faker.lorem.words();

    I.createFolderInRoot(folderName);
    I.waitForGlassPanelHidden();

    folder.folders.openSubFolder(folderName);
    let doc = await folder.documents.addDocument();
    I.waitForFoundable('DOCUMENT', doc.name, 'name');

    I.refreshActivity();
    folder.smartActions.dontSee('#delete');
}).tag('folder');


Scenario("Given an empty folder When I delete it Then I don't see it in its parent content", ({ I, folder, data }) => {
    const folderName = data.faker.lorem.words();

    I.createFolderInRoot(folderName);
    I.waitForGlassPanelHidden();
    folder.folders.openSubFolder(folderName);
    folder.form.deleteLogically();
    I.waitForGlassPanelHidden();

    folder.documents.results.dontSeeInResults(folderName);
}).tag('folder');