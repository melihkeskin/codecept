// in this file you can append custom step methods to 'I' object
const data = require('./data/data.js');
const dateformat = require('dateformat/lib/dateformat.js');
const document = require('./pages/document');
const glassPanel = require('./fragments/glassPanel');
const util = require('./fragments/util');
const notification = require('./fragments/notification');
const folder = require('./pages/folder');
const faker = require('faker');

module.exports = function () {
	return actor({
		createAndOpenDocument: async function (doc) {
			let created = await this.createDocument(doc);
			await document.open(created.id);
			return created;
		},
		createDocument: async function (doc, waitForIndexation) {
			if (!doc) {
				doc = {};
			}

			if (doc.file) {
				if (doc.file instanceof Array) {
					var files = new Array();
					for (var i = 0; i < doc.file.length; i++) {
						files[i] = await this.haveTmpFile(doc.file[i]);
					}
					doc.file = files;
				}
				else {
					doc.file = new Array(await this.haveTmpFile(doc.file));
				}
			}

			if (doc.name === undefined || doc.name === null) {
				doc.name = faker.system.commonFileName();
			}
			if (!doc.classId) {
				doc.classId = "Document";
			}
			doc.id = await util.executeScriptX((doc, done) => {
				var newDocument = new Document();
				newDocument.setName(doc.name);
				newDocument.setClassId(doc.classId);

				if (doc.file) {
					newDocument.setFiles(doc.file);
				}
				if (doc.acl) {
					newDocument.setACL(doc.acl);
				}
				if (doc.tags) {
					Object.keys(doc.tags).forEach(e => {
						newDocument.addTag(e, doc.tags[e], false);
						//console.log(`Adding tag key=${e}  value=${doc.tags[e]}`);
					});
				}
				JSAPI.get().document().create(new Array(newDocument), function (documents) {
					done(documents[0].getId());
				});
			}, doc);
			if (waitForIndexation) {
				await this.waitForFoundable("DOCUMENT", doc.id);
			}
			return doc;
		},
		haveAnnotation: async function (docId, annotation) {
			annotation.classId = 'Annotation';
			if (!annotation.type) {
				type = 'circle';
			}
			annotation.file = 'data/annotations/' + annotation.type + '.xml'
			annotation.tags = {};
			annotation.tags.ComponentLink = docId;
			await this.createDocument(annotation, true);
		},
		haveMail: async function (waitForIndexation, file, mail) {
			if (!mail) {
				mail = data.mail();
			}
			if (file) {
				mail.file = await this.haveTmpFile(file);
			}
			mail.id = await util.executeScriptX((mail, done) => {
				var incomingMail = new Document();
				incomingMail.setClassId("CourrierEntrant");
				incomingMail.setName(mail.name);
				incomingMail.addTag('CanalEntree', mail.channelCode.value, false);
				if (mail.refClient) {
					incomingMail.addTag('RefClient', mail.refClient, false);
				}
				incomingMail.addTag('PrenomClient', mail.firstName, false);
				incomingMail.addTag('NomClient', mail.lastName, false);
				incomingMail.addTag('TypeCourrier', mail.routing.type.value, false);
				incomingMail.addTag('ObjetCourrier', mail.object, false);
				incomingMail.addTag('DateCourrier', '0', false);
				if (mail.file) {
					incomingMail.setFiles(new Array(mail.file));
				}
				JSAPI.get().document().create(new Array(incomingMail), function (documents) {
					doc = documents[0];
					done(doc.getId());
				});
			}, mail);

			mail.refClient = await this.executeScript(function () {
				return doc.getTagValue('RefClient')
			});
			if (waitForIndexation) {
				mail.task = await this.waitForFoundable("TASK", mail.id, "children.id_value");
			}
			return mail;
		},
		sendOrder: async function (order) {
			order.id = await util.executeScriptX((order, done) => {
				var task = new Task();
				task.setClassId('order');
				task.addTag('Username', order.userName, false);
				task.addTag('material', order.material, false);
				task.setWorkflow('material_order_process');

				JSAPI.get().task().create(new Array(task), function (tasks) {
					done(tasks[0].getId());
				});
			}, order);
			return order;
		},
		haveEnvelope: async function (envelope, waitForIndexation) {
			envelope.id = await util.executeScriptX((envelope, done) => {
				var task = new Task();
				task.setClassId(envelope.workflow.id + '_Step1_Validation');
				task.addTag('ServiceDestinataire', envelope.routing.service.value, false);
				if (envelope.refClient) {
					task.addTag('RefClient', envelope.refClient, false);
				} else {
					task.addTag('RefClient', '123456', false);
				}
				task.addTag('Statut', 'ATRAITER', false);
				task.setWorkflow(envelope.workflow.id);
				JSAPI.get().task().create(new Array(task), function (tasks) {
					done(tasks[0].getId());
				});
			}, envelope);

			if (waitForIndexation) {
				await this.waitForFoundable("TASK", envelope.id);
			}
			return envelope;
		},
		haveCustomerFolder: async function (waitForIndexation) {
			let customer = data.customer();
			customer.id = await util.executeScriptX((customer, done) => {
				var customerFolder = new VirtualFolder();
				customerFolder.setClassId("DossierClient");
				customerFolder.setName(customer.ref + ' - ' + customer.lastName + " " + customer.firstName);
				customerFolder.addTag('RefClient', '' + customer.ref, false);
				customerFolder.addTag('PrenomClient', '' + customer.firstName, false);
				customerFolder.addTag('NomClient', '' + customer.lastName, false);
				JSAPI.get().virtualFolder().create(new Array(customerFolder), function (folders) {
					done(folders[0].getId());
				});
			}, customer);
			if (waitForIndexation) {
				await this.waitForFoundable('VIRTUAL_FOLDER', customer.id);
			}
			return customer;
		},
		waitForFoundable: async function (category, id, criterionName, criteria) {
			return await this.waitForESIndexation(category, id, criterionName, criteria, true);
		},
		waitForNotFoundable: async function (category, id, criterionName, criteria) {
			return await this.waitForESIndexation(category, id, criterionName, criteria, false);
		},
		waitForESIndexation: async function (category, id, criterionName, criteria, shouldFoundResult) {
			return await util.executeScriptX((category, id, criterionName, criteria, shouldFoundResult, done) => {
				let service;
				if (category == 'DOCUMENT') {
					service = JSAPI.get().document();
				} else if (category == 'TASK') {
					service = JSAPI.get().task();
				} else if (category == 'FOLDER') {
					service = JSAPI.get().folder();
				} else if (category == 'VIRTUAL_FOLDER') {
					service = JSAPI.get().virtualFolder();
				}

				var request = new SearchRequest();
				var filters = new AndClause();
				request.addFilterClause(filters);
				var criterion = new Criterion();
				if (criterionName) {
					criterion.setName(criterionName);
				} else {
					criterion.setName("id_value");
				}

				criterion.addValue(id);
				filters.addCriterion(criterion);

				if (criteria) {
					criteria.forEach(e => {
						let c = new Criterion();
						c.setName(e.name);
						c.addValue(e.value);
						filters.addCriterion(c);
					});
				}

				var f = function (results) {
					if (results && ((shouldFoundResult && results.length > 0) || (!shouldFoundResult && results.length == 0))) {
						done(shouldFoundResult ? results[0].getId() : '');
					} else {
						setTimeout(function () { service.search(request, f); }, 100);
					}
				};
				service.search(request, f);
			}, category, id, criterionName, criteria, shouldFoundResult);
		},
		haveTmpFile: async function (fileName) {
			let file = {};
			file.name = fileName;
			file.random = faker.datatype.number();

			this.waitForElement("#wrapper", 10);
			this.executeScript(function (file) {
				$("#wrapper").append($("<from action='post' id='formContent' method='post' enctype='multipart/form-data'> <input type='file' id='upload-" + file.random + "' name='file' > </form>"));
			}, file);
			this.waitForElement('#upload-' + file.random, 10);
			this.attachFile('#upload-' + file.random, fileName);
			return await util.executeScriptX((file, done) => {
				var f = new FormData();
				f.append('file', $('#upload-' + file.random)[0].files[0]);
				$.post({
					url: "./upload",
					data: f,
					processData: false,
					contentType: false,
					mimeTypes: "multipart/form-data",
					success: function (result) {
						done(result.split('|')[0]);
					}
				});
			}, file);
		},
		haveFolder: async function (folder, waitForIndexation) {
			if (!folder) {
				folder = {};
			}
			if (!folder.name) {
				folder.name = faker.datatype.number() + '_' + faker.commerce.productName().split(' ').join('-');
			}
			if (!folder.classId) {
				folder.classId = "Folder";
			}
			folder.id = await util.executeScriptX((folder, done) => {
				var newFolder = new Folder();
				newFolder.setClassId(folder.classId);
				newFolder.setName(folder.name);
				if (folder.acl) {
					newFolder.setACL(folder.acl);
				}
				if (folder.tags) {
					Object.keys(folder.tags).forEach(e => {
						newFolder.addTag(e, folder.tags[e], false);
					});
				}
				JSAPI.get().folder().create(new Array(newFolder), function (folders) {
					done(folders[0].getId());
				});
			}, folder);

			if (waitForIndexation) {
				await this.waitForFoundable('FOLDER', folder.id);
			}
			return folder;
		},
		haveTask: async function (task, waitForIndexation) {
			if (!task) {
				task = {};
			}
			task.id = await util.executeScriptX((task, done) => {
				var newTask = new Task();
				newTask.setClassId(task.classId);
				newTask.setName(task.name);
				if (task.workflow) {
					newTask.setWorkflow(task.workflow);
				}
				if (task.acl) {
					newTask.setACL(task.acl);
				}
				if (task.tags) {
					Object.keys(task.tags).forEach(e => {
						newTask.addTag(e, task.tags[e], false);
					});
				}
				JSAPI.get().task().create(new Array(newTask), function (tasks) {
					done(tasks[0].getId());
				});
			}, task);

			if (waitForIndexation) {
				await this.waitForFoundable('TASK', task.id);
			}
			return task;
		},
		getUserId: async function () {
			return await this.executeScript(function () {
				return JSAPI.get().getUserAPI().getCurrentUser().getId();
			});
		},
		refreshActivity: function () {
			this.say('I refresh current activity');
			this.click('.ti-reload');
			this.waitForGlassPanelHidden();
		},
		waitForGlassPanelHidden: function () {
			glassPanel.waitForInvisible();
		},
		getDate: function (date, format) {
			var toFormat = date ? date : new Date();
			var usedFormat = format ? format : "dd mmm yyyy HH:MM:ss";
			return dateformat(toFormat, usedFormat);
		},


		createFolderInRoot: function (name) {
			folder.open('root');
			this.waitForGlassPanelHidden();
			folder.folders.clickOnAddFolder();
			this.waitForElement('.modal-dialog.component-creation.folder', 5);
			this.fillField('.modal-header .title-container .string-input', name);
			folder.form.changeClass('NoCaseFolder');
			folder.form.create();
			notification.waitForVisible('Le dossier a été créé avec succès');
			this.waitForGlassPanelHidden();
		},

		seeInHistory: async function (task, text) {
			task.smartActions.openSub('#history');
			this.waitForElement('.component-history .timeline-item .item-description', 5);
			let nameUser = await this.executeScript(function () {
				return JSAPI.get().getUserAPI().getCurrentUser().getDisplayName();
			});
			this.see(nameUser + text, 'div');
		},
		goBack() {
			this.executeScript(function () {
				JSAPI.get().getNavigationAPI().goBack();
			});
			this.waitForGlassPanelHidden();
		},
		waitAndRemoveLock: function () {
			util.waitAndRemoveLock.apply(util, arguments);
		},
		executeScriptX: async function () {
			return await util.executeScriptX.apply(util, arguments);
		},
		test: function () {
			this.initializeTests();
			const args = Array.from(arguments);
			this.executeScript.apply(null, args);
		},
		initializeTests: function () {
			this.executeScript(function () {
				window.assertTrue = function (condition, message) {
					if (!condition) {
						throw message || "Condition should be true";
					}
				};
				window.assertFalse = function (condition, message) {
					if (condition) {
						throw message || "Condition should be false";
					}
				};
				window.assertNull = function (condition, message) {
					if (typeof (condition) !== "undefined" && condition !== null) {
						throw message || "Condition should be null";
					}
				};
				window.assertEquals = function (expected, actual, message) {
					if (Array.isArray(expected) && Array.isArray(actual)) {
						arrayEquals(expected, actual, message);
						return;
					}
					if (!(expected === actual)) {
						throw message || "Expected=" + expected + " but actual=" + actual;
					}
				};
				window.arrayEquals = function (expected, actual, message) {
					let eq = Array.isArray(expected) &&
						Array.isArray(actual) &&
						expected.length === actual.length &&
						expected.every((val, index) => val === actual[index]);
					if (!eq) {
						throw message || "Expected=" + expected + " but actual=" + actual;
					}
				};
			});
		},
		haveDocumentCreationPopup: async function (doc) {
			this.executeScript(function (doc) {
				var newComponent = new Document();
				if (doc.classId) {
					newComponent.setClassId(doc.classId);
				}
				newComponent.setName(doc.name);
				var popup = JSAPI.get().getPopupAPI().buildComponentCreation(newComponent);
				popup.show();
			}, doc);
		},
		haveTaskCreationPopup: async function (task) {
			this.executeScript(function (task) {
				var newComponent = new Task();
				if (task.classId) {
					newComponent.setClassId(task.classId);
				}
				newComponent.setName(task.name);
				var popup = JSAPI.get().getPopupAPI().buildComponentCreation(newComponent);
				popup.show();
			}, task);
		}
	});
}