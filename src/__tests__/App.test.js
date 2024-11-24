// src/__tests__/App.test.js

import { render, within, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';
import App from '../App';

describe('<App /> component', () => {

  test('renders list of events', () => {
    const { container } = render(<App />);
    expect(container.querySelector('#event-list')).toBeInTheDocument();
  });

  test('renders CitySearch', () => {
    const { container } = render(<App />);
    expect(container.querySelector('#city-search')).toBeInTheDocument();
  });

  test('renders NumberOfEvents component', () => {
    render(<App />);
    expect(screen.getByTestId('numberOfEventsInput')).toBeInTheDocument();
  });
});

describe('<App /> integration', () => {
  test('renders a list of events matching the city selected by the user', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const CitySearchDOM = container.querySelector('#city-search');
    const CitySearchInput = within(CitySearchDOM).queryByRole('textbox');

    await user.type(CitySearchInput, "Berlin");
    const berlinSuggestionItem = within(CitySearchDOM).queryByText('Berlin, Germany');
    await user.click(berlinSuggestionItem);

    const EventListDOM = container.querySelector('#event-list');
    const allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');   

    const allEvents = await getEvents();
    const berlinEvents = allEvents.filter(event => event.location === 'Berlin, Germany');

    expect(allRenderedEventItems.length).toBe(berlinEvents.length);
    allRenderedEventItems.forEach(event => {
      expect(event.textContent).toContain("Berlin, Germany");
    });
  });
});
