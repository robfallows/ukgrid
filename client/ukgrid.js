import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Demand } from '/imports/api/Demand';

Meteor.subscribe('demand', () => {
  Tracker.autorun(() => {
    const latest = Demand.find({}, {sort: {_id:-1}, limit:1}).fetch()[0];
    window.fossil.set(latest.fossil);
    window.nuclear.set(latest.nuclear);
    window.green.set(latest.green);
    window.other.set(latest.other);
  });
});
