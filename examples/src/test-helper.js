'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.log = exports.wait = exports.delay = exports.allureT = exports.allure = void 0;
const tslib_1 = require('tslib');
const date_utils_1 = require('./date-utils');
exports.allure = reporter;
exports.allureT = {
  step(name) {
    exports.allure.startStep(date_utils_1.dateStr() + '>' + name);
    exports.allure.endStep();
  },
};
function delay(ms, ...messages) {
  return tslib_1.__awaiter(this, void 0, void 0, function* () {
    exports.allure.startStep(date_utils_1.dateStr() + ' > ' + 'delay ' + ms);
    console.log(
      ...messages,
      messages.length > 0 ? ':' : '',
      `DELAY ${ms.toString()} ms`,
    );
    yield new Promise((resolve) => setTimeout(resolve, ms));
    exports.allure.endStep();
  });
}
exports.delay = delay;
function wait(condition) {
  return tslib_1.__awaiter(this, void 0, void 0, function* () {
    exports.allure.startStep(
      date_utils_1.dateStr() + ' > ' + 'wait condition ',
    );
    const start = Date.now();
    let elapsed = Date.now();
    const timeout = 7000;
    while (elapsed - start < timeout) {
      elapsed = Date.now();
      if (condition()) {
        break;
      }
      yield delay(0);
    }
    if (elapsed - start >= timeout) {
      exports.allure.startStep(
        date_utils_1.dateStr() + ' > ' + (elapsed - start) + '>=' + timeout,
      );
      exports.allure.endStep();
      exports.allure.endStep();
      throw new Error('Timeout wait');
    }
    exports.allure.endStep();
  });
}
exports.wait = wait;
function log(...messages) {
  exports.allure.startStep(date_utils_1.dateStr() + ' > ' + messages.join(' '));
  exports.allure.endStep();
}
exports.log = log;
//# sourceMappingURL=test-helper.js.map
