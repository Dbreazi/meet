import { useState } from 'react';

const NumberOfEvents = ({ currentNOE, setCurrentNOE }) => {

  const handleChange = (event) => {
    const value = event.target.value;
    const numericValue = Number(value); // Convert to number
    if (numericValue >= 1) {
      setCurrentNOE(numericValue); // Set the number value
    } else {
      setCurrentNOE(1); // Default to 1 if negative value entered
    }
  };

  return (
    <div id="number-of-events">
      <label htmlFor="number-of-events-input">Number of Events: </label>
      <input
        id="number-of-events-input"
        type="number"
        value={currentNOE}
        onChange={handleChange}
        min="1"
        data-testid="number-of-events"
      />
    </div>
  );
};

export default NumberOfEvents;