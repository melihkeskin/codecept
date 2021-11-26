//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Process / Camunda');

Scenario('I launch order process ,I see diagram and active task and check it is the second process task ', async ({ I, task, data }) => {
    const userName = data.faker.name.firstName();
    const material = data.randomElement(data.material);
    let order = await I.sendOrder({ "userName": userName, 'material': material });

    await task.open(order.id);
    task.form.seeTitle('manager_approval');
    task.form.seeListTag('.Username .text-value', userName);

    I.click('#diagram');
    task.bpmn.seeDiagram('material_order_process');
    task.bpmn.seeActive('manager_approval');
}).tag('process');

Scenario('I launch order process, the manager disapproved the order, then I see fingerprint task', async ({ I, task, search, data }) => {
    const userName = data.faker.name.firstName();
    const material = data.randomElement(data.material);
    const comment = data.faker.lorem.sentence();
    let order = await I.sendOrder({ "userName": userName, 'material': material });
    task.open(order.id);


    task.form.seeListTag('.Username .text-value', userName);
    task.form.fillTextTag('.Commentaire', comment);
    task.footer.click('#Refuse', "La tâche a été mise à jour avec succès");

    search.openDefault();
    search.form.category.select('Tâche');
    search.form.launchQuick('FingerPrint Order Refused');
    search.results.openFirst();
    task.waitForOpen(false);
    task.form.seeTitle('Fingerprint Order Refused');

    task.form.seeTextTag('.Commentaire', comment);
    task.form.seeListTag('.Username .text-value', userName);
    task.form.seeListTag('.material', material);
    I.click('#diagram');
    task.bpmn.dontSeeActive();
}).tag('process');

Scenario('I launch order process, the manager approved the order, then I see finance_agreement and check_stock tasks have been created and I see the 2 task actives', async ({ I, task, search, data }) => {
    const userName = data.faker.name.firstName();
    const material = data.randomElement(data.material);
    let order = await I.sendOrder({ "userName": userName, 'material': material });

    task.open(order.id);
    task.form.seeListTag('.Username .text-value', userName);
    task.footer.click('#Validate', "La tâche a été mise à jour avec succès");

    search.openDefault();
    search.form.category.select('Tâche');
    search.form.launchQuick('finance_agreement');
    search.results.seeAndOpenFirst('finance_agreement');

    task.waitForOpen(false);
    task.form.seeTitle('finance_agreement');
    task.form.seeListTag('.Username .text-value', userName);
    task.form.cancel();

    search.form.launchQuick('check_stock');
    search.results.seeAndOpenFirst('check_stock');
    task.waitForOpen(false);
    task.form.seeTitle('check_stock');
    task.form.seeListTag('.material', material);
    I.click('#diagram');
    task.bpmn.seeActive('finance_agreement');
    task.bpmn.seeActive('check_stock');
}).tag('process');

Scenario('I launch order process, all tasks have been done, I see a fingerprint has been created', async ({ I, task, search, data, glassPanel }) => {
    const userName = data.faker.name.firstName() + '.' + data.faker.name.lastName();
    const material = data.randomElement(data.material);
    const comment = data.faker.lorem.sentence();
    let order = await I.sendOrder({ "userName": userName, 'material': material });

    task.open(order.id);

    task.footer.click('#Validate', "La réponse Valider a bien été appliquée sur la tâche");

    await I.login('jna');
    let taskId = await I.waitForFoundable('TASK', userName, 'Username', [{ 'name': 'classid', 'value': 'check_stock' }]);
    task.open(taskId);
    task.form.seeTitle('check_stock');
    task.form.fillListTag('.material', 'PC', true);
    task.footer.click('#stock', "La réponse En stock a bien été appliquée sur la tâche");

    await I.login('admin');
    taskId = await I.waitForFoundable('TASK', userName, 'Username', [{ 'name': 'classid', 'value': 'finance_agreement' }]);
    task.open(taskId);
    task.form.seeTitle('finance_agreement');
    task.form.fillTextTag('.Commentaire', comment);
    task.footer.click('#Confirm', "La réponse Confirmer a bien été appliquée sur la tâche");

    taskId = await I.waitForFoundable('TASK', userName, 'Username', [{ 'name': 'classid', 'value': 'order_fingerprint' }]);
    task.open(taskId);
    task.form.seeTitle('Fingerprint Order Computed');
    task.form.seeListTag('.Username .text-value', userName);
    task.form.seeTextTag('.Commentaire', comment);
    task.form.seeListTag('.material', material);
    task.form.seeListTag('.material', 'PC');
}).tag('process');

Scenario('I launch order process ,I do not have right to see diagram and active task ', async ({ I, task, search, data }) => {
    await I.login('admin');
    const userName = data.faker.name.firstName();
    const material = data.randomElement(data.material);
    let order = await I.sendOrder({ "userName": userName, 'material': material });

    task.open(order.id);
    task.footer.click('#Validate', ["La tâche a été mise à jour avec succès", "La réponse Valider a bien été appliquée sur la tâche"]);

    await I.login('jna');
    search.open('.orderSearchTab');
    search.form.launchSearch();
    search.results.openFirst();
    task.form.seeTitle('check_stock');

    I.click('#diagram');
    task.bpmn.dontSeeDiagram('material_order_process');
}).tag('process');