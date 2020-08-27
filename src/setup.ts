import { AllureReporter } from './AllureReporter';
import { JasmineAllureReporter } from './JasmineAllureReporter';

export function registerAllureReporter() {
  const reporter = ((global as any).reporter = new AllureReporter());
  (jasmine as any).getEnv().addReporter(new JasmineAllureReporter(reporter));
}

registerAllureReporter();

declare global {
  export const reporter: AllureReporter;
}
