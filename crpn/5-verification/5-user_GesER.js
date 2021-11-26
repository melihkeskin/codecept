//<reference path="../../steps.d.ts" />

/* Feature('Verification'); */

const fs = require('fs');
const tagsArray = JSON.parse(fs.readFileSync('./data/data_tags.json'));
const tags = new Map();
for (const [clef, value] of Object.entries(tagsArray)) tags.set(clef, value);

const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

Scenario('0505 - Verification filtre and colums to personal mailboxe user_GesER', async ({ I, search, browse }) => {
	var user = "user_GesER";
	I.login(user);
	I.wait(2);

	search.open("Mes courriers", false);


	I.waitForElement(".advanced-search", 10);

	I.seeElement(tags.get("N_Tiers").id);
	I.seeElement(tags.get("Date_du_courrier").id);
	I.seeElement(tags.get("Type_de_courrier").id);

	I.seeElement(locate('thead').withText('Priorité'));
	I.seeElement(locate('thead').withText('Canal'));
	I.seeElement(locate('thead').withText('Date du courrier'));
	I.seeElement(locate('thead').withText('Statut du courrier'));
	I.seeElement(locate('thead').withText('Type de courrier'));
	I.seeElement(locate('thead').withText('N° Tiers'));
	I.seeElement(locate('thead').withText('Raison sociale'));
	I.seeElement(locate('thead').withText('N° SIREN'));
	I.seeElement(locate('thead').withText('Nom du client'));
	I.seeElement(locate('thead').withText('Prénom du client'));
	I.seeElement(locate('thead').withText('Commentaire'));
	I.seeElement(locate('thead').withText('Gestionnaire du dossier'));

	var critereList = new Array();
	critereList.push(tags.get("Assigne_a").id);
	critereList.push(tags.get("Date_de_creation").id);
	critereList.push(tags.get("Nom_du_client").id);
	critereList.push(tags.get("N_SIREN").id);
	critereList.push(tags.get("Priorite").id);
	critereList.push(tags.get("Raison_sociale").id);

	search.form.seeListAdvanceCriterion(critereList);

	search.form.fillBooleanCriterion(tags.get("Raison_sociale").id);
	I.wait(1);
	I.click('.advanced-search .criterion.tag' + tags.get("Raison_sociale").id + " .multi-valued-box-list");
	I.fillField(".search-textbox", "ENTREPRISE");

	I.wait(1);
	I.pressKey('Enter');
	I.pressKey('Escape');

	I.click(".advanced-search #search");
	//I.wait(2)
	//search.results.seeFieldValueInRow(tags.get("Objet_du_courrier").id, "0504 - ER - courrier A assigner", 1) ;


	//A COMPLETER
}).tag('verification').tag('user_GesER');

Scenario('0506 - Verification document search resul user_GesER', async ({ I, search, browse }) => {
	var user = "user_GesER";
	I.login(user);
	I.wait(2);

	search.open("Documents", false);

	I.waitForElement(tags.get("N_SIREN").id, 10);
	I.seeElement(tags.get("N_Tiers").id);
	I.seeElement(tags.get("N_Tiers_associe").id);
	I.seeElement(tags.get("Type_de_document").id);

	var critereList = new Array();
	critereList.push(tags.get("Canal").id);
	critereList.push(tags.get("Date_du_courrier").id);
	critereList.push(tags.get("Gestionnaire_du_dossier").id);
	critereList.push(tags.get("Nom_du_client").id);
	critereList.push(tags.get("Prenom_du_client").id);
	critereList.push(tags.get("Raison_sociale").id);
	critereList.push(tags.get("Statut_du_document").id);
	critereList.push(tags.get("Date_de_creation").id);
	critereList.push(tags.get("Reference_d_archivage").id);
	critereList.push(tags.get("Type_de_document").id);

	search.form.seeListAdvanceCriterion(critereList);

	search.form.fillBooleanCriterion(tags.get("Raison_sociale").id);

	I.click('.advanced-search .criterion.tag' + tags.get("Raison_sociale").id + " .multi-valued-box-list");
	I.fillField(".search-textbox", "ENTREPRISE");

	I.pressKey('Enter');
	I.pressKey('Escape');

	I.click(".advanced-search #search");

	I.seeElement(locate('thead').withText('Date du courrier'));
	I.seeElement(locate('thead').withText('N° Tiers'));
	I.seeElement(locate('thead').withText('Raison sociale'));
	I.seeElement(locate('thead').withText('Nom du client'));
	I.seeElement(locate('thead').withText('Type de courrier'));
	I.seeElement(locate('thead').withText('Type de document'));
	I.seeElement(locate('thead').withText('Gestionnaire du dossier'));


}).tag('verification').tag('user_GesER');

