import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { TunguskaGauge} from 'meteor/tunguska:gauge';
import { Demand } from '/imports/api/Demand';

import moment from 'moment';

Template.demandGauge.onCreated(function() {
  this.subscribe('demand');
  this.latest = new ReactiveVar(null);
});

Template.demandGauge.onRendered(function() {
  const gauge = Meteor.settings.public.demandGauge;
  gauge.id = this.data.id;
  gauge.digital.callback = (p) => p.toFixed(2);

  this.gauge = new TunguskaGauge(gauge);
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      const latestPost = Demand.find({}, { sort: { _id: -1 }, limit: 1 }).fetch()[0];
      this.gauge.set(latestPost.power / 1000);
      this.latest.set(latestPost.ts);
    } else {
      this.gauge.set(0);
    }
  });
});

Template.demandGauge.helpers({
  timestamp() {
    const s = Meteor.status().status;
    if (s !== 'connected') {
      return s;
    }
    return moment(Template.instance().latest.get()).format().replace(/T/, ' ');
  },
  ready() {
    return Template.instance().subscriptionsReady();
  }
});
