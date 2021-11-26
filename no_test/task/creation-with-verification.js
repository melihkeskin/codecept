//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Task / Creation with verification');

Scenario('I search without results then I can create a task', async ({ I, browse, data }) => {
    let customer = await I.haveCustomerFolder();
    let envelope = data.envelope();
    envelope.refClient = customer.ref;

    openAndFillEEnvelopeForm(browse, I, envelope);

    browse.form.launchSearch("Vérifier");

    browse.results.seeContent("Aucun résultat n'a été trouvé.");
    browse.results.clickFooterAction("Créer une enveloppe", ".envelope-search");

    restoreInitialBrowse(browse);
}).tag('task').tag('verification');

Scenario('I search with results then I cannot create task', async ({ I, browse, data }) => {
    let customer = await I.haveCustomerFolder();
    let envelope = data.envelope();
    envelope.refClient = customer.ref;
    await I.haveEnvelope(envelope, true);

    openAndFillEEnvelopeForm(browse, I, envelope);

    browse.form.launchSearch("Vérifier");
    I.waitForGlassPanelHidden();
    browse.results.dontSeeContent("Aucun résultat n'a été trouvé.");
    browse.results.seeFirst(envelope.refClient);
    restoreInitialBrowse(browse);

    I.dontSeeElement(".envelope-search #create-component[title='Créer une enveloppe']");
}).tag('task').tag('verification');

function openAndFillEEnvelopeForm(browse, I, envelope) {
    browse.menu.open('e-Enveloppes');
    browse.results.waitForTable();
    browse.results.clickFooterAction("Créer une e-Enveloppe");

    browse.form.root = '.envelope-search .search-criteria';
    browse.results.resultsBody = '.envelope-search .search-results-container .table-responsive tbody'
    browse.results.container = '.envelope-search .search-results-container'

    I.waitForGlassPanelHidden();
    browse.form.fillListCriterion("ServiceDestinataire", envelope.routing.service.label, true);
    browse.form.fillListCriterion("workflow", envelope.workflow.label, true);

    I.executeScript(function (refClient) {
        JSAPI.get().getSearchFormAPI().setObjectValue("RefClient", refClient);
    }, envelope.refClient);
}

function restoreInitialBrowse(browse) {
    browse.form.root = '.search-criteria'
    browse.results.resultsBody = '.search-results-container .table-responsive tbody'
    browse.results.container = '.search-results-container'
}