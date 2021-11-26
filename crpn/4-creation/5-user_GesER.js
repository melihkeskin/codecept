//<reference path="../../steps.d.ts" />

/* Feature('Creation'); */

const fs = require('fs');
const tagsArray = JSON.parse(fs.readFileSync('./data/data_tags.json'));
const tags = new Map();
for (const [clef, value] of Object.entries(tagsArray)) tags.set(clef, value);

const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

Scenario('0504 - Add a mail directly assigned to the manager user_GesER', async ({ I, task, insert, search }) => {
	var user = "user_GesER";
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

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0504 - ER - courrier GesER");

	task.form.fillTextTag(tags.get("Commentaire").id, "test 0504");

	task.form.fillTag(tags.get("N_Tiers").id, "65432");

	task.form.fillListTagWithSearch(tags.get("Gestionnaire_du_dossier").id, tags.get("Gestionnaire_du_dossier").Gestionnaire_Employeur_et_Recouvrement, "Gestionnaire");
	task.form.fillListTag(tags.get("Service").id, tags.get("Service").Employeur_Recouvrement);

	I.say('Verification statut courrier');
	task.form.seeListTag(tags.get("Statut_du_courrier").id, "A traiter");
	task.form.seeReadOnlyTag(tags.get("Statut_du_courrier").id);


	I.say('Ajout de la PJ');

	I.click("#create-attached");

	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").RIB);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Donnees_personnelles);

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref501");


	I.say('Verification contenue de tags pré-remplies');

	task.form.seeListTag(tags.get("Statut_du_document").id, "Disponible");
	task.form.seeReadOnlyTag(tags.get("Statut_du_document").id);

	task.form.seeListTag(tags.get("Dossier_de_pension").id, tags.get("Dossier_de_pension").Non);
	task.form.seeListTag(tags.get("Paiement").id, tags.get("Paiement").Non);

	task.form.seeTag(tags.get("N_Tiers").id, "65432");

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
	task.form.seeTag(tags.get("Objet_du_courrier").id, "0504 - ER - courrier GesER");
	task.form.seeTextTag(tags.get("Commentaire").id, "test 0504");

	insert.addFile('data/document_insert/rib.png');
	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.waitForElement("#Initiate", 10);
	I.click("#Initiate");
	I.wait(2);


	I.say('Verification de la creation du courrier');

	search.open("Mes courriers", false);
	I.click(locate('.tree-link').withText('Mes courriers assignés'));

	I.wait(2);
	search.results.open(1);
	I.waitForElement(tags.get("Identifiant_du_pli").id, 10)
	task.form.seeTag(tags.get("Identifiant_du_pli").id, idpli);



}).tag('creation').tag('user_GesER');