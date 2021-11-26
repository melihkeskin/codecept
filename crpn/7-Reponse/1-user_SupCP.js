//<reference path="../../steps.d.ts" />

Feature('Reponse');

const fs = require('fs');
const tagsArray = JSON.parse(fs.readFileSync('./data/data_tags.json'));
const tags = new Map();
for (const [clef, value] of Object.entries(tagsArray)) tags.set(clef, value);

const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

Scenario('0119 - Add answer user_SupCP', async ({ I, search, insert, task }) => {
	//create enveloppe affected to user_GesCP
	var user = "user_SupCP";
	var date = new Date();

	I.login(user);
	I.wait(2);

	task.createEnvelope(user)

	I.say('Verification des remplissage automatiques');

	var time = "MANUEL";
	time = time.concat('_', date.getTime()).substring(0, 13);
	task.form.seeTag(tags.get("Identifiant_du_pli").id, time);
	task.form.seeReadOnlyTag(tags.get("Identifiant_du_pli").id);

	task.form.seeTag(tags.get("Date_du_courrier").id, date.getDate());
	task.form.seeTag(tags.get("Date_du_courrier").id, date.getFullYear());

	I.say('remplissage des tags');

	task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Fax);
	task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Assurance);

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0119 - CP - courrier A distribuer");
	task.form.fillTag(tags.get("Nom_du_client").id, "Tarli");
	task.form.fillTag(tags.get("Prenom_du_client").id, "Laurent");
	task.form.fillTextTag(tags.get("Commentaire").id, "test 0119");

	task.form.fillTag(tags.get("N_Tiers").id, "543");
	I.click(tags.get("Commentaire").id);
	task.form.fillTag(tags.get("Raison_sociale").id, "ENTREPRISE");

	task.form.fillListTagWithSearch(tags.get("Service").id, tags.get("Service").Carriere_et_Prestations, "Carrières");

	I.say('Ajout de la PJ');

	I.click("#create-attached");

	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").Bulletin_de_paye);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Autre);

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref006");

	insert.addFile('data/document_insert/paie.png');
	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.wait(3)
	I.click("#Initiate");

	I.waitForElement('.B_Priorite', 20);
	search.open("Tous les courriers", false);
	I.click(locate('.tree-link').withText('A distribuer'));
	search.results.open(1);

	I.refreshPage()
	I.waitForElement("#more", 10)
	I.click("#more")
	I.wait(1)
	I.click("div#assign")
	I.wait(2)
	I.fillField(".search-textbox input", "superviseur")
	I.wait(0.5)
	I.checkOption("Superviseur Carrieres et Prestations")
	I.click("Button#assign")
	I.click("#yes")

	I.wait(2)

	search.open("Mes courriers", false);
	I.wait(2)
	I.click(locate('.tree-link').withText('Mes courriers assignés'));
	I.wait(1)

	I.click(tags.get("Type_de_courrier").id)

	I.fillField(".search-textbox", "Assurance");

	I.wait(1.5)
	I.checkOption("#cb_0 input")
	I.click("#cancel")
	I.wait(2)

	I.click("#search")
	I.wait(2)

	search.results.seeFieldValueInRow(tags.get("Objet_du_courrier").id, "0119 - CP - courrier A distribuer", 1);
	search.results.seeFieldValueInRow(tags.get("Nom_du_client").id, "Tarli", 1);

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

}).tag('Reponse').tag('user_SupCP');
