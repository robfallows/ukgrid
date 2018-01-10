# ukgrid

A Meteor demo to consume an XML REST endpoint and present a chart and live gauges showing UK power demand ~~and frequency~~.

## Usage

```bash
git clone https://github.com/robfallows/ukgrid.git ukgrid
cd ukgrid
meteor npm i
APIKEY="your-api-key" meteor --settings settings.json
```

Then browse to `localhost:3000`.

## Notes

This is an updated version using Meteor 1.6, becasue the endpoints used and authentication have changed. There is now no frequency endpoint, so for now at least, the frequency "getter" has been commented out. The frequency gauge will not update, and no frequency line will be plotted.

The REST endpoint I'm polling with this app is updated 5 minutes for power demand. Don't expect highly active gauges!

If you want to run this demo, you will need to register to use the API. Registration is free and doesn't take more a minute. Browse to [the Elexon Portal](https://www.elexonportal.co.uk/registration/newuser) and register. Login to the portal and click on the `My Profile` link. Copy the `Scripting Key` and use that as the `APIKEY` environment variable when running Meteor (see Usage, above).
