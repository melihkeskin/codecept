//<reference path="../../steps.d.ts" />

/* Feature('Verification'); */

const fs = require('fs');
const tagsArray = JSON.parse(fs.readFileSync('./data/data_tags.json'));
const tags = new Map();
for (const [clef, value] of Object.entries(tagsArray)) tags.set(clef, value);

const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

/*
Scenario('0306 - Verification Authorisation on documents user_GesCP', async ({I,search,browse}) => {
	var user = "user_GesCP";
	I.login(user);
	I.wait(2);

	search.open("Documents",false);

	I.seeElement(tags.get("Code_carriere").id);
	  I.seeElement(tags.get("N_Tiers").id);
	  I.seeElement(tags.get("N_Tiers_associe").id);
	  I.seeElement(tags.get("Type_de_document").id);

	  var critereList = new Array();
	critereList.push( tags.get("Canal")					.id);
	critereList.push( tags.get("Date_de_creation")		.id);
	critereList.push( tags.get("Date_de_naissance")		.id);
	critereList.push( tags.get("Date_du_courrier")		.id);
	critereList.push( tags.get("Nature_de_document")	.id);
	critereList.push( tags.get("Nom_du_client")			.id);
	critereList.push( tags.get("N_SS")					.id);
	critereList.push( tags.get("Prenom_du_client")		.id);
	critereList.push( tags.get("Reference_d_archivage")	.id);
	critereList.push( tags.get("Statut_du_document")	.id);
	critereList.push( tags.get("Type_de_courrier")		.id);
	  search.form.seeListAdvanceCriterion(critereList);

	  I.click('.criterion.tag'+tags.get("N_Tiers").id + " .multi-valued-box-list");
	  I.fillField(".search-textbox","102030");
	  I.wait(1);
	  I.pressKey('Enter');
	  I.pressKey('Escape');
	  I.click(".advanced-search #search");

	  I.wait(1);

	search.results.selectAndShowContextualMenu(1);
	I.dontSeeElement(locate('.contextual-menu').withText('Supprimer')); 

}).tag('verification').tag('user_GesCP');*/
Scenario('0307 - Verification client folder search result and actions in contextual menu user_GesCP', async ({ I, search, folder }) => {
	var user = "user_GesCP";
	I.login(user);
	I.wait(2);

	search.open("Dossiers Clients", false);


	I.seeElement(tags.get("N_Tiers").id);

	var critereList = new Array();
	critereList.push(tags.get("Code_carriere").id);
	critereList.push(tags.get("Complet").id);
	critereList.push(tags.get("Date_de_comite").id);
	critereList.push(tags.get("Date_de_creation").id);
	critereList.push(tags.get("Date_de_naissance").id);
	critereList.push(tags.get("Nom_du_client").id);
	search.form.seeListAdvanceCriterion(critereList);



	I.click('.criterion.tag' + tags.get("N_Tiers").id + " .multi-valued-box-list");
	I.fillField(".search-textbox", "102030");
	I.wait(1);
	I.pressKey('Enter');
	I.pressKey('Escape');

	//I.click("#search");
	I.click(locate("button").withText('Rechercher'));

	search.results.open(1);

	I.waitForElement(".title-container", 10);

	I.seeElement(tags.get("N_Tiers").id, "102030");
	I.seeElement(tags.get("Nom_du_client").id, "Dupont");
	I.seeElement(tags.get("Date_de_naissance").id, "01/08/1972");
	I.seeElement(tags.get("Code_carriere").id, "001234");
	I.seeElement(tags.get("Complet").id, "Non");

	I.seeElement(locate(".item-level-2").withText("Calcul"));
	I.seeElement(locate(".item-level-2").withText("Contact"));

	I.seeElement(locate(".item-Dossier-de-pension"));
	I.seeElement(locate(".item-Paiement"));

	folder.fillListTag(tags.get("Complet").id, tags.get("Complet").Oui);
	I.pressKey('Escape');

	I.clearField(tags.get("Date_de_comite").id + " .field-value input");
	I.fillField(tags.get("Date_de_comite").id + " .field-value input", "12 décembre 2018 14:00:00");

	I.pressKey('Escape');
	I.click("#saveAndQuit")

	I.wait(10);
	I.waitForElement('.criterion.tag' + tags.get("N_Tiers").id + " .multi-valued-box-list", 10);

	search.form.fillBooleanCriterion(tags.get("Complet").id);

	I.click('.criterion.tag' + tags.get("Complet").id + " .multi-valued-box-list");
	I.checkOption(tags.get("Complet").Oui);

	I.pressKey('Escape');
	I.wait(2)
	I.click(locate("button").withText('Rechercher'));
	I.wait(2)
	search.results.seeFieldValueInRow(tags.get("N_Tiers").id, "102030", 1);
	I.wait(2)
	search.form.fillBooleanCriterion(tags.get("Date_de_comite").id);
	I.wait(2)
	I.click(tags.get("Date_de_comite").id + " .field-value:not(.to) input");
	I.wait(2)
	I.fillField(tags.get("Date_de_comite").id + " .field-value:not(.to) input", "10 décembre 2018 14:00:00");
	I.wait(2)
	I.click(tags.get("Date_de_comite").id + " .field-value .to input");
	I.wait(2)
	I.fillField(tags.get("Date_de_comite").id + " .field-value .to input", "20 décembre 2018 14:00:00");
	I.wait(2)
	I.click(locate("button").withText('Rechercher'));
	I.wait(2)
	search.results.seeFieldValueInRow(tags.get("N_Tiers").id, "102030", 1);

}).tag('verification').tag('user_GesCP');

