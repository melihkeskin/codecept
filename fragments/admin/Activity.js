//<reference path="../../steps.d.ts" />
const { I } = inject();

class Activity {
    constructor(token) {
        this.token = token;
    }
    open() {
        I.amOnPage('#/admin:' + this.token);
    }

    async quit() {
        await I.goToDefaultPage();
    }
}
// For inheritance
module.exports = new Activity();
module.exports.Activity = Activity;