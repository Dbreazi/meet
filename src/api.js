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

  const response = await fetch(`https://ji7oro25e6.execute-api.us-east-1.amazonaws.com/dev/api/get-events/${token}`); // Actual API endpoint for events
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
    return accessToken; // Return the token if it exists in localStorage
  }

  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code"); // This is the authorization code returned by Google
  
  if (!code) {
    const response = await fetch("https://ji7oro25e6.execute-api.us-east-1.amazonaws.com/dev/api/get-auth-url"); // Actual API endpoint for Google OAuth URL
    const result = await response.json();
    const { authUrl } = result;
    window.location.href = authUrl; // Redirect to Google to request the auth code
  } else {
    const accessToken = await getToken(code); // Exchange the authorization code for the access token
    removeQuery(); // Remove the code query parameter from the URL after successful authentication
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
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}` // Actual API endpoint to check token validity
  );
  const result = await response.json();

  if (result.error) {
    localStorage.removeItem('access_token'); // Remove invalid token
    return null; // Return null if token is invalid
  }

  return result;
};

/**
 * Fetches a new access token using the authorization code from Google.
 * @param {*} code - The authorization code returned from Google.
 * @returns The access token.
 */
const getToken = async (code) => {
  const encodeCode = encodeURIComponent(code);
  try {
    const response = await fetch(
      `https://ji7oro25e6.execute-api.us-east-1.amazonaws.com/dev/api/token/${encodeCode}` // Actual API endpoint for getting access token
    );
    const { access_token } = await response.json();
    
    if (access_token) {
      localStorage.setItem("access_token", access_token); // Store the token in localStorage
      return access_token;
    } else {
      throw new Error('Failed to retrieve access token');
    }
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
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
