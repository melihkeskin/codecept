//<reference path="../../steps.d.ts" />

Feature('Virtual folder / Search display mode');

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