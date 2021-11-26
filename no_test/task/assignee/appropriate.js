//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('phu');
});

Feature('Task / Appropriation');

Scenario('I open an invalid task then appropriate it then see save action', async ({ I, login, task, data }) => {
    await I.login('phu');
    let envelope = await I.haveEnvelope(data.envelope());
    await task.open(envelope.id);
    task.footer.dontSee('#saveAndQuit');

    I.scrollTo('#InfoEEnvelope');
    task.smartActions.openSub("#appropriate");
    I.waitForGlassPanelHidden();
    task.footer.seeEnabled('#saveAndQuit');
    task.smartActions.dontSee("#appropriate");
}).tag('task').tag('appropriate');

Scenario('I search an invalid task then appropriate it then see save action', async ({ I, task, data, browse }) => {
    let customer = await I.haveCustomerFolder();
    let envelope = data.envelope();
    envelope.refClient = customer.id;
    envelope = await I.haveEnvelope(envelope, true);
    browse.menu.open('e-Enveloppes');
    browse.left.openFirstLevel(envelope.routing.service.label);
    browse.results.seeFirst(envelope.refClient);

    browse.results.selectAndShowContextualMenu(1);
    browse.results.contextualMenu.click('M\'assigner');

    await task.open(envelope.id);
    I.scrollTo('#InfoEEnvelope');
    task.footer.seeEnabled('#saveAndQuit');
    task.smartActions.dontSee("#appropriate");
}).tag('task').tag('appropriate');

Scenario('I appropriate a task then see save and answer actions', async ({ I, browse, task, notification }) => {
    let customer = await I.haveCustomerFolder(true);

    launchVerification(I, browse, customer);
    browse.results.clickFooterAction("Créer une enveloppe", ".envelope-search");
    restoreInitialBrowse(browse);
    I.waitForGlassPanelHidden();

    task.attachments.attachNewDocument('.Attachment1', 'data/multi-pages.pdf');
    task.attachments.attachNewDocument('.Attachment2', 'data/multi-pages.pdf');

    task.footer.click('#Initiate');
    task.reasonedAnswer.waitForShow();
    task.reasonedAnswer.click('#Envoyer');
    notification.waitForVisible('La tâche a été créée avec succès.', 5);
    I.waitForGlassPanelHidden();

    await I.waitForFoundable('TASK', customer.ref, 'RefClient');
    launchVerification(I, browse, customer);
    I.waitForGlassPanelHidden();
    browse.results.dontSee("Moi", 1);

    browse.results.openFirst();
    restoreInitialBrowse(browse)

    I.waitForGlassPanelHidden();

    I.scrollTo('#InfoEEnvelope');
    task.smartActions.openSub("#appropriate");
    task.footer.seeEnabled('#saveAndQuit');
    task.footer.seeEnabled('#Terminate');
}).tag('task').tag('appropriate').tag('verification');

function launchVerification(I, browse, customer) {
    browse.menu.open('e-Enveloppes');
    browse.results.clickFooterAction("Créer une e-Enveloppe");

    browse.form.root = '.envelope-search .search-criteria';
    browse.results.resultsBody = '.envelope-search .search-results-container .table-responsive tbody'
    I.wait(1);
    browse.form.fillListCriterion("ServiceDestinataire", 'Commerce', true);
    browse.form.fillListCriterion("workflow", "Demande d'adhésion", true);
    browse.form.fillListCriterion("RefClient", customer.ref, true);
    browse.form.launchSearch("Vérifier");
}

function restoreInitialBrowse(browse) {
    browse.form.root = '.search-criteria';
    browse.results.resultsBody = '.search-results-container .table-responsive tbody';
}