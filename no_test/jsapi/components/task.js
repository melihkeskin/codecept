//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('JSAPI / Task');

Scenario('Given a task When I assign it Then I retrieve the new assignee', async ({ I, data }) => {
    let name = data.faker.lorem.words();
    I.executeScriptX(({ name, done }) => {
        var folder = new Folder();
        folder.setName(name);
        folder.setClassId('Folder');
        JSAPI.get().folder().create([folder], function (created) {
            JSAPI.get().folder().get([created[0].getId()], function (folders) {
                window.created = folders[0];
                done();
            });
        });
    }, name);
    I.test(function (name) {
        assertTrue(created.getId());
        assertEquals(name, created.getName());
        assertEquals('Folder', created.getClassId());
        assertEquals(1, created.getVersion());
    }, name);
}).tag('jsapi');
