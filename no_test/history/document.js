//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('Document / History');

Scenario('I create a document then see creator within history', async ({ I, data, document }) => {
    await I.createAndOpenDocument({ 'file': 'data/simple.pdf' });

    document.smartActions.openSub('#history');
    I.waitForElement('.component-history .timeline-item .item-description');
    let nameUser = await I.executeScript(function () {
        return JSAPI.get().getUserAPI().getCurrentUser().getDisplayName()
    });
    I.waitForText('Le document a été créé par ' + nameUser, 5, '.component-history .timeline-item .item-description');
}).tag('document').tag('history');

Scenario('I modify a document then see last update date', async ({ I, data, document, notification }) => {
    let doc = await I.createAndOpenDocument({ 'file': 'data/simple.pdf' });
    document.form.save();
    I.wait(3);
    await document.open(doc.id);

    document.smartActions.openSub('#history');
    I.waitForElement('.component-history .timeline-item-left .item-description');
    let nameUser = await I.executeScript(function () {
        return JSAPI.get().getUserAPI().getCurrentUser().getDisplayName()
    });
    I.waitForText(nameUser + ' a modifié le document', 5, '.component-history .timeline-item:nth-of-type(1) .item-description');
}).tag('document').tag('history');