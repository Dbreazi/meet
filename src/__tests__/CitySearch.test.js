import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';
import { getEvents, extractLocations } from '../api';

describe('<CitySearch /> component', () => {
  let CitySearchComponent;

  beforeEach(() => {
    CitySearchComponent = render(<CitySearch allLocations={[]} setCurrentCity={() => {}} />);
  });

  test('renders text input', () => {
    const cityTextBox = CitySearchComponent.queryAllByRole('textbox');
    expect(cityTextBox.length).toBe(1); // Ensure only one textbox
    expect(cityTextBox[0]).toBeInTheDocument();
    expect(cityTextBox[0]).toHaveClass('city');
  });

  test('suggestions list is hidden by default', () => {
    const suggestionList = CitySearchComponent.queryByRole('list');
    expect(suggestionList).not.toBeInTheDocument();
  });

  test('renders a list of suggestions when city text box gains focus', async () => {
    const user = userEvent.setup();
    const cityTextBox = CitySearchComponent.queryAllByRole('textbox')[0];
    await user.click(cityTextBox);

    const suggestionList = CitySearchComponent.queryByRole('list');
    expect(suggestionList).toBeInTheDocument();
    expect(suggestionList).toHaveClass('suggestions');
  });

  test('updates list of suggestions correctly when user types in city textbox', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    CitySearchComponent.rerender(<CitySearch allLocations={allLocations} setCurrentCity={() => {}} />);

    const cityTextBox = CitySearchComponent.queryAllByRole('textbox')[0];
    await user.type(cityTextBox, "Berlin");

    const suggestions = allLocations.filter((location) => location.toUpperCase().includes(cityTextBox.value.toUpperCase()));

    const suggestionListItems = CitySearchComponent.queryAllByRole('listitem');
    expect(suggestionListItems).toHaveLength(suggestions.length + 1);
    suggestions.forEach((suggestion, i) => {
      expect(suggestionListItems[i].textContent).toBe(suggestion);
    });
  });

  test('renders the suggestion text in the textbox upon clicking on the suggestion', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    CitySearchComponent.rerender(<CitySearch
      allLocations={allLocations}
      setCurrentCity={() => { }}
    />);

    const cityTextBox = CitySearchComponent.queryAllByRole('textbox')[0];
    await user.type(cityTextBox, "Berlin");

    const BerlinGermanySuggestion = CitySearchComponent.queryAllByRole('listitem')[0];
    await user.click(BerlinGermanySuggestion);

    expect(cityTextBox).toHaveValue(BerlinGermanySuggestion.textContent);
  });
});

describe('<CitySearch /> edge cases', () => {
  test('shows all events when no city is selected', async () => {
    const { queryByRole, queryAllByRole } = render(<CitySearch allLocations={[]} setCurrentCity={() => {}} />);
    const cityTextBox = queryByRole('textbox'); 
    await userEvent.clear(cityTextBox); // Clear the textbox instead of typing an empty string

    const suggestionListItems = queryAllByRole('listitem');
    expect(suggestionListItems.length).toBe(1); // Only "See all cities" should be in the list
  });

  test('shows no events when a non-existent city is searched', async () => {
    const { queryByRole, queryAllByRole } = render(<CitySearch allLocations={[]} setCurrentCity={() => {}} />);
    const cityTextBox = queryByRole('textbox'); 
    await userEvent.type(cityTextBox, "NonExistentCity");

    const suggestionListItems = queryAllByRole('listitem');
    expect(suggestionListItems.length).toBe(1); // Only "See all cities" should appear
  });
});