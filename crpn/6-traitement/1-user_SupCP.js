//<reference path="../../steps.d.ts" />

Feature('Traitement');

const fs = require('fs');
const tagsArray = JSON.parse(fs.readFileSync('./data/data_tags.json'));
const tags = new Map();
for (const [clef, value] of Object.entries(tagsArray)) tags.set(clef, value);

const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

Scenario('0117 - Process a mail to be delivered user_SupCP', async ({ I, search, insert, task }) => {
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

	task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Fax);
	task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Contact);
	task.form.fillListTag(tags.get("Type_de_chemise").id, tags.get("Type_de_chemise").Divers_a_classer);

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0117 - CP - courrier A distribuer");

	task.form.fillTextTag(tags.get("Commentaire").id, "test 0117");

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
	I.wait(2)
	I.waitForElement('#create:not(.disabled)', 10);
	I.wait(2)
	I.click("#create");

	I.waitForElement("#Initiate", 10)
	I.click("#Initiate");

	I.waitForElement('.B_Priorite', 20);

	I.say('Verification de la creation du courrier');
	search.open("Tous les courriers", false);
	I.click(locate('.tree-link').withText('A distribuer'));

	I.waitForElement('.search-criteria-container', 20);
	I.wait(2);
	search.results.open(1);
	I.waitForElement(tags.get("Identifiant_du_pli").id, 10);
	task.form.seeTag(tags.get("Identifiant_du_pli").id, idpli);
	//end 0109

	search.open("Tous les courriers", false);

	I.waitForElement(locate('.tree-link').withText('A indexer'), 10);
	I.seeElement(locate('.tree-link').withText('A distribuer'));
	I.seeElement(locate('.tree-link').withText('Carrières et Prestations'));
	I.seeElement(locate('.tree-link').withText('Assignés par statut'));

	I.click(locate('.tree-link').withText('A distribuer'));

	search.results.open(1);
	I.waitForElement(".tag-container " + tags.get("Identifiant_du_pli").id + ' input', 10);
	I.waitForElement(".tag-container " + tags.get("Identifiant_du_pli").id + ' input', 10);

	var idpli = await I.grabValueFrom('.tag-container ' + tags.get("Identifiant_du_pli").id + ' input');

	task.footer.reafecterListCirterion(tags.get("Sous-service").id, "Affiliés Groupe A-J")

	I.waitForElement(".tree-link", 10)

	search.open("Tous les courriers", false);
	I.click(locate('.tree-link').withText('Carrières et Prestations'));
	I.click(locate('.tree-link').withText('Affiliés Groupe A-J'));

	search.results.open(1);

	I.waitForElement(".tag-container " + tags.get("Identifiant_du_pli").id + ' input', 10);
	task.form.seeTag(tags.get("Identifiant_du_pli").id, idpli);

}).tag('traitement').tag('user_SupCP');

Scenario('0118 - Process a mail to be processed and submit a validation request user_SupCP', async ({ I, search, browse, task }) => {
	//need run test 104 before
	var user = "user_SupCP";
	I.login(user);
	search.open("Mes courriers", false);
	I.wait(0.5);
	I.click(locate('.tree-link').withText('En traitement'));

	I.wait(2)

	browse.form.fillFieldCriterion(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Affiliation);
	I.click(".advanced-search #search");

	I.wait(2)
	search.results.open(1);
	I.waitForElement('Button#DemandeValidation', 10);
	I.click('Button#DemandeValidation');

	I.wait(2)

	I.waitForElement(tags.get("Demandeur_de_la_validation").id + ' .value-' + tags.get("Demandeur_de_la_validation").Superviseur_Carrieres_et_Prestations, 10)

	task.form.validationRequest(tags.get("Valideur").id, tags.get("Valideur").Gestionnaire_Carrieres_et_Prestations, "Gestionnaire");
	I.click('button[id="Demander validation"')

	I.wait(2)
	search.open("Tous les courriers", false);
	I.wait(2)
	I.click(locate(".tree-link").withText("Gestionnaire Carrieres et Prestations"));

	I.click(locate('.item-user_GesCP').withText('A valider'));

	browse.form.fillFieldCriterion(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Affiliation);
	I.click(".advanced-search #search");

	I.wait(2)
	search.results.open(1);
	I.wait(5);
	I.click("#cancel");

}).tag('traitement').tag('user_SupCP');