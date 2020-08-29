import { AllureReporter } from './AllureReporter';
import { JasmineAllureReporter } from './JasmineAllureReporter';
import { AllureReporterApi, jasmine_ } from './index';

export function registerAllureReporter(
  jasmineCustom?: (r: AllureReporterApi) => jasmine_.CustomReporter,
) {
  const reporter = ((global as any).reporter = new AllureReporter());
  (jasmine as any)
    .getEnv()
    .addReporter(
      jasmineCustom
        ? jasmineCustom(reporter)
        : new JasmineAllureReporter(reporter),
    );
}

declare global {
  export const reporter: AllureReporter;
}
