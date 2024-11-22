import { useEffect, useState } from 'react';
import { getEvents, getAccessToken, extractLocations } from './api';
import CitySearch from './components/CitySearch';
import EventList from './components/EventList';
import NumberOfEvents from './components/NumberOfEvents';
import './App.css';

const App = () => {
  const [allLocations, setAllLocations] = useState([]);
  const [currentNOE, setCurrentNOE] = useState(32); // Default number of events
  const [events, setEvents] = useState([]);
  const [currentCity, setCurrentCity] = useState("See all cities");
  const [authUrl, setAuthUrl] = useState('');
  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      //fetchAuthUrl();
    //} else {
      fetchData();
    }
  }, [currentCity, currentNOE]);

  /*const fetchAuthUrl = async () => {
    const url = await getAccessToken();
    if (!url) return;
    setAuthUrl(url);
  };*/

  const fetchData = async () => {
    // const token = await getAccessToken();
    // if (!token) return;

    const allEvents = await getEvents(); 
    const filteredEvents = currentCity === "See all cities" ? 
      allEvents : 
      allEvents.filter(event => event.location === currentCity);

    setEvents(filteredEvents.slice(0, currentNOE));
    setAllLocations(extractLocations(allEvents));
  }

  /*const handleAuthRedirect = () => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  };*/

  return (
    <div className="App">
      {/* {authUrl ? (
        <div>
          <h1>Sign In with Google</h1>
          <button onClick={handleAuthRedirect}>Sign In</button>
        </div>
      ) : ( */}
        <>
          <CitySearch allLocations={allLocations} setCurrentCity={setCurrentCity} />
          <NumberOfEvents currentNOE={currentNOE} setCurrentNOE={setCurrentNOE} />
          <EventList events={events} />
        </>
      {/* )} */}
    </div>
  );
};

export default App;
