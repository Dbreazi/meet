// src/App.js

import './App.css';
import EventList from './components/EventList';
import CitySearch from './components/CitySearch';
import NumberOfEvents from './components/NumberOfEvents';
import { useEffect, useState } from 'react';
import { extractLocations, getEvents } from './api';

const App = () => {
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [errorAlert, setErrorAlert] = useState("");

  useEffect(() => {
    fetchData();
  }, [currentCity, currentNOE]);

  const fetchData = async () => {
    try {
      const allEvents = await getEvents();
      const filteredEvents = currentCity === "See all cities" 
        ? allEvents 
        : allEvents.filter(event => event.location === currentCity);
      
      setEvents(filteredEvents.slice(0, currentNOE));
      setAllLocations(extractLocations(allEvents));
    } catch (error) {
      console.error("Error fetching events:", error);
      setErrorAlert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="App">
      <div className="search-container">
        <CitySearch 
          allLocations={allLocations} 
          setCurrentCity={setCurrentCity} 
        />
        <NumberOfEvents 
          setErrorAlert={setErrorAlert}
          currentNOE={currentNOE}
          setCurrentNOE={setCurrentNOE}
        />
      </div>
      <EventList events={events} />
      {errorAlert && <div className="error">{errorAlert}</div>}
    </div>
  );
};

export default App;
