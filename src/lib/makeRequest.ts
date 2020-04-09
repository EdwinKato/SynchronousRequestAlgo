import { Queue } from './Queue';

interface result { 
  id: string,
  seconds: string
}

function cachedRequest(): (seconds: string) => Promise<result> {
  const secondsCache = {};
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  return function (seconds: string): Promise<result> {
    return new Promise((resolve, reject) => {
      const cachedValue = secondsCache[seconds];
      if (cachedValue) {
        console.log(
          `Warning: A request at ${seconds} seconds has already been made.`,
        );
        resolve(cachedValue);
      } else {
        const requestOptions: RequestInit = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify({ seconds }),
          redirect: 'follow',
        };
        fetch('https://jsonplaceholder.typicode.com/posts', requestOptions)
          .then((response) => response.json())
          .then((jsonResponse) => {
            secondsCache[seconds] = jsonResponse;
            return resolve(jsonResponse);
          })
          .catch((error) => {
            return reject(error);
          });
      }
    });
  };
}

const request = cachedRequest();
const queue = new Queue();

export const makeRequest = async () => {
  const currentSeconds = new Date().getSeconds().toString();
  console.log('clicked at: ', currentSeconds);
  const asynchronousCallback = () => request(currentSeconds)
  const result = await queue.enqueue(asynchronousCallback);

  const { id, seconds } = result;
  console.log('id', id);
  console.log('seconds', seconds);
};

