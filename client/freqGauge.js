import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { TunguskaGauge} from 'meteor/tunguska:gauge';
import { Frequencies } from '/imports/api/Frequencies';

import moment from 'moment';

Template.freqGauge.onCreated(function() {
  this.subscribe('frequencies');
  this.latest = new ReactiveVar(null);
});

Template.freqGauge.onRendered(function() {
  const gauge = Meteor.settings.public.freqGauge;
  gauge.id = this.data.id;
  gauge.digital.callback = (p) => p.toFixed(3);
  gauge.tick.major.callback = (v) => `${parseInt(parseInt(v*10, 10) / 10, 10)}.${(parseInt(v*10, 10) % 10)}`;
  gauge.tick.major.legend.callback = (p) => p.toFixed(1);

  this.gauge = new TunguskaGauge(gauge);
  this.autorun(() => {
    if (this.subscriptionsReady()) {
      const latestPost = Frequencies.find({}, {sort: {_id:-1}, limit:1}).fetch()[0];
      if (latestPost) {
        this.gauge.set(latestPost.freq);
        this.latest.set(latestPost.ts);
      } else {
        this.gauge.set(50);
      }
    } else {
      this.gauge.set(50);
    }
  });
});

Template.freqGauge.helpers({
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
