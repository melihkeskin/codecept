//<reference path="../steps.d.ts" />

const I = actor();

module.exports = {

  root: '.breadcrumb',

  see(items) {
    if (!Array.isArray(items)) items = [items];
    I.waitForText('Flower', 5, '.breadcrumb-item:nth-child(1) a');
    I.say('I see breadcrumb containing items: ' + items);
    I.waitNumberOfVisibleElements(this.root + ' .breadcrumb-item', items.length + 1, 120);
    for (const key in items) {
      const index = +key + 2;
      I.waitForText(items[key], 30, this.root + ' .breadcrumb-item:nth-child(' + index + ') a');
    }
  }
}