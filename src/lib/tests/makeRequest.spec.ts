/**
 * @jest-environment jsdom
 */

import { makeRequest, cachedRequest } from '../makeRequest';

const sampleResponse = {
  id: 101,
  seconds: 52,
};

describe('makeRequest', () => {
  it('cachedRequest makes a fetch call with the correct parameters', () => {
    const request = cachedRequest();
    window.fetch = jest.fn()

    request('52');
    expect(window.fetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/posts",
      {
        "body": "{\"seconds\":\"52\"}",
        "headers": expect.any(Headers),
        "method": "POST",
        "redirect": "follow"
      }
    );
  });

  it('cachedRequest stores previous seconds and does not make api call twice', async () => {
    const logger = jest.fn()
    const request = cachedRequest(logger);
    window.fetch = jest.fn().mockReturnValue(
      new Promise((resolve) => resolve({ json: () => sampleResponse })),
    );

    await request('52');
    expect(logger).toHaveBeenNthCalledWith(1, "Making fresh api call")
    expect(window.fetch).toHaveBeenCalledTimes(1);

    await request('52');
    expect(logger).toHaveBeenNthCalledWith(2, "Warning: A request at 52 seconds has already been made.")
    expect(window.fetch).toHaveBeenCalledTimes(1);
  });

});
