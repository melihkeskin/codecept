//<reference path="../../steps.d.ts" />

const fs = require('fs');
const tagsArray = JSON.parse(fs.readFileSync('./data/data_tags.json'));
const tags = new Map();
for (const [clef, value] of Object.entries(tagsArray)) tags.set(clef, value);

const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

Scenario('0511 - Add answer user_GesER', async ({ I, search, task, insert }) => {
	//run 0504 before

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

	I.say('remplissage des tags');

	task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Courrier_Papier);
	task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Contact);

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0511 - courrier GesER");

	task.form.fillTextTag(tags.get("Commentaire").id, "test 0511");

	task.form.fillTag(tags.get("N_Tiers").id, "65432");
	I.click(tags.get("Raison_sociale").id);

	task.form.fillTag(tags.get("Raison_sociale").id, "ENTREPRISE");

	task.form.fillListTagWithSearch(tags.get("Gestionnaire_du_dossier").id, tags.get("Gestionnaire_du_dossier").Gestionnaire_Employeur_et_Recouvrement, "Gestionnaire");
	task.form.fillListTag(tags.get("Service").id, tags.get("Service").Employeur_Recouvrement);

	I.say('Verification statut courrier');
	task.form.seeListTag(tags.get("Statut_du_courrier").id, "A traiter");
	task.form.seeReadOnlyTag(tags.get("Statut_du_courrier").id);


	I.say('Ajout de la PJ');

	I.click("#create-attached");

	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").RIB);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Donnees_personnelles);

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref511");

	insert.addFile('data/document_insert/rib.png');
	I.wait(5);
	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.waitForElement("#Initiate", 10);
	I.click("#Initiate");

	I.wait(2);

	search.open("Mes courriers", false);
	I.wait(2)
	I.click(locate('.tree-link').withText('Mes courriers assignés'));

	I.wait(2)
	search.results.seeFieldValueInRow(tags.get("Raison_sociale").id, "ENTREPRISE", 1);
	search.results.seeFieldValueInRow(tags.get("Objet_du_courrier").id, "0511 - courrier GesER", 1);

	search.results.open(1);

	I.wait(2)

	I.click(tags.get("Reponse").id + " #create-attached");
	I.wait(2)
	insert.addFile('data/document_insert/reponse.docx');
	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.waitForElement("#saveAndQuit", 10);
	I.click("#saveAndQuit");
	I.wait(5);

	search.results.open(1);
	I.seeElement(locate(".attachment-label").withText("reponse.docx"));


}).tag('Reponse').tag('user_Stagiaire');
