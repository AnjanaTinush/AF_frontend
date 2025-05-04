import { fetchAllCountries } from '../../Redux/actions/countryActions';
import { fetchCountriesStart, fetchCountriesSuccess, fetchCountriesFailure } from '../../Redux/slices/countrySlice';

global.fetch = jest.fn();

describe('fetchAllCountries - Unit Test', () => {
  const dispatch = jest.fn();

  it('should dispatch success when fetch succeeds', async () => {
    const mockData = [{ name: { common: 'India' } }];
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockData });

    const result = await fetchAllCountries()(dispatch);

    expect(fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/all');
    expect(dispatch).toHaveBeenCalledWith(fetchCountriesStart());
    expect(dispatch).toHaveBeenCalledWith(fetchCountriesSuccess(mockData));
    expect(result).toEqual(mockData);
  });
});
