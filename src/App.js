// src/App.js

import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import { useEffect, useState } from 'react';
import { extractLocations, getEvents, getAccessToken } from './api';
import './App.css';

const App = () => {
  const [allLocations, setAllLocations] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32); // Default number of events
  const [events, setEvents] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [authUrl, setAuthUrl] = useState('');
  
  useEffect(() => {
    // Check if we have an access token in localStorage, if not, get the auth URL
    const token = localStorage.getItem('access_token');
    if (!token) {
      fetchAuthUrl();
    } else {
      fetchData();
    }
  }, [currentCity]);

  const fetchAuthUrl = async () => {
    // Call the API to get the authentication URL
    const url = await getAccessToken();
    if (!url) return;
    setAuthUrl(url); // Set the auth URL to trigger a redirect to Google for authentication
  };

  const fetchData = async () => {
    const token = await getAccessToken(); // Get the access token
    if (!token) return;

    // Fetch events after obtaining the access token
    const allEvents = await getEvents(token); // Pass the token to get real events
    const filteredEvents = currentCity === "See all cities" ?
      allEvents :
      allEvents.filter(event => event.location === currentCity);
      
    setEvents(filteredEvents.slice(0, currentNOE));
    setAllLocations(extractLocations(allEvents));
  }

  const handleAuthRedirect = () => {
    if (authUrl) {
      window.location.href = authUrl; // Redirect to Google's OAuth URL
    }
  };

  return (
    <div className="App">
      {authUrl ? (
        <div>
          <h1>Sign In with Google</h1>
          <button onClick={handleAuthRedirect}>Sign In</button>
        </div>
      ) : (
        <>
          <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
          <NumberOfEvents currentNOE={currentNOE} setCurrentNOE={setCurrentNOE} />
          <EventList events={events} />
        </>
      )}
    </div>
  );
}

export default App;
