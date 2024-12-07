import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, waitFor, within } from '@testing-library/react';
import App from '../App';  // Import the App component
import userEvent from '@testing-library/user-event';  // Import userEvent for simulating user interactions
import { getEvents } from '../mock-data';  // Import the getEvents function for mock data

const feature = loadFeature('./src/features/filterEventsByCity.feature');

defineFeature(feature, test => {
  // Scenario 1: When the user hasn’t searched for a specific city, show upcoming events from all cities
  test('When the user hasn’t searched for a specific city, show upcoming events from all cities', ({ given, when, then }) => {
    let AppComponent;

    // Given step: user hasn’t searched for any city
    given('user hasn’t searched for any city', () => {
      // Nothing needs to be done here, no action is required for this step
    });

    // When step: the user opens the app
    when('the user opens the app', () => {
      AppComponent = render(<App />);  // Render the App component
    });

    // Then step: the user should see a list of all upcoming events
    then('the user should see a list of all upcoming events', async () => {
      const AppDOM = AppComponent.container.firstChild;
      const EventListDOM = AppDOM.querySelector('#event-list');  // Locate the event list

      await waitFor(() => {  // Wait for asynchronous events to be rendered
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');  // Find the list items
        expect(EventListItems.length).toBe(32);  // Check if the number of events is 32 (adjust this based on your expected number of events)
      });
    });
  });

  // Scenario 2: User should see a list of suggestions when they search for a city
  test('User should see a list of suggestions when they search for a city', ({ given, when, then }) => {
    let AppComponent;
    let CitySearchDOM;

    // Given step: the main page is open
    given('the main page is open', () => {
      AppComponent = render(<App />);  // Render the App component
    });

    // When step: user starts typing in the city textbox
    when('user starts typing in the city textbox', async () => {
      const user = userEvent.setup();  // Set up the user event
      const AppDOM = AppComponent.container.firstChild;
      CitySearchDOM = AppDOM.querySelector('#city-search');
      const citySearchInput = within(CitySearchDOM).queryByRole('textbox');
      await user.type(citySearchInput, 'Berlin');  // Simulate typing "Berlin"
    });

    // Then step: the user should receive a list of cities (suggestions) that match what they’ve typed
    then('the user should receive a list of cities (suggestions) that match what they’ve typed', async () => {
      const suggestionListItems = within(CitySearchDOM).queryAllByRole('listitem');
      expect(suggestionListItems).toHaveLength(2);  // Adjust based on your mock data (2 in this case)
    });
  });

  // Scenario 3: User can select a city from the suggested list
  test('User can select a city from the suggested list', ({ given, and, when, then }) => {
    let AppComponent;
    let AppDOM; 
    let CitySearchDOM;
    let citySearchInput;
    let suggestionListItems;

    // Given step: user was typing “Berlin” in the city textbox
    given('user was typing “Berlin” in the city textbox', async () => {
      AppComponent = render(<App />);
      const user = userEvent.setup();
      AppDOM = AppComponent.container.firstChild;
      CitySearchDOM = AppDOM.querySelector('#city-search');
      citySearchInput = within(CitySearchDOM).queryByRole('textbox');  
      await user.type(citySearchInput, "Berlin");
    });

    // And step: the list of suggested cities is showing
    and('the list of suggested cities is showing', () => {
      suggestionListItems = within(CitySearchDOM).queryAllByRole('listitem'); 
      expect(suggestionListItems).toHaveLength(2);  // Verify 2 suggestions show up
    });

    // When step: the user selects a city (e.g., “Berlin, Germany”) from the list
    when('the user selects a city (e.g., “Berlin, Germany”) from the list', async () => {
      const user = userEvent.setup();
      await user.click(suggestionListItems[0]);  // Click the first suggestion
    });

    // Then step: their city should be changed to that city (i.e., “Berlin, Germany”)
    then('their city should be changed to that city (i.e., “Berlin, Germany”)', () => {
      expect(citySearchInput.value).toBe('Berlin, Germany');
    });

    // And step: the user should receive a list of upcoming events in that city
    and('the user should receive a list of upcoming events in that city', async () => {
      const EventListDOM = AppDOM.querySelector('#event-list');
      const EventListItems = within(EventListDOM).queryAllByRole('listitem');
      const allEvents = await getEvents();

      // filtering the list of all events down to events located in Germany
      const berlinEvents = allEvents.filter(event => event.location === citySearchInput.value);
      expect(EventListItems).toHaveLength(berlinEvents.length);
    });
  });
});
