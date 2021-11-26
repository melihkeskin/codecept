//<reference path="../../steps.d.ts" />

Feature('Authentication / Login');

Scenario('Login with invalid user password', async ({I}) => {
	var scope = await I.getCurrentScope();

	I.amOnPage('/?scope=' + scope);
	I.clearCookie();
	I.amOnPage('/?scope=' + scope);
	I.wait(2);

	I.fillLoginForm('toto', 'abc');
	I.wait(2);
	I.retry().see('F00324', '#msg-signin');
}).tag('login');

Scenario('Login within non-existing scope', async ({I}) => {
	var scope = await I.getCurrentScope();

	I.amOnPage('/?scope=Syldavia');
	I.clearCookie();
	I.amOnPage('/?scope=Syldavia');
	I.wait(2);

	I.fillLoginForm('admin', 'okidoki');
	I.wait(2);
	//I.waitForText('F00324', 5, '#msg-signin');
}).tag('login');
