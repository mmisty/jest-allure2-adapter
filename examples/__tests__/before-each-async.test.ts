import { allure, allureT, delay } from '../test-helper';
import { fail } from 'assert';
import { ContentType } from 'allure-js-commons';

describe('before-each-test', () => {
  const beforeErr = [];

  beforeEach(async () => {
    await allure.step('before each', async () => {
      await delay(100);
      const err = new Error('Fail in before each');
      beforeErr.push(err);
      allure.attachment('err', err.message, ContentType.TEXT);
      throw err;
    });

    allure.test.attachment('Test', 'sdasda', ContentType.TEXT);
  });

  // todo: adapter allure 2
  // logging work:
  // - errors and throws rework
  // - add before each step and attachement

  /* beforeEach(async () => {
    log('before each 2');
    await wait(() => beforeErr.length >1);
    fail('xxxx');
  });*/

  it('async test after before', async () => {
    await delay(10000, 'Message 1');
    await delay(10000, 'Message 2');
    await delay(10000, 'Message 3');
  });

  describe('beforeEach', function () {
    beforeEach(function () {
      fail();
    });

    it("doesn't terminate tests if it raises an Exception", function () {
      allureT.step('first');
    });
  });
});
