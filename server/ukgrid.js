import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Demand } from '/imports/api/Demand';
import { Frequencies } from '/imports/api/Frequencies';

import xml2js from 'xml2js';
xml2js.parseStringSync = Meteor.wrapAsync(xml2js.parseString, xml2js);

const load = function() {
  try {
    const result = HTTP.get('http://www.bmreports.com/bsp/additional/soapfunctions.php?output=XML&element=rollingfrequency');
    const temp = xml2js.parseStringSync(result.content).ROLLING_SYSTEM_FREQUENCY.ST;
    for (let i=0; i<temp.length; i++ ) {
      try {
        Frequencies.insert({
          _id: temp[i]['$'].ST.replace(/ /, 'T'),
          freq: +temp[i]['$'].VAL
        });
      } catch (error) {}
    }
  } catch (error) {
      throw new Meteor.Error('nothing to see at www.bmreports.com/bsp/additional/soapfunctions.php?output=XML&element=rollingfrequency');
  }

  try {
    const result = HTTP.get('http://www.bmreports.com/bsp/additional/soapfunctions.php?element=generationbyfueltypetable');
    const temp = xml2js.parseStringSync(result.content).GENERATION_BY_FUEL_TYPE_TABLE;
    const at = temp.INST[0]['$'].AT.replace(/ /, 'T');
    const fuel = temp.INST[0].FUEL;
    let fossil = nuclear = green = other = 0;
    for (let i=0; i<fuel.length; i++ ) {
      const type = fuel[i]['$'].TYPE;
      const power = +fuel[i]['$'].VAL;
      switch (type) {
        case 'CCGT':
        case 'OCGT':
        case 'OIL':
        case 'COAL': fossil += power;
          break;

        case 'NUCLEAR': nuclear += power;
          break;

        case 'WIND':
        case 'PS':
        case 'NPSHYD': green += power;
          break;

        default: other += power;
      }
    }
    try {
      Demand.insert({
        _id: at,
        fossil,
        nuclear,
        green,
        other
      });
    } catch (error) {}
  } catch (error) {
      throw new Meteor.Error('Nothing to see at http://www.bmreports.com/bsp/additional/soapfunctions.php?element=generationbyfueltypetable');
  }

};

Meteor.startup(function() {
  load();
  Meteor.setInterval(function() {
    try {
      load();
    } catch(error) {}
  }, 60000);
});


Meteor.publish('frequencies', function() {
  return Frequencies.find({}, {sort: {_id:-1}, limit:1440});
});


Meteor.publish('demand', function() {
  return Demand.find({}, {sort: {_id:-1}, limit: 96});
});

