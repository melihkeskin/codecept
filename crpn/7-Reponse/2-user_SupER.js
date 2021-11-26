//<reference path="../../steps.d.ts" />


const fs = require('fs');
const tagsArray = JSON.parse(fs.readFileSync('./data/data_tags.json'));
const tags = new Map();
for (const [clef, value] of Object.entries(tagsArray)) tags.set(clef, value);

const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

Scenario('0216 - Add answer user_SupER', async ({ I, search, insert, task }) => {

	var user = "user_SupER";

	I.login(user);
	task.createEnvelope(user)

	I.say('remplissage des tags');

	task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Courrier_Papier);
	task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Contentieux);

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0216 - ER - courrier Ajout de réponse");
	task.form.fillTextTag(tags.get("Commentaire").id, "test 0216");
	task.form.fillTag(tags.get("N_Tiers").id, "35741");
	I.click(tags.get("Commentaire").id);
	task.form.fillTag(tags.get("N_SIREN").id, "753");
	task.form.fillTag(tags.get("Raison_sociale").id, "SOCIETE");
	task.form.fillListTagWithSearch(tags.get("Gestionnaire_du_dossier").id, tags.get("Gestionnaire_du_dossier").Superviseur_Employeur_et_Recouvrement, "Superviseur");
	task.form.fillListTag(tags.get("Service").id, tags.get("Service").Employeur_Recouvrement);

	I.say('Ajout de la 1ere PJ');

	I.click("#create-attached");

	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").RIB);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Donnees_personnelles);

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref028");

	insert.addFile('data/document_insert/RIB.png');
	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.wait(2)
	I.click("#Initiate");
	I.wait(5);

	search.open("Mes courriers", false);
	I.wait(2)
	I.click(locate('.tree-link').withText('Mes courriers assignés'));
	I.wait(1)

	I.click(tags.get("Type_de_courrier").id)

	I.fillField(".search-textbox", "Contentieux");

	I.wait(1.5)
	I.checkOption("#cb_0 input")
	I.click("#cancel")
	I.wait(2)

	I.click("#search")
	I.wait(2)

	search.results.seeFieldValueInRow(tags.get("Type_de_courrier").id, "Contentieux (violet)", 1);

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
	I.click(tags.get("Reponse").id + " #create-attached:not(.d-none)");
	I.wait(2)
	insert.addFile('data/document_insert/reponse2.docx');
	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.waitForElement("#saveAndQuit", 10);
	I.click("#saveAndQuit");
	I.wait(5);


	search.results.open(1);
	I.seeElement(locate(".attachment-label").withText("reponse2.docx"));

}).tag('Reponse').tag('user_SupER');
