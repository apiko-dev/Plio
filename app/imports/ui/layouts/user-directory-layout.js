import { Template } from 'meteor/templating';
import { Organizations } from '/imports/share/collections/organizations.js';


Template.UserDirectory_Layout.viewmodel({
  mixin: 'organization',
  isReady: false,
  _subHandlers: [],
  autorun: [
    function() {
      this._subHandlers([
        this.templateInstance.subscribe('currentUserOrganizationBySerialNumber', this.organizationSerialNumber())
      ]);
    },
    function () {
      this.isReady(this._subHandlers().every(handle => handle.ready()));
    }
  ]
});
