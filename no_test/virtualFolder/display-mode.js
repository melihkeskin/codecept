//<reference path="../../steps.d.ts" />

Feature('Virtual folder / Display mode');

Scenario('Given a virtual folder tab when I display search results as thumbnails and I open a bucket then I see thumbnails', async ({ I, sidemenu, browse }) => {
    await I.login('jna');
    sidemenu.open('123654');
    browse.results.switchDisplay();
    browse.left.openFirstLevel('Résiliation', false);
    I.waitForVisible('.response-content .home-card', 30);
}).tag('virtualFolder').tag('display');

Scenario('Given a virtual folder When I display search results as thumbnails And I select another leaf Then I see thumbnails', async ({ I, virtualFolder, data }) => {
    await I.login('admin');
    let mail1 = data.mail();
    mail1.routing = data.routing[2];
    await I.haveMail(true, 'data/simple.pdf', mail1);

    let mail2 = data.mail();
    mail2.routing = data.routing[4];
    mail2.refClient = mail1.refClient;
    await I.haveMail(true, 'data/multi-pages.pdf', mail2);
    await virtualFolder.open(mail1.refClient);

    virtualFolder.switchDisplay();
    virtualFolder.searchResults.waitForTable();
    virtualFolder.searchResults.switchDisplay();
    I.waitForVisible('.response-content .home-card', 30);
    virtualFolder.openFirstLevel("Demande d'information", false);
    I.waitForVisible('.response-content .home-card', 30);
}).tag('virtualFolder').tag('display');

Scenario('Given a virtual folder with thumbnails search displayed mode, when I refresh activity, then I always see thumbnails', async ({ I, virtualFolder, data }) => {
    await I.login('admin');
    let mail1 = data.mail();
    mail1.routing = data.routing[2];
    await I.haveMail(true, 'data/simple.pdf', mail1);
    await virtualFolder.open(mail1.refClient);


    virtualFolder.switchDisplay();
    virtualFolder.searchResults.waitForTable();
    virtualFolder.searchResults.switchDisplay();
    I.waitForVisible('.response-content .home-card', 30);

    I.refreshActivity();

    I.waitForVisible('.response-content .home-card', 30);
}).tag('virtualFolder').tag('display');