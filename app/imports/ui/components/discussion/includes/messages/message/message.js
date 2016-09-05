import { Autolinker } from 'meteor/konecty:autolinker';
import Clipboard from 'clipboard';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import get from 'lodash.get';

import { getFormattedDate } from '/imports/api/helpers.js';
import { handleMethodResult } from '/imports/api/helpers.js';
import { remove as removeMessage } from '/imports/api/messages/methods.js';
import { TruncatedStringLengths } from '/imports/api/constants.js';
import { Files } from '/imports/api/files/files.js';

Template.Discussion_Message.viewmodel({
	mixin: ['discussions', 'organization', 'standard', 'modal'],
	fileId: '',

	onRendered(tpl) {
		const $chat = $(tpl.firstNode).closest('.chat-content');
		$chat.scrollTop($chat.find('.chat-messages').height());
		const clipboard = new Clipboard('.js-message-copy-link');
	},
	getFormattedDate: getFormattedDate,
	uploader() {
		return ViewModel.findOne('DiscussionFileUploader');
	},
	isAuthor() {
		return Meteor.userId() === this.createdBy();
	},
	isType(type) {
		return this.type() === type;
	},
	isDiscussionEmpty() {
		return !this.discussionHasMessages(this.discussionId());
	},
	isSelected() {
		return FlowRouter.getQueryParam('at') === this._id();
	},
	formattedMessageText() {
		const message = this.message && this.message();

		return message && Autolinker.link(
			message, { truncate: TruncatedStringLengths.c40 }
		);
	},
	copyAsLink(e) {
		e.preventDefault();
	},
	pathToMessage() {
		const currentRouteName = FlowRouter.getRouteName();
    const params = FlowRouter.current().params;
		const queryParams = { at: this._id() };

    return FlowRouter.path(currentRouteName, params, queryParams);
  },
	pathToMessageToCopy() {
		const ptm = this.pathToMessage();
		const url = `${location.protocol}//${location.hostname}:${location.port}`;

		return `${url}${ptm}`;
  },
	deselect(e) {
		const at = FlowRouter.getQueryParam('at');
		if (at === this._id()) {
			FlowRouter.setQueryParams({ at: null });
		}
	},
	files() {
		return Files.find({ _id: this.fileId() });
	},
	remove(e) {
		if (!this.isAuthor()) return;

		const _id = this._id();
		const callback = (err, res) => {
			if (err) return;
		};

		swal({
			title: "Are you sure you want to delete this message?",
			text: "This cannot be undone.",
			type: "warning",
			showCancelButton: true,
			confirmButtonText: "Remove",
			closeOnConfirm: true
		},
		function () {
			removeMessage.call({ _id }, handleMethodResult(callback));
		});
	},
	openUserDetails() {
		this.modal().open({
      template: 'UserDirectory_Card_Read_Inner',
      _title: 'User details',
      user: this.user()
    });
	}
});
