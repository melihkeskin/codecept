//<reference path="../../steps.d.ts" />

const faker = require('faker');

Before({ login } => {
    login('admin');
});

Feature('Indexation / Conditional tag');

Scenario('Given a task form When I fill list tag matching condition Then I can create it', async ({ I, task }) => {
    let model = { 'name': faker.system.commonFileName(), 'classId': 'AccountingValidation' };
    await I.haveTaskCreationPopup(model);

    task.form.fillListTag('.AccountingMainType', 'ComptabiliteControleAnnuel');
    task.form.fillListTag('.AccountingSubType', 'E');
    task.form.create('La tâche a été créée avec succès.');

    model.id = await I.waitForFoundable('TASK', model.name, 'name');
    task.open(model.id);

    task.form.seeListTag('.AccountingMainType', 'Comptabilité contrôle annuel');
    task.form.seeListTagValue('.AccountingMainType', 'ComptabiliteControleAnnuel');

    task.form.seeListTag('.AccountingSubType', 'E - Ventes / Clients');
    task.form.seeListTagValue('.AccountingSubType', 'E');
}).tag('conditional');

Scenario('Given a conditional tag When I do not match condition Then values are filtered', async ({ I, task, objectPicker }) => {
    await I.haveTaskCreationPopup({ 'classId': 'AccountingValidation' });

    task.form.fillListTag('.AccountingMainType', 'ComptabiliteControleAnnuel');
    task.form.openListPicker('.AccountingSubType');
    objectPicker.see('E');
    objectPicker.see('G');
    objectPicker.see('C');
    objectPicker.select("E");

    task.form.fillListTag('.AccountingMainType', 'Fiscal');
    task.form.seeInvalidTag('AccountingSubType')

    task.form.openListPicker('.AccountingSubType');
    objectPicker.see('DeclarationTVA');
    objectPicker.see('TaxeApprentissage');
    objectPicker.select("TaxeApprentissage");
    task.form.seeListTag('.AccountingSubType', "Taxe d'apprentissage");
    task.form.seeValidTag('AccountingSubType')

    task.form.create('La tâche a été créée avec succès.');
}).tag('conditional');