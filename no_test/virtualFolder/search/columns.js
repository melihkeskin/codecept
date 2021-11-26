//<reference path="../../steps.d.ts" />

Feature('VirtualFolder / Search columns');

Before({ login } => {
    login('admin');
});

var column = 'Date de mise à jour';

Scenario('Given I display a new column in a VF tab with aggregation, when I change bucket, then I still see added column', ({ browse, I, sidemenu }) => {
    sidemenu.open('Tous les courriers');
    browse.waitForOpen();

    browse.left.openFirstLevel('Commerce', false);
    browse.results.addColumn(column);

    browse.left.openFirstLevel('Juridique', false);
    browse.results.seeColumn(column);
}).tag('virtualFolder').tag('columns')

Scenario('Given I display a new column in a VF tab with aggregation, when I came back to VF tab after refresh, then I see added column on all buckets', ({ browse, I, sidemenu }) => {
    sidemenu.open('Tous les courriers');
    browse.waitForOpen();

    browse.left.openFirstLevel('Commerce', false);
    browse.results.addColumn(column);

    sidemenu.open('Accueil');
    I.refreshPage();

    sidemenu.open('Tous les courriers');
    browse.waitForOpen();

    browse.left.openFirstLevel('Commerce', false);
    browse.results.seeColumn(column);

    browse.left.openFirstLevel('Juridique', false);
    browse.results.seeColumn(column);
}).tag('virtualFolder').tag('columns')

Scenario('Given I display a new column in a VF tab without aggregation, when I change tab and refresh then go to VF tab, I still see added column', async ({ sidemenu, I, search, task }) => {
    I.login('jna');
    let mail = await I.haveMail(true);
    await task.assign(mail.task, 'jna');
    await I.waitForFoundable('TASK', mail.task, 'id_value', [{ 'name': 'assignee', 'value': 'jna' }]);


    sidemenu.open('Mes courriers sans agrégations');

    search.results.waitForTable();
    search.results.addColumn(column);
    sidemenu.open('Accueil');

    I.refreshPage();
    sidemenu.open('Mes courriers sans agrégations');

    search.results.waitForTable();
    search.results.seeColumn(column);
}).tag('virtualFolder').tag('columns').tag('assign')


Scenario('Given I display a new column in a VF, when I change bucket, then I still see added column', ({ virtualFolder, sidemenu, I }) => {
    virtualFolder.open('123456');
    virtualFolder.switchToTable();
    virtualFolder.searchResults.addColumn(column);

    virtualFolder.openFirstLevel("Demande d'information", false);
    virtualFolder.searchResults.seeColumn(column);
}).tag('virtualFolder').tag('columns')

Scenario('Given I display a new column in a VF, when I came back to VF tab after refresh, then I see added column on all buckets', ({ virtualFolder, sidemenu, I }) => {
    virtualFolder.open('123456');
    virtualFolder.switchToTable();
    virtualFolder.searchResults.addColumn(column);

    sidemenu.open('Accueil');
    I.refreshPage();

    virtualFolder.open('123456');
    virtualFolder.switchToTable();
    virtualFolder.searchResults.seeColumn(column);

    virtualFolder.openFirstLevel("Demande d'information", false);
    virtualFolder.searchResults.seeColumn(column);
}).tag('virtualFolder').tag('columns')

