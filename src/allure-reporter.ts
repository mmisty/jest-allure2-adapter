import {
  Allure,
  AllureGroup,
  AllureRuntime,
  AllureStep,
  AllureTest,
  Attachment,
  Category,
  ContentType,
  ExecutableItemWrapper,
  IAllureConfig,
  isPromise,
  LabelName,
  LinkType,
  Severity,
  Stage,
  Status,
  StatusDetails,
  StepInterface,
} from 'allure-js-commons';
import {
  AllureAdapterConfig,
  AllureCurrentApi,
  AllureReporterApi,
  jasmine_,
} from './index';
import { TestSuiteProps } from './test-suite-props';
import { AllureCurrent } from './allure-current';
import { dateStr, getContent } from './utils';
import { AttachmentOptions } from 'allure-js-commons/dist/src/model';

const stripAnsi = require('strip-ansi');

enum SpecStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  BROKEN = 'broken',
  PENDING = 'pending',
  DISABLED = 'disabled',
  EXCLUDED = 'excluded',
  TODO = 'todo',
}
type StepStatus = {
  status: Status;
  details?: StatusDetails | any;
};

export class AllureReporter extends Allure implements AllureReporterApi {
  private runningTest: AllureTest | null = null;
  private runningGroup: AllureGroup | null = null;
  private groupNameStack: string[] = [];
  private stepStack: AllureStep[] = [];
  private currentStepStatus: StepStatus | null = null;

  private storyProps: TestSuiteProps = new TestSuiteProps();
  private featureProps: TestSuiteProps = new TestSuiteProps();

  private environmentInfo: Record<string, string> = {};

  private test_: AllureCurrent = new AllureCurrent(
    this.runtime,
    () => this.currentTest,
  );
  private executable: AllureCurrent = new AllureCurrent(
    this.runtime,
    () => this.currentExecutable,
  );

  constructor(private config?: AllureAdapterConfig) {
    super(
      new AllureRuntime({ resultsDir: config?.resultsDir ?? 'allure-results' }),
    );
  }

  get test(): AllureCurrentApi {
    return this.test_;
  }

  get currentTest(): AllureTest {
    if (this.runningTest === null) {
      throw new Error('No active test');
    }

    return this.runningTest;
  }

  protected get currentExecutable(): ExecutableItemWrapper {
    return this.currentStep ?? this.currentTest;
  }

  private get currentGroup(): AllureGroup {
    if (this.runningGroup === null) {
      throw new Error('No active group');
    }

    return this.runningGroup;
  }

  private get currentStep(): AllureStep | null {
    if (this.stepStack.length > 0) {
      return this.stepStack[this.stepStack.length - 1];
    }

    return null;
  }

  startGroup(name: string) {
    // todo check currentgroup.startgroup
    // todo check empty name
    this.runningGroup = this.runtime.startGroup(name);
    this.groupNameStack.push(name);
  }

  // todo decorators
  startTest(spec: jasmine_.CustomReporterResult) {
    this.runningTest = this.currentGroup.startTest(spec.description);
    this.runningTest.fullName = spec.fullName;
    this.executable.initDescription();

    // Capture Jest worker thread for timeline report
    if (process.env.JEST_WORKER_ID) {
      this.currentTest.addLabel(
        LabelName.THREAD,
        `${('0' + Number(process.env.JEST_WORKER_ID)).slice(-2)}`,
      );
    }

    this.applyGroupping();
  }

  startStep(name: string, start?: number): AllureStep {
    const allureStep = this.currentExecutable.startStep(
      (this.config?.stepTimestamp ? dateStr() + ' | ' : '') + name,
      start,
    );
    this.stepStack.push(allureStep);
    return allureStep;
  }

  stepStatus(status: Status, details?: StatusDetails | any) {
    if (this.currentStep) {
      this.currentStepStatus = { status: status, details: details };
    }
  }

  endStep(
    status?: Status,
    stage?: Stage,
    details?: StatusDetails | any,
    end?: number,
  ) {
    const step = this.stepStack.pop();

    if (!step) {
      console.log('No step started');
      return;
    }
    step.stage = stage ?? Stage.FINISHED;

    if (status) {
      step.status = status;
    }

    if (details?.message || details?.trace) {
      step.statusDetails = {
        message: details.message,
        trace: details.trace,
      };
    }

    if (details && this.config?.addStepStatusDetailsAttachment) {
      // todo: status details does not work in report, workaround below
      const type = ContentType.JSON;
      const file = this.getAttachFile(details, type);
      step.addAttachment('StatusDetails_' + dateStr(true), type, file);
    }

    step.endStep(end);
    this.currentStepStatus = null;
  }

