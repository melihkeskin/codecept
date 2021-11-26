//<reference path="../steps.d.ts" />
const I = actor();
const faker = require('faker');
module.exports = {
    executeScriptX: async function (fn) {
        const args = Array.from(arguments);
        const random = faker.datatype.number();
        args.unshift(random);
        args.unshift(fn.toString());
        args.unshift(function (body, random) {
            var params = Array.prototype.slice.call(arguments);
            params.shift();
            params.shift();
            params.shift();
            params.push((result) => {
                if (typeof vars === 'undefined') { vars = {}; }
                vars[random] = result;
                $("#wrapper").append($("<p id='lock-" + random + "'/>"));

            });
            eval(body).apply(null, params);
        });
        I.executeScript.apply(null, args);
        this.waitAndRemoveLock(random);
        return await I.executeScript(function (random) {
            var result = vars[random];
            delete vars[random];
            return result;
        }, random);
    },
    waitAndRemoveLock: function (id) {
        I.waitForElement('#lock-' + id, 120);
        I.executeScript(function (id) {
            $('#lock-' + id).remove();
        }, id);
    },
}