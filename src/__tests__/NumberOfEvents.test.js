import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents /> Component', () => {
    let setErrorAlert;
    let setCurrentNOE;

    beforeEach(() => {
        setErrorAlert = jest.fn();
        setCurrentNOE = jest.fn();
        render(
            <NumberOfEvents
                currentNOE={32}
                setCurrentNOE={setCurrentNOE}
                setErrorAlert={setErrorAlert}
            />
        );
    });

    test('updates value when user types', async () => {
        const input = screen.getByTestId('numberOfEventsInput');
        const user = userEvent.setup();

        await user.clear(input);
        await user.type(input, '50');

        // Wait for the value to be updated
        await screen.findByDisplayValue('50');

        // Ensure setCurrentNOE is called with '50'
        expect(setCurrentNOE).toHaveBeenCalledWith('32');
    });

    test('prevents negative input and resets to 1', async () => {
        const input = screen.getByTestId('numberOfEventsInput');
        const user = userEvent.setup();
        await user.clear(input);
        await user.type(input, '-10');
        
        // Check that the value resets to '1'
        expect(setCurrentNOE).toHaveBeenCalledWith('1');
        expect(setErrorAlert).toHaveBeenCalledWith('Enter a valid number');
    });

    test('handles non-numeric input gracefully', async () => {
        const input = screen.getByTestId('numberOfEventsInput');
        const user = userEvent.setup();
        await user.clear(input);
        await user.type(input, 'abc');
        
        // Check that the value resets to '1'
        expect(setCurrentNOE).toHaveBeenCalledWith('1');
        expect(setErrorAlert).toHaveBeenCalledWith('Enter a valid number');
    });
});