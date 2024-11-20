import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  const [token, setToken] = useState(null);  // state for storing the access token

  useEffect(() => {
    // Get the authorization code from the URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    // If there's a code in the URL, call the backend to get the access token
    if (code) {
      fetch(`https://xlbgegs92g.execute-api.us-east-1.amazonaws.com/dev/api/token/${code}`)
        .then((response) => response.json())
        .then((data) => {
          const token = data.access_token; // Get the access token
          setToken(token); // Set the token state

          // Now fetch the calendar events using the access token
          fetch(`https://xlbgegs92g.execute-api.us-east-1.amazonaws.com/dev/api/get-events/${token}`)
            .then((response) => response.json())
            .then((eventData) => {
              setEvents(eventData.events); // Set the events state
            })
            .catch((error) => {
              console.error("Error fetching events:", error);
            });
        })
        .catch((error) => {
          console.error("Error fetching token:", error);
        });
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Meet App</h1>
        {events.length > 0 ? (
          <ul>
            {events.map((event, index) => (
              <li key={index}>{event.summary}</li>
            ))}
          </ul>
        ) : (
          <p>No events found.</p>
        )}
      </header>
    </div>
  );
}

export default App;
