/**
 * foodtrucks.js – A Slack slash command that displays the weekly schedule Off the Grid food trucks
 * at Vallejo and Front Street. Originally created for Questus.
 */

'use strict';
'use latest';

const https = require('https');

exports.handler = (event, context) => {
    let url = 'https://offthegrid.com/otg-api/passthrough/markets/2.json/';

    /** Make https call to get Off The Grid's event data */
    let xhr = https.get(url, (res) => {
      let resp = '';

      console.log(`Received response: ${res.statusCode}`);
      console.log(`Received headers: ${res.headers}`);

      res.on('data', (chunk) => {
        resp += chunk.toString();
      });

      res.on('end', () => {
        let data = JSON.parse(resp);
        getFoodTrucks(data.MarketDetail.Events[0]);
      });
    }).on('error', (error) => {
      console.log(`Received error: ${error}`);
    });

    /** Collection of strings to be used as copy */
    const STRINGS = {
      offDay: 'No food trucks today.',
      closed: 'Food trucks are closed. ☹️',
      isThursday: 'Roli Roti (Rotisserie Chicken, Porchetta) at the Ferry Building!',
      foodTrucks: 'Food trucks for'
    };

    /**
     * Transform day from Date object into human-readable string
     * @param {number} day - Current day from Date object
     * @return {string} weekdays - Current day in string format
     */
    function getCurrentDay(day) {
      let weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        today = day - 1;

      return weekdays[today];
    }

    /**
     * createVendorsList - Loop through each vendor and create vendor list string
     * @param {array} vendors - List of vendors from Off the Grid
     * @param {string} truckList - List of the day's to-be-compiled food trucks
     * @return {string} truckList - Compiled list of day's food trucks
     */
    function createVendorsList(vendors, truckList) {
      vendors.forEach((vendor) => {
        let name = vendor.name,
          cuisine = vendor.cuisine,
          totalVendors = vendors.length - 1,
          isLastVendor = vendor !== vendors[totalVendors];

        // Assemble the return string, and format the last vendor properly
        truckList += (isLastVendor) ? `${name} (${cuisine}), ` : `and ${name} (${cuisine}).`;
      });

      return truckList;
    }

  /**
   * getFoodTrucks - Get today's food trucks from Off The Grid, and format the text output accordingly
   * @param {object} events - The first event returned from the API
   * @return {object} todaysTrucks - Strings in Slack-formatted Object (via context.succeed)
   */
  function getFoodTrucks(events) {
    let date = new Date(),
      day = date.getDay(),
      nextEventDay = events.Event.day_of_week,
      vendors = events.Vendors,
      today = getCurrentDay(day),
      truckList = `${STRINGS.foodTrucks} ${nextEventDay}: `,
      todaysTrucks = {};

    truckList = createVendorsList(vendors, truckList);

    // Create data structures for Slack Object formating
    if ((nextEventDay !== today) || (today === 'Thursday')) {
      todaysTrucks.attachments = [];
      todaysTrucks.attachments[0] = {};
    }

    // Structure strings in the format Slack expects
    if (today === 'Thursday') {
      todaysTrucks.text = `${STRINGS.isThursday}`;
      todaysTrucks.attachments[0].text = truckList;
    } else if (nextEventDay !== today) {
      todaysTrucks.text = `${STRINGS.closed}`;
      todaysTrucks.attachments[0].text = truckList;
    } else {
      todaysTrucks.text = truckList;
    }

    // Display food truck string in the channel
    // https://api.slack.com/slash-commands#responding_to_a_command
    todaysTrucks.response_type = 'in_channel';

    // Display strings in Slack-approved Object format
    context.succeed(todaysTrucks);
  }
};
