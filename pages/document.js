//<reference path="../steps.d.ts" />
const I = actor();

module.exports = {
    form: require('../fragments/form'),
    viewer: require('../fragments/arender'),
    smartActions: require('../fragments/smartActions'),
    folderAttacher: require('../fragments/folderAttacher'),
    footer: require('../fragments/footerActions'),
    notification: require('../fragments/notification'),
    versions: require('../fragments/documentVersions'),
    glassPanel: require('../fragments/glassPanel'),
    util: require('../fragments/util'),

    waitForOpen(waitForARender) {
        this.glassPanel.waitForInvisible();
        I.waitForElement(this.form.tagContainer, 45);
        if (waitForARender) {
            I.waitForElement('.viewerFrame', 5);
            I.wait(2);
        }
    },
    open(id) {
        this.util.executeScriptX((id, done) => {
            JSAPI.get().registerForComponentChange(function (componentFormAPI, component, phase) {
                if (component.getId() == id) {
                    done();
                }
            });
            JSAPI.get().getNavigationAPI().goToComponentPlace('DOCUMENT', id, false);
        }, id);
        this.waitForOpen(false);
    },
    async createNewVersion(id, versionName) {
        await I.executeScript(function (id, versionName) {
            $.post({
                url: "./plugins/rest/documents/" + id + "/versions",
                data: versionName,
                success: function () {
                    $("#wrapper").append($("<p id='lock-" + versionName + "'/>"));
                }
            });
        }, id, versionName);
        I.waitForElement('#lock-' + versionName, 120);
    },
    async getVersion(documentId) {
        await I.executeScript(function (documentId) {
            $.ajax({
                type: "GET",
                url: "./plugins/rest/documents/" + documentId + "/versions",
                success: function (result) {
                    jsonResult = JSON.stringify(result);
                    versionId = JSON.parse(jsonResult).versions[0].Document.id;
                    $("#wrapper").append($("<p id='lock-" + documentId + "'/>"));
                }
            })
        }, documentId);
        I.waitForElement('#lock-' + documentId, 120);
        return await I.executeScript(function () {
            return versionId
        });
    },
    async deleteVersion(documentId, versionId) {
        await I.executeScript(function (documentId, versionId) {
            $.ajax({
                type: "DELETE",
                url: "./plugins/rest/documents/" + documentId + "/versions/" + versionId,
                success: function () {
                    $("#wrapper").append($("<p id='lock-" + documentId + "'/>"));
                }
            })
        }, documentId, versionId);
        I.waitForElement('#lock-' + documentId, 120);
    },
    changeContent(fileName) {
        I.attachFile('form .gwt-FileUpload', 'data/' + fileName);
        this.notification.waitForVisible('Le fichier ' + fileName + ' a été ajouté au document.', 30);
        this.viewer.seeSelected(fileName, 4);
    }
}