import { Template } from 'meteor/templating';

import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';

Template.StandardsList.viewmodel({
  share: 'organization',
  mixin: 'modal',
  stadardsBookSections() {
    const query = {};
    const options = { sort: { title: 1 } };
    return StandardsBookSections.find(query, options);
  },
  openAddTypeModal(e) {
    this.modal().open({
      title: 'Add',
      isSimple: true,
      template: 'AddStandardType',
    });
  }
});
