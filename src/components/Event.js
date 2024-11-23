// src/components/Event.js

import { useState } from 'react';

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Log the event object to check its contents
  console.log(event); // Should log the event object, including the description

  return (
    <li>
      <div className="eventSummary">
        <h2>{event.summary || 'No title'}</h2> {/* Fallback for missing summary */}
        <p>{event.location || 'Location not available'}</p>
        <p>{new Date(event.created).toLocaleDateString('en-US', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}</p> {/* Formatting created date */}
      </div>
      {showDetails ? (
        <div className="eventDetails">
          <p>{event.description || 'No details available'}</p> {/* Fallback for missing description */}
        </div>
      ) : null}
      <button className="show-details-btn" onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? "Hide Details" : "Show Details"}
      </button>
    </li>
  );
};

export default Event;
