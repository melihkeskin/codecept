//<reference path="../../steps.d.ts" />   


Feature('Browse / Search display mode');

Scenario('Given a browse tab with thumbnails search displayed mode, when I refresh activity, then I always see thumbnails', async ({ I, sidemenu, browse }) => {
     I.login('admin');
    sidemenu.open('Enveloppes');
    browse.waitForOpen();

    browse.results.waitForTable();
    I.waitForVisible('.icon[title="Afficher les miniatures"]');
    I.click('.icon[title="Afficher les miniatures"]');
    I.waitForVisible('.card-img-top', 10);

    I.refreshPage();
    I.waitForVisible('.card-img-top', 10);
}).tag('virtualFolder').tag('display');