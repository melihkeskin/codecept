//<reference path="../../steps.d.ts" />
Before({ login } => {
    login('admin');
});

Feature('Indexation / User tag');

Scenario('Given I have a task with USER tag, when it is filled with not existing user id, then user id is displayed', async ({ I, data, task }) => {
    const userId = 'unknownUserId';
    const material = data.randomElement(data.material);
    order = { "userName": userId, 'material': material }
    await I.sendOrder(order, material);

    task.open(order.id);
    task.form.seeListTag(".Username .text-value", userId);
});

Scenario('Given I have a task with USER tag, when it is filled with existing user id, then user displayName is displayed', async ({ I, data, task }) => {
    const userId = 'phu';
    const material = data.randomElement(data.material);
    order = { "userName": userId, 'material': material }
    await I.sendOrder(order);

    task.open(order.id);

    const userDisplayName = 'Paul Hution';
    task.form.seeListTag(".Username", userDisplayName);
})