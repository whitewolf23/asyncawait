﻿import references = require('references');
import assert = require('assert');
import oldBuilder = require('../../src/asyncBuilder');
import transfer = require('../../src/transfer');
export = builder;


var builder = oldBuilder.mod<AsyncAwait.Async.IterableCPSBuilder>({
    methods: () => ({
        invoke: (co) => {
            co.nextCallback = <(err, item?: { done: boolean; value?: any; }) => void> null;
            co.done = false;
            var next = (callback?: (err, item?: { done: boolean; value?: any; }) => void) => {
                co.nextCallback = callback || nullFunc;
                co.done ? co.nextCallback(new Error('iterated past end')) : transfer(co);
            }
            return new AsyncIterator(next);
        },
        return: (co, result) => {
            co.done = true;
            co.nextCallback(null, { done: true, value: result });
        },
        throw: (co, error) => {
            co.nextCallback(error);
        },
        yield: (co, value) => {
            var result = { done: false, value: value };
            co.nextCallback(null, result);
            transfer();
        },
        finally: (co) => {
            co.nextCallback = null;
        }
    })
});


class AsyncIterator {

    constructor(public next: (callback?: (err, item?: { done: boolean; value?: any; }) => void) => void) { }

    forEach(callback: (value) => void, done_?: (err, value?) => void) {

        // Ensure at least one argument has been supplied, which is a function.
        assert(arguments.length >= 1, 'forEach(): expected at least one argument');
        assert(typeof(callback) === 'function', 'forEach(): expected argument to be a function');

        // Asynchronously call next() until done.
        var done = done_ || nullFunc;
        var stepNext = () => this.next((err, item) => err ? done(err) : stepResolved(item));
        var stepResolved = item => {
            if (item.done) return done(null, item.value);
            callback(item.value);
            setImmediate(stepNext);
        }
        stepNext();
    }
}


function nullFunc() { }