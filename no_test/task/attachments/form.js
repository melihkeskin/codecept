//<reference path="../../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Task / Attachment creation form');


Scenario('I attach a document then I tags are propagated', async ({ I, data, task, document }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    const comment = data.faker.random.word();
    task.form.fillTextTag('.Commentaire', comment);

    task.attachments.startAttachment('.Appendices', 'data/simple.pdf');
    I.waitForText('Classe', 5);
    document.form.changeClass("Pièce jointe d'une e-Enveloppe");
    task.attachments.endAttachment('data/simple.pdf', true);
    task.form.save();

    await task.open(mail.task);
    let id = await task.getAttached('Appendices');
    await document.open(id);
    document.form.seeListTag('.RefClient', mail.refClient);
    document.form.seeTextTag('.Commentaire', comment);
}).tag('task');

Scenario('I attach a document then I can override propagated tags', async ({ I, data, task, document }) => {
    let mail = await I.haveMail(true);
    await task.open(mail.task);
    task.form.fillTextTag('.Commentaire', data.faker.random.word());

    task.attachments.startAttachment('.Appendices', 'data/simple.pdf');
    document.form.changeClass("Pièce jointe d'une e-Enveloppe");
    const comment = data.faker.random.word();
    I.fillField('.component-creation .Commentaire textarea', comment);
    task.attachments.endAttachment('data/simple.pdf', true);
    task.form.save();

    await task.open(mail.task);

    let id = await task.getAttached('Appendices');
    await document.open(id);
    document.form.seeTextTag('.Commentaire', comment);
}).tag('task');