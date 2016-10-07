import { Template } from 'meteor/templating';

import { Files } from '/imports/api/files/files.js';
import { RCAMaxCauses } from '/imports/api/constants.js';

Template.Subcards_RootCauseAnalysis_Read.viewmodel({
  mixin: [],
  causes: '',
  doc() {
    return this.rootCauseAnalysis() || {};
  },
  causes() {
    return this.doc() && this.doc().causes || [];
  },
  fileIds() {
    return this.doc() && this.doc().fileIds || [];
  },
  files() {
    const fileIds = this.fileIds() || [];
    return Files.find({ _id: { $in: fileIds } });
  },
  causesData() {
    const causes = this.causes();

    return _(RCAMaxCauses).times((n) => {
      const index = n + 1;
      const cause = causes.find(cause => cause.index === index);
      const qqq = cause ? { ...cause, isNew: false } : { index, text: '', isNew: true };
      console.log('cause', qqq);
      return cause ? { ...cause, isNew: false } : { index, text: '', isNew: true };
    });
  },
});
