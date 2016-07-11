import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';
import { ActionTypes, ProblemTypes } from '/imports/api/constants.js';


Template.Actions_LinkedTo.viewmodel({
  mixin: ['search', 'organization'],
  linkedTo: [],
  isEditable: true,
  linkedToIds() {
    return this._getDocsIds();
  },
  NCsIds() {
    return this._getDocsIds(ProblemTypes.NC);
  },
  risksIds() {
    return this._getDocsIds(ProblemTypes.RISK);
  },
  docSearchText() {
    const child = this.child('SelectItem');
    return child && child.value();
  },
  docs() {
    const actionType = this.type();

    if (actionType === ActionTypes.CORRECTIVE_ACTION) {
      return this.NCsDocs().concat(this.risksDocs());
    } else if (actionType === ActionTypes.PREVENTATIVE_ACTION) {
      return this.NCsDocs();
    } else if (actionType === ActionTypes.RISK_CONTROL) {
      return this.risksDocs();
    } else {
      return [];
    }
  },
  NCsDocs() {
    const NCsIds = this.NCsIds();

    const NCQuery = {
      ...this.searchObject('docSearchText', [{ name: 'title' }, { name: 'sequentialId' }]),
      organizationId: this.organizationId(),
      _id: { $nin: NCsIds },
    };

    const standardId = this.standardId && this.standardId();
    if (standardId) {
      _.extend(NCQuery, { standardsIds: standardId });
    }

    return NonConformities.find(NCQuery, { sort: { serialNumber: 1 } }).map(({ title, sequentialId, ...args }) => {
      const fullTitle = `${sequentialId} ${title}`;
      const html = `<strong>${sequentialId}</strong> ${title}`;
      return { html, sequentialId, title: fullTitle, documentType: ProblemTypes.NC, ...args };
    });
  },
  risksDocs() {
    const risksIds = this.risksIds();

    const riskQuery = {
      ...this.searchObject('docSearchText', [{ name: 'title' }, { name: 'sequentialId' }]),
      organizationId: this.organizationId(),
      _id: { $nin: risksIds }
    };

    const standardId = this.standardId && this.standardId();
    if (standardId) {
      _.extend(riskQuery, { standardsIds: standardId });
    }

    return Risks.find(riskQuery, { sort: { serialNumber: 1 } }).map(({ title, sequentialId, ...args }) => {
      const fullTitle = `${sequentialId} ${title}`;
      const html = `<strong>${sequentialId}</strong> ${title}`;
      return { html, sequentialId, title: fullTitle, documentType: ProblemTypes.RISK, ...args };
    });
  },
  linkedDocs() {
    const NCsIds = this.NCsIds();
    const risksIds = this.risksIds();

    const NCQuery = {
      _id: { $in: NCsIds },
      organizationId: this.organizationId()
    };
    const NCs = NonConformities.find(NCQuery, { sort: { serialNumber: 1 } }).map(({ ...args }) => {
      return { documentType: ProblemTypes.NC, ...args };
    });

    const riskQuery = {
      _id: { $in: risksIds },
      organizationId: this.organizationId()
    };
    const risks = Risks.find(riskQuery, { sort: { serialNumber: 1 } }).map(({ ...args }) => {
      return { documentType: ProblemTypes.RISK, ...args };
    });

    return NCs.concat(risks);
  },
  onSelectCb() {
    return this.onSelect.bind(this);
  },
  onSelect(viewmodel) {
    const { _id:documentId, documentType } = viewmodel.getSelectedItem();

    if (this.linkedToIds().find(id => id === documentId)) return;

    const resetSelectItemVm = () => {
      viewmodel.value('');
      viewmodel.selected('');
    };

    if (this.onLink) {
      this.onLink({ documentId, documentType }, resetSelectItemVm);
    } else {
      this.linkedTo().push({ documentId, documentType });
      resetSelectItemVm();
    }
  },
  onRemoveCb() {
    return this.remove.bind(this);
  },
  remove(e) {
    const { _id:documentId, documentType } = Blaze.getData(e.target);

    if (!this.linkedToIds().find(id => id === documentId)) return;

    if (this.onUnlink) {
      this.onUnlink({ documentId, documentType });
    } else {
      this.linkedTo().remove(({ docId, docType }) => {
        return (docId === documentId) && (docType === documentType);
      });
    }
  },
  getData() {
    return { linkedTo: this.linkedTo().array() };
  },
  _getDocsIds(docType) {
    let docs;
    if (docType) {
      docs = _.filter(
        this.linkedTo(),
        ({ documentType }) => documentType === docType
      );
    } else {
      docs = this.linkedTo();
    }
    return _.pluck(docs, 'documentId');
  }
});