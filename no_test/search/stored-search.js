//<reference path="../../steps.d.ts" />

const { I } = inject();

const data = require('../../data/data');

Feature('Search / Store & Share');

Before({ I } => {
    I.login('admin');
});

Scenario('I save a search then delete it', ({ search, sidemenu }) => {
    var name = data.faker.lorem.words();
    save(name, search, sidemenu);
    search.openMine(name);
    doDelete(name, search, sidemenu);
}).tag('storedSearch').tag('create');

Scenario('Given I have a stored search with Default Search template and Folder category, when I open it, then Folder category is selected', async ({ search }) => {
    search.openMine("folderStoredSearch");
    await search.form.category.see('Dossier');
}).tag('storedSearch').tag('folder');


Scenario('I save a search then rename it then delete it', ({ search, sidemenu }) => {
    var name = data.faker.lorem.words();
    save(name, search, sidemenu);
    search.openMine(name);
    const newName = data.faker.system.commonFileName();
    search.savedSearch.rename(newName);
    search.openMine(newName);

    doDelete(newName, search, sidemenu);
}).tag('storedSearch').tag('rename');

Scenario('I save a search then update it, and verify it after refresh page, then delete it', ({ search, sidemenu }) => {
    var name = data.faker.lorem.words();
    save(name, search, sidemenu);
    search.openMine(name)
    update(search);

    I.refreshPage();
    search.form.classSelector.see('Courrier Entrant');
    search.form.seeCriterion("CanalEntree", 'Email');

    doDelete(name, search, sidemenu);
}).tag('storedSearch').tag('update');

Scenario('I save a search then share it to a user, then stop sharing it to him, and delete it', async ({ search, sidemenu }) => {
    var name = data.faker.lorem.words();
    save(name, search, sidemenu);
    search.openMine(name)
    search.savedSearch.shareTo('User', 'phu', 'Paul Hution');

    await I.login('phu');
    search.openShared(name);
    search.form.classSelector.see('Courrier Entrant');

    await I.login('admin');
    search.openMine(name);
    search.savedSearch.dontShareTo('Paul Hution');

    await I.login('phu');
    search.openSharedSearchMenu();
    sidemenu.dontSeeTab(name);

    await I.login('admin');
    search.openMine(name);
    doDelete(name, search, sidemenu);
}).tag('storedSearch').tag('user').tag('apeTest');

Scenario('I save a search and share it to a user, then delete it, and verify that the user can not see it anymore', async ({ search, sidemenu }) => {
    var name = data.faker.lorem.words();
    save(name, search, sidemenu);
    search.openMine(name);
    search.savedSearch.shareTo('User', 'phu', 'Paul Hution');

    await I.login('phu');
    search.openShared(name);
    search.form.classSelector.see('Courrier Entrant');

    await I.login('admin');
    search.openMine(name);
    doDelete(name, search, sidemenu);

    await I.login('phu');
    search.openSharedSearchMenu();
    sidemenu.dontSeeTab(name);
}).tag('storedSearch').tag('user');

// Scenario('I save a search then share it to a group, then stop sharing it, and delete it', async (search, sidemenu) => {
//     var name = data.faker.lorem.words();
//     save(name, search, sidemenu);
//     search.openMine(name)
//     search.savedSearch.shareTo('Group', 'All domain users', 'All domain users');

//     await I.login('phu');
//     
//     search.openSharedSearchMenu();
//     sidemenu.dontSeeTab(name);

//     await I.login('admin');
//     search.savedSearch.dontShareTo('All domain users');
//     doDelete(name, search, sidemenu);
// }).tag('storedSearch').tag('group');

Scenario('I save a search then share it to a team, then stop sharing it, and delete it', async ({ search, sidemenu }) => {
    var name = data.faker.lorem.words();
    save(name, search, sidemenu);
    search.openMine(name)
    search.savedSearch.shareTo('Team', 'Arondor', 'Arondor');

    await I.login('phu');
    search.openShared(name);
    search.form.classSelector.see('Courrier Entrant');

    await I.login('admin');
    search.openMine(name);
    search.savedSearch.dontShareTo('Arondor');

    await I.login('phu');
    search.openSharedSearchMenu();
    sidemenu.dontSeeTab(name);

    await I.login('admin');
    search.openMine(name);
    doDelete(name, search, sidemenu);
}).tag('storedSearch').tag('team');

