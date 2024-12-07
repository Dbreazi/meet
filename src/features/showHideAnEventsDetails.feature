Feature: Show/Hide Event Details

  Scenario: Event details are collapsed by default
    Given I am on the Meet app
    Then the event details should be collapsed

  Scenario: User can expand an event to see its details
    Given I am on the Meet app
    When I click on "Show Details" button
    Then the event details should be visible

  Scenario: User can collapse an event to hide details
    Given the event details are visible
    When I click on "Hide Details" button
    Then the event details should be hidden