  setHistoryId(uid: string): void {
    const getUuid = require('uuid-by-string');
    this.currentTest.historyId = getUuid(uid);
  }

  setFullName(fullName: string): void {
    this.currentTest.fullName = fullName;
  }

  endTest(spec: jasmine_.CustomReporterResult) {
    this.endSteps();

    if (spec.status === SpecStatus.PASSED) {
      this.currentTest.status = Status.PASSED;
      this.currentTest.stage = Stage.FINISHED;
    }

    if (spec.status === SpecStatus.BROKEN) {
      this.currentTest.status = Status.BROKEN;
      this.currentTest.stage = Stage.FINISHED;
    }

    if (spec.status === SpecStatus.FAILED) {
      this.currentTest.status = Status.FAILED;
      this.currentTest.stage = Stage.FINISHED;
    }

    if (
      spec.status === SpecStatus.PENDING ||
      spec.status === SpecStatus.DISABLED ||
      spec.status === SpecStatus.EXCLUDED ||
      spec.status === SpecStatus.TODO
    ) {
      this.currentTest.status = Status.SKIPPED;
      this.currentTest.stage = Stage.PENDING;
      this.currentTest.detailsMessage = spec.pendingReason || 'Suite disabled';
    }

    // Capture exceptions
    const exceptionInfo =
      this.findMessageAboutThrow(spec.failedExpectations) ||
      this.findAnyError(spec.failedExpectations);

    if (exceptionInfo !== null && typeof exceptionInfo.message === 'string') {
      let { message } = exceptionInfo;

      message = stripAnsi(message);

      this.currentTest.detailsMessage = message;

      if (exceptionInfo.stack && typeof exceptionInfo.stack === 'string') {
        let { stack } = exceptionInfo;

        stack = stripAnsi(stack, 0);
        stack = stack.replace(message, '');

        this.currentTest.detailsTrace = stack;
      }
    }

    this.featureProps.apply((a) => super.feature(a));
    this.storyProps.apply((a) => super.story(a));
    this.applyDescription();
    if (this.config?.autoHistoryId !== false) {
      this.setHistoryId(spec.fullName);
    }
    this.currentTest.endTest();
  }

  endGroup() {
    if (!this.currentGroup) {
      throw new Error('No runningGroup');
    }

    this.runtime.writeGroup({
      name: this.currentGroup.name,
      uuid: this.currentGroup.uuid,
      befores: [],
      afters: [],
      children: [],
    });
    this.groupNameStack.pop();
    this.currentGroup.endGroup();
  }

  writeCategories(categories: Category[]) {
    super.writeCategoriesDefinitions(categories);
  }

  public step<T>(
    name: string,
    body?: (step: StepInterface) => T,
    start?: number,
    ...args: any[]
  ): any {
    const allureStep = this.startStep(name, start);
    let result;

    if (!body) {
      this.endStep(Status.PASSED);
      return;
    }

    try {
      result = allureStep.wrap(body)(args);
    } catch (error) {
      this.endStep(
        this.currentStepStatus?.status ?? Status.FAILED,
        undefined,
        this.currentStepStatus?.details,
      );
      throw error;
    }

    if (isPromise(result)) {
      const promise = result as Promise<any>;
      return promise
        .then((a) => {
          this.endStep(
            this.currentStepStatus?.status ?? Status.PASSED,
            undefined,
            this.currentStepStatus?.details,
          );
          return a;
        })
        .catch((error) => {
          console.log('Result fail: isPromise');
          this.endStep(
            this.currentStepStatus?.status ?? Status.FAILED,
            undefined,
            this.currentStepStatus?.details,
          );
          throw error;
        });
    } else {
      this.endStep(
        this.currentStepStatus?.status ?? Status.PASSED,
        undefined,
        this.currentStepStatus?.details,
      );
      return result;
    }
  }

  addEnvironment(name: string, value: string) {
    this.environmentInfo[name] = value;
    super.writeEnvironmentInfo(this.environmentInfo);
    return this;
  }

  public logStep(
    name: string,
    status: Status,
    attachments?: [Attachment],
  ): void {
    // console.log('AllureImpl status:', status);
    /*const wrappedStep = this.startStep(name);

                if (attachments) {
                    for (const {name, content, type} of attachments) {
                        this.attachment(name, content, type);
                    }
                }

                wrappedStep.logStep(status);
                wrappedStep.endStep();*/
  }

  public attachment(
    name: string,
    content: Buffer | string,
    type: ContentType | string | AttachmentOptions = ContentType.JSON,
  ) {
    return this.executable.attachment(name, content, type);
  }

