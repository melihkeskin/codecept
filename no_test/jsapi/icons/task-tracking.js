//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('JSAPI / Icon / Task tracking');

Scenario('Given I have custom icon for task class id, when I open task tracking, then I see the custom icon for task', async ({ I, document, utils }) => {
   let mail =  await I.haveMail(true);
    utils.jsapi.icon.addForClass('GEC_Step2_ATraiter', 'fa fa-search');
    
    document.open(mail.id);
    document.form.smartActions.root = '.smart-actions.component-header-actions';
    document.smartActions.openSub('#read_task_history');
    I.waitForVisible('.component-history', 5);
    I.seeElement('.component-history .fa.fa-search');
}).tag('jsapi').tag('icon');

Scenario('Given I have custom icon for tag value, when I open task tracking, then I see the custom icon for task', async ({ I, document, utils }) => {
    utils.jsapi.icon.addForTag('fa fa-search', 'TypeCourrier', 'Contrat');
    
    let docId = await I.waitForFoundable('DOCUMENT', "Contrat", "TypeCourrier");
    document.open(docId);
    document.form.smartActions.root = '.smart-actions.component-header-actions';
    document.smartActions.openSub('#read_task_history');
    I.waitForVisible('.component-history', 5);

    I.seeElement('.component-history .fa.fa-search');
}).tag('jsapi').tag('icon');