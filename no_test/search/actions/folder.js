//<reference path="../../steps.d.ts" />
Before({ login } => {
    login('admin');
});

Feature('Search / Folder actions');

Scenario('Given I select one folder with children, when I display contextual menu, then I see open, openExternal and attach but not delete actions', async ({ search, I }) => {
    let container = await I.haveFolder();
    let doc = await I.createDocument();
    await I.executeScriptX(({ folder, doc, done }) => {
        var child = new ComponentReference(doc.id, "DOCUMENT");
        JSAPI.get().folder().addChildren(folder.id, [child], false, function () {
            done();
        });
    }, container, doc);
    search.openDefault();
    search.form.category.select('Dossier');
    search.form.launchQuick('');

    search.results.select(1);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenAction();
    search.results.seeOpenExternalAction();
    search.results.dontSeeDeleteAction();
    search.results.seeAttachAction();
}).tag('search').tag('actions').tag('folder');

Scenario('Given I select two folders without children, when I display contextual menu, then I see openExternal, delete and attach actions', async ({ search, I }) => {
    await I.haveFolder();
    await I.haveFolder();
    search.openDefault();
    search.form.category.select('Dossier');
    search.form.launchQuick('');

    search.results.select(1);
    search.results.select(2);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenExternalAction();
    search.results.seeDeleteAction();
    search.results.seeAttachAction();
}).tag('search').tag('actions').tag('folder');

Scenario('Given I select one folder without children, when I display contextual menu, then I see open, openExternal, delete and attach actions', async ({ search, I }) => {
    await I.haveFolder();
    search.openDefault();
    search.form.category.select('Dossier');
    search.form.launchQuick('');

    search.results.select(1);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenAction();
    search.results.seeOpenExternalAction();
    search.results.seeDeleteAction();
    search.results.seeAttachAction();
}).tag('search').tag('actions').tag('folder');

Scenario('Given I select two folders, one with children, when I display contextual menu, then I see openExternal and attach actions but not delete', async ({ search, I, folder }) => {
    await I.haveFolder();
    let container = await I.haveFolder();
    let doc = await I.createDocument({}, true);
    await I.executeScriptX(({ folder, doc, done }) => {
        var child = new ComponentReference(doc.id, "DOCUMENT");
        JSAPI.get().folder().addChildren(folder.id, [child], false, function () {
            done();
        });
    }, container, doc);

    search.openDefault();
    search.form.category.select('Dossier');
    search.form.launchQuick('');

    search.results.select(1);
    search.results.select(2);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenExternalAction();
    search.results.dontSeeDeleteAction();
    search.results.seeAttachAction();
}).tag('search').tag('actions').tag('folder');

Scenario('Given I select one folder without children reserved by another user, when I display contextual menu, then I see open, openExternal actions and not delete and attach actions', async ({ search, I, utils }) => {
    await I.login('jna');
    let folder = await I.haveFolder();
    await utils.rest.reserve('folder', folder.id);
    await I.login('admin');

    search.openMine("folderStoredSearch");
    search.form.category.select('Dossier');
    search.form.launchQuick('');

    search.results.select(1);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenAction();
    search.results.seeOpenExternalAction();
    search.results.dontSeeDeleteAction();
    search.results.dontSeeAttachAction();
}).tag('search').tag('actions').tag('folder');

Scenario('Given I select one folder without children and reserved by me, when I display contextual menu, then I see open, openExternal, attach and delete actions ', async ({ search, I, utils }) => {
    let folder = await I.haveFolder();
    await utils.rest.reserve('folder', folder.id);

    search.openDefault();
    search.form.category.select('Dossier');
    search.form.launchQuick('');

    search.results.select(1);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenAction();
    search.results.seeOpenExternalAction();
    search.results.seeDeleteAction();
    search.results.seeAttachAction();
}).tag('search').tag('actions').tag('folder');

Scenario('Given I select two folders, one reserved by another user, when I display contextual menu, then I see openExternal action', async ({ search, I, utils }) => {
    await I.login('jna');
    let folder = await I.haveFolder();
    await utils.rest.reserve('folder', folder.id);
    await I.haveFolder();
    await I.login('admin');

    search.openMine("folderStoredSearch");
    search.form.category.select('Dossier');
    search.form.launchQuick('');

    search.results.select(1);
    search.results.select(2);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenExternalAction();
    search.results.dontSeeDeleteAction();
    search.results.dontSeeAttachAction();
}).tag('search').tag('actions').tag('folder');