import { useState } from "react";
import debounce from 'lodash.debounce';

const NumberOfEvents = ({ currentNOE, setCurrentNOE, setErrorAlert }) => {
    const [number, setNumber] = useState(currentNOE);

    const debouncedSetCurrentNOE = debounce((value) => {
        setCurrentNOE(value);
    }, 500);

    const handleInputChanged = (event) => {
        const value = event.target.value;
        setNumber(value); 

        if (isNaN(value) || value <= 0) {
            setErrorAlert('Enter a valid number');
            setCurrentNOE('1');
        } else if (value > 32) {
            setErrorAlert('Only a maximum of 32 is allowed');
            setCurrentNOE('32');
        } else {
            setErrorAlert('');
            debouncedSetCurrentNOE(value);
        }
    };

    return (
        <div id="number-of-events">
            <label>
                Number of Events:
                <input
                    type="text"
                    value={number}
                    onChange={handleInputChanged}
                    data-testid="numberOfEventsInput"
                />
            </label>
        </div>
    );
};

export default NumberOfEvents;