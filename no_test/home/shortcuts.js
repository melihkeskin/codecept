//<reference path="../../steps.d.ts" />

Before({ login } => {
	login('admin');
});

Feature('Shorcuts');

Scenario('For single shortcut, dropdown is hidden, simple is displayed', ({ navBar }) => {
	navBar.seeElement('.shortcuts-simple', 5);
	navBar.dontSeeElement('.shortcuts-dp.dropdown-button', 5);
}).tag('shortcuts');

Scenario('For multiple shortcuts, dropdown is displayed, simple is hidden', ({ I, navBar }) => {
	I.executeScript(function () {
		MenuShortcutsAPI.get().addCircled("createFolder", "fa fa-folder-o", "flat-red", "Dossier", "Créer un dossier",
			function () {
				var newFolder = new Folder();
				newFolder.setClassId("Folder");
				var popup = JSAPI.get().getPopupAPI().buildComponentCreation(newFolder);
				popup.show();
			}
		)
	});
	navBar.dontSeeElement('.shortcuts-simple', 5);
	navBar.seeElement('.shortcuts-dp.dropdown-button', 5);
}).tag('shortcuts');