Template.demandGauge.onCreated(function() {
  this.subscribe('demand');
  this.latest = new ReactiveVar(null);
});

Template.demandGauge.onRendered(function() {
  var self = this;
  var gauge = Meteor.settings.public.demandGauge;
  gauge.id = self.data.id;
  gauge.digital.callback = function(p) {
    return p.toFixed(2);
  };

  self.gauge = new TunguskaGauge(gauge);
  self.autorun(function() {
    var latest;
    if (self.subscriptionsReady()) {
      latest = Demand.find({}, {
        sort: {
          _id: -1
        },
        limit: 1
      }).fetch()[0];
      self.gauge.set(Demand.findOne(latest._id).power / 1000);
      self.latest.set(latest.ts);
    } else {
      self.gauge.set(0);
    }
  });
});

Template.demandGauge.helpers({
  timestamp: function() {
    var s = Meteor.status().status;
    if (s !== 'connected') {
      return s;
    }
    return moment(Template.instance().latest.get()).format().replace(/T/, ' ');
  },
  ready: function() {
    return Template.instance().subscriptionsReady();
  }
});
