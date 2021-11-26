//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Search / Text criteria');

//TODO FIXME Actually adding column before checking results. Normally if looking for criterion, it should be displayed 

Scenario('Search with text criterion and CONTAINS operator', async ({ I, search, task, data }) => {
    let comment = await createDocumentAndUpdateTaskComment(I, task, data);
    search.openDefault();
    search.form.category.select('Tâche');
    search.form.openAdvancedSearch();
    search.form.selectFreeCriterionOperator('LastCommentaire', 'CONTAINS');
    search.form.fillTextAreaCriterion("LastCommentaire", comment.substring(comment.length / 4, comment.length / 2));
    search.form.launchSearch();
    I.waitForGlassPanelHidden();
    search.results.seeFirst(comment);
}).tag('search').tag('text').tag('contains');


Scenario('Search with text criterion and STARTS_WITH operator', async ({ I, search, task, data }) => {
    let comment = await createDocumentAndUpdateTaskComment(I, task, data);
    search.openDefault();
    search.form.category.select('Tâche');
    search.form.openAdvancedSearch();
    search.form.selectFreeCriterionOperator('LastCommentaire', 'STARTS_WITH');
    search.form.fillTextAreaCriterion("LastCommentaire", comment.substring(0, comment.length / 4));
    search.form.launchSearch();
    I.waitForGlassPanelHidden();
    search.results.seeFirst(comment);
}).tag('search').tag('text').tag('startsWith');


Scenario('Search with text criterion and ENDS_WITH operator', async ({ I, search, task, data }) => {
    let comment = await createDocumentAndUpdateTaskComment(I, task, data);
    search.openDefault();
    search.form.category.select('Tâche');
    search.form.openAdvancedSearch();
    search.form.selectFreeCriterionOperator('LastCommentaire', 'ENDS_WITH');
    search.form.fillTextAreaCriterion("LastCommentaire", comment.substring(comment.length / 4, comment.length));
    search.form.launchSearch();
    I.waitForGlassPanelHidden();
    search.results.seeFirst(comment);
}).tag('search').tag('text').tag('endsWith');


Scenario('Search with text criterion and DIFFERENT operator', async ({ I, search, task, data }) => {
    let comment = await createDocumentAndUpdateTaskComment(I, task, data);
    search.openDefault();
    search.form.category.select('Tâche');
    search.form.openAdvancedSearch();
    search.form.selectFreeCriterionOperator('LastCommentaire', 'DIFFERENT');
    search.form.fillTextAreaCriterion("LastCommentaire", comment);
    search.form.launchSearch();
    I.waitForGlassPanelHidden();
    search.results.dontSeeInResults(comment);
}).tag('search').tag('text').tag('different');

Scenario('Search with text criterion and EQUALS_TO operator', async ({ I, search, task, data }) => {
    let comment = await createDocumentAndUpdateTaskComment(I, task, data);
    search.openDefault();
    search.form.category.select('Tâche');
    search.form.openAdvancedSearch();
    search.form.selectFreeCriterionOperator('LastCommentaire', 'EQUALS_TO');
    search.form.fillTextAreaCriterion("LastCommentaire", comment);
    search.form.launchSearch();
    I.waitForGlassPanelHidden();
    search.results.seeFirst(comment);
}).tag('search').tag('text').tag('equalsTo');

async function createDocumentAndUpdateTaskComment(I, task, data) {
    let comment = data.faker.system.commonFileName();
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.form.fillTextTag('.Commentaire', comment);
    task.attachments.attachNewDocument('.Reponse', 'data/light.txt');
    I.waitForGlassPanelHidden();
    task.footer.clickAndConfirm('#Valider');
    return comment;
}