// src/App.js

import './App.css';
import EventList from './components/EventList';
import CitySearch from './components/CitySearch';
import NumberOfEvents from './components/NumberOfEvents';
import { useEffect, useState } from 'react';
import { extractLocations, getEvents } from './api';
import { InfoAlert, ErrorAlert } from './components/Alert'; // Import ErrorAlert component

const App = () => {
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [errorAlert, setErrorAlert] = useState(""); // Existing errorAlert state
  const [infoAlert, setInfoAlert] = useState(""); // New infoAlert state

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
      
      if (filteredEvents.length === 0) {
        // If no events match, display the info alert
        setInfoAlert("No events found for the selected city. Please try again with a different city.");
      } else {
        // Clear the info alert when there are events
        setInfoAlert("");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setErrorAlert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="App">
      <div className="alerts-container">
        {/* Render InfoAlert if there's any text */}
        {infoAlert.length ? <InfoAlert text={infoAlert}/> : null}
        
        {/* Render ErrorAlert if there's any errorAlert text */}
        {errorAlert.length ? <ErrorAlert text={errorAlert}/> : null}
      </div>
      <div className="search-container">
        <CitySearch 
          allLocations={allLocations} 
          setCurrentCity={setCurrentCity} 
          setInfoAlert={setInfoAlert} // Pass setInfoAlert to CitySearch
        />
        <NumberOfEvents 
          setErrorAlert={setErrorAlert}
          currentNOE={currentNOE}
          setCurrentNOE={setCurrentNOE}
        />
      </div>
      <EventList events={events} />
    </div>
  );
};

export default App;
