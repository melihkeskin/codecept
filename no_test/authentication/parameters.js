//<reference path="../../steps.d.ts" />

Feature('Authentication / Keep parameters');

Scenario('Given scope URL parameter When I login Then the scope parameter is kept', async ({ I }) => {
	var scope = await I.getCurrentScope();
	I.clearCookie();
	I.amOnPage('/?scope=' + scope);
	I.fillLoginForm('admin', 'okidoki');
	I.wait(2);
	I.checkIsConnected('admin');
	I.seeInCurrentUrl('/?scope=' + scope);
}).tag('login').tag('parameters');

Scenario('Given custom URL parameters When I login Then URL parameters are kepts', async ({ I }) => {
	var scope = await I.getCurrentScope();
	I.clearCookie();
	I.amOnPage('/?scope=' + scope + '&param=value');
	I.fillLoginForm('admin', 'okidoki');
	I.wait(2);
	I.checkIsConnected('admin');
	I.seeInCurrentUrl('/?scope=' + scope + '&param=value');
}).tag('login').tag('parameters');

Scenario('Given custom URL parameters on signin page When I login Then URL parameters are kepts', async ({ I }) => {
	var scope = await I.getCurrentScope();
	I.clearCookie();
	I.amOnPage('/signin?scope=' + scope + '&param=value');
	I.fillLoginForm('admin', 'okidoki');
	I.wait(2);
	I.checkIsConnected('admin');
	I.seeInCurrentUrl('/?scope=' + scope + '&param=value');
}).tag('login').tag('parameters');
