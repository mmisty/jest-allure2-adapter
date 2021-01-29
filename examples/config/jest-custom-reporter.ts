import { relative } from 'path';
import { AllureReporterApi, jasmine_, registerAllureReporter } from '../../src';

class JasmineAllureReporter implements jasmine_.CustomReporter {
  private allure: AllureReporterApi;
  private testIds: string[] = [];

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

  // 'Your test suite must contain at least one test.' -> when setting something to not started test
  specStarted(spec: jasmine_.CustomReporterResult) {
    this.allure.startTest(spec);

    this.allure.framework('JEST overridden');
    // this.allure.host('HOST overridden');
    this.allure.step('NON_DEFAULT');
  }

  specDone(spec: jasmine_.CustomReporterResult) {
    // ex. need to have the same test in report even after test was renamed
    const testId = spec.description.match(/(\d+)/)[1];

    // this.allure.setFullName(testId);
    if (this.testIds.indexOf(testId) !== -1) {
      spec.status = 'failed';
      spec.failedExpectations.push({ message: 'DUPLICATE id ' + testId });
    }
    this.testIds.push(testId);
    this.allure.endTest(spec);
  }
}

registerAllureReporter(
  {
    stepTimestamp: true,
    addStepStatusDetailsAttachment: true,
    // autoHistoryId: false,
    tmsLink: (id) => `http://blahissue.com/${id}`,
    issueLink: (id) => `http://issue.com/${id}`,
  },
  (a) => new JasmineAllureReporter(a),
);
