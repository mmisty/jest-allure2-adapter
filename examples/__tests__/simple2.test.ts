import { allure } from '../test-helper';

describe('simple-suite', () => {
  it('simple-test in another file', () => {
    expect(10).toBe(10);
  });

  it('simple-test-2-fail#tag2', async () => {
    allure.step('some', () => {
      allure.step('some', () => {
        allure.step('some', () => expect(10).toBe(9));
      });
    });
  });
});
