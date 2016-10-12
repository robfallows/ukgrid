import { Mongo } from 'meteor/mongo';
import moment from 'moment';

export const Demand = new Mongo.Collection('demand', {
  transform(doc) {
    doc.power = doc.fossil + doc.nuclear + doc.green + doc.other;
    doc.ts = moment(doc._id.replace(/ /, 'T') + 'Z');
    return doc;
  }
});

