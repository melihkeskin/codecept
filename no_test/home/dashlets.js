//<reference path="../../steps.d.ts" />
Before({ login } => {
    login('admin');
});
Feature('Home / Dashlet');

const faker = require('fakerr');

Scenario('Given I have a LIST dashlet, when I click on document item in dashlet, then I go to selected document indexation activity', async ({ I, search, dashletPopup, sidemenu }) => {
    search.openDefault();
    dashletPopup.openCreationPopup();
    dashletPopup.changeType('LIST');
    dashletPopup.changeStep(2);
    let title = faker.lorem.sentence();
    let description = faker.lorem.sentence();
    dashletPopup.fillFields(title, description, 'name');
    dashletPopup.validate();

    sidemenu.open('Accueil');
    let dashlet = locate('.home-aggregation').withDescendant(locate('.header-title').withText(title));
    I.waitForVisible(dashlet, 20);
    I.scrollTo(dashlet);
    let document = locate('.object-card:nth-child(1) .document-name').inside(dashlet);
    I.waitForVisible(document, 10);
    let documentName = await I.grabTextFrom(document);
    I.click(locate('.object-card:nth-child(1)').inside(dashlet).first());
    I.waitForValue('.title-container .string-input', documentName);
}).tag('dashlets');

Scenario('Given I have a dashlet created from stored search, when I click on dashlet title, then I go to stored search', async ({ I, search, dashletPopup, sidemenu, home }) => {
    search.openMine('storedSearch');
    dashletPopup.openCreationPopup();
    dashletPopup.changeType('LIST');
    dashletPopup.changeStep(2);
    let title = faker.lorem.sentence();
    let description = faker.lorem.sentence();
    dashletPopup.fillFields(title, description, 'ObjetCourrier');
    dashletPopup.validate();

    sidemenu.open('Accueil');
    let dashlet = locate('.home-aggregation').withDescendant(locate('.header-title').withText(title));
    I.waitForVisible(dashlet, 20);
    I.scrollTo(dashlet);
    I.click(locate('.header-title').inside(dashlet));

    search.results.waitForTable();
    I.seeInCurrentUrl('storedSearch');
}).tag('dashlets').tag('storedSearch');

Scenario('Given I have a dashlet created from search with hidden request, when I open search form, then I do not see hidden request in history', async ({ I, search, dashletPopup, sidemenu, home }) => {
    search.open('.pliSearchTab');
    dashletPopup.openCreationPopup();
    dashletPopup.changeType('LIST');
    dashletPopup.changeStep(2);
    let title = faker.lorem.sentence();
    let description = faker.lorem.sentence();
    dashletPopup.fillFields(title, description, 'classid');
    dashletPopup.validate();

    sidemenu.open('Accueil');
    let dashlet = locate('.home-aggregation').withDescendant(locate('.header-title').withText(title));
    I.waitForVisible(dashlet, 20);
    I.scrollTo(dashlet);
    I.click(locate('.header-title').inside(dashlet));

    search.results.waitForTable();
    I.dontSeeInCurrentUrl('GEC_Step');
}).tag('dashlets').tag('hidden');

Scenario('Given I create an DONUT dashlet from default search, when I go to home page, then I see it', async ({ I, search, dashletPopup, sidemenu, home }) => {
    await I.createDocument({}, true);

    search.openDefault();
    dashletPopup.openCreationPopup();
    dashletPopup.goStep2('DONUT');
    let title = faker.lorem.sentence();
    let description = faker.lorem.sentence();
    dashletPopup.fillFields(title, description, 'classid', "DONUT");
    dashletPopup.validate();
    sidemenu.open('Accueil');
    home.seeWidget(title, description, 'DONUT');
    home.deleteDashlet(title);
}).tag('dashlets');

Scenario('Given I create an LIST dashlet from DefaultSearch, when I go to home page, then I see it', async ({ I, search, dashletPopup, sidemenu, home }) => {
    await I.createDocument({}, true);

    search.openDefault();
    dashletPopup.openCreationPopup();
    dashletPopup.goStep2('LIST');
    let title = faker.lorem.sentence();
    let description = faker.lorem.sentence();
    dashletPopup.fillFields(title, description, 'classid', "LIST");
    dashletPopup.validate();
    sidemenu.open('Accueil');
    home.seeWidget(title, description, 'LIST');
    home.deleteDashlet(title);
}).tag('dashlets');

