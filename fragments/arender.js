//<reference path="../steps.d.ts" />
const { I } = inject();
module.exports = {
  root: '.viewerFrame',
  contextualMenu: require('./arender/contextualMenu'),
  topPanel: require('./arender/topPanel'),
  advancedSearch: require('./arender/advancedSearch'),
  title: '.documentexplorer_treeview_thumbtitle > .gwt-Label',
  stampSelector: '#stampAnnotationDialogBoxSelection',

  dontSee: function () {
    I.waitForInvisible(this.root);
  },
  seeNameAndPageCount: function (name, pageCount) {
    I.say('Within ARender, I see document ' + name + ' with ' + pageCount + ' pages');
    this.waitForDocumentLoading();
    within({
      frame: this.root
    }, () => {
      I.waitForElement('.thumbimage', 120);
      I.waitForInvisible('#smallLoading', 120);
      this.ensureDocumentNavigatorIsOpened();
      I.waitForText(name, 120, this.title);
      I.seeNumberOfElements('.thumbimage', pageCount);
      I.seeNumberOfElements('.PageView', pageCount);
    });
  },
  seePageCount: function (pageCount) {
    I.say('Within ARender, I see document with ' + pageCount + ' pages');
    this.waitForDocumentLoading();
    within({
      frame: this.root
    }, () => {
      I.waitForElement('.thumbimage', 120);
      I.waitForInvisible('#smallLoading', 120);
      this.ensureDocumentNavigatorIsOpened();
      I.seeNumberOfElements('.thumbimage', pageCount);
      I.seeNumberOfElements('.PageView', pageCount);
    });
  },
  seeDocumentCount: function (documentCount) {
    I.say('Within ARender, I see ' + documentCount + ' document(s)');
    this.waitForDocumentLoading();
    within({
      frame: this.root
    }, () => {
      this.ensureDocumentNavigatorIsOpened();
      I.waitNumberOfVisibleElements(this.title, documentCount, 120);
    });
  },
  seeSelected(docName, pageNumber) {
    this.waitForDocumentLoading();
    within({
      frame: this.root
    }, () => {
      this.ensureDocumentNavigatorIsOpened();
      I.waitForVisible(locate(this.title).withText(docName), 120);
      I.waitForVisible('.thumbimage', 120);
      I.waitForInvisible('#smallLoading', 120);
      I.waitForText('1 / ' + pageNumber, 30, '.gwt-TabLayoutPanelContentContainer .thumblabel_container .thumblabel.thumblabel-selected');
    });
  },
  ensureDocumentNavigatorIsOpened: function () {
    I.executeScript(() => {
      let documentNavigator = document.querySelector('#embeddedScreenSplitView > div:nth-child(2)');
      if (documentNavigator && documentNavigator.style.width != '165px') {
        getARenderJS().getThumbnailsJSAPI().resetNavigator();
      }
      setTimeout(function () {
        getARenderJS().getThumbnailsJSAPI().resetNavigator();
      }, 5000);
    });
  },
  dontSeeSelected(docName, pageNumber) {
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      I.waitForVisible('.thumbimage', 120);
      I.waitForInvisible('#smallLoading', 120);
      this.ensureDocumentNavigatorIsOpened();
      I.waitForVisible(this.title, 120);
      I.dontSee(docName, this.title);
      I.dontSee('1 / ' + pageNumber, '.gwt-TabLayoutPanelContentContainer .thumblabel_container .thumblabel.thumblabel-selected');
    });
  },
  waitForDocumentLoading: function (name) {
    I.say('I wait for ARender loading');
    I.waitForVisible(this.root, 10);
    within({
      frame: this.root
    }, () => {
      I.waitForInvisible('.loader.smallLoader', 120);
      I.waitForInvisible('.thumbimage_container .gwt-Image', 10);
      I.waitForVisible('.PageView', 120);
      this.ensureDocumentNavigatorIsOpened();
      I.waitForElement('.thumbimage', 120);
      I.waitForInvisible('#smallLoading', 120);
      if (name) {
        I.waitForText(name, 120, this.title);
      }
      I.wait(0.3);
    });
  },
  seeDocumentBuilder: function () {
    this.topPanel.see('.selectiveCopyButton');
  },
  dontSeeDocumentBuilder: function () {
    this.topPanel.dontSee('.selectiveCopyButton');
  },
  seeAnnotationMenu: function () {
    this.topPanel.see('.annotationManagerButton');
    //this.topPanel.see('.obfuscateButton')
    this.contextualMenu.see('Surligner le texte');
  },
  dontSeeAnnotationMenu: function () {
    this.topPanel.dontSee('.annotationManagerButton');
    //this.topPanel.dontSee('.obfuscateButton');
    this.contextualMenu.dontSee('Surligner le texte');
  },
  seePrintMenu: function () {
    this.topPanel.see('.printButton');
  },

  seeSearchAndRedactAction() {
    this.advancedSearch.open();
    within({
      frame: this.root
    }, () => {
      var searchAndRedact = locate('.advancedSearchOptions-container .buttonSample').withText('Chercher et biffer');
      I.waitForVisible(searchAndRedact, 10);
    });
  },
  dontSeeSearchAndRedactAction() {
    this.advancedSearch.open();
    var searchAndRedact = locate('.advancedSearchOptions-container .buttonSample').withText('Chercher et biffer');
    I.dontSeeElement(searchAndRedact);
  },
  dontSeePrintMenu: function () {
    this.topPanel.dontSee('.printButton');
  },
  seeDownloadMenu: function () {
    this.topPanel.see('.documentManagerButton');
  },
  dontSeeDownloadMenu: function () {
    this.topPanel.dontSee('.documentManagerButton');
  },
  seeDownloadButton: function () {
    this.topPanel.seeInSubMenu('.downloadButton');
  },
  dontSeeDownloadButton: function () {
    this.topPanel.dontSeeInSubMenu('.downloadButton');
  },
  seeDownloadPDFButton: function () {
    this.topPanel.seeInSubMenu('.downloadPDFButton');
  },
  dontSeeDownloadPDFButton: function () {
    this.topPanel.dontSeeInSubMenu('.downloadPDFButton');
  },
  dontSeeActionsForReadOnlyDocument: function () {
    this.topPanel.openShowMore();
    this.dontSeeAnnotationMenu();
    this.dontSeeDownloadMenu();
    this.dontSeePrintMenu();
    this.dontSeeDocumentBuilder();
  },
  seeActionsForModifyDocument: function () {
    this.seeAnnotationMenu();
    this.seeDownloadMenu();
    this.seePrintMenu();
    this.topPanel.openShowMore();
    this.seeDocumentBuilder();
  },
  openDownloadMenu: function () {
    this.topPanel.openSubMenu(".documentManagerButton");
  },
  download: function () {
    this.click(".downloadButton");
  },
  downloadPDF: function () {
    this.click(".downloadPDFButton");
  },
  click: function (name) {
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      I.click(name);
    });
  },
  seeLanguage: function (locale) {
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      I.waitForVisible('.topPanelPushButton', 10);
      if (locale == 'EN') {
        I.waitForElement(locate('.topPanelPushButton-up').withAttr({ title: 'Print' }), 5);
      }
      else {
        I.waitForElement(locate('.topPanelPushButton-up').withAttr({ title: 'Imprimer' }), 5);
      }
    });
  },
  openDocumentBuilder: function () {
    within({
      frame: this.root
    }, () => {
      I.waitForElement('.thumbimage', 15);
      I.seeNumberOfElements('.thumbimage', 4);
      I.executeScript(function () {
        var db = getARenderJS().getDocumentBuilder();
        db.open();
      });
    });
  },
  splitDocument: function () {
    within({
      frame: this.root
    }, () => {
      I.waitForVisible(locate('.ChildrenPanel .thumbimage').last());
      I.click(locate('.ChildrenPanel .thumbimage').last());
      I.rightClick(locate('.ChildrenPanel .thumbimage').last());
      I.waitForVisible('.popupContent');
      I.click('.popupContent .gwt-Label:nth-child(2)');
      I.waitForVisible(locate('.saveDocumentButton').last());
      I.click(locate('.saveDocumentButton').last());
    });
  },
  addAnnotation: function (name) {
    within({
      frame: this.root
    }, () => {
      let annotationType = locate('#ContextualMenuView .popupContent .popup-item').withText(name);
      I.rightClick('.PageView');
      I.waitForVisible('#ContextualMenuView');
      I.waitForText(name, 10, '#ContextualMenuView .popupContent');
      I.click(annotationType);
      I.click('.PageView');
      this.closeEditAnnotation(true);
      I.waitForElement(".//*[contains(concat(' ', normalize-space(./@class), ' '), ' arender-notification ')][@aria-hidden = 'true']", 10);
      I.waitForInvisible('#loading', 120);
    });
  },
  updateAnnotation: function (text) {
    this.openAnnotationExplorer(true);
    within({
      frame: this.root
    }, () => {
      I.click('.comment-contentArea');
      I.waitForElement('.comment-richText', 10);
      I.fillField('.comment-contentArea', text);
      this.closeEditAnnotation(true);
      I.waitForElement(".//*[contains(concat(' ', normalize-space(./@class), ' '), ' arender-notification ')][@aria-hidden = 'true']", 10);
    });
  },
  seeAnnotation: async function (text) {
    await this.seeComment(text);
    await this.seeAnnotationTextOnPage(text);
  },
  seeComment: async function (text) {
    this.openAnnotationExplorer(true);
    await this.seeTextualObject('.comment-explorer-panel .comment-contentArea .comment-label', 'body', text);
  },
  seeAnnotationTextOnPage: async function (text) {
    await this.seeTextualObject('.postit-mainView .postit-contentView .gwt-RichTextArea', 'body font', text);
  },
  seeTextualObject: async function (objectSelector, contentSelector, text) {
    let found = await I.executeScript(function (objectSelector, contentSelector, text) {
      function hasText(objectSelector, contentSelector, text) {
        var objects = $('.viewerFrame').contents().find(objectSelector);
        for (e = 0; e < objects.length; e++) {
          let t = objects[e]
          var seen = $(t).contents().find(contentSelector).text();
          if (seen.indexOf(text) > -1) {
            return true;
          }
        }
        return false;
      }
      return hasText(objectSelector, contentSelector, text);
    }, objectSelector, contentSelector, text);
    I.test(function (found) {
      assertTrue(found);
    }, found);
  },
  dontSeeAnnotation: function (text) {
    within({
      frame: this.root
    }, () => {
      I.dontSee(text);
    });
  },
  deleteAnnotation: function () {
    this.openAnnotationExplorer(true);
    within({
      frame: this.root
    }, () => {
      I.click('.documentExplorerTab .dropAnnotationReply ');
    });
  },

  openAnnotationExplorer: function (hasAnnotation) {
    within({
      frame: this.root
    }, () => {
      var annotationExplorerMenu = '.annotationExplorerButton';
      if (hasAnnotation) {
        annotationExplorerMenu = '.annotationExplorerButtonFull';
      }
      I.waitForVisible(annotationExplorerMenu, 10);
      I.click(annotationExplorerMenu);
    });
  },
  dontSeeInDocumentExplorer: function (name) {
    within({
      frame: this.root
    }, () => {
      I.dontSeeElement(name);
    });
  },
  closeEditAnnotation: function (embedded) {
    if (embedded) {
      I.waitForVisible('.toppanel .cancelChangesButton', 10);
      I.click('.toppanel .cancelChangesButton');
    } else {
      this.click('.cancelChangesButton');
    }
    I.wait(1);
  },
  replyAnnotation: function (text) {
    this.openAnnotationExplorer(true);
    within({
      frame: this.root
    }, () => {
      I.click('.comment-contentPanel .reply-image');
      I.click('.stackPanel-contentView-selected .comment-contentArea');
      I.fillField('.stackPanel-contentView-selected .comment-contentArea', text);
      this.closeEditAnnotation(true);
      I.waitForVisible('.arender-notification', 5);
      I.waitForElement(".//*[contains(concat(' ', normalize-space(./@class), ' '), ' arender-notification ')][@aria-hidden = 'true']", 10);
    });
  },
  cannotUpdateAnnotation: function () {
    this.openAnnotationExplorer(true);
    within({
      frame: this.root
    }, () => {
      I.click('.comment-contentArea');
      I.dontSeeElement('.comment-richText', 10);
    });
  },
  openStampSelector: function () {
    I.waitForVisible(".annotationManagerButton", 10);
    I.click(".annotationManagerButton");
    I.waitForVisible(".stampAnnotationButton", 5);
    I.click(".stampAnnotationButton");
    I.waitForVisible(this.stampSelector, 5);
  },
  createStamp: function (name) {
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      this.openStampSelector();
      let stampAnnotation = locate('.stampAnnotation').withText(name);
      I.waitForVisible(stampAnnotation, 10);
      I.click(stampAnnotation);
      I.waitForInvisible(this.stampSelector, 10);

      I.click('.scrolldocumentview .PageView');

      I.waitForText('Enregistrement', 60, '.arender-notification');
      I.waitForInvisible('.loader.smallLoader', 120);
      I.waitForInvisible('.arender-notification', 10);
      I.waitForVisible(stampAnnotation, 10);
    });
  },
  createImageStamp: function () {
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      this.openStampSelector();
      I.click(locate(this.stampSelector + '  .stampAnnotation.imageStampView'));
      I.waitForInvisible(this.stampSelector, 5);

      I.click('.scrolldocumentview .PageView');
      let stampAnnotation = locate('.scrolldocumentview .PageView  .stampAnnotation.imageStampView');
      I.waitForVisible(stampAnnotation, 10);
      I.waitForInvisible('.loader.smallLoader', 120);
    });
  },
  canNotCreateStamp: async function (name) {
    I.waitForElement(this.root, 10);
    await within({
      frame: this.root
    }, async () => {
      let numOfElements = await I.grabNumberOfVisibleElements('.stampAnnotationButton');
      if (numOfElements == 1) {
        I.click(".stampAnnotationButton");
        I.waitForVisible(this.stampSelector, 5);
        I.dontSeeElement(locate(this.stampSelector + ' .stampAnnotation >div').withText(name));
        I.click(locate(this.stampSelector + ' button').withText('Fermer'));
        I.waitForInvisible(this.stampSelector, 5);
      }
    });
  },
  deleteStamp: function (name) {
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, async () => {
      let stampAnnotation = locate('.stampAnnotation').withText(name);
      I.waitForInvisible('.loader.smallLoader', 120);
      I.waitForVisible(stampAnnotation, 10);
      I.click(stampAnnotation);

      let dropAnnotationButton = ('.toppanel .standardButton.dropAnnotationButton');

      I.waitForVisible(dropAnnotationButton, 10);
      I.click(dropAnnotationButton);

      I.waitForInvisible(stampAnnotation, 10);
      I.waitForInvisible('.loader.smallLoader', 120);
    });
  },
  deleteImageStamp: function () {
    I.waitForElement(this.root, 10);
    within({
      frame: this.root
    }, () => {
      let stampAnnotation = locate('.scrolldocumentview .PageView .stampAnnotation.imageStampView');
      I.click(stampAnnotation);

      let dropAnnotationButton = '.toppanel .standardButton.dropAnnotationButton';
      I.waitForVisible(dropAnnotationButton, 10);
      I.click(dropAnnotationButton);

      I.waitForInvisible(stampAnnotation);
      I.waitForInvisible('.loader.smallLoader', 120);
      I.wait(3);
    });
  },
  seeStamp: async function (name, color, border) {
    I.waitForElement(this.root, 10);
    await within({
      frame: this.root
    }, async () => {
      let stampAnnotation = locate('.scrolldocumentview .PageView .stampAnnotation').withText(name);
      I.waitForVisible(stampAnnotation, 30);

      if (color != null) {
        let selector = '.scrolldocumentview .PageView .stampAnnotation';
        let stampColor = await I.grabCssPropertyFrom(selector, 'color');
        I.test(function (color, stampColor) {
          assertEquals(color, stampColor);
        }, color, stampColor[0]);

        if (border === true) {
          let stampBorder = await I.grabCssPropertyFrom(selector, 'border');
          let expectedBorder = '1px solid ' + color;
          I.test(function (expectedBorder, stampBorder) {
            assertEquals(expectedBorder, stampBorder);
          }, expectedBorder, stampBorder[0]);
        }
      }
    });
  },
}
