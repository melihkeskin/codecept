//<reference path="../../steps.d.ts" />

/* Feature('Fin-Traitement'); */

const fs = require('fs');
const { WaitTask } = require('puppeteer');
const tagsArray = JSON.parse(fs.readFileSync('./data/data_tags.json'));
const tags = new Map();
for (const [clef, value] of Object.entries(tagsArray)) tags.set(clef, value);

const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

Scenario('0218 - Finish processing a mail user_SupER', async ({ I, search, insert, task }) => {
    var user = "user_SupER";

    I.login(user);
    task.createEnvelope(user)

    I.say('remplissage des tags');

    task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Courrier_Papier);
    task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Contentieux);

    task.form.fillTag(tags.get("Objet_du_courrier").id, "0218 - ER - courrier Ajout de réponse");
    task.form.fillTextTag(tags.get("Commentaire").id, "test 0218");
    task.form.fillTag(tags.get("N_Tiers").id, "35741");
    I.click(tags.get("Commentaire").id);
    task.form.fillTag(tags.get("N_SIREN").id, "753");
    task.form.fillTag(tags.get("Raison_sociale").id, "SOCIETE");
    task.form.fillListTagWithSearch(tags.get("Gestionnaire_du_dossier").id, tags.get("Gestionnaire_du_dossier").Superviseur_Employeur_et_Recouvrement, "Superviseur");
    task.form.fillListTag(tags.get("Service").id, tags.get("Service").Employeur_Recouvrement);

    var idpli = await I.grabValueFrom('.tag-container ' + tags.get("Identifiant_du_pli").id + ' input');
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

    I.click(locate(".tree-link").withText("Mes courriers assignés"));

    I.wait(2);
    search.results.open(1);

    I.click(locate("button").withText("Traiter"));
    I.click(locate("button").withText("Oui"));

    I.wait(2);
    search.open("Courriers", false);
    I.wait(2)
    I.click("#add")
    I.fillField(".search-textbox", "Statut du courrier");
    I.wait(1.5)

    I.checkOption("#cb_0")
    I.click("#validate")
    I.wait(0.5)

    I.click(tags.get("Statut_du_courrier").id)
    I.fillField(".search-textbox", "Traité");
    I.wait(1.5)
    I.checkOption("input[value='Traite'")
    I.click("#cancel")
    I.wait(0.5)

    I.click("#search")
    I.wait(2)

    search.results.open(1);

    I.waitForElement(tags.get("Identifiant_du_pli").id, 10)
    task.form.seeTag(tags.get("Identifiant_du_pli").id, idpli);

    I.dontSeeElement("#Valider", 10)
    I.dontSeeElement("#ACorriger", 10)
    I.dontSeeElement("#saveAndQuit", 10)

    I.click("#cancel")
}).tag('fin_traitement').tag('user_SupER');