Scenario('I save a search then share it to a user, then update it, and verify that the user see the updated search, then delete it', async ({ search, sidemenu }) => {
    var name = data.faker.lorem.words();
    save(name, search, sidemenu);
    search.openMine(name);
    search.savedSearch.shareTo('User', 'phu', 'Paul Hution');
    update(search);

    await I.login('phu');
    search.openShared(name);
    search.form.classSelector.see('Courrier Entrant');
    search.form.seeCriterion('CanalEntree', 'Email');

    await I.login('admin');
    search.openMine(name);
    doDelete(name, search, sidemenu);
}).tag('storedSearch').tag('update');

// Scenario('I save a search then share it to a user, and verify that the user can\'t update it, or rename it, or delete it', async (search, sidemenu) => {
//     var name = data.faker.lorem.words();
//     save(name, search, sidemenu);
//     search.openMine(name)
//     search.savedSearch.shareTo('User', 'phu', 'Paul Hution');
//     search.savedSearch.seeAction('#saveSearch');
//     search.savedSearch.seeAction('#renameSearch');
//     search.savedSearch.seeAction('#deleteSearch');

//     await I.createIncognitoBrowser();
//     await I.login('phu');
//     
//     search.openShared(name);
//     search.form.classSelector.see('Courrier Entrant');
//     search.savedSearch.dontSeeAction('#saveSearch');
//     search.savedSearch.dontSeeAction('#renameSearch');
//     search.savedSearch.dontSeeAction('#deleteSearch');

//     await I.goToPage(0);
//     doDelete(name, search, sidemenu);
// }).tag('storedSearch').tag('actions');

Scenario('I have a shared search and see other recipients.', async ({ search, sidemenu }) => {
    var name = data.faker.lorem.words();
    save(name, search, sidemenu);
    search.openMine(name);
    search.savedSearch.shareTo('User', 'phu', 'Paul Hution');

    await I.login('phu');
    search.openShared(name);
    search.form.classSelector.see('Courrier Entrant');
    search.savedSearch.seeAction('#shareSearch');
    search.savedSearch.seeShareTo('Administrateur');

    await I.login('admin');
    search.openMine(name);
    doDelete(name, search, sidemenu);
}).tag('storedSearch').tag('recipient');

// Scenario('I have a shared search and cannot update its recipients.', async (search, sidemenu) => {
//     var name = data.faker.lorem.words();
//     save(name, search, sidemenu);
//     search.openMine(name)
//     search.savedSearch.shareTo('User', 'phu', 'Paul Hution');

//     await I.createIncognitoBrowser();
//     await I.login('phu');
//     
//     search.openShared(name);
//     search.form.classSelector.see('Courrier Entrant');
//     search.savedSearch.seeAction('#shareSearch');
//     search.savedSearch.seeShareTo('Administrateur');
//     search.savedSearch.cantStopShareTo('Administrateur');

//     await I.goToPage(0);
//     doDelete(name, search, sidemenu);
// }).tag('storedSearch').tag('recipient');

Scenario('I try to save a search without labels, then I see a disabled save button ', async ({ search }) => {
    save("", search);
    search.savedSearch.seeDisabled('#validate');
}).tag('storedSearch').tag('validation');

Scenario('I save a search , then rename it without a label , then I cannot save it ', async ({ search, sidemenu }) => {
    var name = data.faker.lorem.words();
    save(name, search);
    search.openMine(name);
    search.savedSearch.rename('');
    search.savedSearch.seeDisabled('#validate');
    search.savedSearch.cancel();

    doDelete(name, search, sidemenu);
}).tag('storedSearch').tag('validation');

Data(data.categories()).Scenario('Given a stored search, when I update category and refresh page, then I see previously selected category', async ({ I, search, current }) => {
    search.openMine('storedSearch');
    search.form.category.select(current.label);
    search.form.launchQuick('');
    search.results.waitForTable();

    I.refreshPage();
    search.results.waitForTable();

    await search.form.category.see(current.label);
}).tag('navigation').tag('storedSearch');

function save(name, search) {
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.classSelector.select('Courrier Entrant');
    search.savedSearch.open();
    search.savedSearch.save(name);
}

function update(search) {
    search.form.selectFreeCriterionOperator('CanalEntree', 'EQUALS_TO');
    search.form.fillListCriterion('CanalEntree', 'Email');
    search.form.launchSearch();
    search.savedSearch.open();
}

function doDelete(name, search, sidemenu) {
    search.savedSearch.delete();
    sidemenu.dontSeeTab(name);
}

