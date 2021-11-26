//<reference path="../../steps.d.ts" />

Feature('Verification');

const fs = require('fs');
const tagsArray = JSON.parse(fs.readFileSync('./data/data_tags.json'));
const tags = new Map();
for (const [clef, value] of Object.entries(tagsArray)) tags.set(clef, value);

const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

Scenario('0111 - Verification filtre and colums to collectiv mailboxe user_SupCP', async ({ I, search, browse }) => {
	var user = "user_SupCP";
	I.login(user);

	search.open("Tous les courriers", false);
	I.click(locate('.tree-link').withText('Carrières et Prestations'));

	I.waitForElement(tags.get("Type_de_courrier").id, 5);
	I.waitForElement(tags.get("Assigne_a").id, 5);

	I.waitForElement(".advanced-search", 10);
	I.wait(2);

	var critereList = new Array();
	critereList.push(tags.get("Beneficiaire").id);
	critereList.push(tags.get("Canal").id);
	critereList.push(tags.get("Code_carriere").id);
	critereList.push(tags.get("Date_de_creation").id);
	critereList.push(tags.get("Date_de_naissance").id);
	critereList.push(tags.get("Date_du_courrier").id);
	critereList.push(tags.get("Nom_du_client").id);
	critereList.push(tags.get("N_Tiers").id);
	critereList.push(tags.get("Participant").id);
	critereList.push(tags.get("Priorite").id);
	critereList.push(tags.get("Prenom_du_client").id);
	critereList.push(tags.get("Statut_du_courrier").id);
	critereList.push(tags.get("Statut_tiers").id);
	search.form.seeListAdvanceCriterion(critereList);

	I.seeElement(locate('thead').withText('Priorité'));
	I.seeElement(locate('thead').withText('Canal'));
	I.seeElement(locate('thead').withText('Date du courrier'));
	I.seeElement(locate('thead').withText('Type de courrier'));
	I.seeElement(locate('thead').withText('Objet du courrier'));
	I.seeElement(locate('thead').withText('Code carrière'));
	I.seeElement(locate('thead').withText('N° Tiers'));
	I.seeElement(locate('thead').withText('Nom du client'));
	I.seeElement(locate('thead').withText('Prénom du client'));
	I.seeElement(locate('thead').withText('Date de naissance (JJ/MM/AAAA)'));
	I.seeElement(locate('thead').withText('Statut tiers'));
	I.seeElement(locate('thead').withText('Participant'));
	I.seeElement(locate('thead').withText('Bénéficiaire'));
	I.seeElement(locate('thead').withText('Statut du courrier'));
	I.seeElement(locate('thead').withText('Assigné à'));

	browse.form.fillFieldCriterion(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Affiliation);
	I.click(".advanced-search #search");

	I.seeElement(locate('table').withText('0104 - CP - courrier Affiliés A-J'));

}).tag('verification').tag('user_SupCP');

