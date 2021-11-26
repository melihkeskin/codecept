//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Search / Date criteria');

Scenario('Search with date criterion "from" and "to" fields filled', async ({ I, search }) => {
    let beforeDocumentCreation = I.getDate();
    var document = await I.createDocument({}, true);
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.selectFreeCriterionOperator('creationDate');
    
    search.form.fillDateCriterion(beforeDocumentCreation, I.getDate());
    search.form.launchSearch();
    search.results.seeFirst(document.name);
}).tag('search').tag('date');

Scenario('Search with date criterion with only "from" field filled', async ({ I, search }) => {
    let beforeDocumentCreation = I.getDate();
    var document = await I.createDocument({}, true);
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.selectFreeCriterionOperator('creationDate');
    search.form.fillDateCriterion(beforeDocumentCreation, null);
    search.form.launchSearch();
    search.results.seeFirst(document.name);
}).tag('search').tag('date');

Scenario('Search with date criterion with only "to" field filled', async ({ I, search }) => {
    var document = await I.createDocument({}, true);
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.selectFreeCriterionOperator('creationDate');
    search.form.fillDateCriterion(null, I.getDate());
    search.form.launchSearch();
    search.results.seeFirst(document.name);
}).tag('search').tag('date');

Scenario('Select date from "to" picker and have 23:59:59 has HHmmSS', async ({ I, search }) => {
    await I.createDocument({}, true);
    search.open('.documentSearchTab');
    search.form.selectDayFromDateCriterionPicker(null, '1', true);

    search.form.seeToDateCriterion("DateCourrier", '23:59:59');
}).tag('search').tag('date');

Scenario('Fill date from "to" text box and keep filled HHmmSS after date picker selection', async ({ I, search }) => {
    await I.createDocument({}, true);
    search.open('.documentSearchTab');

    let filledDate = '15 mai 2020 10:25:32';
    let expectedDate = '1 mai 2020 10:25:32';
    search.form.fillDateCriterion(null, filledDate);
    search.form.selectDayFromDateCriterionPicker(null, '1');

    search.form.seeToDateCriterion("DateCourrier", expectedDate);
}).tag('search').tag('date');

Scenario('Fill date from "to" text box and blur keep filled HHmmSS', async ({ I, search }) => {
    await I.createDocument({}, true);
    search.open('.documentSearchTab');

    let filledDate = '15 mai 2020 10:25:32';
    let expectedDate = '1 mai 2020 10:25:32';
    I.wait(1);
    search.form.fillDateCriterion(null, filledDate);
    //To blur 'to' field, , type in 'from"
    search.form.fillDateCriterion(' ', null);
    search.form.selectDayFromDateCriterionPicker(null, '1', true);

    search.form.seeToDateCriterion("DateCourrier", expectedDate);
}).tag('search').tag('date');

Scenario('Fill date from "to" text box, then fill and invalid date and keep filled last valid date HHmmSS', async ({ I, search }) => {
    await I.createDocument({}, true);
    search.open('.documentSearchTab');

    let filledDate = '15 mai 2020 10:25:32';
    let expectedDate = '1 mai 2020 10:25:32';

    search.form.selectFreeCriterionOperator('creationDate');
    search.form.fillDateCriterion(null, filledDate);
    search.form.fillDateCriterion(null, 'INVALID' + filledDate);
    search.form.selectDayFromDateCriterionPicker(null, '1');

    search.form.seeToDateCriterion("DateCourrier", expectedDate);
}).tag('search').tag('date');

Scenario('Fill date from "to" text box, then clear text box with cross and select date from picker and have 23:59:59 has HHmmSS', async ({ I, search }) => {
    await I.createDocument({}, true);
    search.open('.documentSearchTab');

    search.form.fillDateCriterion(null, I.getDate());
    search.form.clearToDateCriterion();
    search.form.selectDayFromDateCriterionPicker(null, '1');

    search.form.seeToDateCriterion("DateCourrier", '23:59:59');
}).tag('search').tag('date');

