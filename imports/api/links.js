import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const LinksCollection = new Mongo.Collection('links');
export const OutputCollection = new Mongo.Collection('terminalOutput');

// Add security rules
OutputCollection.allow({
  insert: function(userId, doc) {
    return !!userId;
  },
  remove: function(userId, doc) {
    return doc.userId === userId;
  }
});