import { dateStr } from '../src/allure-reporter';

export const allure = reporter;

export const allureT = {
  step(name: string) {
    allure.startStep(dateStr() + '>' + name);
    allure.endStep();
  },
};

export async function delay(ms: number, ...messages: string[]) {
  await allure.step(dateStr() + ' > ' + 'delay ' + ms, async () => {
    console.log(
      ...messages,
      messages.length > 0 ? ':' : '',
      `DELAY ${ms.toString()} ms`,
    );
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
}
export async function wait(condition: () => boolean) {
  allure.startStep(dateStr() + ' > ' + 'wait condition ');

  const start = Date.now();
  let elapsed = Date.now();
  const timeout = 7000;
  while (elapsed - start < timeout) {
    elapsed = Date.now();
    if (condition()) {
      break;
    }
    await delay(0);
  }
  if (elapsed - start >= timeout) {
    allure.startStep(dateStr() + ' > ' + (elapsed - start) + '>=' + timeout);
    allure.endStep();
    allure.endStep();
    throw new Error('Timeout wait');
  }
  allure.endStep();
}
export function log(...messages: string[]) {
  allure.startStep(dateStr() + ' > ' + messages.join(' '));
  allure.endStep();
}
