//<reference path="../../steps.d.ts" />
const faker = require('faker/locale/fr');
Feature('ARender / Annotations')

Scenario('As an admin, I open a document then I create an textual note, then I can update it, and finally delete it', async ({ I, document }) => {
    await I.login('admin');
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf' });
    document.viewer.waitForDocumentLoading();

    document.viewer.seeAnnotationMenu();
    document.viewer.addAnnotation("Ajouter une note textuelle");
    let note = faker.lorem.sentence();
    document.viewer.updateAnnotation(note);

    await document.viewer.seeAnnotation(note);
    document.viewer.deleteAnnotation();
}).tag('annotation').tag('textual');

Scenario('As an admin, I open a document then I create a circle, then I can update it, and finally delete it', async ({ I, document }) => {
    await I.login('admin');
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf' });
    document.viewer.waitForDocumentLoading();

    document.viewer.seeAnnotationMenu();
    document.viewer.addAnnotation("Ajouter un cercle");
    let note = faker.lorem.sentence();
    document.viewer.updateAnnotation(note);

    await document.viewer.seeComment(note);
    document.viewer.deleteAnnotation();
}).tag('annotation').tag('circle');

Scenario('As a user When I have all annotation permissions Then I see all annotation creation actions', async ({ I, document }) => {
    await I.login('phu');
    let doc = await I.createDocument({ 'file': 'data/simple.pdf', 'acl': 'acl-full-control' });

    document.open(doc.id);
    document.viewer.waitForDocumentLoading();

    document.viewer.seeAnnotationMenu();
}).tag('annotation');

Scenario('As a user with all annotation permissions When I create textual note Then I update and delete it', async ({ I, document }) => {
    await I.login('phu');
    let doc = await I.createDocument({ 'file': 'data/simple.pdf', 'acl': 'acl-full-control' });
    await I.haveAnnotation(doc.id, { 'type': 'textual', 'acl': 'acl-full-control' });

    document.open(doc.id);
    document.viewer.waitForDocumentLoading();

    let note = faker.lorem.sentence();
    document.viewer.updateAnnotation(note);
    await document.viewer.seeAnnotation(note);
    document.viewer.deleteAnnotation();
}).tag('annotation').tag('textual');

Scenario('As a user with all annotation permissions When I create circle Then I update and delete it', async ({ I, document }) => {
    await I.login('phu');
    let doc = await I.createDocument({ 'file': 'data/simple.pdf', 'acl': 'acl-full-control' });
    await I.haveAnnotation(doc.id, { 'type': 'circle', 'acl': 'acl-full-control' });

    document.open(doc.id);
    document.viewer.waitForDocumentLoading();

    let note = faker.lorem.sentence();
    document.viewer.updateAnnotation(note);
    await document.viewer.seeComment(note);
    document.viewer.deleteAnnotation();
}).tag('annotation').tag('circle');

Scenario('Given a document without create annotation permission When I open it Then I cannot create annotation', async ({ I, document }) => {
    await I.login('phu');
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf', 'acl': 'acl-read-annotation' });
    document.viewer.waitForDocumentLoading();
    document.viewer.dontSeeAnnotationMenu();
}).tag('annotations');

Scenario('Given a document with read only circle When I open it Then I cannot nor update neither delete annotation', async ({ I, document }) => {
    await I.login('phu');
    let doc = await I.createDocument({ 'file': 'data/simple.pdf', 'acl': 'acl-read-annotation' });
    await I.haveAnnotation(doc.id, { 'type': 'circle', 'acl': 'acl-read-annotation' });
    document.open(doc.id);

    document.viewer.waitForDocumentLoading();
    document.viewer.openAnnotationExplorer(true);
    document.viewer.dontSeeInDocumentExplorer('.comment-contentArea');
    document.viewer.dontSeeInDocumentExplorer('.dropAnnotationReply');
    document.viewer.dontSeeInDocumentExplorer('.comment-addReplyButton');
}).tag('annotations');

