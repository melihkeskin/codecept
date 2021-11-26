//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('JSAPI / System fields');

Scenario('Given a folder When I set its name Then I retrieve it', async ({ I, data }) => {
    await I.test(function (value) {
        var folder = new Folder();
        folder.setName(value);
        assertEquals(value, folder.getName());
    }, data.faker.lorem.words());
}).tag('jsapi');

Scenario('Given a folder When I set its identifier Then I retrieve it', async ({ I, data }) => {
    await I.test(function (value) {
        var folder = new Folder();
        folder.setId(value);
        assertEquals(value, folder.getId());
    }, data.faker.lorem.words());
}).tag('jsapi');

Scenario('Given a folder When I set its class identifier Then I retrieve it', async ({ I, data }) => {
    await I.test(function (value) {
        var folder = new Folder();
        folder.setClassId(value);
        assertEquals(value, folder.getClassId());
    }, data.faker.lorem.words());
}).tag('jsapi');

Scenario('Given a folder When I set its ACL Then I retrieve it', async ({ I, data }) => {
    await I.test(function (value) {
        var folder = new Folder();
        folder.setACL(value);
        assertEquals(value, folder.getACL());
    }, data.faker.lorem.words());
}).tag('jsapi');

Scenario('Given a folder When I set its status Then I retrieve it', async ({ I, data }) => {
    await I.test(function () {
        var folder = new Folder();
        folder.setStatus('DRAFT');
        assertEquals('DRAFT', folder.getStatus());
    });
}).tag('jsapi');

Scenario('Given a folder When I set its version Then I retrieve it', async ({ I, data }) => {
    await I.test(function (value) {
        var folder = new Folder();
        folder.setVersion(value);
        assertEquals(value, folder.getVersion());
    }, data.faker.datatype.number());
}).tag('jsapi');

Scenario('Given a folder When I get it Then I retrieve its owner and creation & last update dates', async ({ I }) => {
    let doc = await I.createDocument();
    I.executeScriptX(({ id, done }) => {
        JSAPI.get().document().get([id], function (created) {
            window.created = created[0];
            done();
        });
    }, doc.id);
    I.test(function () {
        assertTrue(created.getCreationDate(), "Creation date should be defined");
        assertTrue(created.getLastUpdateDate(), "Last update date should be defined");
        assertTrue(created.getOwner(), "Owner should be defined");
    });
}).tag('jsapi');