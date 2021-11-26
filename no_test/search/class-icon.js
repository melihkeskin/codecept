//<reference path="../../steps.d.ts" />
Before({ login } => {
    login('admin');
});

Feature('Search / Icon column');

Scenario('Given a task class without icon, when launch search, then I see default task icon in icon column', async ({ I, task, search, data }) => {
    const userName = data.faker.name.firstName();
    const material = data.randomElement(data.material);
    await I.sendOrder({ "userName": userName, 'material': material });

    search.openDefault();
    search.form.category.select('Tâche');
    search.form.openAdvancedSearch();
    search.form.classSelector.select('EmptyTask');
    search.form.launchSearch();
    search.results.seeIconColumn('.fab.fa-stumbleupon', 1);
});

Scenario('Given a task class with icon, when launch search, then I see task class icon in icon column', async ({ I, task, search, data }) => {
    const userName = data.faker.name.firstName();
    const material = data.randomElement(data.material);
    await I.sendOrder({ "userName": userName, 'material': material });

    search.openDefault();
    search.form.category.select('Tâche');
    search.form.openAdvancedSearch();
    search.form.classSelector.select('Courrier à traiter');
    search.form.launchSearch();
    search.results.seeIconColumn('.fa.fa-hand-pointer', 1);
});
