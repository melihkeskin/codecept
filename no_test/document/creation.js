//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Document / Creation');

Scenario('Given I opened Insert tab, then I see document icon', async ({ insert, I }) => {
    insert.open();
    I.seeElement('.page-icon .far.fa-file-alt');
})

Scenario('Given I opened Insert tab, when I create a document, then I open it', async ({ I, insert, document, data }) => {
    insert.open();
    insert.addFile('data/simple.pdf');
    insert.openIndexation();

    document.form.changeClass('Document');
    var name = data.faker.system.commonFileName();
    document.form.changeTitle(name);
    document.form.create("Le document a été créé avec succès");

    let id = await I.waitForFoundable('DOCUMENT', name, 'name');
    document.open(id);
    document.form.seeFieldTitle(name);
}).tag('document');

Scenario('Given a document shortcut, when I create document, then I open it', async ({ I, data, document, notification }) => {
    const mail = data.mail();
    I.waitForElement('.shortcuts-simple', 15);
    I.click('.shortcuts-simple');
    I.waitForVisible('.modal-header .title-container .string-input', 10);
    I.fillField('.modal-header .title-container .string-input', mail.name);
    I.attachFile('.custom-file-input', 'data/simple.pdf');
    notification.waitForVisible('simple.pdf a été chargé avec succès');
    I.waitForGlassPanelHidden();

    document.form.fillListTag('.CanalEntree', mail.channelCode.value);
    document.form.fillListTag('.TypeCourrier', mail.routing.type.value);
    document.form.fillTag('.ObjetCourrier', mail.object);
    document.form.fillTag('.PrenomClient', mail.firstName);
    document.form.fillTag('.NomClient', mail.lastName);
    document.form.create();

    let id = await I.waitForFoundable('DOCUMENT', mail.name, 'name');
    document.open(id);
    document.form.seeFieldTitle(mail.name);
    document.form.seeListTag('.CanalEntree', mail.channelCode.label);
    document.form.seeListTag('.TypeCourrier', mail.routing.type.label);
    document.form.seeTag('.ObjetCourrier', mail.object);
    document.form.seeTag('.PrenomClient', mail.firstName);
    document.form.seeTag('.NomClient', mail.lastName);
}).tag('document');

Scenario('I create document from floating shortcut then found it', async ({ I, data, document, notification }) => {
    const mail = data.mail();
    I.waitForElement('.floating-button', 15);
    I.click('.floating-button');
    I.waitForElement('.popup_content', 5);
    I.click('.popup_content');
    I.waitForVisible('.modal-header .title-container .string-input', 10);
    I.fillField('.modal-header .title-container .string-input', mail.name);
    I.attachFile('.custom-file-input', 'data/simple.pdf');
    notification.waitForVisible('simple.pdf a été chargé avec succès');

    document.form.fillListTag('.CanalEntree', mail.channelCode.value);
    document.form.fillListTag('.TypeCourrier', mail.routing.type.value);
    document.form.fillTag('.ObjetCourrier', mail.object);
    document.form.fillTag('.PrenomClient', mail.firstName);
    document.form.fillTag('.NomClient', mail.lastName);
    document.form.create();

    let id = await I.waitForFoundable('DOCUMENT', mail.name, 'name');
    document.open(id);
    document.form.seeFieldTitle(mail.name);
    document.form.seeListTag('.CanalEntree', mail.channelCode.label);
    document.form.seeListTag('.TypeCourrier', mail.routing.type.label);
    document.form.seeTag('.ObjetCourrier', mail.object);
    document.form.seeTag('.PrenomClient', mail.firstName);
    document.form.seeTag('.NomClient', mail.lastName);
}).tag('document');

