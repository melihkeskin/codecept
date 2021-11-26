//<reference path="../../steps.d.ts" />
/* 
Feature('Creation'); */

const fs = require('fs');
const tagsArray = JSON.parse(fs.readFileSync('./data/data_tags.json'));
const tags = new Map();
for (const [clef, value] of Object.entries(tagsArray)) tags.set(clef, value);

const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

Scenario('0304 - Add envelope to mailboxes Group A-J with account user_GesCP', async ({ I, task, insert, search }) => {
	var user = "user_GesCP";
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
	task.form.fillListTag(tags.get("Type_de_chemise").id, tags.get("Type_de_chemise").Calcul);

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0304 - CP - courrier Affiliés A-J");

	task.form.fillTextTag(tags.get("Commentaire").id, "test 0304");

	task.form.fillTag(tags.get("N_Tiers").id, "102030");
	I.click(tags.get("Commentaire").id);
	task.form.fillTag(tags.get("N_Tiers_associe").id, "");
	task.form.fillTag(tags.get("Code_carriere").id, "001234");
	task.form.fillTag(tags.get("Nom_du_client").id, "Dupont");
	task.form.fillTag(tags.get("Prenom_du_client").id, "Martine");
	task.form.fillTag(tags.get("Date_de_naissance").id, "01/08/1972");
	task.form.fillTag(tags.get("N_SS").id, "1720892700123");
	task.form.fillTag(tags.get("Contact_du_client").id, "12 rue de Lilas 92700 Colombes");

	task.form.fillListTag(tags.get("Beneficiaire").id, tags.get("Beneficiaire").Non);
	task.form.fillListTag(tags.get("Participant").id, tags.get("Participant").Non);
	task.form.fillListTag(tags.get("Statut_tiers").id, tags.get("Statut_tiers").ACTIF);

	task.form.fillListTag(tags.get("Service").id, tags.get("Service").Carriere_et_Prestations);
	task.form.fillListTag(tags.get("Sous-service").id, tags.get("Sous-service").Affilies_Groupe_AJ);

	I.say('Verification statut courrier');
	task.form.seeListTag(tags.get("Statut_du_courrier").id, "A traiter");
	task.form.seeReadOnlyTag(tags.get("Statut_du_courrier").id);


	I.say('Ajout de la PJ');

	I.click("#create-attached");

	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").RIB);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Donnees_personnelles);

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref301");


	I.say('Verification contenue de tags pré-remplies');


	I.waitForElement(tags.get("Statut_du_document").id, 5)
	task.form.seeListTag(tags.get("Statut_du_document").id, "Disponible");
	I.waitForElement(tags.get("Statut_du_document").id, 5)
	task.form.seeReadOnlyTag(tags.get("Statut_du_document").id);
	I.waitForElement(tags.get("Dossier_de_pension").id, 5)
	task.form.seeListTag(tags.get("Dossier_de_pension").id, tags.get("Dossier_de_pension").Non);
	I.waitForElement(tags.get("Paiement").id, 5)
	task.form.seeListTag(tags.get("Paiement").id, tags.get("Paiement").Non);
	I.waitForElement(tags.get("N_Tiers").id, 5)
	task.form.seeTag(tags.get("N_Tiers").id, "102030");
	I.waitForElement(tags.get("N_Tiers_associe").id, 5)
	task.form.seeTag(tags.get("N_Tiers_associe").id, "");
	I.waitForElement(tags.get("Code_carriere").id, 5)
	task.form.seeTag(tags.get("Code_carriere").id, "001234");
	I.waitForElement(tags.get("Nom_du_client").id, 5)
	task.form.seeTag(tags.get("Nom_du_client").id, "Dupont");
	I.waitForElement(tags.get("Prenom_du_client").id, 5)
	task.form.seeTag(tags.get("Prenom_du_client").id, "Martine");
	I.waitForElement(tags.get("Date_de_naissance").id, 5)
	task.form.seeTag(tags.get("Date_de_naissance").id, "01/08/1972");
	I.waitForElement(tags.get("N_SS").id, 5)
	task.form.seeTag(tags.get("N_SS").id, "1720892700123");
	I.waitForElement(tags.get("Contact_du_client").id, 5)
	task.form.seeTag(tags.get("Contact_du_client").id, "12 rue de Lilas 92700 Colombes");
	I.waitForElement(tags.get("Beneficiaire").id, 5)
	task.form.seeListTag(tags.get("Beneficiaire").id, tags.get("Beneficiaire").Non);
	I.waitForElement(tags.get("Participant").id, 5)
	task.form.seeListTag(tags.get("Participant").id, tags.get("Participant").Non);
	I.waitForElement(tags.get("Statut_tiers").id, 5)
	task.form.seeListTag(tags.get("Statut_tiers").id, tags.get("Statut_tiers").ACTIF);

	I.say('Verification des tags en lecture seule');

	task.form.seeReadOnlyTag(tags.get("N_Tiers").id);
	task.form.seeReadOnlyTag(tags.get("N_Tiers_associe").id);
	task.form.seeReadOnlyTag(tags.get("Code_carriere").id);
	task.form.seeReadOnlyTag(tags.get("Nom_du_client").id);
	task.form.seeReadOnlyTag(tags.get("Prenom_du_client").id);
	task.form.seeReadOnlyTag(tags.get("Date_de_naissance").id);
	task.form.seeReadOnlyTag(tags.get("N_SS").id);
	task.form.seeReadOnlyTag(tags.get("Contact_du_client").id);

	task.form.seeReadOnlyTag(tags.get("Beneficiaire").id);
	task.form.seeReadOnlyTag(tags.get("Participant").id);
	task.form.seeReadOnlyTag(tags.get("Statut_tiers").id);

	task.form.seeTag(tags.get("Identifiant_du_pli").id, time);
	task.form.seeReadOnlyTag(tags.get("Identifiant_du_pli").id);

	task.form.seeTag(tags.get("Date_du_courrier").id, date.getDate());
	task.form.seeTag(tags.get("Date_du_courrier").id, date.getFullYear());

	task.form.seeListTag(tags.get("Canal").id, "Courrier papier");
	task.form.seeListTag(tags.get("Type_de_courrier").id, "Contact");
	task.form.seeTag(tags.get("Objet_du_courrier").id, "0304 - CP - courrier Affiliés A-J");
	task.form.seeTextTag(tags.get("Commentaire").id, "test 0304");

	insert.addFile('data/document_insert/rib.png');

	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.waitForElement("#Initiate", 10);
	I.click("#Initiate");
	I.wait(5);

	I.say('Verification de la creation du courrier');

	search.open("Tous les courriers", false);
	I.wait(2)
	I.click(locate('.tree-link').withText('Carrières et Prestations'));
	I.wait(1)
	I.click(locate('.tree-link').withText('Affiliés Groupe A-J'));

	search.results.selectAndShowContextualMenu(1);
	search.results.dontSeeAction("tasks", "M'assigner");
	search.results.dontSeeAction("tasks", "Supprimer");

	I.wait(2);;
	search.results.open(1);
	I.waitForElement(tags.get("Identifiant_du_pli").id, 10)
	task.form.seeTag(tags.get("Identifiant_du_pli").id, idpli);



}).tag('creation').tag('user_GesCP');