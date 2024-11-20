# Meet App

This is a progressive web app (PWA) that allows users to view upcoming events for a selected city. It provides features such as filtering events by city, viewing event details, offline usage, and data visualization through charts. The app is built using **React**, **Create-React-App**, and is deployed to **GitHub Pages**.

## Features

### Feature 1: Filter Events by City
- **User Story**:
  - As a user, I should be able to filter events by city so that I can see a list of events taking place in that city.
- **Scenarios**:
  1. **Scenario 1**: When the user hasn’t searched for a specific city, show upcoming events from all cities.
  2. **Scenario 2**: User should see a list of suggestions when they search for a city.
  3. **Scenario 3**: User can select a city from the suggested list.

### Feature 2: Show/Hide Event Details
- **User Story**:
  - As a user, I should be able to view detailed information about an event, so that I can learn more about the event I am interested in.
- **Scenarios**:
  1. **Scenario 1**: When the user clicks on the "Show Details" button for an event, the event details should be displayed.
  2. **Scenario 2**: When the user clicks on the "Hide Details" button, the event details should be hidden again.

### Feature 3: Specify Number of Events
- **User Story**:
  - As a user, I should be able to specify the number of events I want to see, so that I can limit the list of events according to my preferences.
- **Scenarios**:
  1. **Scenario 1**: When the user selects the number of events to display, the app should display the specified number of events.
  2. **Scenario 2**: When the user has not selected a number of events, the app should show the default number of events.

### Feature 4: Use the App When Offline
- **User Story**:
  - As a user, I should be able to use the app and view events when offline, so that I can still use the app without an active internet connection.
- **Scenarios**:
  1. **Scenario 1**: Given the user is offline, when they open the app, they should be able to view the events previously loaded.
  2. **Scenario 2**: Given the user is offline, when the app cannot fetch new data, the user should see a message saying, "You are offline, showing cached events."

### Feature 5: Add an App Shortcut to the Home Screen
- **User Story**:
  - As a user, I should be able to add the app to my home screen, so that I can easily access it without opening a browser.
- **Scenarios**:
  1. **Scenario 1**: Given the user is using a mobile device, when the user clicks the "Add to Home Screen" prompt, the app should be added to the home screen as a shortcut.
  2. **Scenario 2**: Given the app is added to the home screen, when the user taps the app icon from the home screen, the app should open directly in a browser view.

### Feature 6: Display Charts Visualizing Event Details
- **User Story**:
  - As a user, I should be able to see visual charts displaying event details, so that I can easily interpret the data and make decisions.
- **Scenarios**:
  1. **Scenario 1**: Given the list of events has been loaded, when the user views the event details, a pie chart should display the percentage of events by genre.
  2. **Scenario 2**: Given the list of events has been loaded, when the user views the event details, a scatterplot should display the number of events in each location.

## Setup

### Prerequisites
- Node.js (LTS version recommended)
- npm (Node Package Manager)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Dbreazi/meet.git
   ```
2. Navigate to project folder:
   ```bash
   cd meet
   ```
3. Install dependencies: 
   ```bash
   npm install
   ```

## Technologies Used
- **React**: JavaScript library for building user interfaces.
- **GitHub Pages**: Hosting platform for static websites.
- **Create React App**: Tool to set up a new React app with all configurations.
- **PWA (Progressive Web App)**: Makes the app work offline and installable on mobile devices.

## License
This project is licensed under the MIT License.

## Acknowledgements
- Thanks to my tutor and mentor for their support so far
