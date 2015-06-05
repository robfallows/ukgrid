Template.freqGauge.onCreated(function() {
  this.subscribe('frequencies');
  this.latest = new ReactiveVar(null);
});

Template.freqGauge.onRendered(function() {
  var self = this;
  var gauge = Meteor.settings.public.freqGauge;
  gauge.id = self.data.id;
  gauge.digital.callback = function(p) {
    return p.toFixed(3);
  };
  gauge.tick.major.callback = function(v) {
    return '' + parseInt(parseInt(v*10, 10) / 10, 10) + '.' + (parseInt(v*10, 10) % 10);
  };
  gauge.tick.major.legend.callback = function(p) {
    return p.toFixed(1);
  };

  self.gauge = new TunguskaGauge(gauge);
  self.autorun(function() {
    var latest;
    if (self.subscriptionsReady()) {
      latest = Frequencies.find({}, {sort: {_id:-1}, limit:1}).fetch()[0];
      self.gauge.set(Frequencies.findOne(latest._id).freq);
      self.latest.set(latest.ts);
    } else {
      self.gauge.set(50);
    }
  });
});

Template.freqGauge.helpers({
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
