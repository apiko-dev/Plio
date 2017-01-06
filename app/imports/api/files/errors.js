import { Meteor } from 'meteor/meteor';

export const FILE_NAME_NOT_VALID =
   new Meteor.Error(400, 'File name can contain only letters, numbers, underscores, and dashes');