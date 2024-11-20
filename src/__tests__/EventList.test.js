import { render, screen, within, waitFor } from '@testing-library/react';  // Add 'within' here
import { getEvents } from '../api';
import EventList from '../components/EventList';
import App from "../App";

describe('<EventList /> component', () => {
  let EventListComponent;

  beforeEach(() => {
    EventListComponent = render(<EventList events={[]} />); // Rendering the component with an empty events array initially
  });

  test('renders correct number of events when events array is populated', async () => {
    const allEvents = await getEvents();  // Get mock events asynchronously
    EventListComponent.rerender(<EventList events={allEvents} />);  // Re-render with the mock events

    // Check if the number of list items matches the number of events
    expect(EventListComponent.getAllByRole("listitem")).toHaveLength(allEvents.length);
  });

  test('renders no events when events array is empty', () => {
    render(<EventList events={[]} />);

    // Check that no list items are rendered when there are no events
    expect(screen.queryByRole('listitem')).toBeNull();  // No list items should be rendered
  });

  test('renders an error message for invalid event data', () => {
    const invalidEventList = [{ id: 1, summary: null, created: 'invalid-date', location: null }];
    render(<EventList events={invalidEventList} />);

    // Check if the invalid event data is handled, could be a message or fallback UI
    expect(screen.getByText(/No title/)).toBeInTheDocument(); // Check for fallback when data is invalid
    expect(screen.getByText(/Location not available/)).toBeInTheDocument(); // Fallback location
  });
});

describe('<EventList /> integration', () => {
  test('renders a list of 32 events when the app is mounted and rendered', async () => {
    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;
    const EventListDOM = AppDOM.querySelector('#event-list');
    await waitFor(() => {
      const EventListItems = within(EventListDOM).queryAllByRole('listitem');
      expect(EventListItems.length).toBe(32);
    });
  });
});
