//<reference path="../../steps.d.ts" />


const fs = require('fs');
const tagsArray = JSON.parse(fs.readFileSync('./data/data_tags.json'));
const tags = new Map();
for (const [clef, value] of Object.entries(tagsArray)) tags.set(clef, value);

const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

Scenario('0214 - Process a mail to be delivered user_SupER', async ({ I, insert, task, search }) => {
	/*
	var user = "user_SupER";
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
	task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Contact);

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0214 - ER - courrier A assigner");

	task.form.fillTextTag(tags.get("Commentaire").id, "test 0214");

	task.form.fillTag(tags.get("N_Tiers").id, "65432");
	I.click(tags.get("Commentaire").id);
	task.form.fillTag(tags.get("N_Tiers_associe").id, "");
	task.form.fillTag(tags.get("Code_carriere").id, "");
	task.form.fillTag(tags.get("Nom_du_client").id, "");
	task.form.fillTag(tags.get("Prenom_du_client").id, "");
	task.form.fillTag(tags.get("Date_de_naissance").id, "");
	task.form.fillTag(tags.get("N_SS").id, "");
	task.form.fillTag(tags.get("Contact_du_client").id, "");
	task.form.fillTag(tags.get("N_SIREN").id, "654");

	task.form.fillListTag(tags.get("Service").id, tags.get("Service").Employeur_Recouvrement);

	I.say('Verification statut courrier');
	task.form.seeListTag(tags.get("Statut_du_courrier").id, "A traiter");
	task.form.seeReadOnlyTag(tags.get("Statut_du_courrier").id);


	I.say('Ajout de la PJ');

	I.click("#create-attached");

	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").RIB);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Donnees_personnelles);

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref021");
	I.wait(2)
	insert.addFile('data/document_insert/rib.png');
	I.wait(5)
	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.waitForElement("#Initiate", 10);
	I.click("#Initiate");
	I.wait(5);

	I.say('Verification de la creation du courrier');
	search.open("Tous les courriers", false);
	I.click(locate('.tree-link').withText('A assigner'));
	I.waitForElement('.search-criteria-container', 20);
	I.wait(5);
	search.results.open(1);
	I.waitForElement(tags.get("Identifiant_du_pli").id, 10);
	task.form.seeTag(tags.get("Identifiant_du_pli").id, idpli);

	I.wait(5)

	search.open("Tous les courriers", false);
	I.wait(5)
	I.click(locate('.tree-link').withText('A assigner'));
	I.wait(2)

	var date = await I.grabTextFrom('tr:nth-of-type(1) td' + tags.get("Date_du_courrier").id);

	search.results.selectAndShowContextualMenu(1);
	I.wait(1);
	I.click(locate(".label").withText("Assigner à quelqu'un"))
	I.wait(3);
	I.fillField(".search-textbox input", "gestionnaire")
	I.wait(1);
	I.checkOption("Gestionnaire Employeur et Recouvrement")
	I.wait(2);
	I.click("Button#assign")
	I.click("#yes")
	I.wait(5)
	I.click(locate('.tree-link').withText('Assignés'));
	I.wait(5)
	search.results.seeFieldValueInRow(tags.get("Date_du_courrier").id, date, 1);
	*/

}).tag('traitement').tag('user_SupER');

Scenario('0215 - Process a mail to be processed and submit a validation request user_SupER', async ({ I, search, insert, task }) => {
	//need run test 204 before
	var user = "user_SupER";
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

	I.say('remplissage des tags');

	task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Courrier_Papier);
	task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Autre);

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0215 - ER - courrier A assigner");

	task.form.fillTextTag(tags.get("Commentaire").id, "test 0215");

	task.form.fillTag(tags.get("N_Tiers").id, "65432");
	I.click(tags.get("Commentaire").id);
	task.form.fillTag(tags.get("N_SIREN").id, "654");
	task.form.fillListTag(tags.get("Service").id, tags.get("Service").Employeur_Recouvrement);

	I.say('Verification statut courrier');
	task.form.seeListTag(tags.get("Statut_du_courrier").id, "A traiter");
	task.form.seeReadOnlyTag(tags.get("Statut_du_courrier").id);

	I.say('Ajout de la PJ');

	I.click("#create-attached");
	I.wait(0.5)
	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").RIB);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Donnees_personnelles);
	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref021");

	insert.addFile('data/document_insert/rib.png');
	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.waitForElement("#Initiate", 10);
	I.click("#Initiate");
	I.wait(5);

	//end 204

	search.open("Tous les courriers", false);
	I.wait(2)
	I.click(locate('.tree-link').withText('A assigner'));
	I.wait(2)
	search.results.open(1);
	I.waitForElement('Button#DemandeValidation', 10);
	I.click('Button#DemandeValidation');
	I.wait(2)
	I.waitForElement(tags.get("Demandeur_de_la_validation").id + ' .value-' + tags.get("Demandeur_de_la_validation").Superviseur_Employeur_et_Recouvrement, 10)

	task.form.validationRequest(tags.get("Valideur").id, tags.get("Valideur").Gestionnaire_Employeur_et_Recouvrement, "Gestionnaire");
	I.click('button[id="Demander validation"')

	I.wait(2)
	search.open("Tous les courriers", false);
	I.wait(2)
	I.click(locate('.tree-link').withText('Assignés'));
	I.wait(2)
	search.results.open(1);
	I.click("#cancel")

}).tag('traitement').tag('user_SupER');