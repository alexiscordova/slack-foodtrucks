'use latest';

const request = require('request');

module.exports = (cb) => {
  let url = 'https://offthegrid.com/otg-api/passthrough/markets/2.json/';
  request.get(url, function(error, response, body) {
    if (error) {
      cb(null, error);
    } else {
      let data = JSON.parse(body);
      getFoodTrucks(data.MarketDetail.Events[0]);
    }
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
   */
  function getCurrentDay(day) {
    let weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        today = day - 1;

    return weekdays[today];
  };

  /**
   * Loop through each vendor and create vendor list string
   * @params {array} vendors - List of vendors from the API
   */
  function createVendorsList(vendors, truckList) {
    vendors.forEach((vendor) => {
      let name = vendor.name,
          cuisine = vendor.cuisine,
          totalVendors = vendors.length - 1;

      if (vendor !== vendors[totalVendors]) {
        truckList += `${name} (${cuisine}), `;
      } else {
        truckList += `and ${name} (${cuisine}).`;
      }
    });

    return truckList;
  };

  /**
   * Get today's food trucks from Off The Grid, and format the text output accordingly
   * @params {object} events - The first event returned from the API
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

    if ((nextEventDay !== today) || (today === 'Thursday')) {
      todaysTrucks.attachments = [];
      todaysTrucks.attachments[0] = {};
    }

    if (today === 'Thursday') {
      todaysTrucks.text = `${STRINGS.isThursday}`;
      todaysTrucks.attachments[0].text = truckList;
    } else if (nextEventDay !== today) {
      todaysTrucks.text = `${STRINGS.closed}`;
      todaysTrucks.attachments[0].text = truckList;
    } else {
      todaysTrucks.text = truckList;
    }

    todaysTrucks.response_type = 'in_channel';


    cb(null, todaysTrucks);
  }
};
