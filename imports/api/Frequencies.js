import { Mongo } from 'meteor/mongo';
import moment from 'moment';

export const Frequencies = new Mongo.Collection('frequencies', {
  transform: function(doc) {
    doc.ts = moment(doc._id.replace(/ /, 'T') + 'Z');
    return doc;
  }
});

