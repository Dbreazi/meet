import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CitySearch from '../components/CitySearch';
import { getEvents, extractLocations } from '../api';

describe('<CitySearch /> component', () => {
  let CitySearchComponent;

  beforeEach(() => {
    CitySearchComponent = render(<CitySearch allLocations={[]} setCurrentCity={() => {}} />);
  });

  test('renders text input', () => {
    const cityTextBox = screen.queryAllByRole('textbox');
    expect(cityTextBox).toHaveLength(1);
    expect(cityTextBox[0]).toBeInTheDocument();
    expect(cityTextBox[0]).toHaveClass('city');
  });

  test('suggestions list is hidden by default', () => {
    const suggestionList = screen.queryByRole('list');
    expect(suggestionList).not.toBeInTheDocument();
  });

  test('renders a list of suggestions when city text box gains focus', async () => {
    const user = userEvent.setup();
    const cityTextBox = screen.queryByRole('textbox');
    await user.click(cityTextBox);

    const suggestionList = screen.queryByRole('list');
    expect(suggestionList).toBeInTheDocument();
    expect(suggestionList).toHaveClass('suggestions');
  });

  test('updates list of suggestions correctly when user types in city textbox', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    CitySearchComponent.rerender(<CitySearch allLocations={allLocations} setCurrentCity={() => {}} />);

    const cityTextBox = screen.queryByRole('textbox');
    await user.type(cityTextBox, "Berlin");

    const suggestions = allLocations.filter((location) => location.toUpperCase().includes(cityTextBox.value.toUpperCase()));
    const suggestionListItems = screen.queryAllByRole('listitem');

    expect(suggestionListItems).toHaveLength(suggestions.length + 1); // Includes "See all cities"
    suggestions.forEach((suggestion, i) => {
      expect(suggestionListItems[i].textContent).toBe(suggestion);
    });
  });

  test('renders the suggestion text in the textbox upon clicking on the suggestion', async () => {
    const user = userEvent.setup();
    const allEvents = await getEvents();
    const allLocations = extractLocations(allEvents);
    CitySearchComponent.rerender(<CitySearch allLocations={allLocations} setCurrentCity={() => {}} />);

    const cityTextBox = screen.queryByRole('textbox');
    await user.type(cityTextBox, "Berlin");

    const BerlinGermanySuggestion = screen.queryAllByRole('listitem')[0];
    await user.click(BerlinGermanySuggestion);

    expect(cityTextBox).toHaveValue(BerlinGermanySuggestion.textContent);
  });
});

describe('<CitySearch /> edge cases', () => {
  test('shows all events when no city is selected', async () => {
    const { queryByRole, queryAllByRole } = render(<CitySearch allLocations={[]} setCurrentCity={() => {}} />);
    const cityTextBox = queryByRole('textbox');
    await userEvent.clear(cityTextBox); // Clear the textbox

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
