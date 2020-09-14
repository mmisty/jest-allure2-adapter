import { relative } from 'path';
import { AllureReporterApi, jasmine_, registerAllureReporter } from '../../src';

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

registerAllureReporter(
  {
    stepTimestamp: true,
    addStepStatusDetailsAttachment: true,
    tmsLink: (id) => `http://blahissue.com/${id}`,
    issueLink: (id) => `http://issue.com/${id}`,
  },
  (a) => new JasmineAllureReporter(a),
);
