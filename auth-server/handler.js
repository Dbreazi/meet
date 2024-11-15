'use strict';

const { google } = require("googleapis");
const calendar = google.calendar("v3");
const SCOPES = ["https://www.googleapis.com/auth/calendar.events.public.readonly"];
const { CLIENT_SECRET, CLIENT_ID, CALENDAR_ID } = process.env;
const redirect_uris = [
  "https://dbreazi.github.io/meet/"
];

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  redirect_uris[0]
);

module.exports.getAuthURL = async () => {
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
      authUrl, // Return as a JSON object
    }),
  };
};

module.exports.getAccessToken = async (event) => {
  // Decode the authorization code from the URL
  const code = decodeURIComponent(`${event.pathParameters.code}`);

  return new Promise((resolve, reject) => {
    // Exchange the authorization code for an access token
    oAuth2Client.getToken(code, (error, response) => {
      if (error) {
        console.error("Error retrieving access token:", error);
        return reject(error);
      }
      return resolve(response);
    });
  })
    .then((results) => {
      // Respond with the access token
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
      // Handle errors
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Failed to exchange authorization code for access token.",
          details: error,
        }),
      };
    });
};

module.exports.getCalendarEvents = async (event) => {
  // Decode the access token from the URL
  const access_token = decodeURIComponent(`${event.pathParameters.access_token}`);
  oAuth2Client.setCredentials({ access_token }); // Set the credentials

  return new Promise((resolve, reject) => {
    // Call the Google Calendar API to list events
    calendar.events.list(
      {
        calendarId: CALENDAR_ID, // Use the Google Calendar ID from your environment variables
        auth: oAuth2Client, // Set up OAuth2 authentication
        timeMin: new Date().toISOString(), // Fetch events from now onwards
        singleEvents: true, // Expand recurring events into individual ones
        orderBy: "startTime", // Sort by start time
      },
      (error, response) => {
        if (error) {
          return reject(error); // Reject the promise on error
        }
        return resolve(response); // Resolve the promise with the API response
      }
    );
  })
    .then((results) => {
      // Respond with the events data
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ events: results.data.items }), // Return the events
      };
    })
    .catch((error) => {
      // Handle errors
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          error: "Failed to fetch calendar events.",
          details: error,
        }),
      };
    });
};
