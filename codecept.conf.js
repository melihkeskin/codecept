exports.config = {
  tests: './crpn/**/*.js',
  output: './output',
  helpers: {
    CustomHelper: {
      require: './custom_helper.js',
    },
    Puppeteer: {
      url: 'http://dev.crpn.cds.arondor.cloud/flower-docs-gui',
      show: false,
      windowSize: '1280x960',
      chrome: {
        args: ["--no-sandbox", '--lang=fr-FR'],
      }
    },
    FileSystem: {}
  },
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true
    },
    tryTo: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    },
    allure: {
      enabled: true,
      outputDir: 'allure-output'
    },
    autoDelay: {
      enabled: true
    },
    autoLogin: {
      enabled: true,
      saveToFile: false,
      users: {
        admin: {
          login: (I) => {
            I.login('admin');
          },
          check: (I) => {
            I.checkIsConnected('fadmin');
          }
        },
        phu: {
          login: (I) => {
            I.login('phu');
          },
          check: (I) => {
            I.checkIsConnected('phu');
          }
        },
        jna: {
          login: (I) => {
            I.goToLoginPage();
            I.fillLoginForm('jna', 'okidoki');
            I.waitForVisible('.logo-box', 60);
            I.waitForInvisible('.glass-panel-icon', 45);
            I.wait(1);
          },
          check: (I) => {
            I.checkIsConnected('phu');
          }
        },
      }
    }
  },
  include: {
    I: './steps_file.js',
    arender: './fragments/arender.js',
    breadcrumb: './fragments/breadcrumb.js',
    confirmationPopup: './fragments/confirmationPopup.js',
    contextualMenu: './fragments/contextualMenu.js',
    deletionBasket: './fragments/deletionBasket.js',
    folderAttacher: './fragments/folderAttacher.js',
    folderBrowser: './fragments/folderBrowser.js',
    footerActions: './fragments/footerActions.js',
    form: './fragments/form.js',
    glassPanel: './fragments/glassPanel.js',
    inboxLeft: './fragments/inboxLeft.js',
    navBar: './fragments/navBar.js',
    notification: './fragments/notification.js',
    objectPicker: './fragments/objectPicker.js',
    homeCards: './fragments/homeCards.js',
    reports: './fragments/reports.js',
    reasonedAnswerPopup: './fragments/reasonedAnswerPopup.js',
    savedSearch: './fragments/savedSearch.js',
    searchActions: './fragments/searchActions.js',
    searchForm: './fragments/searchForm.js',
    searchResults: './fragments/searchResults.js',
    sidemenu: './fragments/sidemenu.js',
    smartActions: './fragments/smartActions.js',
    taskAttachments: './fragments/taskAttachments.js',

    admin: './pages/admin.js',
    browse: './pages/browse.js',
    insert: './pages/insert.js',
    Component: './pages/Component.js',
    document: './pages/document.js',
    folder: './pages/folder.js',
    home: './pages/home.js',
    search: './pages/search.js',
    settings: './pages/settings.js',
    task: './pages/task.js',
    virtualFolder: './pages/virtualFolder.js',
    data: './data/data.js',
    utils: './utils/utils.js'

  },
  bootstrap: null,
  mocha: {},
  name: 'Codecept'
}