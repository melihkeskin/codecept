//<reference path="../steps.d.ts" />
const I = actor();
const glassPanel = require("../../fragments/glassPanel");

module.exports = {
    addForClass(componentClass, icon) {
        I.executeScript(function (componentClass, icon) {
            JSAPI.get().getHelperFactory().registerComponentIconResolver(function (component, callback) {
                if (component.getClassId() == componentClass) {
                    callback.onSuccess(icon);
                } else {
                    callback.onSuccess(null);
                }
            });
        }, componentClass, icon);
        glassPanel.waitForInvisible();
    },
    addForTag(icon, tag, value) {
        I.executeScript(function (icon, tag, value) {
            JSAPI.get().getHelperFactory().registerComponentIconResolver(function (component, callback) {
                if (component.getTagValue(tag) == value) {
                    callback.onSuccess(icon);
                } else {
                    callback.onSuccess(null);
                }
            }, tag);
        }, icon, tag, value);
        glassPanel.waitForInvisible();
    }
}