import {
  Allure,
  AllureGroup,
  AllureRuntime,
  LinkType,
  AllureStep,
  AllureTest,
  Attachment,
  Category,
  ContentType,
  ExecutableItemWrapper,
  isPromise,
  LabelName,
  IAllureConfig,
  Stage,
  Status,
  StepInterface,
} from 'allure-js-commons';
import stripAnsi from 'strip-ansi';
import { relative } from 'path';

enum SpecStatus {
  PASSED = 'passed',
  FAILED = 'failed',
  BROKEN = 'broken',
  PENDING = 'pending',
  DISABLED = 'disabled',
  EXCLUDED = 'excluded',
  TODO = 'todo',
}

export class AllureReporter extends Allure {
  private runningTest: AllureTest | null = null;
  private runningGroup: AllureGroup | null = null;
  public runningExecutable: ExecutableItemWrapper | null = null;
  private groupStack: AllureGroup[] = [];
  private groupNameStack: string[] = [];
  private stepStack: AllureStep[] = [];
  private stepNameStack: string[] = [];
  private environmentInfo: Record<string, string> = {};
  private categories: Category[] = [];

  constructor(config?: IAllureConfig) {
    super(new AllureRuntime(config ?? { resultsDir: 'allure-results' }));
  }

  get currentGroup(): AllureGroup {
    if (this.runningGroup === null) {
      throw new Error('No active group');
    }

    return this.runningGroup;
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

  startGroup(name: string) {
    // todo check currentgroup.startgroup
    this.runningGroup = this.runtime.startGroup(name);
    let nameGr = name;

    for (let i = 0; i < this.groupStack.length + 1; i++) {
      if (this.groupStack.length > i) {
        for (let j = 0; j <= i; j++) {
          nameGr = name.replace(this.groupStack[j].name, '');
        }
      }
    }

    this.groupNameStack.push(nameGr);
    this.groupStack.push(this.currentGroup);
  }

  // todo remove tags
  startTest(name?: string) {
    this.runningTest = this.currentGroup.startTest(name);
    // Capture Jest worker thread for timeline report
    if (process.env.JEST_WORKER_ID) {
      this.currentTest.addLabel(
        LabelName.THREAD,
        `${process.env.JEST_WORKER_ID}`,
      );
    }

    this.applyGroupping();
  }

  startStep(name: string): AllureStep {
    const allureStep = this.currentExecutable.startStep(name);
    this.stepStack.push(allureStep);
    // const myStep = { uid: v4(), step: allureStep }
    // this.stepStack2.push(myStep);
    this.stepNameStack.push(name);

    // console.log('START:' + JSON.stringify(this.stepNameStack));
    return allureStep;
  }

  endStep(status?: Status, stage?: Stage) {
    // console.log('END:' + JSON.stringify(this.stepNameStack));
    const step = this.stepStack.pop();

    this.stepNameStack.pop();
    if (!step) {
      throw new Error('No step started');
    }
    step.stage = stage ?? Stage.FINISHED;
    if (status) {
      step.status = status;
    }
    step.endStep();
  }

  // todo type
  endTest(spec: any) {
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

        stack = stripAnsi(stack);
        stack = stack.replace(message, '');

        this.currentTest.detailsTrace = stack;
      }
    }

