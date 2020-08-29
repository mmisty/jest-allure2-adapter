import { relative } from 'path';
import { AllureReporterApi, jasmine_ } from './index';

export class JasmineAllureReporter implements jasmine_.CustomReporter {
  private allure: AllureReporterApi;

  constructor(allure: AllureReporterApi) {
    this.allure = allure;
  }

  suiteStarted(suite?: jasmine_.CustomReporterResult) {
    if (suite) {
      this.allure.startGroup(suite.fullName);
    } else {
      // case for tests without suite
      this.allure.startGroup(
        relative(process.cwd(), (expect as any).getState().testPath),
      );
    }
  }

  suiteDone() {
    this.allure.endGroup();
  }

  specStarted(spec: jasmine_.CustomReporterResult) {
    this.allure.startTest(spec);
  }

  specDone(spec: jasmine_.CustomReporterResult) {
    this.allure.endTest(spec);
  }
}