Scenario('0507 - Verification client folder search result user_GesER', async ({ I, search, folder }) => {
	var user = "user_GesER";
	I.login(user);
	I.wait(2);

	search.open("Dossiers Clients", false);


	I.seeElement(tags.get("N_Tiers").id);

	var critereList = new Array();
	critereList.push(tags.get("Complet").id);
	critereList.push(tags.get("Date_de_comite").id);
	critereList.push(tags.get("Date_de_creation").id);
	critereList.push(tags.get("Gestionnaire_du_dossier").id);
	critereList.push(tags.get("Nom_du_client").id);
	critereList.push(tags.get("N_Tiers").id);
	search.form.seeListAdvanceCriterion(critereList);



	search.form.fillBooleanCriterion(tags.get("Raison_sociale").id);

	I.click('.advanced-search .criterion.tag' + tags.get("Raison_sociale").id + " .multi-valued-box-list");
	I.fillField(".search-textbox", "ENTREPRISE");

	I.pressKey('Enter');
	I.pressKey('Escape');

	I.click(".advanced-search #search");

	search.results.open(1);

	I.waitForElement(".title-container", 10);

	I.seeElement(tags.get("N_Tiers").id, "65432");
	I.seeElement(tags.get("N_SIREN").id, "654");

	I.seeElement(tags.get("Raison_sociale").id, "ENTRERPISE");

	I.seeElement(tags.get("Complet").id, "Non");

	I.seeElement(locate(".item-Tous-les-documents"));

	I.seeElement(locate(".item-Dossier-de-pension"));
	I.seeElement(locate(".item-Paiement"));



}).tag('verification').tag('user_GesER');

Scenario('0508 - Verification client enveloppe search user_GesER', async ({ I, search, browse }) => {
	var user = "user_GesER";
	I.login(user);
	I.wait(2);

	search.open("Courriers", false);

	I.seeElement(tags.get("N_SIREN").id);
	I.seeElement(tags.get("N_Tiers").id);
	I.seeElement(tags.get("N_Tiers_associe").id);
	I.seeElement(tags.get("Type_de_courrier").id);

	I.seeElement(tags.get("N_Tiers").id);

	var critereList = new Array();
	critereList.push(tags.get("Assigne_a").id);
	critereList.push(tags.get("Canal").id);
	critereList.push(tags.get("Date_de_creation").id);
	critereList.push(tags.get("Date_du_courrier").id);
	critereList.push(tags.get("Gestionnaire_du_dossier").id);
	critereList.push(tags.get("Nom_du_client").id);
	critereList.push(tags.get("Prenom_du_client").id);
	critereList.push(tags.get("Statut_du_courrier").id);
	critereList.push(tags.get("Raison_sociale").id);

	search.form.seeListAdvanceCriterion(critereList);

	I.seeElement(locate('thead').withText('Date du courrier'));
	I.seeElement(locate('thead').withText('N° Tiers'));
	I.seeElement(locate('thead').withText('Nom du client'));
	I.seeElement(locate('thead').withText('Type de courrier'));
	I.seeElement(locate('thead').withText('Statut du courrier'));
	I.seeElement(locate('thead').withText('Assigné à'));
	I.seeElement(locate('thead').withText('Raison sociale'));



	I.click('.criterion.tag' + tags.get("N_Tiers").id + " .multi-valued-box-list");
	I.fillField(".search-textbox", "65432");
	I.wait(1);
	I.pressKey('Enter');
	I.pressKey('Escape');
	I.click(locate("button").withText('Rechercher'));

	I.wait(1);

	search.results.seeFieldValueInRow(tags.get("Raison_sociale").id, "ENTREPRISE", 1);


}).tag('verification').tag('user_GesER');