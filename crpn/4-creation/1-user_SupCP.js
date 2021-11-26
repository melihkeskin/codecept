//<reference path="../../steps.d.ts" />

Feature('Creation');

const fs = require('fs');
const tagsArray = JSON.parse(fs.readFileSync('./data/data_tags.json'));
const tags = new Map();
for (const [clef, value] of Object.entries(tagsArray)) tags.set(clef, value);

const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

Scenario('0104 - Add envelope to mailboxes Group A-J with account user_SupCP', async ({ I, task, insert, search }) => {
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

	task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Courrier_Papier);
	task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Affiliation);
	task.form.fillListTag(tags.get("Type_de_chemise").id, tags.get("Type_de_chemise").Calcul);

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0104 - CP - courrier Affiliés A-J");

	task.form.fillTextTag(tags.get("Commentaire").id, "test 0104");

	task.form.fillTag(tags.get("N_Tiers").id, "12345");
	I.click(tags.get("Commentaire").id);
	task.form.fillTag(tags.get("N_Tiers_associe").id, "");
	task.form.fillTag(tags.get("Code_carriere").id, "000123");
	task.form.fillTag(tags.get("Nom_du_client").id, "Dupont");
	task.form.fillTag(tags.get("Prenom_du_client").id, "Jean");
	task.form.fillTag(tags.get("Date_de_naissance").id, "01/06/1975");
	task.form.fillTag(tags.get("N_SS").id, "1750692700123");
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

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref001");

	insert.addFile('data/document_insert/rib.png');

	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.waitForElement("#Initiate", 10);
	I.click("#Initiate");
	I.wait(5);

	I.say('Verification de la creation du courrier');
	I.waitForElement('.B_Priorite', 20);
	search.open("Tous les courriers", false);
	I.wait(5);
	I.click(locate('.tree-link').withText('Carrières et Prestations'));
	I.wait(5);
	I.click(locate('.tree-link').withText('Affiliés Groupe A-J'));

	I.waitForElement('.search-criteria-container', 20);
	I.wait(2);
	search.results.open(1);

	I.waitForElement(tags.get("Identifiant_du_pli").id, 10)
	task.form.seeTag(tags.get("Identifiant_du_pli").id, idpli);
	I.click(".footer .actions #Reaffecter");
	I.click("#Réaffecter");


}).tag('creation').tag('user_SupCP');

Scenario('0105 - Add envelope to mailboxes Group K-Z with account user_SupCP', async ({ I, task, insert, search }) => {
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

	task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Courrier_Papier);
	task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Assurance);
	task.form.fillListTag(tags.get("Type_de_chemise").id, tags.get("Type_de_chemise").Conseil_medical);
	task.form.fillTag(tags.get("Objet_du_courrier").id, "0105 - CP - courrier Affiliés K-Z");
	task.form.fillTextTag(tags.get("Commentaire").id, "test 0105");
	task.form.fillTag(tags.get("N_Tiers").id, "54321");
	I.click(tags.get("Commentaire").id);
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
	task.form.fillListTag(tags.get("Sous-service").id, tags.get("Sous-service").Affilies_Groupe_KZ);

	I.say('Verification statut courrier');
	task.form.seeListTag(tags.get("Statut_du_courrier").id, "A traiter");
	task.form.seeReadOnlyTag(tags.get("Statut_du_courrier").id);


	I.say('Ajout de la PJ');

	I.click("#create-attached");

	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").Lettre_cheque);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Prelevements);

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref002");

	insert.addFile('data/document_insert/Lettre_cheque.jpg');

	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.waitForElement("#Initiate", 10);
	I.click("#Initiate");
	I.wait(5);

	I.say('Verification de la creation du courrier');
	search.open("Tous les courriers", false);
	I.waitForElement(locate('.tree-link').withText('Carrières et Prestations'), 10);
	I.click(locate('.tree-link').withText('Carrières et Prestations'));
	I.waitForElement(locate('.tree-link').withText('Affiliés Groupe K-Z'), 10);
	I.click(locate('.tree-link').withText('Affiliés Groupe K-Z'));
	I.waitForElement('.search-criteria-container', 20);
	I.wait(2);
	search.results.open(1);
	I.waitForElement(tags.get("Identifiant_du_pli").id, 10);
	task.form.seeTag(tags.get("Identifiant_du_pli").id, idpli);
	I.click(".footer .actions #Reaffecter");
	I.click("#Réaffecter");

}).tag('creation').tag('user_SupCP');

Scenario('0106 - Add envelope to trainee mailboxes user_SupCP', async ({ I, task, insert, search }) => {
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

	task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Courrier_Papier);
	task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Assurance);
	task.form.fillListTag(tags.get("Type_de_chemise").id, tags.get("Type_de_chemise").Correspondances);

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0106 - CP - courrier Stagiaires");

	task.form.fillTextTag(tags.get("Commentaire").id, "test 0106");

	task.form.fillTag(tags.get("N_Tiers").id, "54321");
	I.click(tags.get("Commentaire").id);
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

	insert.addFile('data/document_insert/paie.png');

	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.waitForElement("#Initiate", 10);
	I.click("#Initiate");
	I.wait(10);

	I.say('Verification de la creation du courrier');

	search.open("Tous les courriers", false);
	I.wait(2);
	I.click(locate('.tree-link').withText('Carrières et Prestations'));
	I.wait(0.5);
	I.click(locate('.tree-link').withText('Affiliés Stagiaires'));
	I.waitForElement('.search-criteria-container', 20);
	I.wait(2);
	search.results.open(1);
	I.waitForElement(tags.get("Identifiant_du_pli").id, 10);
	task.form.seeTag(tags.get("Identifiant_du_pli").id, idpli);
	I.click(".footer .actions #Reaffecter");
	I.click("#Réaffecter");



}).tag('creation').tag('user_SupCP');

