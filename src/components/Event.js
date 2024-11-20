// src/components/Event.js

import { useState } from 'react';

const Event = ({ event }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Format the event date (using 'created' field)
  const formattedDate = new Date(event.created).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <li>
      {/* Updated fallback text for missing summary */}
      <h3>{event.summary || 'No title'}</h3>  {/* Display "No title" if summary is missing */}
      <p>{formattedDate || 'Date not available'}</p>
      <p>{event.location || 'Location not available'}</p>
      <button onClick={toggleDetails}>
        {showDetails ? 'Hide Details' : 'Show Details'}
      </button>
      {showDetails && (
        <div>
          <p>Event Details</p>
        </div>
      )}
    </li>
  );
};

export default Event;