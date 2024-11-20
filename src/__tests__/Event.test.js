// src/__tests__/Event.test.js

import { render, screen, fireEvent } from '@testing-library/react';
import Event from '../components/Event';

describe('<Event />', () => {
  // Mock Event Data
  const mockEvent = {
    summary: 'Sample Event',
    created: '2024-11-18T12:00:00Z',
    location: 'Berlin, Germany',
  };

  test('renders event title, start time, and location correctly', () => {
    render(<Event event={mockEvent} />);

    // Check if the event title is rendered
    expect(screen.getByText(mockEvent.summary)).toBeInTheDocument();

    // Check if the event start time is rendered in the formatted date
    expect(screen.getByText(/Nov 18, 2024/)).toBeInTheDocument();  // Adjust format to match the formatting in Event.js

    // Check if the event location is rendered
    expect(screen.getByText(mockEvent.location)).toBeInTheDocument();

    // Check if the "Show Details" button is present
    expect(screen.getByText(/Show Details/)).toBeInTheDocument();
  });

  test('shows event details when "Show Details" button is clicked', () => {
    render(<Event event={mockEvent} />);

    // Initially, the details should not be visible
    expect(screen.queryByText('Event Details')).not.toBeInTheDocument();

    // Click the "Show Details" button
    fireEvent.click(screen.getByText(/Show Details/));

    // Now the event details should be visible
    expect(screen.getByText('Event Details')).toBeInTheDocument();
    expect(screen.getByText(/Hide Details/)).toBeInTheDocument(); // "Hide Details" should now be visible
  });

  test('handles missing event summary', () => {
    const eventWithNoSummary = { ...mockEvent, summary: null };
    render(<Event event={eventWithNoSummary} />);
    expect(screen.getByText('No title')).toBeInTheDocument(); // Expect 'No title' instead of 'Event Name'
  });

  test('handles missing event location', () => {
    const eventWithNoLocation = { ...mockEvent, location: null };
    render(<Event event={eventWithNoLocation} />);
    expect(screen.getByText('Location not available')).toBeInTheDocument(); // Expect 'Location not available' instead of the location
  });
});