  addParameter(name: string, value: string) {
    this.executable.addParameter(name, value);
    return this;
  }

  addParameters(...params: [string, any][]) {
    this.executable.addParameters(...params);
    return this;
  }

  // for test

  addPackage(value: string) {
    this.currentTest.addLabel(LabelName.PACKAGE, value);
    return this;
  }

  addLink(options: { name?: string; url: string; type?: LinkType }) {
    this.currentTest.addLink(
      options.url,
      options.name ?? options.url,
      options.type,
    );
    return this;
  }

  addIssue(options: { id: string; name?: string; url?: string }) {
    if (!this.config?.issueLink && !options.url) {
      throw new Error('Specify url or issueLink in config');
    }
    const link =
      this.config?.issueLink && !options.url
        ? this.config?.issueLink(options.id)
        : `${options.url}${options.id}`;
    this.issue(options.name ?? options.id, link);

    return this;
  }

  addTms(options: { id: string; name?: string; url?: string }) {
    if (!this.config?.tmsLink && !options.url) {
      throw new Error('Specify url or tmsLink in config');
    }
    const link =
      this.config?.tmsLink && !options.url
        ? this.config?.tmsLink(options.id)
        : `${options.url}${options.id}`;
    this.tms(options.name ?? options.id, link);

    return this;
  }

  addLabel(name: string, value: string) {
    this.currentTest.addLabel(name, value);
    return this;
  }

  addDescription(description: string): void {
    this.test_.addDescription(description);
  }

  description(description: string) {
    this.executable.description(description);
    return this;
  }

  descriptionHtml(description: string) {
    this.executable.descriptionHtml(description);
    return this;
  }

  feature(feature: string): this {
    return this.featureStoryForSuite(this.featureProps, feature, 'FEATURE');
  }

  story(story: string): this {
    return this.featureStoryForSuite(this.storyProps, story, 'STORY');
  }

  tag(tag: string) {
    super.tag(tag);
  }

  owner(owner: string) {
    super.owner(owner);
  }

  lead(lead: string) {
    super.label(LabelName.LEAD, lead);
  }

  framework(framework: string) {
    super.label(LabelName.FRAMEWORK, framework);
  }

  language(language: string) {
    super.label(LabelName.LANGUAGE, language);
  }

  as_id(id: string) {
    super.label(LabelName.AS_ID, id);
  }

  host(host: string) {
    super.label(LabelName.HOST, host);
  }

  testClass(testClass: string) {
    super.label(LabelName.TEST_CLASS, testClass);
  }

  testMethod(testMethod: string) {
    super.label(LabelName.TEST_METHOD, testMethod);
  }

  severity(severity: Severity) {
    super.severity(severity);
  }

  private endSteps() {
    while (this.currentStep !== null) {
      this.endStep(Status.BROKEN);
    }
  }

  private applyGroupping(): void {
    const replaceDot = (name: string): string => {
      // todo regexp with \s
      if (name.substr(0, 1) === '.') {
        return name.substr(1, name.length - 1);
      }
      if (name.substr(name.length - 1) === '.') {
        return name.substr(0, name.length - 1);
      }
      return name;
    };
    const groups = this.groupNameStack.map((p) => replaceDot(p));
    this.addPackage(groups.join('.'));

    if (groups.length > 0) {
      this.parentSuite(groups[0]);
    }

    if (groups.length > 1) {
      this.suite(groups[1]);
    }

    if (groups.length > 2) {
      this.subSuite(groups[2]);
    }
  }

  private applyDescription() {
    const testDesc = this.test_.getDescription();
    if (testDesc.length) {
      this.test_.applyDescription();
    }
  }

  private findMessageAboutThrow(expectations?: any[]): any | null {
    for (const expectation of expectations || []) {
      if (expectation.matcherName === '') {
        return expectation;
      }
    }

    return null;
  }

  private findAnyError(expectations?: any[]): any | null {
    expectations = expectations || [];
    if (expectations.length > 0) {
      return expectations[0];
    }

    return null;
  }

  private getAttachFile(content: string, type: ContentType) {
    return this.runtime.writeAttachment(getContent(content, type), type);
  }

  private featureStoryForSuite(
    prop: TestSuiteProps,
    value: string,
    type: 'STORY' | 'FEATURE',
  ) {
    if (this.runningTest) {
      prop.testProp = value;
      return this;
    }

    if (prop.suiteProp) {
      throw new Error(type + ' for suite can be set only once');
    }

    prop.suiteProp = value;
    return this;
  }
}
