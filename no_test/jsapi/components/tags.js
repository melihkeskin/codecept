//<reference path="../../steps.d.ts" />


Before({ login } => {
    login('admin');
});

Feature('JSAPI / Tags');

Scenario('Given a document When I get unexisting tag Then I retrieve null value', async ({ I }) => {
    await I.test(function () {
        var newDocument = new Document();
        assertEquals([], newDocument.getTags());
        assertFalse(newDocument.getTagValue("tag"))
        assertFalse(newDocument.getTagValues("tag"))
    });
}).tag('jsapi');

Scenario('Given a document When I add a new monovalued using string tag Then I retrieve its value', async ({ I, data }) => {
    await I.test(function (value) {
        var newDocument = new Document();
        newDocument.addTag("tag", value, false);
        assertEquals(["tag"], newDocument.getTags());
        assertEquals(value, newDocument.getTagValue("tag"))
        arrayEquals([value], newDocument.getTagValues("tag"));
    }, data.faker.lorem.words());
}).tag('jsapi');

Scenario('Given a task When I add a new monovalued tag using array Then I retrieve its value', async ({ I, data }) => {
    await I.test(function (value) {
        var task = new Task();
        task.addTag("tag", [value], false);
        assertEquals(value, task.getTagValue("tag"))
        arrayEquals([value], task.getTagValues("tag"));
    }, data.faker.lorem.words());
}).tag('jsapi');

Scenario('Given a document When I add a new multivalued tag Then I retrieve its values', async ({ I, data }) => {
    await I.test(function (value) {
        var newDocument = new Document();
        newDocument.addTag("tag", [value, value + '2'], false);
        assertEquals(["tag"], newDocument.getTags());
        assertEquals(value, newDocument.getTagValue("tag"))
        assertEquals([value, value + '2'], newDocument.getTagValues("tag"))
    }, data.faker.lorem.words());
}).tag('jsapi');

Scenario('Given a document When I modify an existing tag Then I retrieve its new values', async ({ I, data }) => {
    await I.test(function (value) {
        var newDocument = new Document();
        newDocument.addTag("tag", "orginal value", false);
        newDocument.addTag("tag", value, false);
        assertEquals(["tag"], newDocument.getTags());
        assertEquals(value, newDocument.getTagValue("tag"))
        assertEquals([value], newDocument.getTagValues("tag"))
    }, data.faker.lorem.words());
}).tag('jsapi');