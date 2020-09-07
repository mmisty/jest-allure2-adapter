import { allure } from '../../test-helper';

describe('check description', () => {
  it('html description', () => {
    allure.descriptionHtml(
      '<h1>Test about desc</h1></br><h2>Heading2</h2><p>some teext</p>',
    );
  });

  it('one line description', () => {
    allure.description('Some text');
  });
  it('one line markdown description', () => {
    allure.description('Some **strong** text');
  });

  it('multiline markdown description (not work)', () => {
    allure.description('one line\nsecond line </br>');
  });

  it('multiline description (no markdown)', () => {
    allure.description(`
      asdasd
      asdasd
      asd
      __tests__
      `);
  });
});
