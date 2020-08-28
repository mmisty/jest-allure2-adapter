import { AllureReporter } from './AllureReporter';
import { JasmineAllureReporter } from './JasmineAllureReporter';

export declare namespace jasmine {
  function getEnv(): any;
  interface CustomReporter {
    jasmineStarted?(suiteInfo: any): void;
    suiteStarted?(result: CustomReporterResult): void;
    specStarted?(result: CustomReporterResult): void;
    specDone?(result: CustomReporterResult): void;
    suiteDone?(result: CustomReporterResult): void;
    jasmineDone?(runDetails: any): void;
  }
  interface CustomReporterResult {
    description: string;
    failedExpectations?: any[];
    fullName: string;
    id: string;
    passedExpectations?: any[];
    pendingReason?: string;
    status?: string;
  }
}

export function registerAllureReporter() {
  const reporter = ((global as any).reporter = new AllureReporter());
  (jasmine as any).getEnv().addReporter(new JasmineAllureReporter(reporter));
}

/*
export function addReporter(
  jasmineCustom?: (r: AllureReporter) => jasmine.CustomReporter,
) {
  // const reporter = ((global as any).reporter = new AllureReporter());
  jasmine
    .getEnv()
    .addReporter(jasmineCustom ?? new JasmineAllureReporter(reporter));
}
*/

registerAllureReporter();

declare global {
  export const reporter: AllureReporter;
}
