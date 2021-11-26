//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('ARender / Download');

Scenario('I open PDF document then dont see native download button, but I see download as PDF button and download it as PDF', ({ I, insert, document, search, arender, data }) => {
    insert.open();
    insert.addFile('data/simple.pdf');
    insert.openIndexation();

    document.form.changeClass('Document');
    var name = data.faker.system.commonFileName();
    document.form.changeTitle(name);
    document.form.create();

    search.openDefault();
    search.form.searchByString('name', name);
    search.results.seeAndOpenFirst(name);

    arender.waitForDocumentLoading();
    arender.seeNameAndPageCount('simple.pdf', 1);
    arender.seeDownloadMenu();
    arender.openDownloadMenu();
    arender.dontSeeDownloadButton();

    arender.seeDownloadPDFButton();
    I.handleDownloads();
    arender.downloadPDF();
    I.amInPath('output/downloads');
    I.retry({
        retries: 10,
        minTimeout: 3000,
        maxTimeout: 3000
    }).seeFile('simple.pdf')

}).tag('arender').tag('download');

Scenario('I open TXT document then see native download button and download it, I see also download as PDF button and download it as PDF', ({ I, insert, document, search, arender, data }) => {
    insert.open();
    insert.addFile('data/light.txt');
    insert.openIndexation();

    document.form.changeClass('Document');
    var name = data.faker.system.commonFileName();
    document.form.changeTitle(name);
    document.form.create();

    search.openDefault();
    search.form.searchByString('name', name);
    search.results.seeAndOpenFirst(name);

    arender.waitForDocumentLoading();
    arender.seeNameAndPageCount('light.txt', 1);

    arender.seeDownloadMenu();
    arender.openDownloadMenu();
    arender.seeDownloadButton();

    I.handleDownloads();
    arender.download();
    I.amInPath('output/downloads');
    I.retry({
        retries: 10,
        minTimeout: 3000,
        maxTimeout: 3000
    }).seeFile('light.txt')

    arender.openDownloadMenu();
    arender.seeDownloadPDFButton();
    I.handleDownloads();
    arender.downloadPDF();
    I.amInPath('output/downloads');
    I.retry({
        retries: 10,
        minTimeout: 3000,
        maxTimeout: 3000
    }).seeFile('light.txt.pdf')
}).tag('arender').tag('download');