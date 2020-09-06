import { allure } from '../src/test-helper';

describe('simple-suite', () => {
  it('simple-test', () => {
    expect(10).toBe(10);
  });

  it('simple-test-2-fail#tag', async () => {
    allure.step('some', () => {
      allure.step('some', () => {
        allure.step('some', () => expect(10).toBe(9));
      });
    });
  });
});
