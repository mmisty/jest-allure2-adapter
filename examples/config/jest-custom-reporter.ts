import {
  AllureReporterApi,
  jasmine_,
  registerAllureReporter,
} from 'jest-allure2-adapter';
import { relative } from 'path';

class JasmineAllureReporter implements jasmine_.CustomReporter {
  private allure: AllureReporterApi;

  constructor(allure: AllureReporterApi) {
    this.allure = allure;
  }

  suiteStarted(suite?: jasmine_.CustomReporterResult) {
    if (suite) {
      this.allure.startGroup(suite.description);
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
    this.allure.step('NON_DEFAULT');
  }

  specDone(spec: jasmine_.CustomReporterResult) {
    this.allure.endTest(spec);
  }
}

registerAllureReporter((a) => new JasmineAllureReporter(a));
