//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Favorites / Task');

Scenario('Given that I bookmarked a task, when I open right bar, then I see icon from task class', async ({ I, task, rightBar }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.form.bookmark();
    I.goBack();
    await rightBar.open();
    rightBar.see('2-A traiter', "favorites", '.fa.fa-hand-pointer');
  
    rightBar.openFavorite('2-A traiter');
    task.waitForOpen();
    task.form.unbookmark();
}).tag('favorites');

Scenario('Given that I bookmarked a task without icon for its task class, when I open right bar, then I see default task icon', async ({ I, task, rightBar, data }) => {
    const userId = 'phu';
    const material = data.randomElement(data.material);
    order = { "userName": userId, 'material': material }
    await I.sendOrder(order);

    task.open(order.id);

    task.form.bookmark();
    await rightBar.open();
    rightBar.see('manager_approval', "favorites", '.fab.fa-stumbleupon');
  
    rightBar.openFavorite('manager_approval');
    task.waitForOpen();
    task.form.unbookmark();
});

