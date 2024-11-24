// src/api.js

import mockData from './mock-data';

/**
 * Extracts unique locations from the events array.
 */
export const extractLocations = (events) => {
  return [...new Set(events.map(event => event.location))];
};

/**
 * Fetches the list of events (mock data during development).
 */
export const getEvents = async () => {
  if (window.location.href.startsWith("http://localhost")) {
    return mockData; // Return mock data during development
  }

  const token = await getAccessToken();
  if (token) {
    removeQuery();
    const url = `https://ji7oro25e6.execute-api.us-east-1.amazonaws.com/dev/api/get-events/${token}`;
    const response = await fetch(url);
    const result = await response.json();
    return result.events || [];
  }
  return [];
};

/**
 * Removes the query parameter from the URL after successful authentication.
 */
const removeQuery = () => {
  let newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
  window.history.pushState("", "", newUrl);
};

/**
 * Retrieves the access token from localStorage or redirects to Google Authorization.
 */
export const getAccessToken = async () => {
  const accessToken = localStorage.getItem('access_token');
  const tokenCheck = accessToken && await checkToken(accessToken);

  if (!accessToken || tokenCheck.error) {
    await localStorage.removeItem("access_token");
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");

    if (!code) {
      const response = await fetch("https://ji7oro25e6.execute-api.us-east-1.amazonaws.com/dev/api/get-auth-url");
      const result = await response.json();
      return window.location.href = result.authUrl;
    }
    return code && getToken(code);
  }
  return accessToken;
};

/**
 * Fetches a new access token using the authorization code from Google.
 */
const getToken = async (code) => {
  const encodeCode = encodeURIComponent(code);
  const response = await fetch(
    `https://ji7oro25e6.execute-api.us-east-1.amazonaws.com/dev/api/token/${encodeCode}`
  );
  const { access_token } = await response.json();
  access_token && localStorage.setItem("access_token", access_token);
  return access_token;
};

/**
 * Checks the validity of the access token by querying Google's token info endpoint.
 */
const checkToken = async (accessToken) => {
  const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
  return await response.json();
};