Scenario('0112 - Verification filtre and colums to personal mailboxe user_SupCP', async ({ I, task, insert, search, browse }) => {

	//need to run Scenario "0105 - Add envelope to mailboxes Group K-Z with account user_SupCP"
	var user = "user_SupCP";
	var date = new Date();

	I.login(user);

	task.createEnvelope(user)

	I.say('Verification des remplissage automatiques');

	var time = "MANUEL";
	time = time.concat('_', date.getTime()).substring(0, 13);
	task.form.seeTag(tags.get("Identifiant_du_pli").id, time);
	task.form.seeReadOnlyTag(tags.get("Identifiant_du_pli").id);

	task.form.seeTag(tags.get("Date_du_courrier").id, date.getDate());
	task.form.seeTag(tags.get("Date_du_courrier").id, date.getFullYear());

	var idpli = await I.grabValueFrom('.tag-container ' + tags.get("Identifiant_du_pli").id + ' input');

	I.say('remplissage des tags');

	task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Courrier_Papier);
	task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Affiliation);
	task.form.fillListTag(tags.get("Type_de_chemise").id, tags.get("Type_de_chemise").Conseil_medical);

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0112 - CP - courrier Affiliés K-Z");

	task.form.fillTextTag(tags.get("Commentaire").id, "test 0112");

	task.form.fillTag(tags.get("N_Tiers").id, "54321");
	I.click(tags.get("Commentaire").id);
	task.form.fillTag(tags.get("N_Tiers_associe").id, "");
	task.form.fillTag(tags.get("Code_carriere").id, "000321");
	task.form.fillTag(tags.get("Nom_du_client").id, "Tarli");
	task.form.fillTag(tags.get("Prenom_du_client").id, "Laurent");
	task.form.fillTag(tags.get("Date_de_naissance").id, "22/03/1982");
	task.form.fillTag(tags.get("N_SS").id, "1820375020123");
	task.form.fillTag(tags.get("Contact_du_client").id, "24 rue du pont 75020 Paris");
	task.form.fillListTag(tags.get("Beneficiaire").id, tags.get("Beneficiaire").Non);
	task.form.fillListTag(tags.get("Participant").id, tags.get("Participant").Non);
	task.form.fillListTag(tags.get("Statut_tiers").id, tags.get("Statut_tiers").AFFILIE);

	task.form.fillListTag(tags.get("Service").id, tags.get("Service").Carriere_et_Prestations);
	task.form.fillListTag(tags.get("Sous-service").id, tags.get("Sous-service").Affilies_Groupe_KZ);

	I.say('Verification statut courrier');
	task.form.seeListTag(tags.get("Statut_du_courrier").id, "A traiter");
	task.form.seeReadOnlyTag(tags.get("Statut_du_courrier").id);

	I.say('Ajout de la PJ');

	I.click("#create-attached");

	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").Lettre_cheque);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Prelevements);

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref002");

	insert.addFile('data/document_insert/Lettre_cheque.jpg');
	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.waitForElement("#Initiate", 5);
	I.click("#Initiate");
	I.waitForElement('.B_Priorite', 5);

	I.say('Verification de la creation du courrier');
	search.open("Tous les courriers", false);
	I.click(locate('.tree-link').withText('Carrières et Prestations'));
	I.click(locate('.tree-link').withText('Affiliés Groupe K-Z'));
	I.waitForElement('.search-criteria-container', 5);
	I.wait(2);
	search.results.open(1);
	I.waitForElement(tags.get("Identifiant_du_pli").id, 10);
	task.form.seeTag(tags.get("Identifiant_du_pli").id, idpli);
	I.click(".footer .actions #Reaffecter");
	I.click("#Réaffecter");

	I.waitForElement(".advanced-search", 5);
	I.wait(2);

	browse.form.fillFieldCriterion(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Affiliation);
	I.click(".advanced-search #search");

	//Permet d'auto assigner arrivé dans le document
	search.results.open(1);
	I.click(".footer #cancel");

	I.waitForElement(".advanced-search", 10);
	I.wait(2);
	search.results.seeFieldValueInRow(tags.get("Statut_du_courrier").id, "En traitement", 1);
	search.results.seeFieldValueInRow(tags.get("Assigne_a").id, "Moi", 1);

	I.wait(5);

	search.open("Mes courriers", false);
	I.click(locate('.tree-link').withText('Mes courriers assignés'));

	I.waitForElement(".advanced-search", 10);
	I.seeElement(locate('thead').withText('Priorité'));
	I.seeElement(locate('thead').withText('Canal'));
	I.seeElement(locate('thead').withText('Date du courrier'));
	I.seeElement(locate('thead').withText('Statut du courrier'));
	I.seeElement(locate('thead').withText('Statut de la demande de validation'));
	I.seeElement(locate('thead').withText('Type de courrier'));
	I.seeElement(locate('thead').withText('Objet du courrier'));
	I.seeElement(locate('thead').withText('N° Tiers'));
	I.seeElement(locate('thead').withText('Nom du client'));
	I.seeElement(locate('thead').withText('Prénom du client'));

	I.seeElement(tags.get("Priorite").id);
	I.seeElement(tags.get("Date_du_courrier").id);
	I.seeElement(tags.get("Type_de_courrier").id);

	var critereList = new Array();
	critereList.push(tags.get("Assigne_a").id);
	critereList.push(tags.get("Beneficiaire").id);
	critereList.push(tags.get("Canal").id);
	critereList.push(tags.get("Code_carriere").id);
	critereList.push(tags.get("Date_de_creation").id);
	critereList.push(tags.get("Date_de_naissance").id);
	critereList.push(tags.get("Nom_du_client").id);
	critereList.push(tags.get("N_Tiers").id);
	critereList.push(tags.get("Participant").id);
	critereList.push(tags.get("Prenom_du_client").id);
	critereList.push(tags.get("Statut_du_courrier").id);
	critereList.push(tags.get("Statut_tiers").id);
	search.form.seeListAdvanceCriterion(critereList);

	browse.form.fillFieldCriterion(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Affiliation);
	I.click(".advanced-search #search");

	I.see('0112 - CP - courrier Affiliés K-Z');

}).tag('verification').tag('user_SupCP');

