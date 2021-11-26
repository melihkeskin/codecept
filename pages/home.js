//<reference path="../steps.d.ts" />
const I = actor();

module.exports = {
    root: '.home',
    breadcrumb: require('../fragments/breadcrumb'),
    navBar: require('../fragments/navBar'),
    notification: require('../fragments/notification'),
    confirmationPpopup: require('../fragments/confirmationPopup'),

    waitForOpen() {
        I.waitForInvisible('.glass-panel-icon', 45);
        I.waitForElement(this.root, 45);
    },
    seeWidget: function (title, description, type) {
        let dashlet = locate('.home-aggregation').withDescendant(locate('.header-title').withText(title));
        switch (type) {
            case 'DONUT':
                let createdDonut = locate('.ct-chart-donut').inside(dashlet);
                let donutaggregationlabel = locate('.ct-legend').withText('Document').inside(locate('.ct-chart').inside(dashlet));
                I.waitForVisible(createdDonut, 120);
                I.waitForVisible(donutaggregationlabel, 10);
                I.waitForText(description, 10);
                break;
            case 'LIST':
                let createdList = locate('.row').inside(dashlet);
                let displayedlabel = locate('.document-name').withText('Document').inside(dashlet);
                I.waitForVisible(createdList, 120);
                I.waitForVisible(displayedlabel, 10);
                I.waitForText(description, 10);
                break;
            case 'HISTO':
                let createdHisto = locate('.ct-chart-bar').inside(dashlet);
                let histoaggregationlabel = locate('.ct-legend').withText('Document').inside(locate('.ct-chart').inside(dashlet));
                I.waitForVisible(createdHisto, 120);
                I.waitForVisible(histoaggregationlabel, 10);
                I.waitForText(description, 10);
                break;
        }
    },
    deleteDashlet: function (title) {
        let createdDashlet = locate('#delete').inside(locate('.home-aggregation').withDescendant(locate('.header-title').withText(title)));
        I.waitForVisible(createdDashlet, 120);
        I.click(createdDashlet);
        this.confirmationPpopup.confirm();
        this.notification.waitForVisible('Le dashlet a été supprimé avec succès.');
    },
    editDashlet: function (oldtitle, updatedtitle, updatedDescription) {
        let createdDashlet = locate('#edit').inside(locate('.home-aggregation').withDescendant(locate('.header-title').withText(oldtitle)));
        I.waitForVisible(createdDashlet, 120);
        I.click(createdDashlet);
        I.waitForElement('.modal-content');
        I.fillField('[id~=Libellé] .string-input', updatedtitle);
        I.fillField('[id~=Description] .string-input', updatedDescription);
        I.click('.actions #validate');
    }
}