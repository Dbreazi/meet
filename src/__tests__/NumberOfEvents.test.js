import { render, screen, fireEvent } from '@testing-library/react';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
  test('renders NumberOfEvents component', () => {
    render(<NumberOfEvents currentNOE={32} setCurrentNOE={() => {}} />);
    expect(screen.getByTestId('number-of-events')).toBeInTheDocument();
  });

  test('has default value of 32', () => {
    render(<NumberOfEvents currentNOE={32} setCurrentNOE={() => {}} />);
    const input = screen.getByRole('spinbutton');
    expect(input.value).toBe('32');
  });

  test('updates value when user types', () => {
    const setCurrentNOE = jest.fn();
    render(<NumberOfEvents currentNOE={32} setCurrentNOE={setCurrentNOE} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '50' } });
    expect(setCurrentNOE).toHaveBeenCalledWith(50);
  });

  test('prevents negative input', () => {
    const setCurrentNOE = jest.fn();
    render(<NumberOfEvents currentNOE={32} setCurrentNOE={setCurrentNOE} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '-10' } });
    expect(setCurrentNOE).toHaveBeenCalledWith(1); // It should set it to 1, not negative
  });

  test('handles non-numeric input gracefully', () => {
    const setCurrentNOE = jest.fn();
    render(<NumberOfEvents currentNOE={32} setCurrentNOE={setCurrentNOE} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(setCurrentNOE).toHaveBeenCalledWith(1); // It should set it to 1, not NaN
  });
});