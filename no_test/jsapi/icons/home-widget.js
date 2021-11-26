//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('JSAPI / Icon / Home widgets');

Scenario('Given I have icon based on task classid, when I am on Home page, then I see custom icon in search widget', ({ I, utils }) => {
    utils.jsapi.icon.addForClass('GEC_Step2_ATraiter', 'fa fa-search');
    I.refreshActivity();
    I.waitForVisible('.search-widget.pliSearch .row .fa-search', 5);
}).tag('home-widgets').tag('icon').tag('jsapi');

Scenario('Given I have icon based on document classid, when I am on Home page, then I see custom icon in search widget', ({ I, utils }) => {
    utils.jsapi.icon.addForClass('CourrierEntrant', 'fa fa-search');
    I.refreshActivity();
    I.waitForVisible('.search-widget.documentSearch .row .fa-search', 5);
}).tag('home-widgets').tag('icon').tag('jsapi');


Scenario('Given I have icon based on task classid, when I am on Home page, then I see custom icon in favorite widget', async ({ I, utils, sidemenu, task }) => {
    utils.jsapi.icon.addForClass('GEC_Step2_ATraiter', 'fa fa-search');
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.form.bookmark();

    sidemenu.open('Accueil');
    I.waitForInvisible('.favorite-search-widget .loading', 10);
    I.waitForText("2-A traiter", 10, '.favorite-search-widget .document-name');
    I.seeElement('.favorite-search-widget .row  .fa.fa-search');

    await task.open(mail.task);
    task.form.unbookmark();
}).tag('home-widgets').tag('favorites').tag('icon').tag('jsapi');

Scenario('Given I have icon based on tag value, when I am on Home page, then I see custom icon in favorite widget', async ({ I, utils, sidemenu, task }) => {
    let mail = await I.haveMail(true);
    utils.jsapi.icon.addForTag('fa fa-search', 'TypeCourrier', mail.routing.type.value);
    await task.open(mail.task);
    task.form.bookmark();

    sidemenu.open('Accueil');
    I.waitForInvisible('.favorite-search-widget .loading', 10);
    I.waitForText("2-A traiter", 10, '.favorite-search-widget .document-name');
    I.seeElement('.favorite-search-widget .row .fa.fa-search');

    await task.open(mail.task);
    task.form.unbookmark();
}).tag('home-widgets').tag('favorites').tag('icon').tag('jsapi');