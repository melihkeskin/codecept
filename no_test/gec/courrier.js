//<reference path="../../steps.d.ts" />

const data = require('../../data/data');

Before({ login } => {
	login('admin');
});

Feature('Process / GEC Drools');

let mail = data.mail();

Scenario('I create incoming mail', async ({ I, document, arender }) => {
	mail = await I.haveMail(true, 'data/simple.pdf', mail);
	await document.open(mail.id);
	arender.waitForDocumentLoading();
	arender.seeNameAndPageCount('simple.pdf', 1);
}).tag('courrier').tag('gec');

Scenario('I open the created customer folder', ({ search, virtualFolder }) => {
	search.open('.dossierClientSearchTab');
	search.form.launchQuick(mail.firstName + ' ' + mail.lastName);
	search.results.seeAndOpenFirst(mail.lastName);

	virtualFolder.waitForOpen();
	virtualFolder.form.seeTag('.NomClient', mail.lastName);
	virtualFolder.form.seeTag('.PrenomClient', mail.firstName);
}).tag('courrier').tag('gec');

Scenario('I open the created task and it is automatically assigned to me', ({ I, browse, task, sidemenu }) => {
	sidemenu.open('Tous les courriers');

	browse.waitForOpen();
	browse.left.openSecondLevel(mail.routing.service.label, 'A traiter');
	browse.breadcrumb.see(['Tous les courriers', mail.routing.service.label, 'A traiter']);
	browse.results.seeAndOpenFirst(mail.lastName);
	I.waitForGlassPanelHidden();

	task.form.seeTag('.NomClient', mail.lastName);
	task.form.seeTag('.PrenomClient', mail.firstName);
	task.form.seeTag('.ObjetCourrier', mail.object);
	task.form.seeListTag('.TypeCourrier', mail.routing.type.label);
	task.form.seeListTag('.CanalEntree', mail.channelCode.label);
}).tag('courrier').tag('gec');

Scenario('I open my task and add missing attachment', ({ I, browse, task, sidemenu, notification }) => {
	sidemenu.open('Mes courriers');
	browse.waitForOpen();
	browse.left.openFirstLevel('En cours de traitement', false);
	I.wait(1);
	browse.breadcrumb.see(['Mes courriers', 'En cours de traitement']);
	browse.results.seeAndOpenFirst(mail.lastName);
	task.waitForOpen();
	task.attachments.attachNewDocument('.Reponse', 'data/simple.pdf');
	//I.waitForGlassPanelHidden();
	task.form.save();
}).tag('courrier').tag('gec');

Scenario('I process my task', async ({ I, browse, task, sidemenu, notification }) => {
	sidemenu.open('Mes courriers');
	browse.waitForOpen();
	browse.left.openFirstLevel('En cours de traitement', false);
	I.waitForGlassPanelHidden();
	browse.breadcrumb.see(['Mes courriers', 'En cours de traitement']);

	browse.results.seeAndOpenFirst(mail.lastName);
	I.waitForGlassPanelHidden();

	const comment = data.faker.lorem.sentence();
	task.form.fillTextTag('.Commentaire', comment);
	task.form.clickAction('.answer-action#Valider', true, 'La réponse Traiter a bien été appliquée sur la tâche');

	await I.waitForFoundable('TASK', comment, 'LastCommentaire');

	browse.left.openFirstLevel('Finalisé', false);
	browse.breadcrumb.see(['Mes courriers', 'Finalisé']);
	browse.results.seeAndOpenFirst(mail.lastName);

	task.form.seeTextTag('.LastCommentaire', comment);
	I.dontSeeElement('footer .answer-action');
}).tag('courrier').tag('gec');