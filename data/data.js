//<reference path="../steps.d.ts" />
const I = actor();

module.exports = {
  faker: require('faker'),
  channelCodes: [
    { 'label': 'Email', 'value': '1' },
    { 'label': 'Fax', 'value': '2' },
    { 'label': 'Courrier Papier', 'value': '3' },
    { 'label': 'Recommandé', 'value': '4' }
  ],
  routing: [
    { 'type': { 'label': 'Facture Client', 'value': 'FactureClient' }, 'service': { 'label': 'Comptabilité', 'value': 'COMPTABILITE' } },
    { 'type': { 'label': 'Facture Fournisseur', 'value': 'FactureFournisseur' }, 'service': { 'label': 'Comptabilité', 'value': 'COMPTABILITE' } },
    { 'type': { 'label': 'Commande', 'value': 'Commande' }, 'service': { 'label': 'Commerce', 'value': 'COMMERCE' } },
    { 'type': { 'label': 'Réclamation', 'value': 'Reclamation' }, 'service': { 'label': 'Commerce', 'value': 'COMMERCE' } },
    { 'type': { 'label': 'Demande d\'information', 'value': 'DemandeInfo' }, 'service': { 'label': 'Commerce', 'value': 'COMMERCE' } },
    { 'type': { 'label': 'Contrat', 'value': 'Contrat' }, 'service': { 'label': 'Juridique', 'value': 'JURIDIQUE' } },
    { 'type': { 'label': 'Résiliation', 'value': 'Resiliation' }, 'service': { 'label': 'Juridique', 'value': 'JURIDIQUE' } },
    { 'type': { 'label': 'Courrier DSI', 'value': 'CourrierDSI' }, 'service': { 'label': 'DSI', 'value': 'DSI' } }
  ],
  envelopeWorkflow: [
    { 'label': 'Demande de réclamation', 'id': 'EEnvelope_Claim' },
    { 'label': 'Demande d\'adhésion', 'id': 'EEnvelope_Subscription' }
  ],
  material: [
    'Souris', 'Clavier'
  ],

  iterations: function (count) {
    var iterations = new DataTable(['iteration']);
    for (var i = 0; i < count; i++) {
      iterations.add(['' + i]);
    }
    return iterations;
  },
  categories: function () {
    var categories = new DataTable(['value', 'label']);
    categories.add(['document', 'Document']);
    categories.add(['folder', 'Dossier']);
    categories.add(['virtualFolder', 'Dossier virtuel']);
    categories.add(['task', 'Tâche']);
    return categories;
  },
  docsClass: function () {
    var docClass = new DataTable(['value']);
    docClass.add(['Abonnement à une opération']);
    docClass.add(['Annotation']);
    docClass.add(['Configuration d\'un annuaire d\'entreprise']);
    docClass.add(['Configuration de champs à historiser']);
    docClass.add(['Configuration de l\'interface']);
    docClass.add(['Configuration des oAuth clients']);
    docClass.add(['Courrier Entrant']);
    docClass.add(['Courrier Sortant']);
    docClass.add(['CSS']);
    docClass.add(['Document']);
    docClass.add(['Pièce jointe d\'une e-Enveloppe']);
    docClass.add(['Préférences utilisateur']);
    docClass.add(['Script']);
    docClass.add(['Template']);
    return docClass;
  },
  mail: function () {
    return {
      'name': this.faker.system.commonFileName(),
      'firstName': this.removeAccents(this.faker.name.firstName()),
      'lastName': this.removeAccents(this.faker.name.lastName()),
      'object': this.faker.lorem.sentence(),
      'channelCode': this.randomElement(this.channelCodes),
      'routing': this.randomElement(this.routing),
      'refClient': null,
    }
  },
  order: function () {
    return {
      'user': this.faker.name.firstName(),
      'material': 'PC'
    }
  },
  envelope: function () {
    return {
      'workflow': this.randomElement(this.envelopeWorkflow),
      'routing': this.randomElement(this.routing)
    }
  },
  customer: function () {
    return {
      'ref': this.faker.datatype.number() + '',
      'firstName': this.faker.name.firstName(),
      'lastName': this.faker.name.lastName()
    }
  },
  randomElement: function (array) {
    const index = this.randomInteger(0, array.length);
    return array[index];
  },
  randomInteger: function (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
  },
  removeAccents: function (strAccents) {
    strAccents = strAccents.split('');
    strAccentsOut = new Array();
    strAccentsLen = strAccents.length;
    var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    var accentsOut = ['A', 'A', 'A', 'A', 'A', 'A', 'a', 'a', 'a', 'a', 'a', 'a', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'o', 'o', 'o', 'o', 'o', 'o', 'E', 'E', 'E', 'E', 'e', 'e', 'e', 'e', 'e', 'C', 'c', 'D', 'I', 'I', 'I', 'I', 'i', 'i', 'i', 'i', 'U', 'U', 'U', 'U', 'u', 'u', 'u', 'u', 'N', 'n', 'S', 's', 'Y', 'y', 'y', 'Z', 'z'];
    for (var y = 0; y < strAccentsLen; y++) {
      if (accents.indexOf(strAccents[y]) != -1) {
        strAccentsOut[y] = accentsOut[accents.indexOf(strAccents[y])];
      } else
        strAccentsOut[y] = strAccents[y];
    }
    strAccentsOut = strAccentsOut.join('');
    return strAccentsOut;
  }
}