Scenario('Given a script When I launch document creation within a popup Then I open it', async ({ I, data, document }) => {
    const doc = data.mail();
    doc.random = data.faker.datatype.number();
    I.executeScript(function (doc) {
        var newDocument = new Document();
        newDocument.setClassId("Document");
        newDocument.setName(doc.name);
        var popup = JSAPI.get().getPopupAPI().buildComponentCreation(newDocument, function (saved) {
            docId = saved.getId();
            $("#wrapper").append($("<p id='lock-" + doc.random + "'/>"));
        });
        popup.show();
    }, doc);

    I.waitForVisible('.modal-header .title-container .string-input');
    I.fillField('.modal-header .title-container .string-input', doc.name);
    I.fillField('.modal-header .title-container .string-input', doc.name);
    I.attachFile('.custom-file-input', 'data/simple.pdf');
    I.waitForGlassPanelHidden();
    document.form.create();
    I.waitForElement('#lock-' + doc.random, 20);
    let documentId = await I.executeScript(function () {
        return docId;
    });

    await document.open(documentId);
    document.form.seeFieldTitle(doc.name);
}).tag('document');

Scenario('Given I fill title after adding file at document creation, title is not reset when adding a new file', ({ I, data, notification }) => {
    const mail = data.mail();
    I.waitForElement('.shortcuts-simple', 15);
    I.click('.shortcuts-simple');
    I.attachFile('.custom-file-input', 'data/simple.pdf');
    notification.waitForVisible('simple.pdf a été chargé avec succès');
    I.waitForGlassPanelHidden();
    I.click('.file-container #delete');
    I.attachFile('.custom-file-input', 'data/multi-pages.pdf');
    notification.waitForVisible('multi-pages.pdf a été chargé avec succès');
    I.waitForGlassPanelHidden();
    I.seeInField('.modal-header .title-container .string-input', "multi-pages.pdf");
}).tag('document');

Scenario('Given I fill title at document creation, title is not reset when adding a file', ({ I, data, notification }) => {
    const mail = data.mail();
    I.waitForElement('.shortcuts-simple', 15);
    I.click('.shortcuts-simple');
    I.fillField('.modal-header .title-container .string-input', mail.name);

    I.attachFile('.custom-file-input', 'data/simple.pdf');
    notification.waitForVisible('simple.pdf a été chargé avec succès');
    I.waitForGlassPanelHidden();
    I.seeInField('.modal-header .title-container .string-input', mail.name);
}).tag('document');

Scenario('Given I add a file at document creation, title is filled with file name. I upload a new file, new file name is used as title', ({ I, data, notification }) => {
    const mail = data.mail();
    I.waitForElement('.shortcuts-simple', 15);
    I.click('.shortcuts-simple');

    I.attachFile('.custom-file-input', 'data/simple.pdf');
    notification.waitForVisible('simple.pdf a été chargé avec succès');
    I.waitForGlassPanelHidden();
    I.seeInField('.modal-header .title-container .string-input', "simple.pdf");

    I.click('.file-container #delete');

    I.attachFile('.custom-file-input', 'data/multi-pages.pdf');
    notification.waitForVisible('multi-pages.pdf a été chargé avec succès');
    I.waitForGlassPanelHidden();
    I.seeInField('.modal-header .title-container .string-input', "multi-pages.pdf");
}).tag('document');

Scenario('Given I create a document in popup, when I change class, then I see placeholder and description are updated', async ({ I, document }) => {
    await I.haveDocumentCreationPopup({ 'classId': 'Document' });

    I.waitForVisible('.modal-dialog.component-creation', 5);
    I.seeElement('.modal-dialog .far.fa-file-alt');
    I.seeAttributesOnElements('.modal-header .title-container .field-string input', { placeholder: 'Document' });
    I.waitForText('Classe de document utilisée pour matérialiser un document', 5, '.modal-header .description');

    document.form.changeClass('Courrier Entrant');
    I.seeElement('.modal-dialog .far.fa-file-alt');
    I.seeAttributesOnElements('.modal-header .title-container .field-string input', { placeholder: 'Courrier Entrant' });
    I.waitForText("Document entrant issu de la chaîne d'acquisition", 5, '.modal-header .description');
});