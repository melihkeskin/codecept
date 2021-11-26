//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Navigation / Breadcrumb');

Scenario("I navigate from Home to Search and document tabs then see breadcrumb", async ({ I, search, browse }) => {
    browse.breadcrumb.see(['Accueil']);
    search.openDefault();
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Recherche']);

    let doc = await I.createAndOpenDocument({ 'file': 'data/simple.pdf' });
    browse.breadcrumb.see(['Recherche', doc.name]);

    search.openDefault();
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Recherche']);

    search.form.searchById(doc.id);
    I.waitForGlassPanelHidden();
    search.results.seeAndOpenFirst(doc.name);
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Recherche', doc.name]);
});

Scenario("Given I am in document indexation, when I navigate to a bookmarked component, then I see cleared breadcrumb with only bookmarked component name", async ({ I, document, rightBar, browse }) => {
    let bookmarked = await I.createAndOpenDocument();
    document.form.bookmark();
    I.goBack();
    I.refreshPage();
    I.waitForGlassPanelHidden();

    let notBookmarked = await I.createAndOpenDocument();
    browse.breadcrumb.see(["Accueil", notBookmarked.name]);

    await rightBar.open();
    rightBar.see(bookmarked.name, "favorites");
    rightBar.openFavorite(bookmarked.name);

    browse.breadcrumb.see([bookmarked.name]);
    document.form.unbookmark();
}).tag('favorite');

Scenario("Given I am in document indexation, when I navigate through task tracking, then I see task name appended to breadcrumb", async ({ I, document, task, rightBar, browse }) => {
    let mail = await I.haveMail(true);
    await document.open(mail.id);

    browse.breadcrumb.see(["Accueil", mail.name]);

    document.smartActions.openSub('#read_task_history');
    I.waitForElement('.component-history .timeline-item .item-description');
    I.click('.component-history .timeline-item .item-description a');

    browse.breadcrumb.see(["Accueil", mail.name, '2-A traiter']);
}).tag('taskTracking');

Scenario('I navigate from Home to document and its parent folder tabs then see breadcrumb', async ({ I, search, browse, document, folder }) => {
    browse.breadcrumb.see(['Accueil']);
    search.openDefault();
    browse.breadcrumb.see(['Recherche']);

    let mail = await I.haveMail(true);
    search.form.searchById(mail.id);
    I.waitForGlassPanelHidden();
    search.results.seeAndOpenFirst(mail.name);
    browse.breadcrumb.see(['Recherche', mail.name]);

    let today = new Date();
    document.form.openParentFolder(today.getUTCDate());
    browse.breadcrumb.see(['Parcourir', 'Courriers', today.getFullYear(), today.getMonth() + 1, today.getUTCDate()]);

    folder.documents.results.openFirst();
    I.waitForInvisible('Parcourir');
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Recherche', mail.name]);
});

Scenario('I navigate from Home to an end folder and open a document in it then see the complete breadcrumb, then I return and see the complete folder breadcrumb without document title', async ({ I, search, browse, document, folder }) => {
    browse.breadcrumb.see(['Accueil']);
    search.openDefault();
    browse.breadcrumb.see(['Recherche']);

    let today = new Date();
    let mail = await I.haveMail(true);

    search.form.category.select("Dossier");
    search.form.launchQuick("Courriers");
    I.waitForGlassPanelHidden();
    search.results.openFirst();
    I.waitForGlassPanelHidden();

    browse.breadcrumb.see(['Parcourir', 'Courriers']);

    folder.select(0, today.getFullYear());
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Parcourir', 'Courriers', today.getFullYear()]);

    folder.select(1, today.getMonth() + 1);
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Parcourir', 'Courriers', today.getFullYear(), today.getMonth() + 1]);

    const date = today.getUTCDate().toString();
    folder.folders.openSubFolder(date);
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Parcourir', 'Courriers', today.getFullYear(), today.getMonth() + 1, today.getUTCDate()]);

    search.results.openFirst();
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Parcourir', 'Courriers', today.getFullYear(), today.getMonth() + 1, today.getUTCDate(), mail.name]);

    document.footer.click('#cancel');
    browse.breadcrumb.see(['Parcourir', 'Courriers', today.getFullYear(), today.getMonth() + 1, today.getUTCDate()]);
});

Scenario('I navigate through folder leaves and open a document in it then see the complete breadcrumb, then I return and see parent folder breadcrumb without leaves', async ({ I, search, browse, document, folder }) => {
    browse.breadcrumb.see(['Accueil']);
    search.openDefault();
    browse.breadcrumb.see(['Recherche']);

    let today = new Date();
    let mail = await I.haveMail(true);

    search.form.category.select("Dossier");
    search.form.launchQuick("Courriers");
    I.waitForGlassPanelHidden();
    search.results.openFirst();
    I.waitForGlassPanelHidden();

    browse.breadcrumb.see(['Parcourir', 'Courriers']);

    folder.select(0, today.getFullYear());
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Parcourir', 'Courriers', today.getFullYear()]);

    folder.select(1, today.getMonth() + 1);
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Parcourir', 'Courriers', today.getFullYear(), today.getMonth() + 1]);

    folder.select(2, today.getUTCDate());
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Parcourir', 'Courriers', today.getFullYear(), today.getMonth() + 1, today.getUTCDate()]);

    search.results.openFirst();
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Parcourir', 'Courriers', today.getFullYear(), today.getMonth() + 1, today.getUTCDate(), mail.name]);

    document.footer.click('#cancel');
    browse.breadcrumb.see(['Parcourir', 'Courriers']);
});

