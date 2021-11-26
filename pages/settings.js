//<reference path="../steps.d.ts" />
const I = actor();
const sidemenu = require('../fragments/sidemenu');


module.exports = {
    openAdmin(){
        sidemenu.open('Administration');
        I.waitForElement('.componentsTab', 5)

    },
    openConfiguration(){
        sidemenu.open('Configuration');
        I.waitForElement('#CSS', 5)
    },
    openComposants(){
        sidemenu.open('Composants');
        I.waitForElement('.fa-plus', 5)
    },
    addStringTagClass(id,name)
    {
        I.click("#TAG_CLASS");

        I.click('.fa-plus');
        I.click('#validate');
        I.fillField(".id-editor .field-string .string-input",id);
        I.fillField(".i18n-labels .field-string .string-input",name);
        I.click('.fa-save');

    },
    deleteTagClass(id)
    {
        I.click("#TAG_CLASS");
        I.waitForElement('.class-admin .combobox .select2-hidden-accessible', 5);
        I.selectOption(".class-admin .combobox .select2-hidden-accessible",id);
        I.click("#delete");
        I.click("#yes");
    },
    deleteDocumentClass(id)
    {
        I.click("#DOCUMENT_CLASS");
        I.waitForElement('.class-admin .combobox .select2-hidden-accessible', 5);
        I.selectOption(".class-admin .combobox .select2-hidden-accessible",id);
        I.click("#delete");
        I.click("#yes");
    },
    CreateDocumentClass(id,name,ids_tags)
    {
        I.click("#DOCUMENT_CLASS");
        I.waitForElement('.fa-plus', 5);
        I.click('.fa-plus');
        I.fillField(".id-editor .field-string .string-input",id);
        I.fillField(".i18n-labels .field-string .string-input",name);
        I.selectOption(".form-group .combobox .select2-hidden-accessible","acl-full-control");
        I.click("#tags");
        I.click(".card-widgets .btn");
        for(var i = 0; i< ids_tags.length ;i++)   
           I.selectOption(".modal-content .combobox .select2-hidden-accessible",ids_tags[i]);
       
        I.click("#validate");
        I.click("#save");
       

    }
}