Scenario('0107 - Add envelope to Socials_actions and Pre_contentious mailboxes user_SupCP', async ({ I, task, insert, search }) => {
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

	task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Courrier_Papier);
	task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Assurance);
	task.form.fillListTag(tags.get("Type_de_chemise").id, tags.get("Type_de_chemise").Correspondances);

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0107 - CP - courrier Action sociale");

	task.form.fillTextTag(tags.get("Commentaire").id, "test 0107");

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
	task.form.fillListTag(tags.get("Sous-service").id, tags.get("Sous-service").Action_sociale_et_Pre_contentieux);

	I.say('Verification statut courrier');
	task.form.seeListTag(tags.get("Statut_du_courrier").id, "A traiter");
	task.form.seeReadOnlyTag(tags.get("Statut_du_courrier").id);


	I.say('Ajout de la PJ');

	I.click("#create-attached");

	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").Bulletin_de_paye);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Autre);

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref004");

	insert.addFile('data/document_insert/paie.png');

	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.waitForElement("#Initiate", 10);
	I.click("#Initiate");
	I.wait(5);

	I.say('Verification de la creation du courrier');
	search.open("Tous les courriers", false);
	I.click(locate('.tree-link').withText('Carrières et Prestations'));
	I.click(locate('.tree-link').withText('Action sociale et Pré-contentieux'));
	I.waitForElement('.search-criteria-container', 20);
	I.wait(2);
	search.results.open(1);
	I.waitForElement(tags.get("Identifiant_du_pli").id, 10);
	task.form.seeTag(tags.get("Identifiant_du_pli").id, idpli);
	I.click(".footer .actions #Reaffecter");
	I.click("#Réaffecter");

}).tag('creation').tag('user_SupCP');

Scenario('0108 - Add envelope to Affiliation and identification mailboxes user_SupCP', async ({ I, task, insert, search }) => {
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
	I.wait(2.5);
	task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Contact);
	I.wait(2.5);
	task.form.fillListTag(tags.get("Type_de_chemise").id, tags.get("Type_de_chemise").Divers_a_classer);
	I.wait(2.5);
	task.form.fillTag(tags.get("Objet_du_courrier").id, "0108 - CP - courrier Affiliation et identification");
	I.wait(2.5);
	task.form.fillTextTag(tags.get("Commentaire").id, "test 0108");

	task.form.fillTag(tags.get("N_Tiers").id, "12345");
	I.click(tags.get("Commentaire").id);
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
	task.form.fillListTag(tags.get("Sous-service").id, tags.get("Sous-service").Affiliation_et_Identification);

	I.say('Verification statut courrier');
	task.form.seeListTag(tags.get("Statut_du_courrier").id, "A traiter");
	task.form.seeReadOnlyTag(tags.get("Statut_du_courrier").id);


	I.say('Ajout de la PJ');

	I.click("#create-attached");

	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").RIB);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Autre);

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref005");

	insert.addFile('data/document_insert/paie.png');

	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.waitForElement("#Initiate", 10);
	I.click("#Initiate");
	I.wait(5);

	I.say('Verification de la creation du courrier');
	search.open("Tous les courriers", false);
	I.wait(5);
	I.click(locate('.tree-link').withText('Carrières et Prestations'));
	I.click(locate('.tree-link').withText('Affiliation et Identification'));
	I.waitForElement('.search-criteria-container', 20);
	I.wait(2);
	search.results.open(1);
	I.waitForElement(tags.get("Identifiant_du_pli").id, 10);
	task.form.seeTag(tags.get("Identifiant_du_pli").id, idpli);
	I.click(".footer .actions #Reaffecter");
	I.click("#Réaffecter");

}).tag('creation').tag('user_SupCP');

Scenario('0109 - Add envelope to "To distribute" mailboxes user_SupCP', async ({ I, task, insert, search }) => {
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

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0109 - CP - courrier A distribuer");

	task.form.fillTextTag(tags.get("Commentaire").id, "test 0109");

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

	I.say('Verification statut courrier');
	task.form.seeListTag(tags.get("Statut_du_courrier").id, "A traiter");
	task.form.seeReadOnlyTag(tags.get("Statut_du_courrier").id);

	I.say('Ajout de la PJ');

	I.click("#create-attached");

	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").Bulletin_de_paye);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Autre);

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref006");

	insert.addFile('data/document_insert/paie.png');
	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.waitForElement("#Initiate", 10);
	I.click("#Initiate");
	I.wait(5);

	I.say('Verification de la creation du courrier');
	search.open("Tous les courriers", false);
	I.click(locate('.tree-link').withText('A distribuer'));

	I.waitForElement('.search-criteria-container', 10);
	I.wait(2);
	search.results.open(1);
	I.waitForElement(tags.get("Identifiant_du_pli").id, 10);
	task.form.seeTag(tags.get("Identifiant_du_pli").id, idpli);
	I.click(".footer .actions #Reaffecter");
	I.click("#Réaffecter");

}).tag('creation').tag('user_SupCP');