Scenario('I open a virtual folder then I switch to table display, and open a document then see the complete breadcrumb, then I return and see the complete virtual folder bread crumb without document title', async ({ I, virtualFolder, browse, searchResults, document }) => {
    browse.breadcrumb.see(['Accueil']);

    let mail = await I.haveMail(true);
    await virtualFolder.open(mail.refClient);
    const virtualFolderName = mail.refClient + " - " + mail.lastName + " " + mail.firstName;
    browse.breadcrumb.see(['Accueil', virtualFolderName, mail.routing.type.label]);

    virtualFolder.switchDisplay();
    searchResults.waitForTable();
    searchResults.seeAndOpenFirst(mail.object);
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Accueil', virtualFolderName, mail.routing.type.label, mail.name]);

    document.footer.click('#cancel');
    browse.breadcrumb.see(['Accueil', virtualFolderName, mail.routing.type.label]);
});

Scenario('I navigate to a virtual folder and open a task in it , then open a document in it, then see the complete breadcrumb, then I return and see the complete virtual folder and task bread crumb without document title, then I return and see the complete virtual folder bread crumb without task or document title.', async ({ I, sidemenu, browse, searchResults, task, document }) => {
    browse.breadcrumb.see(['Accueil']);

    let mail = await I.haveMail(true);
    sidemenu.open('Tous les courriers');
    I.waitForGlassPanelHidden();
    const taskClass = 'A traiter';
    const taskTitle = '2-A traiter';
    browse.left.openSecondLevel(mail.routing.service.label, taskClass);
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Tous les courriers', mail.routing.service.label, taskClass]);

    searchResults.seeAndOpenFirst(mail.object);
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Tous les courriers', mail.routing.service.label, taskClass, taskTitle]);

    task.attachments.editAttachment('.Courrier');
    browse.breadcrumb.see(['Tous les courriers', mail.routing.service.label, taskClass, taskTitle, mail.name]);

    document.footer.click('#cancel');
    browse.breadcrumb.see(['Tous les courriers', mail.routing.service.label, taskClass, taskTitle]);

    task.footer.click('#cancel');
    browse.breadcrumb.see(['Tous les courriers', mail.routing.service.label, taskClass]);
});

Scenario('I navigate to a virtual folder and its parent folder then see bread crumb without virtual folder path or title, then I go back and see virtual folder breadcrumb only.', async ({ I, virtualFolder, browse, document }) => {
    browse.breadcrumb.see(['Accueil']);

    let mail = await I.haveMail(true);
    await virtualFolder.open(mail.refClient);
    const virtualFolderName = mail.refClient + " - " + mail.lastName + " " + mail.firstName;
    browse.breadcrumb.see(['Accueil', virtualFolderName, mail.routing.type.label]);

    document.form.openParentFolder('Clients');
    browse.breadcrumb.see(['Parcourir', 'Clients']);

    I.pageGoBack();
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Accueil', virtualFolderName, mail.routing.type.label]);
});

Scenario('I navigate from Home to default search and document, then I navigate to another search , then I navigate to another search, then I go back twice, and I see the default search and document breadcrumb.', async ({ I, search, data, browse }) => {
    browse.breadcrumb.see(['Accueil']);
    search.openDefault();
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Recherche']);

    let doc = await I.createAndOpenDocument({ 'file': 'data/simple.pdf' });
    browse.breadcrumb.see(['Recherche', doc.name]);

    search.open('.dossierClientSearchTab');
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Dossiers Clients']);

    search.open('.documentSearchTab');
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Courriers reçus']);

    I.pageGoBack();
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Dossiers Clients']);

    I.pageGoBack();
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Recherche', doc.name]);
});

Scenario('I navigate from Home to default search and document, then I open a virtual folder twice, and I go back twice, then I see the default search and document breadcrumb.', async ({ I, search, data, browse, sidemenu }) => {
    browse.breadcrumb.see(['Accueil']);
    search.openDefault();
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Recherche']);

    let doc = await I.createAndOpenDocument({ 'file': 'data/simple.pdf' });
    browse.breadcrumb.see(['Recherche', doc.name]);

    let mail = await I.haveMail(true);
    sidemenu.open('Tous les courriers');
    I.waitForGlassPanelHidden();
    const taskClass = 'A traiter';
    browse.left.openSecondLevel(mail.routing.service.label, taskClass);
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Tous les courriers', mail.routing.service.label, taskClass]);

    sidemenu.open('Tous les courriers');
    I.waitForGlassPanelHidden();
    browse.left.openSecondLevel(mail.routing.service.label, taskClass);
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Tous les courriers', mail.routing.service.label, taskClass]);

    I.pageGoBack();
    I.pageGoBack();
    I.waitForGlassPanelHidden();
    browse.breadcrumb.see(['Recherche', doc.name]);
});

// Scenario('I open a document from the home page, I see home in breadcrumb, then I open default search and reopen this document, I see correct breadcrumb', async (I, search, data, browse, sidemenu) => {
//     browse.breadcrumb.see(['Accueil']);
//     const name = data.faker.system.commonFileName();
//     await I.createAndOpenDocument(name, 'data/simple.pdf');
//     browse.breadcrumb.see(['Accueil', name]);

//     search.openDefault();
//     search.results.openFirst();
//     browse.breadcrumb.see(['Recherche', name]);
// });

