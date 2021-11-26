//<reference path="../steps.d.ts" />
const { I } = inject();
const util = require('../fragments/util');
const glassPanel = require('../fragments/glassPanel');

class Component {
    constructor(category) {
        this.form = require('../fragments/form');
        this.category = category;
    }

    open(id) {
        util.executeScriptX((id, category, done) => {
            JSAPI.get().registerForComponentChange(function (componentFormAPI, component, phase) {
                if (component.getId() == id) {
                    done();
                }
            });
            JSAPI.get().getNavigationAPI().goToComponentPlace(category, id, false);
        }, id, this.category);
        glassPanel.waitForInvisible();
    }
}

// For inheritance
module.exports = new Component();
module.exports.Component = Component;