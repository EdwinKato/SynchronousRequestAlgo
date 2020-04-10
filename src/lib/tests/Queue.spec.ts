import { Queue } from '../Queue';

const promise = new Promise((resolve) => resolve(true));

describe('Queue', () => {
    it('creating a queue triggers the focus and blur event listeners', () => {
        window.addEventListener = jest.fn()
        new Queue();

        expect(window.addEventListener).toHaveBeenCalledTimes(2)
        expect(window.addEventListener).toHaveBeenNthCalledWith(1, "focus", expect.any(Function))
        expect(window.addEventListener).toHaveBeenNthCalledWith(2, "blur", expect.any(Function))
    });

    it('enqueue adds queue items to the queue and calls dequeue there after', () => {
        const queue = new Queue();
        queue.workingOnPromise = true;
        queue.dequeue = jest.fn();

        expect(queue.queue.length).toBe(0);

        queue.enqueue(() => promise);

        expect(queue.queue.length).toBe(1);
        expect(queue.dequeue).toHaveBeenCalled();
    });

    it('dequeue removes queue items from the queue after execution', async () => {
        const queue = new Queue();
        queue.queue = [{
            promise: () => promise,
            resolve: () => {},
            reject: () => {},
        }];

        await queue.dequeue();

        expect(queue.queue.length).toBe(0);
    });

    it('dequeue calls dequeue after if there are more items in the queue', async () => {
        const queue = new Queue();
        const spy = jest.spyOn(queue, 'dequeue');
        queue.queue = [
            {
                promise: () => promise,
                resolve: () => {},
                reject: () => {},
            },
            {
                promise: () => promise,
                resolve: () => {},
                reject: () => {},
            }
        ]

        await queue.dequeue();

        // Thrice, accounting for the call above
        expect(spy).toHaveBeenCalledTimes(3);
    });

    it('dequeue does not run items in queue when workingOnPromise is set to true', async () => {
        const queue = new Queue();
        queue.workingOnPromise = true;
        const spy = jest.spyOn(queue, 'dequeue');
        queue.queue = [
            {
                promise: () => promise,
                resolve: () => {},
                reject: () => {},
            },
            {
                promise: () => promise,
                resolve: () => {},
                reject: () => {},
            }
        ]

        await queue.dequeue();

        // Once, accounting for the call above
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('dequeue does not run items in queue when pause is set to true', async () => {
        const queue = new Queue();
        queue.pause = true;
        const spy = jest.spyOn(queue, 'dequeue');
        queue.queue = [
            {
                promise: () => promise,
                resolve: () => {},
                reject: () => {},
            },
            {
                promise: () => promise,
                resolve: () => {},
                reject: () => {},
            }
        ]

        await queue.dequeue();

        // Once, accounting for the call above
        expect(spy).toHaveBeenCalledTimes(1);
    });

});

