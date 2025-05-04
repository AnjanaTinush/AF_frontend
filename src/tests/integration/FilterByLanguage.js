import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fetchAllCountries } from '../../Redux/actions//countryActions';
import { fetchCountriesStart, fetchCountriesSuccess } from '../../Redux/slices/countrySlice';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

global.fetch = jest.fn();

describe('fetchAllCountries - Integration Test', () => {
  it('dispatches correct actions and returns data', async () => {
    const mockData = [{ name: { common: 'India' } }];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const store = mockStore({
      countries: {
        countries: [],
        filteredCountries: [],
        loading: false,
        error: null,
      },
    });

    const result = await store.dispatch(fetchAllCountries());

    const actions = store.getActions();

    expect(fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/all');
    expect(actions).toContainEqual(fetchCountriesStart());
    expect(actions).toContainEqual(fetchCountriesSuccess(mockData));
    expect(result).toEqual(mockData); // ✅ Integration-level assertion
  });
});
