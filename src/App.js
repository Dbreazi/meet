// src/App.js
import './App.css';
import EventList from './components/EventList';
import CitySearch from './components/CitySearch';
import NumberOfEvents from './components/NumberOfEvents';
import CityEventsChart from './components/CityEventsChart'; 
import EventGenresChart from './components/EventGenresChart'; 
import { useEffect, useState } from 'react';
import { extractLocations, getEvents } from './api';
import { InfoAlert, ErrorAlert, WarningAlert } from './components/Alert';

const App = () => {
  const [events, setEvents] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32);
  const [allLocations, setAllLocations] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [errorAlert, setErrorAlert] = useState(""); 
  const [infoAlert, setInfoAlert] = useState(""); 
  const [warningMessage, setWarningMessage] = useState(""); 

  useEffect(() => {
    fetchData();
  }, [currentCity, currentNOE]);

  const fetchData = async () => {
    if (!navigator.onLine) {
      setWarningMessage("You are viewing cached data. The app is offline.");
    } else {
      setWarningMessage(""); 
    }

    try {
      const allEvents = await getEvents();
      const filteredEvents = currentCity === "See all cities" 
        ? allEvents 
        : allEvents.filter(event => event.location === currentCity);
      
      setEvents(filteredEvents.slice(0, currentNOE));
      setAllLocations(extractLocations(allEvents));
      
      if (filteredEvents.length === 0) {
        setInfoAlert("No events found for the selected city. Please try again with a different city.");
      } else {
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
        {infoAlert.length ? <InfoAlert text={infoAlert}/> : null}
        {warningMessage.length ? <WarningAlert text={warningMessage}/> : null}
        {errorAlert.length ? <ErrorAlert text={errorAlert}/> : null}
      </div>
      <div className="search-container">
        <CitySearch 
          allLocations={allLocations} 
          setCurrentCity={setCurrentCity} 
          setInfoAlert={setInfoAlert} 
        />
        <NumberOfEvents 
          setCurrentNOE={setCurrentNOE} 
          setErrorAlert={setErrorAlert} 
        />
        <div className="app-logo">MEET APP</div> {/* Logo text */}
      </div>
      {/* Container for both charts */}
      <div className="charts-container">
        <CityEventsChart allLocations={allLocations} events={events} />
        <EventGenresChart events={events} />
      </div>
      <EventList events={events} />
    </div>
  );
};

export default App;