Scenario('Given I create an HISTOGRAM dashlet from DefaultSearch, when I go to home page, then I see it', async ({ I, search, dashletPopup, sidemenu, home }) => {
    await I.createDocument({}, true);

    search.openDefault();
    dashletPopup.openCreationPopup();
    dashletPopup.goStep2('HISTO');
    let title = faker.lorem.sentence();
    let description = faker.lorem.sentence();
    dashletPopup.fillFields(title, description, 'classid', "HISTO");
    dashletPopup.validate();
    sidemenu.open('Accueil');
    I.waitForText(title, 10);
    home.seeWidget(title, description, 'HISTO');
    home.deleteDashlet(title);
}).tag('dashlets');

Scenario('Given an existing dashlet, when I update its title and description, they I see updated value', async ({ I, search, dashletPopup, sidemenu, home }) => {
    search.openDefault();
    dashletPopup.openCreationPopup();
    dashletPopup.goStep2('LIST');
    let title = faker.lorem.sentence();
    let description = faker.lorem.sentence();
    dashletPopup.fillFields(title, description, 'classid', "LIST");
    dashletPopup.validate();
    sidemenu.open('Accueil');
    home.seeWidget(title, description, 'LIST');
    let updatedtitle = faker.lorem.sentence();
    let updateddescription = faker.lorem.sentence();
    home.editDashlet(title, updatedtitle, updateddescription);
    I.waitForInvisible(".glass-panel-icon", 45);
    I.dontSee(title);
    I.waitForText(updateddescription, 2);
    I.waitForText(updatedtitle, 2);
    home.deleteDashlet(updatedtitle);
}).tag('dashlets').tag('fixme');

Scenario('Given I create a dashlet, when I delete it, then do not see it on home page', async ({ I, search, dashletPopup, sidemenu, home }) => {
    await I.createDocument({}, true);

    search.openDefault();
    dashletPopup.openCreationPopup();
    dashletPopup.goStep2('LIST');
    let title = faker.lorem.sentence();
    let description = faker.lorem.sentence();
    dashletPopup.fillFields(title, description, 'classid', "LIST");
    dashletPopup.validate();
    sidemenu.open('Accueil');
    home.seeWidget(title, description, 'LIST');

    home.deleteDashlet(title);
    I.waitForInvisible(".glass-panel-icon", 45);
    I.dontSee(title, '.home-aggregation .header-title ');
}).tag('dashlets');

Scenario('Given a dashlet created with one user, when I am on home page with another user, then I do not see dashlet', async ({ I, search, dashletPopup, login }) => {
    search.openDefault();
    dashletPopup.openCreationPopup();
    dashletPopup.goStep2('LIST');
    let title = faker.lorem.sentence();
    let description = faker.lorem.sentence();
    dashletPopup.fillFields(title, description, 'classid', 'LIST');
    dashletPopup.validate();

    await login('phu');
    I.dontSee(title);
}).tag('dashlets');

Scenario('Given I am creating a DASHLET, when dashlet type is not filled, then I cannot go to step 2', async ({ I, search, dashletPopup }) => {
    search.openDefault();
    dashletPopup.openCreationPopup();
    I.waitForElement('.modal-content .actions button#step2.disabled', 5);
    I.click('.stepper-2 .inactive');
    I.dontSeeElement('.actions #step1');
}).tag('dashlets').tag('validation');

Scenario('Given I am creating an HISTOGRAM dashlet, when one aggregation is missing, then I cannot validate creation', async ({ I, search, dashletPopup }) => {
    search.openDefault();
    dashletPopup.openCreationPopup();
    dashletPopup.changeType('HISTO');
    dashletPopup.changeStep(2);
    dashletPopup.fillFields('', '', 'classid', 'DONUT');
    //validate button has to be disabled
    I.waitForElement('.modal-content .actions button#validate.disabled', 5);
}).tag('dashlets').tag('validation');

Scenario('Given I am creating an DONUT dashlet, when no aggregation has been filled, then I cannot validate creation', async ({ I, search, dashletPopup }) => {
    search.openDefault();
    dashletPopup.openCreationPopup();
    dashletPopup.goStep2('DONUT');
    I.waitForElement('.modal-content .actions button#validate.disabled', 5);
}).tag('dashlets').tag('validation');

