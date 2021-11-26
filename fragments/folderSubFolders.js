//<reference path="../steps.d.ts" />

const I = actor();

module.exports = {

	root: locate('div').withAttr({ title: 'Sous-dossiers' }),

	form: require('../fragments/form'),
	addFolderAction: '#addNewFolder',
	addDocumentAction: '#addNewDocument',
	rootActionContainer: '.create-at-root ',


	clickOnAddFolder: function () {
		this.clickOnAddAction(this.addFolderAction);
	},

	clickOnAddDocument: function () {
		this.clickOnAddAction(this.addDocumentAction);
	},

	clickAddFolderFromTree: function (subName) {
		this.clickAddOnTree(subName, 'Folder');
	},

	clickAddDocumentFromTree: function (subName) {
		this.clickAddOnTree(subName, 'Document');
	},

	openSubFolder: function (subName) {
		this.clickOnSubFolderAction(subName, '#edit');
	},

	clickOnAddAction: function (action) {
		I.waitForVisible(this.root, 5);
		within(this.root, () => {
			I.waitForVisible(this.rootActionContainer + '#add', 3);
			I.click(this.rootActionContainer + '#add');
			this.form.waitForActionEnabled(this.rootActionContainer + action);
			I.click(this.rootActionContainer + action);
		});
	},

	clickAddOnTree: function (subName, component) {
		I.waitForVisible(this.root, 5);
		within(this.root, () => {
			this.clickOnSubFolderAction(subName, '#add');
			var newSubName = this.convertNameToStyle(subName);
			var addComponent = '.item-' + newSubName + ' #addNew' + component;
			this.form.waitForActionEnabled(addComponent);
			I.click(addComponent);
		});
	},

	clickOnSubFolderAction: function (subName, action) {
		var subFolder = "a[title='" + subName + "']";
		I.waitForVisible(subFolder, 10);
		I.click(subFolder);
		var newSubName = this.convertNameToStyle(subName);
		I.click('.item-' + newSubName + ' ' + action);
	},

	convertNameToStyle: function (subName) {
		I.say(subName);
		var cleanName = subName.replace(/\s/g, "-");
		return (cleanName);
	}
}