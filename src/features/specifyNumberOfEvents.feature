Feature: Specify Number of Events

  Scenario: 32 events are shown by default
    Given the user has not set a specific number of events to display
    When the event list is loaded
    Then 32 events should be displayed by default

  Scenario: User can change the number of events displayed
    Given the user is viewing the list of events
    When the user selects a display button other than 32
    Then the selected number of events will be displayed
