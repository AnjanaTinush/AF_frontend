global.fetch = jest.fn();

describe('Language API call', () => {
  it('fetches countries for selected language', async () => {
    const mockLangData = [{ name: { common: 'Spain' }, languages: { spa: 'Spanish' } }];
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockLangData });

    const lang = 'spa';
    const response = await fetch(`https://restcountries.com/v3.1/lang/${lang}`);
    const data = await response.json();

    expect(fetch).toHaveBeenCalledWith(`https://restcountries.com/v3.1/lang/${lang}`);
    expect(data).toEqual(mockLangData);
  });
});
