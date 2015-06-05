var load = function() {
  try {
    var result = HTTP.get('http://www.bmreports.com/bsp/additional/soapfunctions.php?output=XML&element=rollingfrequency');
    var temp = xml2js.parseStringSync(result.content).ROLLING_SYSTEM_FREQUENCY.ST;
    for (var i=0; i<temp.length; i++ ) {
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
    var result = HTTP.get('http://www.bmreports.com/bsp/additional/soapfunctions.php?element=generationbyfueltypetable');
    var temp = xml2js.parseStringSync(result.content).GENERATION_BY_FUEL_TYPE_TABLE;
    var at = temp.INST[0]['$'].AT.replace(/ /, 'T');
    var fuel = temp.INST[0].FUEL;
    var fossil = nuclear = green = other = 0;
    for (var i=0; i<fuel.length; i++ ) {
      var type = fuel[i]['$'].TYPE;
      var power = +fuel[i]['$'].VAL;
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
        fossil: fossil,
        nuclear: nuclear,
        green: green,
        other: other
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

