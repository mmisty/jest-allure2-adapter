'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.greeter = exports.Delays = void 0;
const tslib_1 = require('tslib');
/**
 * Some predefined delays (in milliseconds).
 */
var Delays;
(function (Delays) {
  Delays[(Delays['Short'] = 500)] = 'Short';
  Delays[(Delays['Medium'] = 2000)] = 'Medium';
  Delays[(Delays['Long'] = 5000)] = 'Long';
})((Delays = exports.Delays || (exports.Delays = {})));
/**
 * Returns a Promise<string> that resolves after given time.
 *
 * @param {string} name - A name.
 * @param {number=} [delay=Delays.Medium] - Number of milliseconds to delay resolution of the Promise.
 * @returns {Promise<string>}
 */
function delayedHello(name, delay = Delays.Medium) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(`Hello, ${name}`), delay),
  );
}
// Below are examples of using ESLint errors suppression
// Here it is suppressing missing return type definitions for greeter function
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function greeter(name) {
  return tslib_1.__awaiter(this, void 0, void 0, function* () {
    return yield delayedHello(name, Delays.Long);
  });
}
exports.greeter = greeter;
//# sourceMappingURL=main.js.map
