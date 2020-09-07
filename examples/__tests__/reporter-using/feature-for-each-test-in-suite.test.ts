import { allure } from '../../test-helper';

describe('featured-test', () => {
  allure.feature('feature1');
  allure.story('story2 ');

  it('should be orange', async () => {
    expect(1).toBe(1);
  });

  it('should be yellow', async () => {
    expect(1).toBe(1);
  });

  it('should be green', async () => {
    expect(1).toBe(1);
  });

  describe('featured-test-nested', () => {
    // allure.feature('feature4');
    it('should be black', async () => {
      allure.feature('feature2 ');
      allure.story('story3 ');
      expect(1).toBe(1);
    });

    it('should be brown', async () => {
      allure.story('story ');
      expect(1).toBe(1);
    });
  });
});
