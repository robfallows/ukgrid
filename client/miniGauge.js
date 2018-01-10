import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { TunguskaGauge} from 'meteor/tunguska:gauge';

Template.miniGauge.onRendered(function() {
  const instance = Template.instance();
  const gauge = Meteor.settings.public.miniGauge;

  gauge.id = instance.data.id;
  gauge.digital.callback = function(p) {
    return p.toFixed(2);
  };

  instance.gauge = new TunguskaGauge(gauge);
  
  instance.autorun(() => {
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
      instance.gauge.set(val / 1000);
    } else {
      instance.gauge.set(0);
    }
  });
});
