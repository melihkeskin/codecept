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

Scenario('0204 - Add envelope to "To assign" mailboxes user_SupER', async ({ I, task, insert, search }) => {
	var user = "user_SupER";
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
	task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Autre);

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0204 - ER - courrier A assigner");

	task.form.fillTextTag(tags.get("Commentaire").id, "test 0204");

	task.form.fillTag(tags.get("N_Tiers").id, "65432");
	I.click(tags.get("Commentaire").id);
	task.form.fillTag(tags.get("N_SIREN").id, "654");


	task.form.fillListTag(tags.get("Service").id, tags.get("Service").Employeur_Recouvrement);

	I.say('Verification statut courrier');
	task.form.seeListTag(tags.get("Statut_du_courrier").id, "A traiter");
	task.form.seeReadOnlyTag(tags.get("Statut_du_courrier").id);


	I.say('Ajout de la PJ');

	I.click("#create-attached");

	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").RIB);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Donnees_personnelles);

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref021");


	I.say('Verification contenue de tags pré-remplies');


	task.form.seeListTag(tags.get("Dossier_de_pension").id, tags.get("Dossier_de_pension").Non);
	I.waitForElement(tags.get("Dossier_de_pension").id, 5)
	task.form.seeListTag(tags.get("Paiement").id, tags.get("Paiement").Non);
	I.waitForElement(tags.get("Paiement").id, 5)
	task.form.seeListTag(tags.get("Statut_du_document").id, "Disponible");
	I.waitForElement(tags.get("Statut_du_document").id, 5)
	task.form.seeReadOnlyTag(tags.get("Statut_du_document").id);
	I.waitForElement(tags.get("Statut_du_document").id, 5)

	task.form.seeTag(tags.get("N_SIREN").id, "654");

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
	task.form.seeListTag(tags.get("Type_de_courrier").id, "Autre");
	task.form.seeTag(tags.get("Objet_du_courrier").id, "0204 - ER - courrier A assigner");
	task.form.seeTextTag(tags.get("Commentaire").id, "test 0204");

	insert.addFile('data/document_insert/rib.png');

	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.waitForElement("#Initiate", 10);
	I.click("#Initiate");
	I.wait(5);

	I.say('Verification de la creation du courrier');
	search.open("Tous les courriers", false);
	I.click(locate('.tree-link').withText('A assigner'));
	I.waitForElement('.search-criteria-container', 20);
	I.wait(2);
	search.results.open(1);
	I.waitForElement(tags.get("Identifiant_du_pli").id, 10);
	task.form.seeTag(tags.get("Identifiant_du_pli").id, idpli);


}).tag('creation').tag('user_SupER');

