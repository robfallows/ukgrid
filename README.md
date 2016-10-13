# ukgrid

A Meteor demo to consume XML REST endpoints and present a chart and live gauges showing UK power demand and frequency.

## Usage

```bash
git clone https://github.com/robfallows/ukgrid.git ukgrid
cd ukgrid
meteor npm i
meteor --settings settings.json
```

Then browse to `localhost:3000`.

## Notes

The REST endpoints I'm polling with this app are updated every minute for frequency and every 5 minutes for power demand. Don't expect highly active gauges!
