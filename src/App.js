// src/App.js

import './App.css';
import EventList from './components/EventList';
import CitySearch from './components/CitySearch';
import NumberOfEvents from './components/NumberOfEvents';
import { useEffect, useState } from 'react';
import { extractLocations, getEvents } from './api'; // Import your api functions

const App = () => {
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32); // Default number of events
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [errorAlert, setErrorAlert] = useState(""); // For error handling

  // Fetch data whenever the city or number of events changes
  useEffect(() => {
    fetchData();
  }, [currentCity, currentNOE]);

  // Function to fetch events and locations
  const fetchData = async () => {
    try {
      const allEvents = await getEvents(); // Fetch events from the API or mock data
      const filteredEvents = currentCity === "See all cities" ?
        allEvents : allEvents.filter(event => event.location === currentCity); // Filter based on city
      setEvents(filteredEvents.slice(0, currentNOE)); // Limit to the specified number of events
      setAllLocations(extractLocations(allEvents)); // Extract unique locations
    } catch (error) {
      console.error("Error fetching events:", error);
      setErrorAlert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="App">
      <CitySearch 
        allLocations={allLocations} 
        setCurrentCity={setCurrentCity} 
      />
      <EventList events={events} />
      <NumberOfEvents 
        setErrorAlert={setErrorAlert}
        currentNOE={currentNOE}
        setCurrentNOE={setCurrentNOE}
      />
      {errorAlert && <div className="error">{errorAlert}</div>} {/* Display error alert if any */}
    </div>
  );
}

export default App;