Scenario('0308 - Verification client enveloppe search user_GesCP', async ({ I, search, browse }) => {
	var user = "user_GesCP";
	I.login(user);
	I.wait(2);

	search.open("Courriers", false);

	I.seeElement(tags.get("Code_carriere").id);
	I.seeElement(tags.get("N_Tiers").id);
	I.seeElement(tags.get("N_Tiers_associe").id);
	I.seeElement(tags.get("Type_de_courrier").id);

	I.seeElement(tags.get("N_Tiers").id);

	var critereList = new Array();
	critereList.push(tags.get("Assigne_a").id);
	critereList.push(tags.get("Canal").id);
	critereList.push(tags.get("Date_de_creation").id);
	critereList.push(tags.get("Date_de_naissance").id);
	critereList.push(tags.get("Date_du_courrier").id);
	critereList.push(tags.get("Nom_du_client").id);
	critereList.push(tags.get("N_SS").id);
	critereList.push(tags.get("Prenom_du_client").id);
	critereList.push(tags.get("Statut_du_courrier").id);

	search.form.seeListAdvanceCriterion(critereList);

	I.seeElement(locate('thead').withText('Canal'));
	I.seeElement(locate('thead').withText('Date du courrier'));
	I.seeElement(locate('thead').withText('Code carrière'));
	I.seeElement(locate('thead').withText('N° Tiers'));
	I.seeElement(locate('thead').withText('Nom du client'));
	I.seeElement(locate('thead').withText('Type de courrier'));
	I.seeElement(locate('thead').withText('Statut du courrier'));



	I.click('.criterion.tag' + tags.get("N_Tiers").id + " .multi-valued-box-list");
	I.fillField(".search-textbox", "12345");
	I.wait(1);
	I.pressKey('Enter');
	I.pressKey('Escape');
	I.click(locate("button").withText('Rechercher'));

	I.wait(1);

	search.results.seeFieldValueInRow(tags.get("Nom_du_client").id, "Dupont", 1);
	search.results.seeFieldValueInRow(tags.get("Nom_du_client").id, "Dupont", 2);
	search.results.seeFieldValueInRow(tags.get("Nom_du_client").id, "Dupont", 3);
	search.results.seeFieldValueInRow(tags.get("Nom_du_client").id, "Dupont", 4);



}).tag('verification').tag('user_GesCP');
