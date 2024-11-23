// src/api.js

import mockData from './mock-data';

/**
 * Extracts unique locations from the events array.
 * @param {*} events - The array of events.
 * @returns An array of unique locations.
 */
export const extractLocations = (events) => {
  const extractedLocations = events.map((event) => event.location);
  const locations = [...new Set(extractedLocations)];
  return locations;
};

/**
 * Fetches the list of events.
 * @returns Events data or mock data (if on localhost).
 */
export const getEvents = async () => {
  if (window.location.href.startsWith("http://localhost")) {
    return mockData; // Return mock data during development
  }

  const token = await getAccessToken(); // Get the access token

  if (token) {
    removeQuery(); // Clean up the URL
    const url = `https://vjep7vx6i2.execute-api.us-east-2.amazonaws.com/dev/api/get-events/${token}`;
    const response = await fetch(url);
    const result = await response.json();
    return result.events || []; // Return the events or an empty array if no events found
  }
  return [];
};

/**
 * Removes the code query parameter from the URL after successful authentication.
 */
const removeQuery = () => {
  let newurl;
  if (window.history.pushState && window.location.pathname) {
    newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState("", "", newurl);
  } else {
    newurl = window.location.protocol + "//" + window.location.host;
    window.history.pushState("", "", newurl);
  }
};

/**
 * Checks the validity of the access token by querying Google's token info endpoint.
 * @param {*} accessToken - The access token to be checked.
 * @returns The result of the token check (valid/invalid).
 */
const checkToken = async (accessToken) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
  );
  const result = await response.json();
  return result;
};

/**
 * Retrieves the access token from localStorage or redirects the user to the Google Authorization screen.
 * @returns Access token or redirects the user for authorization.
 */
export const getAccessToken = async () => {
  const accessToken = localStorage.getItem('access_token');
  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenCheck.error) {
    await localStorage.removeItem("access_token");
    const searchParams = new URLSearchParams(window.location.search);
    const code = await searchParams.get("code");
    if (!code) {
      const response = await fetch(
        "https://vjep7vx6i2.execute-api.us-east-2.amazonaws.com/dev/api/get-auth-url"
      );
      const result = await response.json();
      const { authUrl } = result;
      return (window.location.href = authUrl); // Redirect to Google Auth if no token is found
    }
    return code && getToken(code);
  }
  return accessToken;
};

/**
 * Fetches a new access token using the authorization code from Google.
 * @param {*} code - The authorization code returned from Google.
 * @returns The access token.
 */
const getToken = async (code) => {
  const encodeCode = encodeURIComponent(code);
  const response = await fetch(
    `https://vjep7vx6i2.execute-api.us-east-2.amazonaws.com/dev/api/token/${encodeCode}`
  );
  const { access_token } = await response.json();
  access_token && localStorage.setItem("access_token", access_token); // Store the token in localStorage
  return access_token;
};
