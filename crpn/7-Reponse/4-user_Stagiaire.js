//<reference path="../../steps.d.ts" />

const fs = require('fs');
const tagsArray = JSON.parse(fs.readFileSync('./data/data_tags.json'));
const tags = new Map();
for (const [clef, value] of Object.entries(tagsArray)) tags.set(clef, value);

const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

Scenario('0409 - Add answer user_Stagiaire', async ({ I, task, search, insert }) => {

	var user = "user_SupCP";
	var date = new Date();

	I.login(user);

	task.createEnvelope(user)

	I.say('remplissage des tags');

	task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Courrier_Papier);
	task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Assurance);
	task.form.fillListTag(tags.get("Type_de_chemise").id, tags.get("Type_de_chemise").Correspondances);

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0409 - CP - courrier Stagiaires");

	task.form.fillTextTag(tags.get("Commentaire").id, "test 0409");

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
	task.form.fillListTag(tags.get("Sous-service").id, tags.get("Sous-service").Affilies_Stagiaires);

	I.say('Verification statut courrier');
	task.form.seeListTag(tags.get("Statut_du_courrier").id, "A traiter");
	task.form.seeReadOnlyTag(tags.get("Statut_du_courrier").id);


	I.say('Ajout de la PJ');

	I.click("#create-attached");

	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").Bulletin_de_paye);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Autre);

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref003");


	I.say('Verification contenue de tags pré-remplies');

	insert.addFile('data/document_insert/paie.png');

	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.waitForElement("#Initiate", 10);
	I.click("#Initiate");

	I.wait(5)

	search.open("Tous les courriers", false);
	I.wait(1)
	I.click(locate('.tree-link').withText('Carrières et Prestations'));
	I.wait(2)
	I.click(locate('.tree-link').withText('Affiliés Stagiaires'));

	I.wait(2)
	var date = await I.grabTextFrom('tr:nth-of-type(1) td' + tags.get("Date_du_courrier").id);

	search.results.selectAndShowContextualMenu(1);
	I.wait(0.5)
	I.click(locate(".label").withText("Assigner"))
	I.wait(2)
	I.fillField(".search-textbox input", "Stagiaire")
	I.wait(0.5)
	I.checkOption("User Stagiaire")
	I.click("Button#assign")
	I.click("#yes")

	I.logout();

	var user = "user_Stagiaire";
	I.login(user);

	I.wait(2)
	search.results.seeFieldValueInRow(tags.get("Date_du_courrier").id, date, 1);
	search.results.open(1);

	I.waitForElement('Button#DemandeValidation', 10);
	I.click('Button#DemandeValidation');

	I.wait(2)

	I.waitForElement(tags.get("Demandeur_de_la_validation").id + ' .value-' + tags.get("Demandeur_de_la_validation").User_Stagiaire, 10)

	task.form.validationRequest(tags.get("Valideur").id, tags.get("Valideur").Superviseur_Carrieres_et_Prestations, "Superviseur Carrieres et Prestations");
	I.click('button[id="Demander validation"')

	I.logout();

	var user = "user_SupCP";
	I.login(user);


	search.open("Mes courriers", false);
	I.wait(2)
	I.click(locate('.tree-link').withText('A valider'));
	I.wait(2)

	search.results.seeFieldValueInRow(tags.get("Date_du_courrier").id, date, 1);
	search.results.open(1);
	I.wait(2)
	I.click("button#Valider")

	I.logout();

	var user = "user_Stagiaire";
	I.login(user)

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

	search.results.seeFieldValueInRow(tags.get("Objet_du_courrier").id, "0409 - CP - courrier Stagiaires", 1);
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

}).tag('Reponse').tag('user_Stagiaire');
