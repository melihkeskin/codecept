//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Search / Task actions');

Scenario('Given I select one task with missing attachments, when I display contextual menu, then I see open, openExternal, assign, appropriate, delete actions and not answer actions', async ({ I, search }) => {
    await I.haveMail(true);
    await I.haveMail(true);
    search.openDefault();
    search.form.category.select('Tâche');
    search.form.launchQuick('');

    search.results.select(1);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenAction();
    search.results.seeAppropriateAction();
    search.results.seeAssignAction();
    search.results.seeOpenExternalAction();
    search.results.seeDeleteAction();
    search.results.dontSeeAnswerAction('Traiter');
}).tag('search').tag('actions').tag('task');

Scenario('Given I select two tasks with missing attachments, when I display contextual menu, then I see openExternal, assign, appropriate, delete but not answer actions', async ({ I, search }) => {
    await I.haveMail(true);
    await I.haveMail(true);
    search.openDefault();
    search.form.category.select('Tâche');
    search.form.launchQuick('');

    search.results.select(1);
    search.results.select(2);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeAppropriateAction();
    search.results.seeAssignAction();
    search.results.seeOpenExternalAction();
    search.results.seeDeleteAction();
    search.results.dontSeeAnswerAction('Traiter');
}).tag('search').tag('actions').tag('task');

Scenario('Given I select one not reserved and valid task, when I display contextual menu, then I see tasks and answer actions', async ({ I, search, task }) => {
    let mail = await I.haveMail(true);
    task.open(mail.task);
    task.form.seeInvalidTags(0);
    task.attachments.attachNewDocument('.Reponse', 'data/multi-pages.pdf');
    task.form.save();

    search.openDefault();
    search.form.category.select('Tâche');
    search.form.launchQuick('');

    search.results.selectAndShowContextualMenu(1);

    search.results.seeTaskAction('Copie de courrier');
    search.results.seeAnswerAction('Refuser');
    search.results.seeAnswerAction('Ré-assigner');
    search.results.seeAnswerAction('Informer');
    search.results.seeAnswerAction('Traiter');
}).tag('search').tag('actions').tag('task');

Scenario('Given I select one task, when I display contextual menu, then I see task actions for monovalued task', async ({ I, search }) => {
    await I.haveMail(true);

    search.openDefault();
    search.form.category.select('Tâche');
    search.form.launchQuick('');

    search.results.selectAndShowContextualMenu(1);
    search.results.seeTaskAction('Copie de courrier');
}).tag('search').tag('actions').tag('task');

Scenario('Given I select two tasks, when I display contextual menu, then I dont see task actions for monovalued task', async ({ I, search }) => {
    await I.haveMail(true);
    await I.haveMail(true);

    search.openDefault();
    search.form.category.select('Tâche');
    search.form.launchQuick('');

    search.results.select(1);
    search.results.select(2);
    search.results.selectAndShowContextualMenu(1);

    search.results.dontSeeTaskAction('Copie de courrier');
}).tag('search').tag('actions').tag('task');

Scenario('Given I select two valid tasks of same class, when I display contextual menu, then I see answer actions', async ({ I, search, task }) => {
    let mail1 = await I.haveMail(true);
    let mail2 = await I.haveMail(true);

    task.open(mail1.task);
    task.form.seeInvalidTags(0);
    task.attachments.attachNewDocument('.Reponse', 'data/multi-pages.pdf');
    task.form.save();
    await I.waitForFoundable('TASK', mail1.task);

    task.open(mail2.task);
    task.form.seeInvalidTags(0);
    task.attachments.attachNewDocument('.Reponse', 'data/multi-pages.pdf');
    task.form.save();
    await I.waitForFoundable('TASK', mail2.task);

    search.openDefault();
    search.form.category.select('Tâche');
    search.form.launchQuick('');

    search.results.select(1);
    search.results.select(2);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeAnswerAction('Refuser');
    search.results.seeAnswerAction('Ré-assigner');
    search.results.seeAnswerAction('Informer');
    search.results.seeAnswerAction('Traiter');
}).tag('search').tag('actions').tag('task');

Scenario('Given I select one valid task reserved by another user, when I display contextual menu, then I see open, openExternal and not delete and answers actions', async ({ I, search, task, utils }) => {
    let mail = await I.haveMail(true);
    search.openDefault();
    search.form.category.select('Tâche');
    search.form.launchQuick('');
    task.open(mail.task);
    task.form.seeInvalidTags(0);
    task.attachments.attachNewDocument('.Reponse', 'data/multi-pages.pdf');
    task.form.save();
    utils.rest.reserve('task', mail.task);

    await I.login('jna');
    search.openShared('storedSearch');
    search.form.category.select('Tâche');
    search.form.launchQuick('');
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenAction();
    search.results.seeOpenExternalAction();
    search.results.dontSeeDeleteAction();
    search.results.dontSeeAnswerAction('Traiter');
}).tag('search').tag('actions').tag('task');

Scenario('Given I select one valid task reserved by me, then I see open, openExternal, assign, approriate, delete and answer actions', async ({ I, search, task, utils }) => {
    let mail = await I.haveMail(true);
    task.open(mail.task);
    task.form.seeInvalidTags(0);
    task.attachments.attachNewDocument('.Reponse', 'data/multi-pages.pdf');
    task.form.save();
    utils.rest.reserve('task', mail.task);

    search.openDefault();
    search.form.category.select('Tâche');
    search.form.launchQuick(mail.refClient);
    search.results.selectAndShowContextualMenu(1);

    search.results.seeOpenAction();
    search.results.seeAppropriateAction();
    search.results.seeAssignAction();
    search.results.seeOpenExternalAction();
    search.results.seeDeleteAction();
    search.results.seeAnswerAction('Traiter');
}).tag('search').tag('actions').tag('task');

Scenario('Given I select one not reserved task with invalid mandatory tag, when I display contextual menu, then I do not see answers actions', async ({ I, search, task, data }) => {
    const userName = data.faker.name.firstName() + '.' + data.faker.name.lastName();
    const material = data.randomElement(data.material);
    let order = await I.sendOrder({ "userName": userName, 'material': material });

    task.open(order.id);

    task.footer.click('#Validate', "La réponse Valider a bien été appliquée sur la tâche");

    search.openDefault();
    search.form.category.select('Tâche');
    search.form.openAdvancedSearch();
    search.form.classSelector.select('finance_agreement');
    search.form.launchQuick('');

    search.results.selectAndShowContextualMenu(1);
    search.results.dontSeeAnswerAction('Refuser');
    search.results.dontSeeAnswerAction('Confirmer');
}).tag('search').tag('actions').tag('task');
