import { Queue } from './Queue';

interface result { 
  id: string,
  seconds: string,
  cached?: boolean
}

export function cachedRequest(log = console.log): (seconds: string) => Promise<result> {
  const secondsCache: { [key: string]: result } = {};
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  return function (seconds: string): Promise<result> {
    return new Promise(async (resolve, reject) => {
      const cachedValue = secondsCache[seconds];

      if (cachedValue) {
        log(
          `Warning: A request at ${seconds} seconds has already been made.`
        );
        resolve(cachedValue);
      } else {
        const requestOptions: RequestInit = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify({ seconds }),
          redirect: 'follow',
        };

        try {
          log(`Making fresh api call`);
          const response = await fetch('https://jsonplaceholder.typicode.com/posts', requestOptions)
          const jsonResponse = await response.json()
          secondsCache[seconds] = { ...jsonResponse, cached: true };
          return resolve(jsonResponse);
        } catch (error) {
          return reject(error);
        }

      }
    });
  };
}

const request = cachedRequest();
const queue = new Queue();

export const makeRequest = async () => {
  const currentSeconds = new Date().getSeconds().toString();
  console.log('Clicked button at: ', currentSeconds);
  const asynchronousCallback = () => request(currentSeconds)
  const result = await queue.enqueue(asynchronousCallback);

  const { id, seconds, cached } = result;
  if (!cached) {
    console.log('id', id);
    console.log('seconds', seconds);
  }
};
