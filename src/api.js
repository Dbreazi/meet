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
export const getEvents = async (token) => {
  if (window.location.href.startsWith("http://localhost")) {
    return mockData; // Return mock data during development
  }

  const response = await fetch(`https://wawdvzibpk.execute-api.us-east-1.amazonaws.com/dev/api/get-events/${token}`); // Use your actual API endpoint
  const result = await response.json();
  return result.events || null; // Return the events data or null if no events found
};

/**
 * Retrieves the access token from localStorage or redirects the user to the Google Authorization screen.
 * @returns Access token or redirects the user for authorization.
 */
export const getAccessToken = async () => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    return accessToken;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  
  if (!code) {
    const response = await fetch("https://wawdvzibpk.execute-api.us-east-1.amazonaws.com/dev/api/get-auth-url");
    const result = await response.json();
    const { authUrl } = result;
    window.location.href = authUrl; // Redirect to Google Auth
  } else {
    const accessToken = await getToken(code);
    return accessToken;
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
 * Fetches a new access token using the authorization code from Google.
 * @param {*} code - The authorization code returned from Google.
 * @returns The access token.
 */
const getToken = async (code) => {
  const encodeCode = encodeURIComponent(code);
  const response = await fetch(
    `https://wawdvzibpk.execute-api.us-east-1.amazonaws.com/dev/api/token/${encodeCode}` // Use your actual API endpoint
  );
  const { access_token } = await response.json();
  if (access_token) {
    localStorage.setItem("access_token", access_token); // Store the token in localStorage
  }
  return access_token;
};

/**
 * Removes the code query parameter from the URL after successful authentication.
 */
const removeQuery = () => {
  let newurl;
  if (window.history.pushState && window.location.pathname) {
    newurl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname;
    window.history.pushState("", "", newurl);
  } else {
    newurl = window.location.protocol + "//" + window.location.host;
    window.history.pushState("", "", newurl);
  }
};
