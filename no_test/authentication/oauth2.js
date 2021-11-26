//<reference path="../../steps.d.ts" />
/*
Feature('Authentication / OAuth 2');

Scenario('Login with Google account', async (I) => {
	var scope = await I.getCurrentScope();
	I.amOnPage('/?scope=' + scope);
	I.clearCookie();
	I.amOnPage('/?scope=' + scope);
	I.wait(2);

	I.seeElement('#sso-list .mdi-google');
	I.click('#sso-list .mdi-google');

	fillGoogleForm(I, 'flowerdocs.mail@gmail.com', 'Okidoki3');

	I.amOnPage('/');
	I.checkIsConnected('flowerdocs.mail@gmail.com');
}).tag('login').tag('google');

Scenario('Automatic login with Google account', async (I) => {
	var scope = await I.getCurrentScope();
	I.amOnPage('/?scope=' + scope);
	I.clearCookie();
	I.amOnPage('/?scope=' + scope);
	I.waitForVisible('#form-signin #username', 3);
	I.amOnPage('/?scope=' + scope + '&sso=auto');
	I.wait(2);
	I.checkIsConnected('flowerdocs.mail@gmail.com');
}).tag('login').tag('google');

function fillGoogleForm(I, mail, password) {
	I.wait(3);
	I.waitForVisible('#identifierId', 5);
	I.fillField('#identifierId', mail);
	I.waitForVisible('#identifierNext');
	I.click('#identifierNext');
	I.waitForVisible('input[name="password"]', 5);

	I.wait(5);

	I.fillField('input[name="password"]', password);
	I.click('#passwordNext');

	I.wait(3);
}
*/