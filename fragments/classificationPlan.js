//<reference path="../steps.d.ts" />
const I = actor();

module.exports = {

		root: '.virtual-folder-browser',
		glassPanel: require('./glassPanel'),

		waitForLoaded: function () {
			within(this.root, () => {
				I.waitForElement('.active', 15);
			});
		},
		seeDocument: function (title) { // TODO: manage if type not expanded: open type, then look for title
			within(this.root, () =>{
				I.see(title);
			});
		},
		seeTypeDocument: function(type){
			I.waitForElement(this.root, 15);
			within(this.root, () => {
				I.waitForText(type, 15);
			});
		},
		seeNumberOfDocumentForType: function(type, number){ //with visualisation in list
			I.waitForElement(this.root, 15);
//			within(this.root, () => {
//				this.seeTypeDocument(type);
				leaf = locate('div').withChild('//a[contains(@title, "'+type+'")]');
				within(leaf, () =>{
					I.waitForText(number, 15);
				});
//			});
		},
		seeNumberOfTypesInList: function(number){
			I.waitForElement(this.root, 15);
			within(this.root, () => {
				I.seeNumberOfElements('.leaf-container', number);
			});
		},
		seeNumberOfTypesInTree: function(number){
			I.waitForElement(this.root, 15);
			within(this.root, () => {
				I.seeNumberOfElements('.item-level-0', number);
			});
		},
		openFirstLevel: function (first, hasSecondLevel) {
			I.waitForElement(this.root, 15);
			within(this.root, () => {
				I.waitForText(first, 15);
				I.wait(0.3);
				I.click(first)
				if (hasSecondLevel) {
					I.waitForElement('.active-node', 15);
				} else {
					I.waitForElement('.active', 15);
				}
			});
			this.glassPanel.waitForInvisible();
		},
		openSecondLevel: function (first, second) {
			this.openFirstLevel(first, true)
			within(this.root + " .active-node", () => {
				I.waitForText(second, 15);
				I.click(second);
			});
			this.glassPanel.waitForInvisible();
		},
		openThirdLevel: function (first, second, third) {
			this.openFirstLevel(first, true)
			this.openSecondLevel(first, second)
			within(this.root + " .active-node", () => {
				I.waitForText(second, 15);
				I.click(third);
			});
			this.glassPanel.waitForInvisible();
		},
}
