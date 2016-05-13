import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';
import { update, remove } from '/imports/api/standards/methods.js';

Template.EditStandard.viewmodel({
  share: 'standard',
  mixin: 'modal',
  standard() {
    const _id = this._id && this._id();
    return Standards.findOne({ _id });
  },
  update({ query = {}, ...args }, options = {}, cb) {
    if (_.isFunction(options)) {
      cb = options;
      options = {};
    }
    const _id = this._id && this._id();
    const modifier = _.extend(args, { _id, options, query });
    console.log(modifier);
    this.modal().callMethod(update, modifier, cb);
  },
  remove() {
    const { _id, title } = this.standard();
    swal(
      {
        title: 'Are you sure?',
        text: `The standard "${title}" will be removed.`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn-danger',
        confirmButtonText: 'Remove',
        closeOnConfirm: false
      },
      () => {
        this.modal().callMethod(remove, { _id }, () => {
          swal('Removed!', `The standard "${title}" was removed succesfully.`, 'success');

          this.selectedStandardId('');
          this.modal().close();
        });
      }
    );
  }
});
