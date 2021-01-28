import { allure } from '../test-helper';

describe('simple-suite-before-each', () => {
  beforeEach(() => {
    allure.step('before step');
  });

  afterEach(() => {
    allure.step('after step');
  });

  it('1.simple-test', () => {
    expect(10).toBe(10);
  });

  it('2.simple-test4354', () => {
    expect(10).toBe(10);
  });
});
