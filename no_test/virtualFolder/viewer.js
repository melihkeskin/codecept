//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Virtual folder / Viewer');

Scenario('I open virtual folder then visualize a bucket with two documents', async ({ I, data, virtualFolder, document }) => {
    let mail1 = await I.haveMail(true, 'data/simple.pdf');

    let mail2 = data.mail();
    mail2.refClient = mail1.refClient;
    mail2.routing = mail1.routing;
    await I.haveMail(true, 'data/simple.pdf', mail2);

    await virtualFolder.open(mail1.refClient);
    virtualFolder.clickOnTreeItem(mail1.routing.type.label);

    document.viewer.waitForDocumentLoading();
    document.viewer.seeDocumentCount(2);
}).tag('virtualFolder');

Scenario('I open virtual folder then visualize buckets with one document', async ({ I, data, virtualFolder, document }) => {
    let mail1 = data.mail();
    mail1.routing = data.routing[0];
    mail1 = await I.haveMail(true, 'data/simple.pdf', mail1);

    let mail2 = data.mail();
    mail2.refClient = mail1.refClient;
    mail2.routing = data.routing[1];
    await I.haveMail(true, 'data/multi-pages.pdf', mail2);

    await virtualFolder.open(mail1.refClient);
    virtualFolder.clickOnTreeItem(mail1.routing.type.label);
    document.viewer.waitForDocumentLoading();
    document.viewer.seeDocumentCount(1);
    document.viewer.seeSelected('simple.pdf', 1);

    virtualFolder.clickOnTreeItem(mail2.routing.type.label);
    document.viewer.waitForDocumentLoading();
    document.viewer.seeDocumentCount(1);
    document.viewer.seeSelected('multi-pages.pdf', 4);
}).tag('virtualFolder');