//<reference path="../../steps.d.ts" />

const fs = require('fs');
const tagsArray = JSON.parse(fs.readFileSync('./data/data_tags.json'));
const tags = new Map();
for (const [clef, value] of Object.entries(tagsArray)) tags.set(clef, value);

const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

Scenario('0310 - Process a mail to be delivered user_GesCP', async ({ I, search, insert, task }) => {
    //create enveloppe affected to user_GesCP
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

    task.form.fillTag(tags.get("Objet_du_courrier").id, "0310 - CP - courrier A distribuer");

    task.form.fillTextTag(tags.get("Commentaire").id, "test 0310");

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
    I.waitForElement(locate(".tree-link").withText("A distribuer"), 5);
    I.click(locate('.tree-link').withText('A distribuer'));
    search.results.open(1);
    I.waitForElement("div.title-container", 10);
    I.refreshPage();
    I.waitForElement("#more", 20);
    I.click("#more");
    I.click("div#assign");
    I.waitForElement(".search-textbox input", 5);
    I.fillField(".search-textbox input", "gestionnaire")
    I.wait(1)
    I.checkOption("Gestionnaire Carrieres et Prestations")
    I.waitForElement("Button#assign", 5);
    I.click("Button#assign")
    I.waitForElement("#yes", 5);
    I.click("#yes")

    I.logout();

    //end creation courrier

    user = "user_GesCP";

    I.login(user);
    I.wait(2);
    search.open("Tous les courriers", false);

    I.waitForElement(locate('.tree-link').withText('A indexer'), 10);
    I.seeElement(locate('.tree-link').withText('A distribuer'));
    I.seeElement(locate('.tree-link').withText('Carrières et Prestations'));

    I.click(locate('.tree-link').withText('A distribuer'));

    search.results.open(1);
    I.waitForElement('.tag-container', 20);

    var idpli = await I.grabValueFrom('.tag-container ' + tags.get("Identifiant_du_pli").id + ' input');

    task.footer.reafecterListCirterion(tags.get("Sous-service").id, "Affiliés Groupe A-J")

    I.wait(1)
    search.open("Tous les courriers", false);
    I.wait(2.5);
    I.click(locate('.tree-link').withText('Carrières et Prestations'));
    I.wait(2.5);
    I.click(locate('.tree-link').withText('Affiliés Groupe A-J'));
    I.wait(2.5);

    search.results.open(1);
    I.waitForElement(tags.get("Identifiant_du_pli").id, 10);
    task.form.seeTag(tags.get("Identifiant_du_pli").id, idpli);

}).tag('traitement').tag('user_GesCP');