import { AllureReporter } from './AllureReporter';
import { relative } from 'path';

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

// export const Categories: Category[] = []; // todo check may not work

export class JasmineAllureReporter implements jasmine.CustomReporter {
  private allure: AllureReporter;

  constructor(allure: AllureReporter) {
    this.allure = allure;
  }

  suiteStarted(suite?: jasmine.CustomReporterResult) {
    if (suite) {
      this.allure.startGroup(suite.fullName);
    } else {
      // case for tests without suite
      this.allure.startGroup(
        relative(process.cwd(), (expect as any).getState().testPath),
      );
    }
  }

  jasmineDone() {
    this.allure.writeCategories();
  }

  suiteDone() {
    this.allure.endGroup();
  }

  specStarted(spec: jasmine.CustomReporterResult) {
    this.allure.startTest(spec.description);
  }

  specDone(spec: jasmine.CustomReporterResult) {
    this.allure.endTest(spec);
  }
}
