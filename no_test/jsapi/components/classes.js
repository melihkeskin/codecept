//<reference path="../../steps.d.ts" />


Before({ login } => {
    login('admin');
});

Feature('JSAPI / Component classes');

Scenario('Given a document class When I got it Then I can access to its field', async ({ I, data }) => {
    await I.executeAsyncScript(({ done }) => {
        JSAPI.get().documentClass().get(['Document'], function (classes) {
            window.componentClass = classes[0];
            done();
        });
    });
    I.test(function () {
        assertEquals('Document', componentClass.getId());
        assertEquals('Document', componentClass.getLocalizedDisplayName());
        assertTrue(componentClass.getLocalizedDescriptiopn());
        assertEquals([], componentClass.getTagReferences());
    });
}).tag('jsapi');

Scenario('Given a folder class When I got it Then I can access to its field', async ({ I, data }) => {
    await I.executeAsyncScript(({ done }) => {
        JSAPI.get().folderCkass().get(['Folder'], function (classes) {
            window.componentClass = classes[0];
            done();
        });
    });
    I.test(function () {
        assertEquals('Folder', componentClass.getId());
        assertEquals('Dossier', componentClass.getLocalizedDisplayName());
        assertEquals([], componentClass.getTagReferences());
    });
}).tag('jsapi');

Scenario('Given a task class When I got it Then I can access to its field', async ({ I, data }) => {
    await I.executeAsyncScript(({ done }) => {
        JSAPI.get().taskClass().get(['GEC_Step0_Creation'], function (classes) {
            window.componentClass = classes[0];
            done();
        });
    });
    I.test(function () {
        assertEquals('GEC_Step0_Creation', componentClass.getId());
        assertEquals('Processus de traitement', componentClass.getLocalizedDisplayName());
        assertTrue(componentClass.getLocalizedDescriptiopn());
        assertTrue(componentClass.getTagReferences().length > 10);
    });
}).tag('jsapi');