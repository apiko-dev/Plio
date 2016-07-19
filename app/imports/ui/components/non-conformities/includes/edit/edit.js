import { Template } from 'meteor/templating';

import {
  update, remove,
  completeAnalysis, undoAnalysis,
  setAnalysisTargetDate,
  updateStandards, undoStandardsUpdate
} from '/imports/api/non-conformities/methods.js';

Template.NC_Card_Edit.viewmodel({
  mixin: ['organization', 'nonconformity', 'modal', 'callWithFocusCheck'],
  NC() {
    return this._getNCByQuery({ _id: this._id() });
  },
  slingshotDirective: 'nonConformitiesFiles',
  uploaderMetaContext() {
    return {
      organizationId: this.organizationId(),
      nonConformityId: this._id()
    };
  },
  onUpdateNotifyUserCb() {
    return this.onUpdateNotifyUser.bind(this);
  },
  onUpdateNotifyUser({ query, options }, cb) {
    return this.update({ query, options }, cb);
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update({ query = {}, options = {}, e = {}, withFocusCheck = false, ...args }, cb = () => {}) {
    const _id = this._id();
    const allArgs = { ...args, _id, options, query };

    const updateFn = () => this.modal().callMethod(update, allArgs, cb);

    if (withFocusCheck) {
      this.callWithFocusCheck(e, updateFn);
    } else {
      updateFn();
    }
  },
  updateAnalysisTargetDate({ date }) {
    const _id = this._id();
    this.modal().callMethod(setAnalysisTargetDate, { _id, targetDate: date });
  },
  completeAnalysis() {
    const _id = this._id();
    this.modal().callMethod(completeAnalysis, { _id });
  },
  undoAnalysis() {
    const _id = this._id();
    this.modal().callMethod(undoAnalysis, { _id });
  },
  updateStandards() {
    const _id = this._id();
    this.modal().callMethod(updateStandards, { _id });
  },
  undoStandardsUpdate() {
    const _id = this._id();
    this.modal().callMethod(undoStandardsUpdate, { _id });
  },
  remove() {
    const { title } = this.NC();
    const _id = this._id();

    swal(
      {
        title: 'Are you sure?',
        text: `The non-conformity "${title}" will be removed.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Remove',
        closeOnConfirm: false
      },
      () => {
        this.modal().callMethod(remove, { _id }, (err) => {
          if (err) return;
          swal('Removed!', `The non-conformity "${title}" was removed successfully.`, 'success');

          this.modal().close();
        });
      }
    );
  },
});