Scenario('Fill date from "to" text box, then clear text box and select date from picker and have 23:59:59 has HHmmSS', async ({ I, search }) => {
    await I.createDocument({}, true);
    search.open('.documentSearchTab');

    search.form.fillDateCriterion(null, I.getDate())
    search.form.fillDateCriterion(null, ' ');
    search.form.selectDayFromDateCriterionPicker(null, '1');

    search.form.seeToDateCriterion("DateCourrier", '23:59:59');
}).tag('search').tag('date');

Scenario('Select date from "from" picker and have 00:00:00 has HHmmSS', async ({ I, search }) => {
    await I.createDocument({}, true);
    search.open('.documentSearchTab');
    search.form.selectDayFromDateCriterionPicker("1", null, true);

    search.form.seeFromDateCriterion("DateCourrier", '00:00:00');
}).tag('search').tag('date');

Scenario('Fill date "from" text box and keep filled HHmmSS after date picker selection', async ({ I, search }) => {
    await I.createDocument({}, true);
    search.open('.documentSearchTab');

    let filledDate = '15 mai 2020 10:25:32';
    let expectedDate = '1 mai 2020 10:25:32';
    search.form.fillDateCriterion(filledDate, null);
    search.form.selectDayFromDateCriterionPicker("1", null);

    search.form.seeFromDateCriterion("DateCourrier", expectedDate);
}).tag('search').tag('date');

Scenario('Fill date "from" text box and blur keep filled HHmmSS', async ({ I, search }) => {
    await I.createDocument({}, true);
    search.open('.documentSearchTab');

    let filledDate = '15 mai 2020 10:25:32';
    let expectedDate = '1 mai 2020 10:25:32';
    search.form.fillDateCriterion(filledDate, null);
    I.wait(1);
    //To blur 'from' field, type in 'to"
    search.form.fillDateCriterion(null, ' ');
    search.form.selectDayFromDateCriterionPicker("1", null, true);

    search.form.seeFromDateCriterion("DateCourrier", expectedDate);
}).tag('search').tag('date');

Scenario('Fill date "from" text box, then fill and invalid date and keep filled last valid date HHmmSS', async ({ I, search }) => {
    await I.createDocument({}, true);
    search.open('.documentSearchTab');

    let filledDate = '15 mai 2020 10:25:32';
    let expectedDate = '1 mai 2020 10:25:32';

    search.form.selectFreeCriterionOperator('creationDate');
    search.form.fillDateCriterion(filledDate, null);
    search.form.fillDateCriterion('INVALID' + filledDate, null);
    search.form.selectDayFromDateCriterionPicker("1", null);

    search.form.seeFromDateCriterion("DateCourrier", expectedDate);
}).tag('search').tag('date');

Scenario('Fill date "from" text box, then clear text box with cross and select date from picker and have 00:00:00 as HHmmSS', async ({ I, search }) => {
    await I.createDocument({}, true);
    search.open('.documentSearchTab');

    search.form.fillDateCriterion(I.getDate(), null);
    search.form.clearFromDateCriterion();
    search.form.selectDayFromDateCriterionPicker("1", null);

    search.form.seeFromDateCriterion("DateCourrier", '00:00:00');
}).tag('search').tag('date');

Scenario('Fill date "from" text box, then clear text box and select date from picker and have 00:00:00 as HHmmSS', async ({ I, search }) => {
    await I.createDocument({}, true);
    search.open('.documentSearchTab');

    search.form.fillDateCriterion(I.getDate(), null);
    search.form.fillDateCriterion('', null);
    search.form.selectDayFromDateCriterionPicker("1", null);

    search.form.seeFromDateCriterion("DateCourrier", '00:00:00');
}).tag('search').tag('date');

Scenario('Given a date criterion without HHmmSS, When I fill "from" and "to" with same date, then I find my document', async ({ I, search }) => {
    var document = await I.createDocument({ 'classId': 'DocumentTestTags', 'tags': {'DateTagWithoutHHMMSSPattern': Date.now().toString()} }, true);
    search.openDefault();
    search.form.openAdvancedSearch();
    search.form.selectFreeCriterionOperator('DateTagWithoutHHMMSSPattern');
    var today = I.getDate('dd/mm/yyyy');
    search.form.fillDateCriterion(today, today);
    search.form.launchSearch();
    search.results.seeFirst(document.name);
}).tag('search').tag('date');