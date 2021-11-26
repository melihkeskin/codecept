//<reference path="../../steps.d.ts" />
Feature('Fin Traitement');

const fs = require('fs');
const tagsArray = JSON.parse(fs.readFileSync('./data/data_tags.json'));
const tags = new Map();
for (const [clef, value] of Object.entries(tagsArray)) tags.set(clef, value);

const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

Scenario('0121 - Finish processing a mail user_SupCP', async ({ I, task, insert, search }) => {
	var user = "user_SupCP";

	I.login(user);

	task.createEnvelope(user)

	I.say('remplissage des tags');

	task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Fax);
	task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Contact);
	task.form.fillListTag(tags.get("Type_de_chemise").id, tags.get("Type_de_chemise").Divers_a_classer);

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0121 - CP - courrier A distribuer");

	task.form.fillTextTag(tags.get("Commentaire").id, "test 0121");

	task.form.fillTag(tags.get("N_Tiers").id, "12345");
	I.click(tags.get("Commentaire").id);
	task.form.fillTag(tags.get("N_Tiers_associe").id, "");
	task.form.fillTag(tags.get("Code_carriere").id, "000123");

	task.form.fillTag(tags.get("Nom_du_client").id, "Dupont");
	task.form.fillTag(tags.get("Prenom_du_client").id, "Jean");
	task.form.fillTag(tags.get("Date_de_naissance").id, "01/06/1975");
	task.form.fillTag(tags.get("N_SS").id, "1750692700123");
	task.form.fillTag(tags.get("Contact_du_client").id, "12 rue des Lilas 92700 Colombes");

	task.form.fillListTag(tags.get("Beneficiaire").id, tags.get("Beneficiaire").Non);
	task.form.fillListTag(tags.get("Participant").id, tags.get("Participant").Non);
	task.form.fillListTag(tags.get("Statut_tiers").id, tags.get("Statut_tiers").ACTIF);

	task.form.fillListTag(tags.get("Service").id, tags.get("Service").Carriere_et_Prestations);

	I.say('Ajout de la PJ');

	I.click("#create-attached");

	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").Bulletin_de_paye);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Autre);

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref006");

	insert.addFile('data/document_insert/paie.png');
	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");

	I.waitForElement("#Initiate", 10)
	I.click("#Initiate");
	I.wait(5);

	search.open("Tous les courriers", false);

	I.waitForElement(locate('.tree-link').withText('A indexer'), 10);
	I.seeElement(locate('.tree-link').withText('A distribuer'));
	I.seeElement(locate('.tree-link').withText('Carrières et Prestations'));
	I.seeElement(locate('.tree-link').withText('Assignés par statut'));

	I.click(locate('.tree-link').withText('A distribuer'));

	search.results.open(1);

	task.footer.reafecterListCirterion(tags.get("Sous-service").id, "Affiliés Groupe A-J")

	//End enveloppe

	search.open("Tous les courriers", false);
	I.wait(2)
	I.click(locate('.tree-link').withText('Carrières et Prestations'));
	I.wait(1)
	I.click(locate('.tree-link').withText('Affiliés Groupe A-J'));
	I.wait(1)
	var date = await I.grabTextFrom('tr:nth-of-type(1) td' + tags.get("Date_du_courrier").id);

	search.results.open(1);

	I.waitForElement("#Valider", 10)
	I.click("#Valider")
	I.waitForElement("#yes", 10)
	I.click("#yes")

	I.wait(3)
	I.retry(5).dontSeeElement("button#cancel")

	search.open("Courriers", false);
	I.wait(2)
	I.click("#add")
	I.fillField(".search-textbox", "Statut du courrier");
	I.wait(1.5)

	I.checkOption("#cb_0")
	I.click("#validate")
	I.wait(2)

	I.click(tags.get("Statut_du_courrier").id)
	I.fillField(".search-textbox", "Traité");
	I.wait(1.5)
	I.checkOption("input[value='Traite'")
	I.click("#cancel")
	I.wait(2)

	I.click("#search")
	I.wait(2)

	search.results.open(1);

	I.waitForElement(tags.get("Date_du_courrier").id, 10);
	task.form.seeTag(tags.get("Date_du_courrier").id, date);

	I.dontSeeElement("#Valider", 10)
	I.dontSeeElement("#ACorriger", 10)
	I.dontSeeElement("#saveAndQuit", 10)

	I.click("#cancel")

}).tag('fin_traitement').tag('user_SupCP');
