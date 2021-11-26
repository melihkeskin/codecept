//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Folder / Content');

Scenario('Given a folder When I add it a document using JS API Then the document is a folder child', async ({ I, folder }) => {
    let container = await I.haveFolder();
    let doc = await I.createDocument({}, true);
    I.executeScriptX(({ folder, doc, done }) => {
        var child = new ComponentReference(doc.id, "DOCUMENT");
        JSAPI.get().folder().addChildren(folder.id, [child], false, function () {
            done();
        });
    }, container, doc);

    folder.open(container.id);
    folder.documents.results.seeFirst(doc.name);
}).tag('folder').tag('children');

Scenario('Given a folder When I add it a document And replace it with another document using JS API Then only the second document is a folder child', async ({ I, folder }) => {
    let container = await I.haveFolder();
    let doc1 = await I.createDocument({}, true);
    let doc2 = await I.createDocument({}, true);
    I.executeScriptX(({ folder, doc1, doc2, done }) => {
        var child1 = new ComponentReference(doc1.id, "DOCUMENT");
        JSAPI.get().folder().addChildren(folder.id, [child1], false, function () {
            var child2 = new ComponentReference(doc2.id, "DOCUMENT");
            JSAPI.get().folder().addChildren(folder.id, [child2], true, function () {
                done();
            });
        });
    }, container, doc1, doc2);

    folder.open(container.id);
    folder.documents.results.seeFirst(doc2.name);
    folder.documents.results.dontSeeInResults(doc1.name);
}).tag('folder').tag('children');

Scenario('Given a folder with one child When I remove the child using JS API Then I do not see it within folder', async ({ I, folder }) => {
    let container = await I.haveFolder();
    let doc = await I.createDocument({}, true);
    I.executeScriptX(({ folder, doc, done }) => {
        var child = new ComponentReference(doc.id, "DOCUMENT");
        JSAPI.get().folder().addChildren(folder.id, [child], false, function () {
            done();
        });
    }, container, doc);

    I.executeScriptX(({ folder, doc, done }) => {
        var child = new ComponentReference(doc.id, "DOCUMENT");
        JSAPI.get().folder().deleteChildren(folder.id, [child], function () {
            done();
        });
    }, container, doc);

    folder.open(container.id);
    folder.documents.results.dontSeeInResults(doc.name);
}).tag('folder').tag('children');