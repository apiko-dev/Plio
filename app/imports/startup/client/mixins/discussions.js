import { Discussions } from '/imports/api/discussions/discussions.js';
import { DocumentTypes } from '/imports/api/constants.js';
import { Messages } from '/imports/api/messages/messages.js';

export default {
  discussionHasMessages(discussionId) {
    return Messages.find({ discussionId }).count();
  },
  _getDiscussionIdByStandardId(standardId) {
    const query = { documentType: DocumentTypes.STANDARD, linkedTo: standardId };
    const options = { fields: { _id: 1 } };
    const discussion = Discussions.findOne(query, options);

    return discussion ? discussion._id : null;
  },
  _getDiscussionIdsByStandardId(standardId) {
    const query = { documentType: DocumentTypes.STANDARD, linkedTo: standardId };
    const options = { fields: { _id: 1 } };

    return Discussions.find(query, options).map(
      c => c._id
    );
  }
};