import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { ActionTypes } from '/imports/api/constants.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { restore, remove } from '/imports/api/standards/methods.js';

Template.Standards_Card_Read.viewmodel({
  share: 'standard',
  mixin: ['modal', 'user', 'organization', 'standard', 'date', 'roles', 'router', 'collapsing', 'collapse', 'workInbox'],
  onRendered(template) {
    template.autorun(() => {
      this.collapsed(this.hasDocxAttachment());

      // Workaround for https://github.com/twbs/bootstrap/issues/2274
      template.$('.list-group-collapse.collapse').height('auto');
    });
  },
  closeAllOnCollapse: false,
  isFullScreenMode: false,
  isDiscussionOpened: false,
  ActionTypes() {
    return ActionTypes;
  },
  toggleScreenMode() {
    const $div = this.templateInstance.$('.content-cards-inner');
    const offset = $div.offset();
    if (this.isFullScreenMode()) {
      this.isFullScreenMode(false);

      setTimeout(() => {
        $div.css({ 'position': 'inherit', 'top': 'auto', 'right': 'auto', 'bottom': 'auto', 'left': 'auto', 'transition': 'none' });
      }, 150);
    } else {
      $div.css({ 'position': 'fixed', 'top': offset.top, 'right': $(window).width() - (offset.left + $div.outerWidth()), 'bottom': '0', 'left': offset.left });

      setTimeout(() => {

        // Safari workaround
        $div.css({ 'transition': 'all .15s linear' });
        this.isFullScreenMode(true);
      }, 100);
    }

  },
  standards() {
    const isDeleted = this.isActiveStandardFilter('deleted') ? true : { $in: [null, false] };
    return this._getStandardsByQuery({ isDeleted });
  },
  standard() {
    return this._getStandardByQuery({ _id: this._id() });
  },
  hasDocxAttachment() {
    const standard = this.standard();
    return ( standard && standard.source1 && standard.source1.htmlUrl ) || ( standard && standard.source2 && standard.source2.htmlUrl );
  },
  section() {
    const _id = !!this.standard() && this.standard().sectionId;
    return StandardsBookSections.findOne({ _id });
  },
  type() {
    const _id = !!this.standard() && this.standard().typeId;
    return StandardTypes.findOne({ _id });
  },
  _getNCsQuery() {
    return { standardsIds: this.standard() && this.standard()._id };
  },
  openEditStandardModal: _.throttle(function() {
    if (ViewModel.findOne('ModalWindow')) return;

    this.modal().open({
      _title: 'Compliance standard',
      template: 'EditStandard',
      _id: this.standard() && this.standard()._id
    });
  }, 1000),
  restore({ _id, title, isDeleted }) {
    if (!isDeleted) return;

    swal(
      {
        title: 'Are you sure?',
        text: `The standard "${title}" will be restored!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Restore',
        closeOnConfirm: false,
      },
      () => {
        restore.call({ _id }, (err) => {
          if (err) {
            swal('Oops... Something went wrong!', err.reason, 'error');
          } else {
            swal('Restored!', `The standard "${title}" was restored successfully.`, 'success');

            FlowRouter.setQueryParams({ by: 'section' });
            Meteor.setTimeout(() => {
              this.goToStandard(_id);
              this.expandCollapsed(_id);
            }, 0);
          }
        });
      }
    );
  },
  delete({ _id, title, isDeleted }) {
    if (!isDeleted) return;

    swal(
      {
        title: 'Are you sure?',
        text: `The standard "${title}" will be deleted permanently!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        closeOnConfirm: false,
      },
      () => {
        remove.call({ _id }, (err) => {
          if (err) {
            swal('Oops... Something went wrong!', err.reason, 'error');
          } else {
            swal('Removed!', `The standard "${title}" was removed successfully.`, 'success');

            const query = {};
            const options = { sort: { deletedAt: -1 } };

            const standard = this._getStandardByQuery(query, options);

            if (!!standard) {
              const { _id } = standard;

              Meteor.setTimeout(() => {
                this.goToStandard(_id);
                this.expandCollapsed(_id);
              }, 0);
            }
          }
        });
      }
    );
  }
});
