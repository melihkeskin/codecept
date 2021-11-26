//<reference path="../../steps.d.ts" />

Feature('Authentication / Phishing');

Scenario('I try to redirect user on Google page after login, then user is redirected to Flower', async ({ I }) => {
	var scope = await I.getCurrentScope();
	I.amOnPage('/signin?scope=' + scope + '&targetURL=https://google.fr');
	I.clearCookie();
	I.amOnPage('/signin?scope=' + scope + '&targetURL=https://google.fr');
	I.wait(2);

	I.fillLoginForm('admin', 'okidoki');
	I.wait(2);
	I.checkIsConnected('admin');
}).tag('login').tag('security');

Scenario('I try to redirect user on Google page on logout, then user is redirected to signin page', async ({ I }) => {
	await I.login('admin');
	var scope = await I.getCurrentScope();
	I.amOnPage('/j_spring_security_logout?scope=' + scope + '&targetURL=https://google.com')
	I.seeInCurrentUrl('/signin?scope=' + scope);
}).tag('login').tag('security');

Scenario('I try to inject JS to redirect on Google using error_description parameter and stay on login page', async ({ I }) => {
	var scope = await I.getCurrentScope();
	I.amOnPage('/signin?scope=' + scope);
	I.clearCookie();
	I.amOnPage('/signin?scope=' + scope + '&targetURL=/signin/aaa%0A?scope=' + scope + '&error_description=%22);document.location="https://google.com";//');
	I.wait(2);

	I.seeElement('#form-signin #username');
}).tag('login').tag('security');

Scenario('I try to inject HTML to redirect on Google using scope parameter and stay on login page', async ({ I }) => {
	var scope = await I.getCurrentScope();
	I.amOnPage('/signin?scope=' + scope);
	I.clearCookie();
	I.amOnPage('/signin?scope=' + scope + '"><img src=x onerror=document.location="https://google.com">');
	I.wait(2);

	I.seeElement('#form-signin #username');
}).tag('login').tag('security');
