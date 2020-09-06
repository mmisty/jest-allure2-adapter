import { allure, delay } from '../../src/test-helper';
import { Status } from 'allure-js-commons';

async function delayNumber(
  ms: number,
  ...messages: string[]
): Promise<{ hello: number }> {
  console.log(
    ...messages,
    messages.length > 0 ? ':' : '',
    `DELAY ${ms.toString()} ms`,
  );
  await new Promise((resolve) => setTimeout(resolve, ms));
  return { hello: 5 };
}
describe('steps', () => {
  describe('params', () => {
    it('ste1', async () => {
      allure.addParameter('test', 'value1');
    });
    it('ste2', async () => {
      allure.addParameter('test', 'value2');
    });
  });
  it('ste', async () => {
    allure.feature('other feature');
    /* reporter.startStep('some step1');
        expect(10).toBe(10)
        reporter.endStep();
        reporter.startStep('some step2');
        expect(10).toBe(10)
        reporter.endStep();

        reporter.startStep('neseted');

        reporter.startStep('sneseted');
        reporter.endStep();
        reporter.endStep();*/
    await allure.step('some step 1', () => expect(1).toBe(1));
    await allure.step('some step 2', () => {
      allure.step('step iside 1 ', () => expect(1).toBe(1));
      allure.step('step iside 2 ', () => expect(1).toBe(1));
      /*reporter.step('step iside 3 ',
                    (p) => expect(p).toBe(1),
                    {'p':0}
                );*/
    });
    await allure.step('delay', () => delay(1000));
    await allure.step('some step 2', () => expect(1).toBe(1));
    await allure.step('delayThrows', () => delay(1000)).catch();
    /*reporter.createStep().currentTest.;
        reporter.createStep('some step22', () => expect(10).toBe(10));
        reporter.createStep('some step3', () => expect(10).toBe(10));*/

    expect(10).toBe(10);
  });

  it('stepp - delayThrows', async () => {
    allure.feature('steps');
    allure.feature('other feature');
    await allure.step('delay', () => delay(1000));
    await allure.step('delayThrows', () => delay(1000));
  });

  it('stepp - hello', async () => {
    allure.feature('steps');
    const number = await allure.step('delay', () => delayNumber(100));
    allure.step(`HELLO:${number.hello}`);
    allure.step('with param', () => {
      allure.addParameter('name', 'valeu');
      allure.addParameters(['namefdf', 'valeudf'], ['name', { ob: 6 }]);
    });
  });

  it('nested steps', async () => {
    const number = await allure.step('delay', () => delayNumber(100));

    allure.step(`HELLO:${number.hello}`);
    allure.step('with param', () => {
      allure.addParameter('name', 'valeu');
      allure.addParameters(['namefdf', 'valeudf'], ['name', { ob: 6 }]);
    });
  });
});