/* Scenario('0205 - Add envelope to "To index" mailboxes user_SupER', async ({I,task,insert,search}) => {
	var user = "user_SupER";
	var date = new Date();

	I.login(user);
	I.wait(2);

	I.say('Creation de courrier');
	I.waitForElement(users.get(user).shortcuts_dropdown,10);
	I.wait(2)
	I.click(users.get(user).shortcuts_dropdown);
	I.wait(2)
	I.waitForElement(users.get(user).shortcut_crea_courrier,10);
I.click(users.get(user).shortcut_crea_courrier);
	
	I.say('Verification des remplissage automatiques');

	var time = "MANUEL";
	time = time.concat('_',date.getTime()).substring(0,13);
	task.form.seeTag(tags.get("Identifiant_du_pli").id,time);
	task.form.seeReadOnlyTag(tags.get("Identifiant_du_pli").id);

	task.form.seeTag(tags.get("Date_du_courrier").id,date.getDate());
	task.form.seeTag(tags.get("Date_du_courrier").id,date.getFullYear());

	I.say('remplissage des tags');

	task.form.fillListTag(tags.get("Canal")					.id ,tags.get("Canal")				.Email);
	task.form.fillListTag(tags.get("Type_de_courrier")		.id ,tags.get("Type_de_courrier")	.Contact);
	
	task.form.fillTag(tags.get("Objet_du_courrier")			.id  ,"0205 - ER - courrier A indexer");
	task.form.fillTextTag(tags.get("Commentaire")			.id  ,"test 0205");

	var idpli = await I.grabValueFrom('.tag-container ' + tags.get("Identifiant_du_pli").id +' input'); 
	
	
	task.form.fillTag(tags.get("N_SIREN")					.id	,"654");
	task.form.fillListTag(tags.get("Service")				.id 	,tags.get("Service")			.Employeur_Recouvrement);


	I.say('Verification statut courrier');
	task.form.seeListTag(tags.get("Statut_du_courrier")		.id	,"A traiter");
	task.form.seeReadOnlyTag(tags.get("Statut_du_courrier")	.id);

	pause()
	I.say('Ajout de la PJ');

	I.click("#create-attached");

	task.form.fillListTag(tags.get("Type_de_document")		.id 	,tags.get("Type_de_document")	.Bulletin_de_paye);
	task.form.fillListTag(tags.get("Nature_de_document")	.id 	,tags.get("Nature_de_document")	.Demandes);

	task.form.fillTag(tags.get("Reference_d_archivage")		.id	,"Ref022");


	I.say('Verification contenue de tags pré-remplies');

	task.form.seeTag(tags.get("N_SIREN")					.id	,"654");

	task.form.seeListTag(tags.get("Dossier_de_pension")		.id	, tags.get("Dossier_de_pension")	.Non);
	task.form.seeListTag(tags.get("Paiement")				.id	, tags.get("Paiement")				.Non);

	task.form.seeListTag(tags.get("Statut_du_document")		.id	,"Disponible");
	task.form.seeReadOnlyTag(tags.get("Statut_du_document")	.id);


	I.say('Verification des tags en lecture seule');

	task.form.seeReadOnlyTag(tags.get("N_Tiers")			.id  );
	task.form.seeReadOnlyTag(tags.get("N_Tiers_associe")	.id	);
	task.form.seeReadOnlyTag(tags.get("Code_carriere")		.id	);
	task.form.seeReadOnlyTag(tags.get("Nom_du_client")		.id	);
	task.form.seeReadOnlyTag(tags.get("Prenom_du_client")	.id	);
	task.form.seeReadOnlyTag(tags.get("Date_de_naissance")	.id	);
	task.form.seeReadOnlyTag(tags.get("N_SS")				.id	);
	task.form.seeReadOnlyTag(tags.get("Contact_du_client")	.id	);
	
	task.form.seeReadOnlyTag(tags.get("Beneficiaire")		.id 	);
	task.form.seeReadOnlyTag(tags.get("Participant")		.id 	);
	task.form.seeReadOnlyTag(tags.get("Statut_tiers")		.id 	);

	pause()
	task.form.seeTag(tags.get("Identifiant_du_pli").id,time);
	task.form.seeReadOnlyTag(tags.get("Identifiant_du_pli")	.id);

	task.form.seeTag(tags.get("Date_du_courrier").id,date.getDate());
	task.form.seeTag(tags.get("Date_du_courrier").id,date.getFullYear());

	task.form.seeListTag(tags.get("Canal")					.id , "Email");
	task.form.seeListTag(tags.get("Type_de_courrier")		.id , "Contact");
	task.form.seeTag(tags.get("Objet_du_courrier")			.id  ,"0205 - ER - courrier A indexer");
	task.form.seeTextTag(tags.get("Commentaire")			.id  ,"test 0205");

	insert.addFile('data/document_insert/paie.png');
 
 
 
 I.waitForElement('#create:not(.disabled)',10);
	I.click("#create");
	I.waitForElement("#Initiate",10);
	I.click("#Initiate");
	I.wait(5);


	I.say('Verification de la creation du courrier');
	search.open("Tous les courriers",false);
	I.click(locate('.tree-link').withText('A indexer'));
	I.waitForElement('.search-criteria-container', 20);
	I.wait(2);
	search.results.open(1);
	I.waitForElement(tags.get("Identifiant_du_pli").id,10);
	task.form.seeTag(tags.get("Identifiant_du_pli").id  , idpli);
	

}).tag('creation').tag('user_SupER');
 */

