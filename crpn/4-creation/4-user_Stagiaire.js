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




Scenario('0404 - Add envelope to mailboxes Group A-J with account user_Stagiaire', async ({ I, task }) => {
	var user = "user_Stagiaire";

	I.login(user);

	task.createEnvelope(user)

	I.say('Verification des valeurs possibles courrier');

	task.form.seeListPossibleValues("Type_de_courrier", tags);
	task.form.seeListPossibleValues("Canal", tags);
	task.form.seeListPossibleValues("Type_de_chemise", tags);
	task.form.seeListPossibleValues("Beneficiaire", tags);
	task.form.seeListPossibleValues("Participant", tags);
	task.form.seeListPossibleValues("Statut_tiers", tags);
	task.form.seeListPossibleValues("Service", tags);

	task.form.fillListTag(tags.get("Service").id, tags.get("Service").Carriere_et_Prestations);
	task.form.seeListPossibleValues("Sous-service", tags);

	task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Courrier_Papier);

	task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Affiliation);
	task.form.fillTag(tags.get("N_Tiers").id, "65432");

	I.say('Ajout de la PJ');
	I.click("#create-attached");

	I.say('Verification des valeurs possibles PJ');

	task.form.seeListPossibleValues("Type_de_document", tags);
	task.form.seeListPossibleValues("Nature_de_document", tags);
	task.form.seeListPossibleValues("Dossier_de_pension", tags);
	task.form.seeListPossibleValues("Paiement", tags);


	I.say('Verification des valeurs par defaut PJ');
	task.form.seeListTag(tags.get("Dossier_de_pension").id, tags.get("Dossier_de_pension").Non);
	task.form.seeListTag(tags.get("Paiement").id, tags.get("Paiement").Non);
}).tag('creation').tag('user_Stagiaire');

