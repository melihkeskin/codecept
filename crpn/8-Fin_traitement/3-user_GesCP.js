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

Scenario('0313 - Finish processing a mail user_GesCP', async ({ I, search, insert, task, browse }) => {
    var user = "user_SupCP";
    var date = new Date();

    I.login(user);

    task.createEnvelope(user)

    I.say('remplissage des tags');

    task.form.fillListTag(tags.get("Canal").id, tags.get("Canal").Courrier_Papier);
    task.form.fillListTag(tags.get("Type_de_courrier").id, tags.get("Type_de_courrier").Contact);
    task.form.fillListTag(tags.get("Type_de_chemise").id, tags.get("Type_de_chemise").Calcul);

    task.form.fillTag(tags.get("Objet_du_courrier").id, "0313 - CP - courrier Affiliés A-J");

    task.form.fillTextTag(tags.get("Commentaire").id, "test 0313");

    task.form.fillTag(tags.get("N_Tiers").id, "102030");
    I.click(tags.get("Commentaire").id);
    task.form.fillTag(tags.get("N_Tiers_associe").id, "");
    task.form.fillTag(tags.get("Code_carriere").id, "001234");
    task.form.fillTag(tags.get("Nom_du_client").id, "Dupont");
    task.form.fillTag(tags.get("Prenom_du_client").id, "Martine");
    task.form.fillTag(tags.get("Date_de_naissance").id, "01/08/1972");
    task.form.fillTag(tags.get("N_SS").id, "1720892700123");
    task.form.fillTag(tags.get("Contact_du_client").id, "12 rue de Lilas 92700 Colombes");
    I.wait(0.5);
    task.form.fillListTag(tags.get("Beneficiaire").id, tags.get("Beneficiaire").Non);
    I.wait(0.5);
    task.form.fillListTag(tags.get("Participant").id, tags.get("Participant").Non);
    task.form.fillListTag(tags.get("Statut_tiers").id, tags.get("Statut_tiers").ACTIF);
    task.form.fillTag(tags.get("Raison_sociale").id, "ENTREPRISE");
    task.form.fillListTagWithSearch(tags.get("Service").id, tags.get("Service").Carriere_et_Prestations, "Carrières");

    I.say('Ajout de la PJ');

    I.click("#create-attached");

    task.form.fillListTag(tags.get("Type_de_document").id, tags.get("Type_de_document").RIB);
    task.form.fillListTag(tags.get("Nature_de_document").id, tags.get("Nature_de_document").Donnees_personnelles);

    task.form.fillTag(tags.get("Reference_d_archivage").id, "Ref301");

    insert.addFile('data/document_insert/rib.png');

    I.wait(5)
    I.waitForElement('#create:not(.disabled)', 10);
    I.click("#create");
    I.waitForElement("#Initiate", 10);
    I.click("#Initiate");

    I.wait(5);
    search.open("Tous les courriers", false);
    I.click(locate('.tree-link').withText('A distribuer'));
    I.wait(2)
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

    //
    I.login("user_GesCP");

    I.wait(2);
    search.open("Mes courriers", false);
    I.wait(2);
    I.click(locate(".tree-link").withText("Mes courriers assignés"));
    I.wait(1)
    I.click(tags.get("Type_de_courrier").id)
    I.fillField(".search-textbox", "Contact");
    I.wait(1.5)
    I.checkOption("#cb_0 input")
    I.click("#cancel")
    I.wait(2)
    I.click("#search")
    I.wait(2)

    search.results.open(1);

    I.wait(2);
    task.form.seeListTag(tags.get("Statut_du_courrier").id, "En traitement");

    I.waitForElement("#Valider", 10)
    I.click("#Valider")
    I.waitForElement("#yes", 10)
    I.click("#yes")

    I.wait(5)
    search.open("Courriers", false);
    I.wait(2)

    I.waitForElement(tags.get("Type_de_courrier").id);
    I.click(tags.get("Type_de_courrier").id)
    I.fillField(".search-textbox", "Contact");
    I.wait(1.5)
    I.checkOption("#cb_0 input")
    I.click("#cancel")
    I.wait(5)

    I.click("#add")
    I.fillField(".search-textbox", "Assigné à");
    I.wait(1.5)
    I.checkOption("#cb_0 input")
    I.click("#validate")


    I.click(tags.get("Assigne_a").id)
    I.fillField(".search-textbox", "gestionnaire");
    I.checkOption("#cb_0 input")
    I.click("#cancel")
    I.wait(5)

    I.click("#search")
    I.wait(5)

    search.results.open(1);

    I.wait(5)
    I.dontSeeElement("#Valider", 10)
    I.dontSeeElement("#ACorriger", 10)
    I.dontSeeElement("#saveAndQuit", 10)

    I.click("#cancel")

}).tag('fin_traitement').tag('user_GesCP');