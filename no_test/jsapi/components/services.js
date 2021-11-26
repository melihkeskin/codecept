//<reference path="../../steps.d.ts" />

Before({ login } => {
    login('admin');
});

Feature('JSAPI / Services');

Scenario('Given a script When I create a folder Then I retrieve it', async ({ I, data }) => {
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

Scenario('Given a script When I create a document And modify its name Then I retrieve it', async ({ I, data }) => {
    let name = data.faker.lorem.words();
    I.executeScriptX(({ name, done }) => {
        var doc = new Document();
        doc.setName(name);
        doc.setClassId('Document');
        JSAPI.get().document().create([doc], function (created) {
            created[0].setName(name + '-updated');
            JSAPI.get().document().update([created[0]], function (updated) {
                JSAPI.get().document().get([updated[0].getId()], function (folders) {
                    window.updated = folders[0];
                    done();
                });
            });
        });
    }, name);
    I.test(function (name) {
        assertTrue(updated.getId());
        assertEquals(name + '-updated', updated.getName());
        assertEquals('Document', updated.getClassId());
        assertEquals(2, updated.getVersion());
    }, name);
}).tag('jsapi');

Scenario('Given a document When I update it twice with outdated version Then an error is thrown', async ({ I }) => {
    let result = await I.executeScriptX(({ done }) => {
        var doc = new Document();
        doc.setClassId('Document');
        JSAPI.get().document().create([doc], function (created) {
            JSAPI.get().document().update([created[0]], function (updated) {
                created[0].setVersion(1);
                JSAPI.get().document().update([created[0]], function (updated) {
                    done('ok');
                }, function (error) {
                    done('error');
                });
            });
        });
    });

    I.test(function (result) {
        assertEquals('error', result);
    }, result);
}).tag('jsapi');

Scenario('Given a script When I search for tasks Then I found some tasks', async ({ I }) => {
    I.executeScriptX(({ done }) => {
        var request = new SearchRequest();
        JSAPI.get().task().search(request, function (results) {
            window.results = results;
            done();
        });
    });
    I.test(function () {
        assertTrue(results.length > 0);
        assertTrue(results[0].getId());
    });
}).tag('jsapi');

Scenario('Given a script When I delete a document Then I cannot get it', async ({ I }) => {
    let result = await I.executeScriptX(({ done }) => {
        var doc = new Document();
        doc.setClassId('Document');
        JSAPI.get().document().create([doc], function (created) {
            JSAPI.get().document().doDelete([created[0].getId()], function () {
                JSAPI.get().document().get([created[0].getId()], function () {
                    done('ko');
                }, function () {
                    done('ok');
                });
            });
        });
    });

    I.test(function (result) {
        assertEquals('ok', result);
    }, result);
}).tag('jsapi');

