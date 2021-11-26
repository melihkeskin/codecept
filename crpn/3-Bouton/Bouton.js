//<reference path="../../steps.d.ts" />

Feature('Boutton');

const fs = require('fs');
let userJSON = fs.readFileSync('./data/data_css.json');
const usersArray = JSON.parse(userJSON);
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);


Scenario('0103 - Checks the presence of buttons assigned to user_SupCP', async ({ I }) => {
	var user = "user_SupCP";
	I.login(user);

	I.seeElement({ css: users.get(user).shortcut_crea_courrier });
	I.seeElement({ css: users.get(user).shortcut_actualiser });
	I.seeElement({ css: users.get(user).shortcut_doc_GED });
	I.seeElement({ css: users.get(user).shortcut_profile });

}).tag('bouton').tag('user_SupCP');

Scenario('0203 - Checks the presence of buttons assigned to user_SupER', async ({ I }) => {
	var user = "user_SupER";
	I.login(user);

	I.seeElement({ css: users.get(user).shortcut_crea_courrier });
	I.seeElement({ css: users.get(user).shortcut_actualiser });
	I.seeElement({ css: users.get(user).shortcut_doc_GED });
	I.seeElement({ css: users.get(user).shortcut_profile });
}).tag('bouton').tag('user_SupER');

Scenario('0303 - Checks the presence of buttons assigned to user_GesCP', async ({ I }) => {
	var user = "user_GesCP";
	I.login(user);

	I.seeElement({ css: users.get(user).shortcut_crea_courrier });
	I.seeElement({ css: users.get(user).shortcut_actualiser });
	I.seeElement({ css: users.get(user).shortcut_profile });
}).tag('bouton').tag('user_GesCP');

Scenario('0403 - Checks the presence of buttons assigned to user_Stagiaire', async ({ I }) => {
	var user = "user_Stagiaire";
	I.login(user);

	I.seeElement({ css: users.get(user).shortcut_crea_courrier });
	I.seeElement({ css: users.get(user).shortcut_actualiser });
	I.seeElement({ css: users.get(user).shortcut_profile });
}).tag('bouton').tag('user_Stagiaire');

Scenario('0503 - Checks the presence of buttons assigned to user_GesER', async ({ I }) => {
	var user = "user_GesER";
	I.login(user);

	I.seeElement({ css: users.get(user).shortcut_crea_courrier });
	I.seeElement({ css: users.get(user).shortcut_actualiser });
	I.seeElement({ css: users.get(user).shortcut_profile });
}).tag('bouton').tag('user_GesER');

