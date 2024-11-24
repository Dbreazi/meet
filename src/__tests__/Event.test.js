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

    expect(screen.getByText(mockEvent.summary)).toBeInTheDocument();
    expect(screen.getByText(/Nov 18, 2024/)).toBeInTheDocument();  // Adjust format to match the formatting in Event.js
    expect(screen.getByText(mockEvent.location)).toBeInTheDocument();
    expect(screen.getByText(/Show Details/)).toBeInTheDocument();
  });

  test('shows event details when "Show Details" button is clicked', () => {
    render(<Event event={mockEvent} />);
  
    expect(screen.queryByText('Event Details')).not.toBeInTheDocument();
  
    fireEvent.click(screen.getByText(/Show Details/));
  
    expect(screen.getByText('No details available')).toBeInTheDocument(); 
    expect(screen.getByText(/Hide Details/)).toBeInTheDocument();
  });

  test('handles missing event summary', () => {
    const eventWithNoSummary = { ...mockEvent, summary: null };
    render(<Event event={eventWithNoSummary} />);
    expect(screen.getByText('No title')).toBeInTheDocument(); 
  });

  test('handles missing event location', () => {
    const eventWithNoLocation = { ...mockEvent, location: null };
    render(<Event event={eventWithNoLocation} />);
    expect(screen.getByText('Location not available')).toBeInTheDocument(); 
  });
});
