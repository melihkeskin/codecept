//<reference path="../steps.d.ts" />
const fs = require('fs');
const I = actor();
const faker = require('faker');
const usersArray = JSON.parse(fs.readFileSync('./data/data_css.json'));
const users = new Map();
for (const [clef, value] of Object.entries(usersArray)) users.set(clef, value);

module.exports = {
    form: require('../fragments/form'),
    attachments: require('../fragments/taskAttachments'),
    viewer: require('../fragments/arender'),
    smartActions: require('../fragments/smartActions'),
    footer: require('../fragments/footerActions'),
    reasonedAnswer: require('../fragments/reasonedAnswerPopup'),
    bpmn: require('../fragments/bpmnViewer'),
    glassPanel: require('../fragments/glassPanel'),
    util: require('../fragments/util'),

    waitForOpen() {
        this.waitForOpen(true);
    },
    waitForOpen(waitForARender) {
        this.glassPanel.waitForInvisible();
        I.waitForElement(this.form.tagContainer, 45);
        I.waitForElement('.attachment-container', 45);
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
            JSAPI.get().getNavigationAPI().goToComponentPlace('TASK', id, false);
        }, id);
        this.waitForOpen(false);
    },
    getAttached(attachmentId) {
        return I.executeScript(function (attachmentId) {
            var ids = JSAPI.get().getLastComponentFormAPI().getComponent().getAttachmentIds(attachmentId);
            return ids[0];
        }, attachmentId);
    },
    async getAssignee(task) {
        let data = {};
        data.id = task;
        data.random = faker.datatype.number();
        I.executeScript(function (data) {
            var taskApi = JSAPI.get().task();
            taskApi.get(new Array(data.id), function (tasks) {
                assignee = tasks[0].getAssignee();
                $("#wrapper").append($("<p id='lock-" + data.random + "'/>"));
            });
        }, data);
        I.waitForElement('#lock-' + data.random, 120);
        return await I.executeScript(function () {
            return assignee;
        });
    },
    registerCustomProviderFor(profile) {
        I.executeScript(function (profile) {
            var userAPI = JSAPI.get().getUserAPI();
            userAPI.registerAssigneeProvider(function (tasks, key, callback) {
                $.get("./plugins/rest/profiles/" + profile + "/users/" + key, function (data) {
                    var users = new Array();
                    $.each(data, function (k, v) {
                        users.push(User.fromJSON(JSON.stringify(v)));
                    });
                    callback.provide(users);
                });
            });
        }, profile);
    },
    async assign(id, assignee) {
        this.util.executeScriptX((id, assignee, done) => {
            JSAPI.get().task().assign([id], assignee, function () {
                JSAPI.get().task().get([id], function (tasks) {
                    window.task = tasks[0];
                    done();
                });
            });
        }, id, assignee);
    },
    createEnvelope(user) {
        if (user.includes("Sup")) {
            I.waitForElement(users.get(user).shortcuts_dropdown, 10);
            I.wait(2)
            I.click(users.get(user).shortcuts_dropdown);
        }
        I.wait(2)
        I.waitForElement(users.get(user).shortcut_crea_courrier, 10);
        I.click(users.get(user).shortcut_crea_courrier);
    }
}