Scenario('Given a document with read only textual annotation When I open it Then I cannot nor update neither delete annotation', async ({ I, document }) => {
    await I.login('phu');
    let doc = await I.createDocument({ 'file': 'data/simple.pdf', 'acl': 'acl-read-annotation' });
    await I.haveAnnotation(doc.id, { 'type': 'textual', 'acl': 'acl-read-annotation' });

    document.open(doc.id);

    document.viewer.waitForDocumentLoading();
    await document.viewer.seeAnnotation("Note textuelle");
    document.viewer.cannotUpdateAnnotation();
    document.viewer.dontSeeInDocumentExplorer('.dropAnnotationReply');
    document.viewer.dontSeeInDocumentExplorer('.comment-addReplyButton');
}).tag('annotations');

Scenario('As a user who can create and update annotations When I create a circle Then I update it but I do not see delete action', async ({ I, data, document }) => {
    await I.login('phu');
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf' });
    document.viewer.waitForDocumentLoading();
    document.viewer.addAnnotation('Ajouter un cercle');
    let note = faker.lorem.sentence();
    document.viewer.openAnnotationExplorer(true);
    document.viewer.updateAnnotation(note);
    await document.viewer.seeComment(note);
    document.viewer.dontSeeInDocumentExplorer('.dropAnnotationReply');
}).tag('annotations');

Scenario('As a user who can create and update annotations When I create a textual note Then I reply to it but I do not see delete action', async ({ document, I, data }) => {
    await I.login('phu');
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf' });
    document.viewer.waitForDocumentLoading();
    let note = faker.lorem.sentence();
    document.viewer.addAnnotation('Ajouter une note textuelle');
    document.viewer.openAnnotationExplorer(true);
    document.viewer.replyAnnotation(note);
    await document.viewer.seeAnnotation(note);
    document.viewer.dontSeeInDocumentExplorer('.dropAnnotationReply');
}).tag('annotation');

Scenario('I do not have permission to see annotations, I open a document with annotation, then I see no annotation on it', async ({ document, I }) => {
    await I.login('phu');
    let doc = await I.createDocument({ 'file': 'data/simple.pdf', 'acl': 'acl-read-content' });
    await I.haveAnnotation(doc.id, { 'type': 'circle', 'acl': 'acl-full-control' });

    document.open(doc.id);
    document.viewer.waitForDocumentLoading();

    document.viewer.openAnnotationExplorer(false);
}).tag('annotations');

Scenario('I do not have permission to see annotations, I open a document with textual annotation, then I see no annotation on it', async ({ document, I }) => {
    await I.login('phu');
    let doc = await I.createDocument({ 'file': 'data/simple.pdf', 'acl': 'acl-read-content' });
    await I.haveAnnotation(doc.id, { 'type': 'textual', 'acl': 'acl-full-control' });

    document.open(doc.id);
    document.viewer.waitForDocumentLoading();

    document.viewer.openAnnotationExplorer(false);
    document.viewer.dontSeeAnnotation('Note textuelle');
    document.viewer.dontSeeInDocumentExplorer('.comment-contentArea');
    document.viewer.dontSeeInDocumentExplorer('.dropAnnotationReply');
    document.viewer.dontSeeInDocumentExplorer('.comment-addReplyButton');
}).tag('annotations');

Scenario('I cannot see annotation if I do not have READ permission on annotation', async ({ document, I }) => {
    await I.login('admin');
    let doc = await I.createDocument({ 'file': 'data/simple.pdf', 'acl': 'acl-full-control' });
    await I.haveAnnotation(doc.id, { 'type': 'textual', 'acl': 'acl-admin' });

    document.open(doc.id);
    document.viewer.waitForDocumentLoading();
    await document.viewer.seeAnnotation('Note textuelle');

    await I.login('phu');
    document.open(doc.id);
    document.viewer.waitForDocumentLoading();
    document.viewer.seeAnnotationMenu();
    document.viewer.openAnnotationExplorer(false);
    document.viewer.dontSeeAnnotation('Note textuelle');
    document.viewer.dontSeeInDocumentExplorer('.comment-contentArea');
    document.viewer.dontSeeInDocumentExplorer('.dropAnnotationReply');
    document.viewer.dontSeeInDocumentExplorer('.comment-addReplyButton');
}).tag('annotations');