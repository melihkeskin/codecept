const { BinActivity } = require('../fragments/admin/BinActivity');

//<reference path="../steps.d.ts" />
const I = actor();

class admin {
    constructor(){
        this.left = require('../fragments/inboxLeft');
        this.bins = {
            'documents': new BinActivity('documents')
        };

        this.test = new BinActivity();
    }
}

// For inheritance
module.exports = new admin();
module.exports.admin = admin;