//<reference path="../../steps.d.ts" />

const fs = require('fs');
const tagsArray = JSON.parse(fs.readFileSync('./data/data_tags.json'));
const tags = new Map();
for (const [clef, value] of Object.entries(tagsArray)) tags.set(clef, value);

const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

Scenario('0312 - Add answer user_GesCP', async ({ I, search, insert, task }) => {
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

	var idpli = await I.grabValueFrom('.tag-container ' + tags.get("Identifiant_du_pli").id + ' input');

	I.say('remplissage des tags');

	task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Fax);
	task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Contact);

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0312 - CP - courrier A distribuer");

	task.form.fillTag(tags.get("Nom_du_client").id, "Tarli");
	task.form.fillTag(tags.get("Prenom_du_client").id, "Laurent");
	task.form.fillTextTag(tags.get("Commentaire").id, "test 0312");

	task.form.fillTag(tags.get("N_Tiers").id, "654321");
	I.click(tags.get("N_SIREN").id);
	task.form.fillTag(tags.get("N_SIREN").id, "654");
	task.form.fillTag(tags.get("Raison_sociale").id, "ENTREPRISE");


	task.form.fillListTagWithSearch(tags.get("Service").id, tags.get("Service").Carriere_et_Prestations, "Carrières");


	I.say('Ajout de la PJ');

	I.click("#create-attached");

	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").Bulletin_de_paye);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Autre);

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref006");


	I.say('Verification contenue de tags pré-remplies');

	I.say('Verification des tags en lecture seule');

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
	I.fillField(".search-textbox input", "gestionnaire")
	I.wait(0.5)
	I.checkOption("Gestionnaire Carrieres et Prestations")
	I.click("Button#assign")
	I.click("#yes")

	I.logout();

	//end creation courrier

	//310 before
	var user = "user_GesCP";
	I.login(user);

	search.open("Mes courriers", false);
	I.wait(2)
	I.click(locate('.tree-link').withText('Mes courriers assignés'));
	I.wait(1)

	I.click(tags.get("Type_de_courrier").id)

	I.fillField(".search-textbox", "Contact");

	I.wait(1.5)
	I.checkOption("#cb_0 input")
	I.click("#cancel")
	I.wait(2)

	I.click("#search")
	I.wait(2)

	search.results.seeFieldValueInRow(tags.get("Type_de_courrier").id, "Contact", 1);

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

}).tag('Reponse').tag('user_GesCP');
