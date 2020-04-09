import { Queue } from './Queue';

function cachedRequest() {
    const secondsCache = {};
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    return function (seconds) {
        return new Promise((resolve, reject) => {
            const cachedValue = secondsCache[seconds]
            if (cachedValue) {
                console.log(`Warning: A request at ${seconds} seconds has already been made.`)
                return resolve(cachedValue)
            };

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({"seconds":seconds}),
                redirect: 'follow'
            };
            fetch("https://jsonplaceholder.typicode.com/posts", requestOptions)
                .then(response => response.json())
                .then(jsonResponse => {
                    secondsCache[seconds] = jsonResponse
                    return resolve(jsonResponse)
                }).catch(error => {
                    return reject(error)
            })
        })
    }
}

const request = cachedRequest()
const queue = new Queue()

export const makeRequest = async () => {
    const seconds = new Date().getSeconds().toString();
    console.log('clicked at: ', seconds);
    const result = await queue.enqueue(() => request(seconds))

    const { id, seconds: secondsResponse } = result;
    console.log('id', id);
    console.log('secondsResponse', secondsResponse);
}