Scenario('0206 - Add envelope to "assigned" mailboxes user_SupER', async ({ I, task, insert, search }) => {
	var user = "user_SupER";
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

	task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Fax);
	task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Echeancier);

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0206 - ER - courrier Assigné");
	task.form.fillTextTag(tags.get("Commentaire").id, "test 0206");
	task.form.fillTag(tags.get("N_Tiers").id, "56789");
	I.click(tags.get("N_SIREN").id);
	task.form.fillTag(tags.get("N_SIREN").id, "789");
	task.form.fillTag(tags.get("Raison_sociale").id, "COMPAGNIE");

	task.form.fillListTagWithSearch(tags.get("Gestionnaire_du_dossier").id, tags.get("Gestionnaire_du_dossier").Gestionnaire_Employeur_et_Recouvrement, "Gestionnaire");
	task.form.fillListTag(tags.get("Service").id, tags.get("Service").Employeur_Recouvrement);

	var idpli = await I.grabValueFrom('.tag-container ' + tags.get("Identifiant_du_pli").id + ' input');

	I.say('Verification statut courrier');
	task.form.seeListTag(tags.get("Statut_du_courrier").id, "A traiter");
	task.form.seeReadOnlyTag(tags.get("Statut_du_courrier").id);


	I.say('Ajout de la PJ');

	I.click("#create-attached");

	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").Lettre_cheque);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Autre);

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref023");


	I.say('Verification contenue de tags pré-remplies');


	I.waitForElement(tags.get("N_SIREN").id, 5)
	task.form.seeTag(tags.get("N_SIREN").id, "789");
	I.waitForElement(tags.get("N_Tiers").id, 5)
	task.form.seeTag(tags.get("N_Tiers").id, "56789");
	I.waitForElement(tags.get("Dossier_de_pension").id, 5)
	task.form.seeListTag(tags.get("Dossier_de_pension").id, tags.get("Dossier_de_pension").Non);
	I.waitForElement(tags.get("Paiement").id, 5)
	task.form.seeListTag(tags.get("Paiement").id, tags.get("Paiement").Non);
	I.waitForElement(tags.get("Statut_du_document").id, 5)
	task.form.seeListTag(tags.get("Statut_du_document").id, "Disponible");
	I.waitForElement(tags.get("Statut_du_document").id, 5)
	task.form.seeReadOnlyTag(tags.get("Statut_du_document").id);

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

	task.form.seeListTag(tags.get("Canal").id, "Fax");
	task.form.seeListTag(tags.get("Type_de_courrier").id, "Echéancier");
	task.form.seeTag(tags.get("Objet_du_courrier").id, "0206 - ER - courrier Assigné");
	task.form.seeTextTag(tags.get("Commentaire").id, "test 0206");

	insert.addFile('data/document_insert/Lettre_cheque.jpg');
	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.waitForElement("#Initiate", 10);
	I.click("#Initiate");
	I.wait(5);

	I.say('Verification de la creation du courrier');
	search.open("Tous les courriers", false);
	I.click(locate('.tree-link').withText('Assignés'));
	I.waitForElement('.search-criteria-container', 20);
	I.wait(2);
	search.results.open(1);
	I.waitForElement(tags.get("Identifiant_du_pli").id, 10);
	task.form.seeTag(tags.get("Identifiant_du_pli").id, idpli);


}).tag('creation').tag('user_SupER');

