const { google } = require("googleapis");
const calendar = google.calendar("v3");
const { CLIENT_SECRET, CLIENT_ID, CALENDAR_ID } = process.env;

// OAuth2 client setup
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "https://dbreazi.github.io/meet/"
);

module.exports.getAuthURL = async () => {
  const SCOPES = ["https://www.googleapis.com/auth/calendar.events.public.readonly"];

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      authUrl,
    }),
  };
};

module.exports.getAccessToken = async (event) => {
  const code = decodeURIComponent(`${event.pathParameters.code}`);

  return new Promise((resolve, reject) => {
    oAuth2Client.getToken(code, (error, response) => {
      if (error) {
        console.error('Error getting access token:', error); // Log the error
        return reject(error);
      }
      console.log('Access token received:', response); // Log the access token
      return resolve(response);
    });
  })
    .then((results) => {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(results),
      };
    })
    .catch((error) => {
      console.error('Error in getAccessToken:', error); // Log the error
      return {
        statusCode: 500,
        body: JSON.stringify(error),
      };
    });
};

module.exports.getCalendarEvents = async (event) => {
  const access_token = decodeURIComponent(event.pathParameters.access_token);
  console.log('Received Access Token:', access_token); // Log access token

  return new Promise((resolve, reject) => {
    oAuth2Client.setCredentials({ access_token });

    console.log('Using Calendar ID:', CALENDAR_ID); // Log Calendar ID
    console.log('Current time (start of events):', new Date().toISOString()); // Log current time used for the calendar query

    calendar.events.list(
      {
        calendarId: CALENDAR_ID,
        auth: oAuth2Client,
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      },
      (error, response) => {
        if (error) {
          console.error('Error fetching calendar events:', error); // Log error from API request
          reject(error);
        } else {
          console.log('API Response:', response.data.items); // Log the events fetched
          resolve(response);
        }
      }
    );
  })
    .then((results) => {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ events: results.data.items }),
      };
    })
    .catch((error) => {
      console.error('Error in getCalendarEvents:', error); // Log any errors from the promise
      return {
        statusCode: 500,
        body: JSON.stringify(error),
      };
    });
};
