Meteor.subscribe('demand', function() {
  Tracker.autorun(function() {
    var latest = Demand.find({}, {sort: {_id:-1}, limit:1}).fetch()[0];
    fossil.set(latest.fossil);
    nuclear.set(latest.nuclear);
    green.set(latest.green);
    other.set(latest.other);
  });
});
