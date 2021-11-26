//<reference path="../../steps.d.ts" />
Before({ login } => {
    login('admin');
});

Feature('Indexation / Mandatory tags');

Scenario('Mandatory tag not filled', ({ I, data, document, notification }) => {
    const mail = data.mail();

    I.waitForElement('.shortcuts-simple', 15);
    I.click('.shortcuts-simple');
    I.waitForVisible('.modal-header .title-container .string-input', 5);
    I.fillField('.modal-header .title-container .string-input', mail.name);
    I.attachFile('.custom-file-input', 'data/simple.pdf');
    notification.waitForVisible(' a été chargé avec succès');

    document.form.seeMandatoryTags(6);
    //DateCourrier is filled and valid
    document.form.seeInvalidTags(5);
    document.form.waitForActionDisabled(document.form.createAction);

    document.form.fillListTag('.CanalEntree', mail.channelCode.value);
    document.form.fillListTag('.TypeCourrier', mail.routing.type.value);
    document.form.fillTag('.ObjetCourrier', mail.object);
    document.form.fillTag('.PrenomClient', mail.firstName);
    document.form.fillTag('.NomClient', mail.lastName);

    document.form.seeInvalidTags(0);
    document.form.waitForActionEnabled(document.form.createAction);
})