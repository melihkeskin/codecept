//<reference path="../../steps.d.ts" />

Feature('Deconnexion');

const fs = require('fs');
const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

Scenario('0125 - Deconnexion Flower user_SupCP', async ({ I }) => {
    var user = "user_SupCP";
    I.login(user);

    I.logout();

}).tag("deconnexion").tag("user_SupCP");

Scenario('0221 - Deconnexion Flower user_SupER', async ({ I }) => {
    var user = "user_SupER";
    I.login(user);

    I.logout();

}).tag("deconnexion").tag("user_SupER");

Scenario('0315 - Deconnexion Flower user_GesCP', async ({ I }) => {
    var user = "user_GesCP";
    I.login(user);

    I.logout();

}).tag("deconnexion").tag("user_GesCP");

Scenario('0412 - Deconnexion Flower user_Stagiaire', async ({ I }) => {
    var user = "user_Stagiaire";
    I.login(user);

    I.logout();

}).tag("deconnexion").tag("user_Stagiaire");

Scenario('0516 - Deconnexion Flower user_GesER', async ({ I }) => {
    var user = "user_GesER";
    I.login(user);

    I.logout();

}).tag("deconnexion").tag("user_GesER");