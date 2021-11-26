//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Folder / Tree');

Scenario('I create a folder hierarchy within another folder then seen it', async ({ I, folder }) => {
    let rootFolder = await I.haveFolder({ 'classId': 'NoCaseFolder' });
    folder.open(rootFolder.id);
    folder.form.seeFieldTitle(rootFolder.name);

    folder.createChildFolder(-1, rootFolder.name + '-child1');

    I.refreshActivity();
    folder.form.seeFieldTitle(rootFolder.name);
    folder.seeChildFolder(0, rootFolder.name + '-child1');
    folder.createChildFolder(0, rootFolder.name + '-child2');

    I.refreshActivity();
    folder.form.seeFieldTitle(rootFolder.name);
    folder.seeChildFolder(0, rootFolder.name + '-child1');
    folder.seeChildFolder(1, rootFolder.name + '-child2');
}).tag('folder').tag('children');

Scenario('I create a child document within folder then seen it', async ({ I, folder, document }) => {
    let rootFolder = await I.haveFolder({ 'classId': 'NoCaseFolder' });
    folder.open(rootFolder.id);

    folder.createChildDocument(-1, rootFolder.name + '-child1', document);
    folder.documents.results.seeFirst(rootFolder.name + '-child1');
}).tag('folder').tag('children');

Scenario('I create a child document within sub folder then seen it', async ({ I, folder, document }) => {
    let rootFolder = await I.haveFolder({ 'classId': 'NoCaseFolder' });
    folder.open(rootFolder.id);

    folder.createChildFolder(-1, rootFolder.name + '-child1');
    folder.createChildDocument(0, rootFolder.name + '-child1', document);

    I.refreshActivity();
    folder.form.seeFieldTitle(rootFolder.name);

    folder.select(0);
    folder.documents.results.seeFirst(rootFolder.name + '-child1');
}).tag('folder').tag('children');