Scenario('0113 - Verification document search result and actions in contextual menu user_SupCP', async ({ I, search, browse }) => {
	var user = "user_SupCP";
	I.login(user);

	search.open("Documents", false);

	I.seeElement(tags.get("Code_carriere").id);
	I.seeElement(tags.get("N_Tiers").id);
	I.seeElement(tags.get("N_Tiers_associe").id);
	I.seeElement(tags.get("Type_de_document").id);

	var critereList = new Array();
	critereList.push(tags.get("Canal").id);
	critereList.push(tags.get("Date_de_creation").id);
	critereList.push(tags.get("Date_de_naissance").id);
	critereList.push(tags.get("Date_du_courrier").id);
	critereList.push(tags.get("Nature_de_document").id);
	critereList.push(tags.get("Nom_du_client").id);
	critereList.push(tags.get("N_SS").id);
	critereList.push(tags.get("Prenom_du_client").id);
	critereList.push(tags.get("Reference_d_archivage").id);
	critereList.push(tags.get("Statut_du_document").id);
	critereList.push(tags.get("Type_de_courrier").id);
	search.form.seeListAdvanceCriterion(critereList);

	I.click('.criterion.tag' + tags.get("N_Tiers").id + " .multi-valued-box-list");
	I.fillField(".search-textbox", "54321");
	I.wait(1);
	I.pressKey('Enter');
	I.pressKey('Escape');
	I.click(".advanced-search #search");

	search.results.seeFieldValueInRow(tags.get("Nom_du_client").id, "Tarli", 1);
	search.results.seeFieldValueInRow(tags.get("Nom_du_client").id, "Tarli", 2);

	I.seeElement(locate('thead').withText('Canal'));
	I.seeElement(locate('thead').withText('Date du courrier'));
	I.seeElement(locate('thead').withText('Code carrière'));
	I.seeElement(locate('thead').withText('N° Tiers'));
	I.seeElement(locate('thead').withText('Nom du client'));
	I.seeElement(locate('thead').withText('Type de courrier'));
	I.seeElement(locate('thead').withText('Type de document'));
	I.seeElement(locate('thead').withText('Nature de document'));
	I.seeElement(locate('thead').withText('Statut du document'));


	search.results.selectAndShowContextualMenu(1);
	I.seeElement(locate('.contextual-menu').withText('Ouvrir'));
	I.seeElement(locate('.contextual-menu').withText('Ouvrir dans une nouvelle fenêtre'));
	I.seeElement(locate('.contextual-menu').withText('Télécharger'));
	I.seeElement(locate('.contextual-menu').withText('Supprimer'));

}).tag('verification').tag('user_SupCP');

Scenario('0114 - Verification client forlder search result menu user_SupCP', async ({ I, search, folder }) => {
	var user = "user_SupCP";
	I.login(user);

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
	I.fillField(".search-textbox", "12345");
	I.wait(1);
	I.pressKey('Enter');
	I.pressKey('Escape');
	//I.click(".advanced-search #search");
	I.click(locate("button").withText('Rechercher'));

	search.results.open(1);

	I.waitForElement(".title-container", 10);

	I.seeElement(tags.get("N_Tiers").id, "12345");
	I.seeElement(tags.get("Nom_du_client").id, "Dupont");
	I.seeElement(tags.get("Date_de_naissance").id, "01/06/1975");
	I.seeElement(tags.get("Code_carriere").id, "000123");
	I.seeElement(tags.get("Complet").id, "Non");

	I.seeElement(locate("button").withText('Sauvegarder'));
	I.seeElement(locate("button").withText('Annuler'));

	I.seeElement(locate(".tree-item-container .item-CarrieresEtPrestations"));

	I.seeElement(locate(".item-Dossier-de-pension"));
	I.seeElement(locate(".item-Paiement"));

	folder.fillListTag(tags.get("Complet").id, tags.get("Complet").Oui);
	I.pressKey('Escape');

	I.clearField(tags.get("Date_de_comite").id + " .field-value input");
	I.fillField(tags.get("Date_de_comite").id + " .field-value input", "1 mars 2019 00:00:00");

	I.pressKey('Escape');
	I.click("#saveAndQuit")

	I.waitForElement('.criterion.tag' + tags.get("N_Tiers").id + " .multi-valued-box-list", 10);

	search.form.fillBooleanCriterion(tags.get("Complet").id);

	I.click('.criterion.tag' + tags.get("Complet").id + " .multi-valued-box-list");
	I.checkOption(tags.get("Complet").Oui);

	I.pressKey('Escape');

	I.click(locate("button").withText('Rechercher'));
	search.results.seeFieldValueInRow(tags.get("N_Tiers").id, "12345", 1);

	search.form.fillBooleanCriterion(tags.get("Date_de_comite").id);

	I.fillField(tags.get("Date_de_comite").id + " .field-value:not(.to) input  ", "1 mars 2019 00:00:00");
	I.fillField(tags.get("Date_de_comite").id + " .field-value .to input  ", "15 mars 2019 00:00:00");
	I.click(locate("button").withText('Rechercher'));
	search.results.seeFieldValueInRow(tags.get("N_Tiers").id, "12345", 1);
}).tag('verification').tag('user_SupCP');


Scenario('0115 - Verification client enveloppe search user_SupCP', async ({ I, search, browse }) => {
	var user = "user_SupCP";
	I.login(user);
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

}).tag('verification').tag('user_SupCP');
