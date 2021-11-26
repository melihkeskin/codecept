/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file.js');
type arender = typeof import('./fragments/arender.js');
type breadcrumb = typeof import('./fragments/breadcrumb.js');
type confirmationPopup = typeof import('./fragments/confirmationPopup.js');
type contextualMenu = typeof import('./fragments/contextualMenu.js');
type dashletPopup = typeof import('./fragments/dashletPopup.js');
type deletionBasket = typeof import('./fragments/deletionBasket.js');
type folderAttacher = typeof import('./fragments/folderAttacher.js');
type folderBrowser = typeof import('./fragments/folderBrowser.js');
type footerActions = typeof import('./fragments/footerActions.js');
type form = typeof import('./fragments/form.js');
type glassPanel = typeof import('./fragments/glassPanel.js');
type inboxLeft = typeof import('./fragments/inboxLeft.js');
type navBar = typeof import('./fragments/navBar.js');
type notification = typeof import('./fragments/notification.js');
type notificationPopup = typeof import('./fragments/notificationPopup.js');
type objectPicker = typeof import('./fragments/objectPicker.js');
type rightBar = typeof import('./fragments/rightBar.js');
type reasonedAnswerPopup = typeof import('./fragments/reasonedAnswerPopup.js');
type savedSearch = typeof import('./fragments/savedSearch.js');
type searchActions = typeof import('./fragments/searchActions.js');
type searchForm = typeof import('./fragments/searchForm.js');
type searchResults = typeof import('./fragments/searchResults.js');
type sidemenu = typeof import('./fragments/sidemenu.js');
type smartActions = typeof import('./fragments/smartActions.js');
type stampPopup = typeof import('./fragments/stampPopup.js');
type taskAttachments = typeof import('./fragments/taskAttachments.js');
type admin = typeof import('./pages/admin.js');
type browse = typeof import('./pages/browse.js');
type insert = typeof import('./pages/insert.js');
type component = typeof import('./pages/component.js');
type document = typeof import('./pages/document.js');
type folder = typeof import('./pages/folder.js');
type home = typeof import('./pages/home.js');
type search = typeof import('./pages/search.js');
type task = typeof import('./pages/task.js');
type virtualFolder = typeof import('./pages/virtualFolder.js');
type data = typeof import('./data/data.js');
type utils = typeof import('./utils/utils.js');
type CustomHelper = import('./custom_helper.js');

declare namespace CodeceptJS {
  interface SupportObject { I: CodeceptJS.I, arender: arender, breadcrumb: breadcrumb, confirmationPopup: confirmationPopup, contextualMenu: contextualMenu, dashletPopup: dashletPopup, deletionBasket: deletionBasket, folderAttacher: folderAttacher, folderBrowser: folderBrowser, footerActions: footerActions, form: form, glassPanel: glassPanel, inboxLeft: inboxLeft, navBar: navBar, notification: notification, notificationPopup: notificationPopup, objectPicker: objectPicker, rightBar: rightBar, reasonedAnswerPopup: reasonedAnswerPopup, savedSearch: savedSearch, searchActions: searchActions, searchForm: searchForm, searchResults: searchResults, sidemenu: sidemenu, smartActions: smartActions, stampPopup: stampPopup, taskAttachments: taskAttachments, admin: admin, browse: browse, insert: insert, component: component, document: document, folder: folder, home: home, search: search, task: task, virtualFolder: virtualFolder, data: data, utils: utils }
  interface CallbackOrder { [0]: CodeceptJS.I; [1]: arender; [2]: breadcrumb; [3]: confirmationPopup; [4]: contextualMenu; [5]: dashletPopup; [6]: deletionBasket; [7]: folderAttacher; [8]: folderBrowser; [9]: footerActions; [10]: form; [11]: glassPanel; [12]: inboxLeft; [13]: navBar; [14]: notification; [15]: notificationPopup; [16]: objectPicker; [17]: rightBar; [18]: reasonedAnswerPopup; [19]: savedSearch; [20]: searchActions; [21]: searchForm; [22]: searchResults; [23]: sidemenu; [24]: smartActions; [25]: stampPopup; [26]: taskAttachments; [27]: admin; [28]: browse; [29]: insert; [30]: component; [31]: document; [32]: folder; [33]: home; [34]: search; [35]: task; [36]: virtualFolder; [37]: data; [38]: utils }
  interface Methods extends CustomHelper, CodeceptJS.Puppeteer, CodeceptJS.FileSystem {}
  interface I extends ReturnType<steps_file> {}
  namespace Translation {
    interface Actions {}
  }
}
