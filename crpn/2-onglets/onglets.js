//<reference path="../../steps.d.ts" />

Feature('Check presence assigned');

Scenario('0102 - Checks the presence of tabs assigned to user_SupCP', async ({I, browse}) => {
	I.login("user_SupCP");
	
	browse.menu.seeTab("Accueil");
	browse.menu.seeTab("Rechercher");
	browse.menu.seeTab("Mes courriers");
	browse.menu.seeTab("Tous les courriers");
	browse.menu.seeTab("Reporting");
	I.say("L\'utilisateur est connecté,et voit tous les onglets qui lui sont affectés");
	
}).tag('check_assigned').tag('user_SupCP');

Scenario('0202 - Checks the presence of tabs assigned to  user_SupER', async ({I, browse}) => {
	I.login("user_SupER");
	
	browse.menu.seeTab("Accueil");
	browse.menu.seeTab("Rechercher");
	browse.menu.seeTab("Mes courriers");
	browse.menu.seeTab("Tous les courriers");
	browse.menu.seeTab("Reporting");
	I.say("L\'utilisateur est connecté,et voit tous les onglets qui lui sont affectés");
}).tag('check_assigned').tag('user_SupER');

Scenario('0302 - Checks the presence of tabs assigned to user_GesCP', async ({I, browse}) => {
	I.login("user_GesCP");
	
	browse.menu.seeTab("Accueil");
	browse.menu.seeTab("Rechercher");
	browse.menu.seeTab("Mes courriers");
	browse.menu.seeTab("Tous les courriers");
	I.say("L\'utilisateur est connecté,et voit tous les onglets qui lui sont affectés");
	}).tag('check_assigned').tag('user_GesCP');

Scenario('0402 - Checks the presence of tabs assigned to  user_Stagiaire', async ({I, browse}) => {
	I.login("user_Stagiaire");
	
	browse.menu.seeTab("Accueil");
	browse.menu.seeTab("Rechercher");
	browse.menu.seeTab("Mes courriers");
	browse.menu.seeTab("Tous les courriers");
	I.say("L\'utilisateur est connecté,et voit tous les onglets qui lui sont affectés");
	}).tag('check_assigned').tag('user_Stagiaire');

Scenario('0502 - Checks the presence of tabs assigned to user_GesER', async ({I, browse}) => {
	I.login("user_GesER");
	
	browse.menu.seeTab("Accueil");
	browse.menu.seeTab("Rechercher");
	browse.menu.seeTab("Mes courriers");
	I.say("L\'utilisateur est connecté,et voit tous les onglets qui lui sont affectés");
	}).tag('check_assigned').tag('user_GesER');