    this.currentTest.endTest();
  }

  get currentStep(): AllureStep | null {
    if (this.stepStack.length > 0) {
      return this.stepStack[this.stepStack.length - 1];
    }

    return null;
  }

  writeCategories() {
    super.writeCategoriesDefinitions(this.categories);
  }

  private applyGroupping() {
    const groups = this.groupNameStack;
    if (groups.length > 0) {
      this.parentSuite(groups[0]);
    }

    if (groups.length > 1) {
      this.suite(groups[1]);
    }

    if (groups.length > 2) {
      this.subSuite(groups.slice(2).join(' > '));
    }
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
    this.groupStack.pop();
    this.groupNameStack.pop();
    this.currentGroup.endGroup();
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

  public step<T>(
    name: string,
    body?: (step: StepInterface) => T,
    ...args: any[]
  ): any {
    console.log('step:', name);

    const allureStep = this.startStep(name);
    let result;

    if (!body) {
      this.endStep(Status.PASSED);
      return;
    }

    try {
      result = allureStep.wrap(body)(args);
    } catch (error) {
      console.log('Result:' + JSON.stringify(result));
      this.endStep(Status.FAILED);
      throw error;
    }

    if (isPromise(result)) {
      const promise = result as Promise<any>;
      return promise
        .then((a) => {
          console.log('Result pass: isPromise');
          this.endStep(Status.PASSED);
          return a;
        })
        .catch((error) => {
          console.log('Result fail: isPromise');
          this.endStep(Status.FAILED);
          throw error;
        });
    } else {
      this.endStep(Status.PASSED);
      return result;
    }

    /*if (!isPromise(result)) {

        }*/
  }

  addEnvironment(name: string, value: string) {
    this.environmentInfo[name] = value;
    super.writeEnvironmentInfo(this.environmentInfo);
    return this;
  }

  writeAttachment(content: Buffer | string, type: ContentType): string {
    return this.runtime.writeAttachment(content, type);
  }

  public logStep(
    name: string,
    status: Status,
    attachments?: [Attachment],
  ): void {
    console.log('AllureImpl status:', status);

    /*const wrappedStep = this.startStep(name);

                if (attachments) {
                    for (const {name, content, type} of attachments) {
                        this.attachment(name, content, type);
                    }
                }

                wrappedStep.logStep(status);
                wrappedStep.endStep();*/
  }

  public attachment(name: string, content: Buffer | string, type: ContentType) {
    const file = this.runtime.writeAttachment(content, type);

    this.currentTest.addAttachment(name, type, file);
  }

  public stepAttachement(
    name: string,
    content: Buffer | string,
    type: ContentType,
  ) {
    const file = this.runtime.writeAttachment(content, type);

    this.currentExecutable.addAttachment(name, type, file);
  }

  addCategory(category: Category): void {
    // todo check if the same exist
    this.categories.push(category);
  }

  addPackage(value: string) {
    this.currentTest.addLabel(LabelName.PACKAGE, value);
    return this;
  }

  addPackageByTestPath(relativeFrom: string, spec: any) {
    const relativePath = relative(relativeFrom, spec.testPath);
    this.addPackage(relativePath);
    return this;
  }

  addParameter(name: string, value: string) {
    this.currentExecutable.addParameter(name, value);
    return this;
  }

  addParameters(...params: [string, any][]) {
    params.forEach((p) => {
      const value = typeof p[1] !== 'string' ? JSON.stringify(p[1]) : p[1];
      this.currentExecutable.addParameter(p[0], value);
    });
    return this;
  }

  addTestPathParameter(relativeFrom: string, spec: any) {
    const relativePath = relative(relativeFrom, spec.testPath);
    this.addParameter('Test Path', relativePath);
    return this;
  }

  description(description: string) {
    this.currentTest.description = description;
    return this;
  }

  descriptionHtml(description: string) {
    this.currentTest.descriptionHtml = description;
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
    const uri = 'some';
    /* options.url ??
        (this.config?.issueUri ? this.config.issueUri(options.id) : undefined);*/
    if (!uri) {
      throw new Error('Specify url or issueUri in config');
    }
    this.issue(options.name ?? options.id, uri);
    return this;
  }

  addTms(options: { id: string; name?: string; url?: string }) {
    const uri = 'some';
    /* options.url ??
        (this.config?.tmsUri ? this.config.tmsUri(options.id) : undefined);*/
    if (!uri) {
      throw new Error('Specify url or tmsUri in config');
    }
    this.tms(options.name ?? options.id, uri);
    return this;
  }

  addAttachment(name: string, buffer: any, type: ContentType) {
    this.stepAttachement(name, buffer, type);
    return this;
  }

  addTestAttachment(name: string, buffer: any, type: ContentType) {
    this.attachment(name, buffer, type);
    return this;
  }

  addLabel(name: string, value: string) {
    this.currentTest.addLabel(name, value);
    return this;
  }
}
