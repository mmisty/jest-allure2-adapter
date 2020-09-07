'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.dateStr = void 0;
exports.dateStr = () => {
  const date = new Date(Date.now());
  return (
    date.getUTCHours() +
    ':' +
    date.getMinutes() +
    ':' +
    date.getSeconds() +
    '.' +
    date.getMilliseconds()
  );
};
//# sourceMappingURL=date-utils.js.map
