//<reference path="../../steps.d.ts" />

Feature('Authentication / Legacy URLs');

Scenario('I open old page /login.jsp then I am redirected to /signin', async ({ I }) => {
    var scope = await I.getCurrentScope();

    I.amOnPage('/login.jsp?scope=' + scope);

    I.seeInCurrentUrl('/signin?scope=' + scope);
}).tag('login');

Scenario('I open old page /FlowerDocs.jsp then I am redirected to /signin', async ({ I }) => {
    var scope = await I.getCurrentScope();
    I.amOnPage('/FlowerDocs.jsp?scope=' + scope);
    await I.login('admin');
    I.seeInCurrentUrl('/?scope=' + scope);
}).tag('login');

Scenario('As authenticated user, I open old page /FlowerDocs.jsp then I am redirected to /', async ({ I }) => {
    await I.login('admin');
    var scope = await I.getCurrentScope();
    I.amOnPage('/FlowerDocs.jsp?scope=' + scope);

    I.seeInCurrentUrl('/');
}).tag('login');
