import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { TunguskaGauge} from 'meteor/tunguska:gauge';
//import { fossil, nuclear, green, other } from '/imports/groups';
//import { Demand } from '/imports/api/Demand';

Template.miniGauge.onRendered(function() {
  const instance = Template.instance();
  const gauge = Meteor.settings.public.miniGauge;

  gauge.id = instance.data.id;
  gauge.digital.callback = function(p) {
    return p.toFixed(2);
  };

  instance.gauge = new TunguskaGauge(gauge);
  
  instance.autorun(function() {
    let val;
    switch (instance.gauge.id) {
      case 'fossil': val = +window.fossil.get();
        break;
      case 'nuclear': val = +window.nuclear.get();
        break;
      case 'green': val = +window.green.get();
        break;
      default: val = +window.other.get();
    }
    if (instance.subscriptionsReady()) {
      //latest = Demand.find({}, {sort: {_id:-1}, limit:1}).fetch()[0];
      instance.gauge.set(val / 1000);
    } else {
      instance.gauge.set(0);
    }
  });
});
