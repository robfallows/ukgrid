//                        Code for setting up and managing a Highcharts chart
Template.demandChart.onCreated(function() {
  this.subscribe('demand'); //                          Current demand data (24hrs)
  this.subscribe('frequencies'); //                     Current frequency data (24hrs)
});

Template.demandChart.onRendered(function() { //         On DOM chart render ...
  var self = this;
  Highcharts.setOptions({ //                            Use local time
    global: {
      useUTC: false
    }
  });

  Highcharts.theme = Meteor.settings.public.theme;
  Highcharts.setOptions(Highcharts.theme);

  var chart = $('#' + self.data.chartId).highcharts(Meteor.settings.public.demandChart).highcharts();
  self.autorun(function() {
    var t = Date.now() - 86400000;
    if (self.subscriptionsReady()) {
      var i;
      var groupedDemand = Demand.find().fetch().sort(function(a,b) {
        if (a.ts < b.ts) {
          return -1;
        } else if (a.ts > b.ts) {
          return 1;
        }
        return 0;
      }).map(function(e) {
        return [
          +e.ts,
          +e.power / 1000
        ]
      });
      for (i=0; i<groupedDemand.length; i++) {
        if (groupedDemand[i][0] >= t) {
          break;
        }
      }
      groupedDemand = groupedDemand.slice(i);
      chart.series[0].setData(groupedDemand);
      
      var groupedFrequencies = Frequencies.find().fetch().sort(function(a,b) {
        if (a.ts < b.ts) {
          return -1;
        } else if (a.ts > b.ts) {
          return 1;
        }
        return 0;
      }).map(function(e) {
        return [
          +e.ts,
          +e.freq
        ]
      });
      for (i=0; i<groupedFrequencies.length; i++) {
        if (groupedFrequencies[i][0] >= t) {
          break;
        }
      }
      groupedFrequencies = groupedFrequencies.slice(i);
      chart.series[1].setData(groupedFrequencies);
    }
  });
});
