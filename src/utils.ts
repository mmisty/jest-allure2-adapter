import { ContentType } from 'allure-js-commons';
import { AttachmentOptions } from 'allure-js-commons/dist/src/model';

const dateNow = Date.now;
const stripAnsi = require('strip-ansi');

function addZero(num: number, digits: number = 2) {
  return `${('0' + num).slice(-digits)}`;
}

export const dateStr = (isFileName: boolean = false) => {
  const date = new Date(dateNow());
  return (
    date.getFullYear() +
    '-' +
    addZero(date.getMonth() + 1) +
    '-' +
    addZero(date.getDate()) +
    (isFileName ? 'T' : ' ') +
    addZero(date.getUTCHours()) +
    (isFileName ? '-' : ':') +
    addZero(date.getMinutes()) +
    (isFileName ? '-' : ':') +
    addZero(date.getSeconds()) +
    '.' +
    addZero(date.getMilliseconds(), 3)
  );
};

export function getContent(
  content: Buffer | string,
  type: ContentType | string | AttachmentOptions,
) {
  if (typeof content === 'string') {
    return stripAnsi(content);
  }

  if (type === ContentType.JSON) {
    return JSON.stringify(content);
  }

  return content;
}
