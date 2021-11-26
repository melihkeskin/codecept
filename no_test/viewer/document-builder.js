//<reference path="../../steps.d.ts" />
Before({ login } => {
  login('admin');
});
Feature('ARender / Document Builder');

Scenario('I split a document then verify new built document has expected page number', async ({ I, data, document, search, arender, notification }) => {
  await I.createAndOpenDocument({ 'file': 'data/multi-pages.pdf' });
  I.waitForElement('.viewerFrame', 5);
  arender.openDocumentBuilder();
  arender.splitDocument();

  const name = data.faker.system.commonFileName();
  I.waitForVisible('.modal-header .title-container .string-input', 10);

  I.waitForVisible('.modal-header .title-container .string-input', 10);
  I.fillField('.modal-header .title-container .string-input', name);

  document.form.create();
  notification.waitForVisible('Le document a été créé avec succès.', 5);
  I.waitForGlassPanelHidden();

  search.openDefault();
  search.results.openFirst();

  arender.waitForDocumentLoading();
  arender.seeNameAndPageCount('Nouveau document.pdf', 1);
}).tag('arender').tag('document-builder');

Scenario('I split a document then verify document builder is closed when I open another document', async ({ I, search, data, document, arender }) => {
  await I.createAndOpenDocument({ 'file': 'data/multi-pages.pdf' });
  I.waitForElement('.viewerFrame', 5);
  arender.openDocumentBuilder();
  document.form.cancel();
  search.openDefault();
  search.results.openFirst();
  within({
    frame: ".viewerFrame"
  }, () => {
    I.dontSeeElement('.newDocumentButton');
  });
}).tag('arender').tag('document-builder');