Template.miniGauge.onRendered(function() {
  var self = this;
  var instance = Template.instance();
  var gauge = Meteor.settings.public.miniGauge;

  gauge.id = instance.data.id;
  gauge.digital.callback = function(p) {
    return p.toFixed(2);
  };

  instance.gauge = new TunguskaGauge(gauge);
  
  instance.autorun(function() {
    var val;
    switch (instance.gauge.id) {
      case 'fossil': val = +fossil.get();
        break;
      case 'nuclear': val = +nuclear.get();
        break;
      case 'green': val = +green.get();
        break;
      default: val = +other.get();
    }
    if (instance.subscriptionsReady()) {
      latest = Demand.find({}, {sort: {_id:-1}, limit:1}).fetch()[0];
      instance.gauge.set(val / 1000);
    } else {
      instance.gauge.set(0);
    }
  });
});
