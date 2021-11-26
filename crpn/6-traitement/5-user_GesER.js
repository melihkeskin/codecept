//<reference path="../../steps.d.ts" />


const fs = require('fs');
const tagsArray = JSON.parse(fs.readFileSync('./data/data_tags.json'));
const tags = new Map();
for (const [clef, value] of Object.entries(tagsArray)) tags.set(clef, value);

const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

Scenario('0509- Process a mail being processed and request validation user_GesER', async ({ I, search, insert, task }) => {
    //0504 before
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

    var idpli = await I.grabValueFrom('.tag-container ' + tags.get("Identifiant_du_pli").id + ' input');

    I.say('remplissage des tags');

    task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Courrier_Papier);
    task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Contact);

    task.form.fillTag(tags.get("Objet_du_courrier").id, "0504 - ER - courrier GesER");

    task.form.fillTextTag(tags.get("Commentaire").id, "test 0504");

    task.form.fillTag(tags.get("N_Tiers").id, "65432");

    task.form.fillListTagWithSearch(tags.get("Gestionnaire_du_dossier").id, tags.get("Gestionnaire_du_dossier").Gestionnaire_Employeur_et_Recouvrement, "Gestionnaire");
    task.form.fillListTag(tags.get("Service").id, tags.get("Service").Employeur_Recouvrement);

    I.say('Verification statut courrier');
    task.form.seeListTag(tags.get("Statut_du_courrier").id, "A traiter");
    task.form.seeReadOnlyTag(tags.get("Statut_du_courrier").id);

    I.say('Ajout de la PJ');

    I.click("#create-attached");

    task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").RIB);
    task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Donnees_personnelles);

    task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref501");

    insert.addFile('data/document_insert/rib.png');
    I.waitForElement('#create:not(.disabled)', 10);
    I.click("#create");
    I.waitForElement("#Initiate", 10);
    I.click("#Initiate");

    I.wait(2);

    search.open("Mes courriers", false);
    I.wait(2)
    I.click(locate('.tree-link').withText('En traitement'));
    I.wait(2)

    search.results.open(1);

    I.waitForElement('Button#DemandeValidation', 10);
    I.click('Button#DemandeValidation');

    I.wait(2)

    I.waitForElement(tags.get("Demandeur_de_la_validation").id + ' .value-' + tags.get("Demandeur_de_la_validation").Gestionnaire_Employeur_et_Recouvrement, 10)

    task.form.validationRequest(tags.get("Valideur").id, tags.get("Valideur").Superviseur_Employeur_et_Recouvrement, "Superviseur Employeur et recouvrement");
    I.click('button[id="Demander validation"')
    I.wait(5)

    search.open("Courriers", false);
    I.wait(2)
    I.click("#add")
    I.fillField(".search-textbox", "Statut du courrier");
    I.wait(1.5)

    I.checkOption("#cb_0")
    I.click("#validate")
    I.wait(2)

    I.click(tags.get("Statut_du_courrier").id)
    I.fillField(".search-textbox", "A valider");

    I.wait(1.5)
    I.checkOption("#cb_0 input")
    I.click("#cancel")
    I.wait(2)

    I.click("#search")
    I.wait(2)
    search.results.open(1);

    I.wait(2)
    I.dontSeeElement("#Valider", 10)
    I.dontSeeElement("#ACorriger", 10)
    I.dontSeeElement("#saveAndQuit", 10)

    task.form.seeReadOnlyTag(tags.get("Canal").id);
    task.form.seeReadOnlyTag(tags.get("Type_de_courrier").id);
    task.form.seeReadOnlyTag(tags.get("Objet_du_courrier").id);
    task.form.seeReadOnlyTag(tags.get("Commentaire").id);
    task.form.seeReadOnlyTag(tags.get("N_Tiers").id);
    task.form.seeReadOnlyTag(tags.get("Gestionnaire_du_dossier").id);
    task.form.seeReadOnlyTag(tags.get("Service").id);

    I.click("#cancel")
}).tag('traitement').tag('user_GesER');

Scenario('0510- Process a validation request user_GesER', async ({ I, search, insert, task }) => {

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

    var idpli = await I.grabValueFrom('.tag-container ' + tags.get("Identifiant_du_pli").id + ' input');

    I.say('remplissage des tags');

    task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Courrier_Papier);
    task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Contact);

    task.form.fillTag(tags.get("Objet_du_courrier").id, "0510 - ER - courrier GesER");

    task.form.fillTextTag(tags.get("Commentaire").id, "test 0510");

    task.form.fillTag(tags.get("N_Tiers").id, "65432");

    task.form.fillListTagWithSearch(tags.get("Gestionnaire_du_dossier").id, tags.get("Gestionnaire_du_dossier").Gestionnaire_Employeur_et_Recouvrement, "Gestionnaire");
    task.form.fillListTag(tags.get("Service").id, tags.get("Service").Employeur_Recouvrement);

    I.say('Verification statut courrier');
    task.form.seeListTag(tags.get("Statut_du_courrier").id, "A traiter");
    task.form.seeReadOnlyTag(tags.get("Statut_du_courrier").id);


    I.say('Ajout de la PJ');

    I.click("#create-attached");

    task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").RIB);
    task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Donnees_personnelles);

    task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref501");


    I.say('Verification contenue de tags pré-remplies');

    task.form.seeListTag(tags.get("Statut_du_document").id, "Disponible");
    task.form.seeReadOnlyTag(tags.get("Statut_du_document").id);

    task.form.seeListTag(tags.get("Dossier_de_pension").id, tags.get("Dossier_de_pension").Non);
    task.form.seeListTag(tags.get("Paiement").id, tags.get("Paiement").Non);

    task.form.seeTag(tags.get("N_Tiers").id, "65432");

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
    task.form.seeTag(tags.get("Objet_du_courrier").id, "0510 - ER - courrier GesER");
    task.form.seeTextTag(tags.get("Commentaire").id, "test 0510");

    insert.addFile('data/document_insert/rib.png');
    I.waitForElement('#create:not(.disabled)', 10);
    I.click("#create");
    I.waitForElement("#Initiate", 10);
    I.click("#Initiate");
    I.wait(2);

    I.say('Verification de la creation du courrier');

    search.open("Mes courriers", false);
    I.click(locate('.tree-link').withText('Mes courriers assignés'));

    I.wait(2);
    search.results.open(1);
    I.waitForElement(tags.get("Identifiant_du_pli").id, 10)
    task.form.seeTag(tags.get("Identifiant_du_pli").id, idpli);

    I.logout();
    user = "user_SupER";
    I.login(user);

    I.wait(5)
    search.open("Mes courriers", false);
    I.wait(2)
    I.click(locate('.tree-link').withText('A valider'));
    I.wait(2)

    search.results.open(1);

    I.waitForElement("#Valider", 10)
    I.waitForElement("#ACorriger", 10)
    I.waitForElement("#saveAndQuit", 10)
    I.waitForElement("#cancel", 10)

    I.click('Button#Valider');

}).tag('traitement').tag('user_GesER');