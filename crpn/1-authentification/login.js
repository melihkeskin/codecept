//<reference path="../../steps.d.ts" />

Feature('Authentication / Login');

const fs = require('fs');
let userJSON = fs.readFileSync('./data/data_css.json');
const usersArray = JSON.parse(userJSON);
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);


Scenario('0101 - Connection to Flower whith account user_SupCP', async ({ I, browse }) => {
	var user = "user_SupCP";
	I.login(user);
	I.say("L\'utilisateur est connecté, l'onglet sélectionné dans le bandeau de navigation est \"Mes courriers\"");
	browse.menu.isTabSelected(users.get(user).mes_courriers);
}).tag('login').tag('user_SupCP');

Scenario('0201 - Connection to Flower whith account user_SupER', async ({ I, browse }) => {
	var user = "user_SupER";
	I.login(user);
	I.say("L\'utilisateur est connecté, l'onglet sélectionné dans le bandeau de navigation est \"Mes courriers\"");
	browse.menu.isTabSelected(users.get(user).mes_courriers);
}).tag('login').tag('user_SupER');

Scenario('0301 - Connection to Flower whith account user_GesCP', async ({ I, browse }) => {
	var user = "user_GesCP";
	I.login(user);
	I.say("L\'utilisateur est connecté, l'onglet sélectionné dans le bandeau de navigation est \"Mes courriers\"");
	browse.menu.isTabSelected(users.get(user).mes_courriers);
}).tag('login').tag('user_GesCP');

Scenario('0401 - Connection to Flower whith account user_Stagiaire', async ({ I, browse }) => {
	var user = "user_Stagiaire";
	I.login(user);
	I.say("L\'utilisateur est connecté, l'onglet sélectionné dans le bandeau de navigation est \"Mes courriers\"");
	browse.menu.isTabSelected(users.get(user).mes_courriers);
}).tag('login').tag('user_Stagiaire');

Scenario('0501 - Connection to Flower whith account user_GesER', async ({ I, browse }) => {
	var user = "user_GesER";
	I.login(user);
	I.say("L\'utilisateur est connecté, l'onglet sélectionné dans le bandeau de navigation est \"Mes courriers\"");
	browse.menu.isTabSelected(users.get(user).mes_courriers);
}).tag('login').tag('user_GesER');