Scenario('0207 - Add envelope to "assigned" mailboxes with some documents user_SupER', async ({ I, task, insert, search }) => {
	var user = "user_SupER";
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

	task.form.fillTag(tags.get("Objet_du_courrier").id, "0207 - ER - courrier Assigné - plusieurs docs");
	task.form.fillTextTag(tags.get("Commentaire").id, "test 0207");
	task.form.fillTag(tags.get("N_Tiers").id, "56789");
	I.click(tags.get("N_SIREN").id);
	task.form.fillTag(tags.get("N_SIREN").id, "789");
	task.form.fillTag(tags.get("Raison_sociale").id, "COMPAGNIE");

	task.form.fillListTagWithSearch(tags.get("Gestionnaire_du_dossier").id, tags.get("Gestionnaire_du_dossier").Gestionnaire_Employeur_et_Recouvrement, "Gestionnaire");
	task.form.fillListTag(tags.get("Service").id, tags.get("Service").Employeur_Recouvrement);

	var idpli = await I.grabValueFrom('.tag-container ' + tags.get("Identifiant_du_pli").id + ' input');

	I.say('Verification statut courrier');
	task.form.seeListTag(tags.get("Statut_du_courrier").id, "A traiter");
	task.form.seeReadOnlyTag(tags.get("Statut_du_courrier").id);


	I.say('Ajout de la 1ere PJ');

	I.click("#create-attached");

	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").Lettre_cheque);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Autre);

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref024");


	I.say('Verification contenue de tags pré-remplies');


	I.waitForElement(tags.get("N_SIREN").id, 5)
	task.form.seeTag(tags.get("N_SIREN").id, "789");
	I.waitForElement(tags.get("N_Tiers").id, 5)
	task.form.seeTag(tags.get("N_Tiers").id, "56789");
	I.waitForElement(tags.get("Dossier_de_pension").id, 5)
	task.form.seeListTag(tags.get("Dossier_de_pension").id, tags.get("Dossier_de_pension").Non);
	I.waitForElement(tags.get("Paiement").id, 5)
	task.form.seeListTag(tags.get("Paiement").id, tags.get("Paiement").Non);
	I.waitForElement(tags.get("Statut_du_document").id, 5)
	task.form.seeListTag(tags.get("Statut_du_document").id, "Disponible");
	I.waitForElement(tags.get("Statut_du_document").id, 5)
	task.form.seeReadOnlyTag(tags.get("Statut_du_document").id);

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
	task.form.seeTag(tags.get("Objet_du_courrier").id, "0207 - ER - courrier Assigné - plusieurs docs");
	task.form.seeTextTag(tags.get("Commentaire").id, "test 0207");

	insert.addFile('data/document_insert/Lettre_cheque.jpg');
	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");

	I.say('Ajout de la 2eme PJ');

	I.click(".task-attachment:not(.selected) #create-attached")
	I.wait(2.5);

	task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").RIB);
	task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Autre);

	task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref025");


	I.say('Verification contenue de tags pré-remplies');


	I.waitForElement(tags.get("N_SIREN").id, 5)
	task.form.seeTag(tags.get("N_SIREN").id, "789");
	I.waitForElement(tags.get("N_Tiers").id, 5)
	task.form.seeTag(tags.get("N_Tiers").id, "56789");
	I.waitForElement(tags.get("Dossier_de_pension").id, 5)
	task.form.seeListTag(tags.get("Dossier_de_pension").id, tags.get("Dossier_de_pension").Non);
	I.waitForElement(tags.get("Paiement").id, 5)
	task.form.seeListTag(tags.get("Paiement").id, tags.get("Paiement").Non);
	I.waitForElement(tags.get("Statut_du_document").id, 5)
	task.form.seeListTag(tags.get("Statut_du_document").id, "Disponible");
	I.waitForElement(tags.get("Statut_du_document").id, 5)
	task.form.seeReadOnlyTag(tags.get("Statut_du_document").id);

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
	task.form.seeTag(tags.get("Objet_du_courrier").id, "0207 - ER - courrier Assigné - plusieurs docs");
	task.form.seeTextTag(tags.get("Commentaire").id, "test 0207");

	insert.addFile('data/document_insert/rib.png');

	I.waitForElement('#create:not(.disabled)', 10);
	I.click("#create");
	I.waitForElement("#Initiate", 10);
	I.click("#Initiate");
	I.wait(5);

	I.say('Verification de la creation du courrier');
	search.open("Tous les courriers", false);
	I.click(locate('.tree-link').withText('Assignés'));

	I.wait(2);
	search.results.open(1);
	I.waitForElement(tags.get("Identifiant_du_pli").id, 10);
	task.form.seeTag(tags.get("Identifiant_du_pli").id, idpli);


}).tag('creation').tag('user_SupER');