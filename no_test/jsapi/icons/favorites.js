//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('JSAPI / Icon / Rightbar / Favorites');

Scenario('Given a bookmarked task with custom icon for task class, when I open right bar, then I see custom icon', async ({ I, utils, task, rightBar }) => {
    utils.jsapi.icon.addForClass('GEC_Step2_ATraiter', 'fa fa-search');
    let mail = await I.haveMail(true);
    await task.open(mail.task);

    task.form.bookmark();
    I.goBack();
    await rightBar.open();
    rightBar.see('2-A traiter', "favorites", '.fa.fa-search');
    rightBar.openFavorite('2-A traiter');

    task.waitForOpen();
    task.form.unbookmark();
}).tag('favorites').tag('icon').tag('jsapi');

Scenario('Given a bookmarked task with custom icon for tag value, when I open right bar, then I see custom icon', async ({ I, utils, task, rightBar }) => {
    let mail = await I.haveMail(true);
    utils.jsapi.icon.addForTag('fa fa-search', 'ServiceDestinataire', mail.routing.service.value);
    await task.open(mail.task);

    task.form.bookmark();
    I.goBack();
    await rightBar.open();
    rightBar.see('2-A traiter', "favorites", '.fa.fa-search');
    rightBar.openFavorite('2-A traiter');

    task.waitForOpen();
    task.form.unbookmark();
}).tag('favorites').tag('icon').tag('jsapi');
