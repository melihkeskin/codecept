//<reference path="../steps.d.ts" />

const { I } = inject();
const { searchForm } = require('../fragments/searchForm');
const { searchResults } = require('../fragments/searchResults');
const { form } = require('../fragments/form');

const glassPanel = require('../fragments/glassPanel');
const notification = require('../fragments/notification');
const faker = require('faker');

class folderDocuments {
    constructor() {
        this.root = '.folder-children .folder-documents ';
        this.dropzone = '.folder-children .dropzone ';
        this.filters = this.root + '.folder-children-filters'
        this.form = new form();
        this.searchForm = new searchForm(this.filters + ' ');
        this.results = new searchResults();
        this.results.resultsBody = this.root + '.folder-children-results .table-responsive .table tbody:nth-of-type(1) ';
    }
    async addDocument(doc) {
        if (!doc) {
            doc = {
                'name': faker.lorem.words(),
                'classId': 'Document',
                'file': 'data/simple.pdf'
            };
        }

        this.seeDropZone();
        I.click(this.dropzone + '#add');

        I.waitForElement('.modal-dialog.component-creation.document', 5);

        I.fillField('.modal-header .title-container .string-input', doc.name);
        let selected = await I.grabTextFrom(".component-class-data .multi-valued-box");

        if (selected != doc.classId) {
            this.form.changeClass(doc.classId);
        }
        I.attachFile('.custom-file-input', doc.file);
        notification.waitForVisible(' a été chargé avec succès');
        glassPanel.waitForInvisible();
        this.form.create();
        notification.waitForVisible('Le document a été créé avec succès.');
        return doc;
    }

    seeDropZone() {
        I.waitForVisible(this.dropzone, 5);
        I.waitForVisible(this.dropzone + '#add', 5);
    }

    openFilters() {
        let filters = this.filters + '.reduced';
        I.waitForVisible(filters, 10)
        I.click(filters + ' .card-header .mdi-plus');
        I.waitForInvisible(filters);
    }
    dontSeeFilters() {
        I.waitForElement(this.filters + '.d-none');
    }
    dontSeeClassSelector(childrenCategory) {
        I.dontSeeElementInDOM(this.filters + ' .advanced-search .classid');
    }
}
module.exports = new folderDocuments();
module.exports.folderDocuments = folderDocuments;