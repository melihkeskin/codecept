//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Search / Virtual folder actions');

Scenario('Given I select one not reserved virtual folder, when I display contextual menu, then I see open, openExternal, attach and delete actions', async ({ I, search }) => {
    await I.haveCustomerFolder(true);
    search.openDefault();
    search.form.category.select('Dossier virtuel');
    search.form.launchQuick('');

    search.results.select(1);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenAction();
    search.results.seeOpenExternalAction();
    search.results.seeDeleteAction();
    search.results.seeAttachAction();
}).tag('search').tag('actions').tag('virtualFolder');

Scenario('Given I select two not reserved virtual folders, when I display contextual menu, then I see openExternal, attach and delete actions', async ({ I, search }) => {
    await I.haveCustomerFolder(true);
    await I.haveCustomerFolder(true);
    search.openDefault();
    search.form.category.select('Dossier virtuel');
    search.form.launchQuick('');

    search.results.select(1);
    search.results.select(2);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenExternalAction();
    search.results.seeDeleteAction();
    search.results.seeAttachAction();
}).tag('search').tag('actions').tag('virtualFolder');

Scenario('Given I select one virtual folder reserved by another user, when I display contextual menu, then I see open and openExternal actions and not delete and attach actions', async ({ search, I, utils }) => {
    let virtualFolder = await I.haveCustomerFolder(true);
    utils.rest.reserve('virtual_folder', virtualFolder.id);
    I.login('jna');

    search.open('.dossierClientSearchTab');
    search.form.launchQuick('');

    search.results.select(1);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenAction();
    search.results.seeOpenExternalAction();
    search.results.dontSeeDeleteAction();
    search.results.dontSeeAttachAction();
}).tag('search').tag('actions').tag('virtualFolder');

Scenario('Given I select two virtual folders, one reserved by another user, when I display contextual menu, then I see openExternal and not delete and attach actions', async ({ search, I, utils }) => {
    let folder = await I.haveFolder();
    utils.rest.reserve('folder', folder.id);
    await I.haveFolder();
    await I.login('jna');

    search.open(".dossierClientSearchTab");
    search.form.launchQuick('');

    search.results.select(1);
    search.results.select(2);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenExternalAction();
    search.results.dontSeeDeleteAction();
    search.results.dontSeeAttachAction();
}).tag('search').tag('actions').tag('virtualFolder');

Scenario('Given I select one virtual folder reserved by me, when I display contextual menu, then I see open, openExternal, attach and delete actions', async ({ search, I, utils }) => {
    let virtualFolder = await I.haveCustomerFolder(true);
    utils.rest.reserve('virtual_folder', virtualFolder.id);

    search.open('.dossierClientSearchTab');
    search.form.launchQuick('');

    search.results.select(1);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenAction();
    search.results.seeOpenExternalAction();
    search.results.seeDeleteAction();
    search.results.seeAttachAction();
}).tag('search').tag('actions').tag('virtualFolder');
