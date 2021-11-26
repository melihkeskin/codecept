//<reference path="../../steps.d.ts" />
Before({ login } => {
    login('admin');
});
Feature('Home / Favorite widget');

Scenario('Given I bookmarked a task with task class without icon, when I am on home page, then I see default icon and task name in favorite widget', async ({ I, task, sidemenu, data }) => {
    const userName = data.faker.name.firstName();
    const material = data.randomElement(data.material);
    let order = await I.sendOrder({ "userName": userName, 'material': material });

    await task.open(order.id);
    task.form.bookmark();

    sidemenu.open('Accueil');
    I.waitForInvisible('.favorite-search-widget .loading', 10);
    I.seeElement('.favorite-search-widget .row .fab.fa-stumbleupon');
    I.waitForText("manager_approval", 10, '.favorite-search-widget .document-name');

    await task.open(order.id);
    task.form.unbookmark();
}).tag('home-widgets').tag('favorites');

Scenario('Given I bookmarked a task with task class with icon, when I am on home page, then I see task class icon and task name in favorite widget', async ({ I, task, sidemenu, data }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.form.bookmark();

    sidemenu.open('Accueil');
    I.waitForInvisible('.favorite-search-widget .loading', 10);
    I.seeElement('.favorite-search-widget .row .fa-hand-pointer');
    I.waitForText("2-A traiter", 10, '.favorite-search-widget .row');

    await task.open(mail.task);
    task.form.unbookmark();
}).tag('home-widgets').tag('favorites');

