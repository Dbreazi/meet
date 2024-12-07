import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import mockData from '../mock-data';

const feature = loadFeature('./src/features/specifyNumberOfEvents.feature');

defineFeature(feature, (test) => {

  test('32 events are shown by default', ({ given, when, then }) => {
    given('the user has not set a specific number of events to display', () => {
      render(<App events={mockData} />);
    });

    when('the event list is loaded', async () => {
      // Ensure that events are loaded and rendered
      await waitFor(() => {
        const eventListItems = screen.getAllByRole('listitem');
        expect(eventListItems.length).toBe(32); // Expect the default number of events
      });
    });

    then('32 events should be displayed by default', () => {
      const eventListItems = screen.getAllByRole('listitem');
      expect(eventListItems.length).toBe(32); // Ensure 32 events are displayed by default
    });
  });

  test('User can change the number of events displayed', ({ given, when, then }) => {
    given('the user is viewing the list of events', () => {
      render(<App events={mockData} />);
    });

    when('the user selects a display button other than 32', async () => {
      const numberOfEventsInput = screen.getByTestId('numberOfEventsInput'); // Select the input field
      await userEvent.clear(numberOfEventsInput); // Clear the current value
      await userEvent.type(numberOfEventsInput, '10'); // Type '10' into the input field
    });

    then('the selected number of events will be displayed', async () => {
      await waitFor(() => {
        const eventListItems = screen.getAllByRole('listitem');
        expect(eventListItems.length).toBe(10); // Ensure 10 events are now displayed
      });
    });
  });
});
