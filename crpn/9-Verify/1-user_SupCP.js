//<reference path="../../steps.d.ts" />

Feature('Vérifier');

const fs = require('fs');
const tagsArray = JSON.parse(fs.readFileSync('./data/data_tags.json'));
const tags = new Map();
for (const [clef, value] of Object.entries(tagsArray)) tags.set(clef, value);

const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

Scenario('0123 - verify notif on email user_SupCP', async ({ I, search }) => {
    var user = "user_SupCP";
    I.login(user);

    I.wait(5);
    search.open("Tous les courriers", false);
    I.click(locate('.tree-link').withText('Carrières et Prestations'));
    I.wait(0.5);
    I.click(locate('.tree-link').withText('Affiliation et Identification'));

    search.results.selectAndShowContextualMenu(1);
    I.click(locate(".label").withText("Assigner à quelqu'un"));
    I.fillField(".search-textbox input", "gestionnaire");
    I.wait(1.5)
    I.checkOption("#cb_0 input");
    I.click("#assign");
    I.wait(2.5);
    I.click("#yes");
    I.refreshPage();

}).tag("verify").tag("user_SupCP");

Scenario('0124 - verify search on "Suivi des réaffectations" user_SupCP', async ({ I, search, browse }) => {
    var user = "user_SupCP";
    I.login(user);

    I.wait(5);
    search.open("Suivi des réaffectations", false);
    I.wait(2);

    I.seeElement(tags.get("N_Tiers").id);
    I.seeElement(tags.get("Identifiant_du_pli").id);
    I.seeElement(".GEC_DirectionInitiale");
    I.seeElement(".GEC_ServiceInitial");

    I.fillField(tags.get("N_Tiers").id + " .string-input", "125634");
    I.wait(0.5);
    I.click("#search");

    //See the row result
    I.waitForElement(".advanced-search", 10);
    I.seeElement(locate('thead').withText('Utilisateur ayant réalisé la réaffectation'));
    I.seeElement(locate('thead').withText('N° Tiers'));
    I.seeElement(locate('thead').withText('Identifiant du pli'));
    I.seeElement(locate('thead').withText('Type de courrier'));
    I.seeElement(locate('thead').withText('Objet du courrier'));
    I.seeElement(locate('thead').withText('Direction initiale'));
    I.seeElement(locate('thead').withText('Service initial'));
    I.seeElement(locate('thead').withText('Direction destinataire'));
    I.seeElement(locate('thead').withText('Service destinataire'));

    search.results.selectAndShowContextualMenu(1);
    I.seeElement(locate('.contextual-menu').withText('Ouvrir'));
    I.seeElement(locate('.contextual-menu').withText('Ouvrir dans une nouvelle fenêtre'));

}).tag("verify").tag("user_SupCP");

