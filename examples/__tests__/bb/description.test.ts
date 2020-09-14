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

  it('desc to step(doesnt work in report)', () => {
    allure.step('some first step', () => {
      allure.descriptionHtml('desc for step');
    });
  });

  it('desc to test from step', () => {
    allure.step('some first step', () => {
      allure.test.descriptionHtml('desc for test');
    });
  });

  it('multiline desc', () => {
    allure.step('some first step', () => {
      allure.addDescription('line1');
      allure.addDescription('line2');
      allure.addDescription('line3');
    });

    allure.addDescription('line4');
  });

  it('multiline desc test', () => {
    allure.step('some first step', () => {
      allure.test.addDescription('line5');
      allure.test.addDescription('line6');
      allure.test.addDescription('line7');
    });

    allure.test.addDescription('line8');
  });
});
