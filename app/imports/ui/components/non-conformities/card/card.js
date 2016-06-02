import { Template } from 'meteor/templating';

import { Problems } from '/imports/api/problems/problems.js';

Template.RisksCard.viewmodel({
  mixin: ['organization', 'nonconformity'],
  NCs() {
    const organizationId = this.organizationId();
    const query = { organizationId };
    const options = { sort: { title: 1 } };
    return Problems.find(query, options);
  },
  NC() {

  }
});
