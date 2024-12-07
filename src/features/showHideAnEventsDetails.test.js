import { defineFeature, loadFeature } from 'jest-cucumber';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App'; // Render the entire App component
import mockData from '../mock-data'; // Import mock data
import userEvent from '@testing-library/user-event';

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, (test) => {
  test('Event details are collapsed by default', ({ given, then }) => {
    given('I am on the Meet app', async () => {
      render(<App events={mockData} />); // Use mock data to render the app
    });

    then('the event details should be collapsed', async () => {
      const eventDetails = screen.queryByText(/Have you wondered how you can ask Google/); // Match the actual text of the event
      expect(eventDetails).not.toBeInTheDocument(); // Ensure event details are hidden by default
    });
  });

  test('User can expand an event to see its details', ({ given, when, then }) => {
    given('I am on the Meet app', async () => {
      render(<App events={mockData} />); // Use mock data to render the app
    });

    when('I click on "Show Details" button', async () => {
      const showDetailsButton = await screen.findAllByRole('button', {
        name: /show details/i,
      });
      await userEvent.click(showDetailsButton[0]); // Click the "Show Details" button
    });

    then('the event details should be visible', async () => {
      const eventDetails = await screen.findByText(/Have you wondered how you can ask Google/); // Adjust this text to match the mock data description
      expect(eventDetails).toBeInTheDocument(); // Ensure the event details are now visible
    });
  });

  test('User can collapse an event to hide details', ({ given, when, then }) => {
    given('the event details are visible', async () => {
      render(<App events={mockData} />); // Use mock data to render the app
      const showDetailsButton = await screen.findAllByRole('button', {
        name: /show details/i,
      });
      await userEvent.click(showDetailsButton[0]); // Click the "Show Details" button
      await waitFor(() => {
        const eventDetails = screen.queryByText(/Have you wondered how you can ask Google/); // Adjust this text to match the mock data description
        expect(eventDetails).toBeInTheDocument(); // Ensure the event details are visible
      });
    });

    when('I click on "Hide Details" button', async () => {
      const hideDetailsButton = await screen.findAllByRole('button', {
        name: /hide details/i,
      });
      await userEvent.click(hideDetailsButton[0]); // Click the "Hide Details" button
    });

    then('the event details should be hidden', async () => {
      const eventDetails = screen.queryByText(/Have you wondered how you can ask Google/); // Match the mock data
      expect(eventDetails).not.toBeInTheDocument(); // Ensure event details are hidden
    });
  });
});
