export const dateStr = () => {
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
