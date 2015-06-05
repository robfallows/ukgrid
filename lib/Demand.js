Demand = new Mongo.Collection('demand', {
  transform: function(doc) {
    doc.power = doc.fossil + doc.nuclear + doc.green + doc.other;
    doc.ts = moment(doc._id.replace(/ /, 'T') + 'Z');
    return doc;
  }
});

fossil = new ReactiveVar(null);
nuclear = new ReactiveVar(null);
green = new ReactiveVar(null);
other = new ReactiveVar(null);
