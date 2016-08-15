# FoodTrucks.js
A Node.js slash command for [Slack](https://slack.com) that displays the Off the Grid food truck schedule at Vallejo and Front Street in San Francisco, CA.

Using the command `/foodtrucks` will display the day's food trucks from [Off the Grid](http://offthegrid.com), along with some additional information if the event is closed.

**Note**: This slash command only displays food trucks from Off the Grid, and—aside from Roli Roti—does not display any other nearby food trucks. Additional food trucks can be added manually, or via `http`/`https` request.

## Dependencies
FoodTrucks.js is written for Node.js in ES2015, and is run using [AWS Lambda](https://aws.amazon.com/lambda/); however, neither ES2015 nor AWS is required to use the script, but it does make it easier.

If you do want to use ES2015 and AWS Lambda, know that it has [pretty poor support for all the fun ES2015 syntax features](http://whatdoeslambdasupport.com).

## Displayed Messages
Depending on the time (e.g., the food trucks are closed) or the day (e.g., there are no food trucks at Vallejo and Front Street), the bot will return one of the following messages:

#### Monday, Wednesday, or Friday
```
  Food trucks for {day}: {vendor_name} ({cuisine}).
```

#### Thursday
```
  Roli Roti (Rotisserie Chicken, Porchetta) at the Ferry Building!
  | Food trucks for {next_event_day}: {vendor_name} ({cuisine}).
```

#### Closed
```
  Food trucks are closed. ☹️
  | Food trucks for {next_event_day}: {vendor_name} ({cuisine}).
```

## License
[MIT](https://github.com/alexiscordova/slack-foodtrucks/blob/master/LICENSE.md), or whatever is best to allow you to do whatever you want with this.
