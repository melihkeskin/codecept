const { I } = inject();

const glassPanel = require('../fragments/glassPanel');
const notification = require('../fragments/notification');
const { folderDocuments } = require('../fragments/folderDocuments');
const { Component } = require('./Component');

class folder extends Component {

	constructor() {
		super('FOLDER');
		this.smartActions = require('../fragments/smartActions');
		this.documents = new folderDocuments();
		this.folders = require('../fragments/folderSubFolders');
		this.child = '.sub-folders .gwt-TreeItem ';
	}

	createChildFolder(level, name) {
		this.launchFolderChildCreation(level);
		I.waitForElement('.modal-header .field-string .string-input', 3);
		I.fillField('.modal-header .field-string .string-input', name);
		this.form.create();
	}
	select(level, name) {
		glassPanel.waitForInvisible();
		let selector = (name === undefined) ? '.container-' + level : '.item-' + name + ' .container-' + level + ' .item-level-' + level + ' .tree-link';
		I.waitForVisible(selector, 10);
		I.click(selector)

		glassPanel.waitForInvisible();

		if (name) {
			I.waitForVisible('.item-' + name + '.active', 10);
		} else {
			I.waitForVisible('.tree-item.active ' + '.container-' + level, 10);
		}
	}
	createChildDocument(level, name, document) {
		this.launchDocumentChildCreation(level);
		I.waitForElement('.modal-header .field-string .string-input', 3);
		I.fillField('.modal-header .field-string .string-input', name);

		document.form.changeClass('Document');
		I.attachFile('.custom-file-input', 'data/simple.pdf');
		notification.waitForVisible('simple.pdf a été chargé avec succès');
		glassPanel.waitForInvisible();
		document.form.create("Le document a été créé avec succès");
		glassPanel.waitForInvisible();
	}
	launchDocumentChildCreation(level) {
		this.launchChildCreation(level, '#addNewDocument');
	}
	launchFolderChildCreation(level) {
		this.launchChildCreation(level, '#addNewFolder');
	}
	launchChildCreation(level, selector) {
		glassPanel.waitForInvisible();
		this.documents.results.waitForTable();

		if (level < 0) {
			I.waitForVisible('.folder-create-actions.create-at-root', 10);
			I.click('.folder-create-actions.create-at-root');
		} else {
			this.select(level);
			let parent = '.container-' + level;
			I.waitForElement(parent + ' .folder-create-actions', 10);
			I.click(parent + ' .folder-create-actions');
			selector = parent + ' ' + selector;
		}
		I.waitForVisible(selector, 10);
		I.click(selector);
	}
	seeChildFolder(level, name) {
		let selector = '.sub-folders .item.item-level-' + level + ' .tree-link';
		I.waitForVisible(selector);
		I.seeTextEquals(name, selector);
	}
	dontSeeClassSelector(childrenCategory) {
		let selector = "." + childrenCategory + ".filters .advanced-search .classid";
		I.dontSeeElementInDOM(selector);
	}
	fillListTag(name, value, multivaluedTag){
		this.openListPicker(name);
	    I.waitForElement('.list-field-picker .list-field-picker-content .value-' + value + ' input', 5);
	    I.checkOption('.list-field-picker .list-field-picker-content .value-' + value + ' input');
	    if (multivaluedTag) {
	    I.click('.list-field-picker #cancel');
		}
	}
	openListPicker(name) {
    let selector = name + ' .multi-valued-box';
    I.waitForElement(selector);
    I.click(selector);
    I.wait(0.2);
	
  	}
}

// For inheritance
module.exports = new folder();
module.exports.folder = folder;