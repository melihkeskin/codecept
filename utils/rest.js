//<reference path="../steps.d.ts" />
const I = actor();

module.exports = {
    reserve(category, ids) {
        I.executeScript(function (category, ids) {
            $.post({
                url: "./plugins/rest/" + category + "/" + ids + "/reservation/reserve",
                success: function () {
                    I.say("Component has been reserved "+ ids);
                }
            });
        }, category, ids);
    }
}