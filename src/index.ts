import path from 'path';
import Reporter = jest.Reporter;
import {
  AllureStep,
  Attachment,
  Category,
  ContentType,
  LinkType,
  Severity,
  Stage,
  Status,
  StepInterface,
} from 'allure-js-commons';

export declare namespace jasmine_ {
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
    testPath: string;
    id: string;
    passedExpectations?: any[];
    pendingReason?: string;
    status?: string;
  }
}
export interface AllureReporterApi {
  startGroup(name: string): void;
  startTest(spec: jasmine_.CustomReporterResult): void;
  startStep(name: string, start?: number): AllureStep;
  endStep(status?: Status, stage?: Stage, end?: number): void;
  endTest(spec: jasmine_.CustomReporterResult): void;
  writeCategories(categories: Category[]): void;
  endGroup(): void;
  step<T>(
    name: string,
    body?: (step: StepInterface) => T,
    start?: number,
    ...args: any[]
  ): any;
  addEnvironment(name: string, value: string): this;
  writeAttachment(content: Buffer | string, type: ContentType): string;
  logStep(name: string, status: Status, attachments?: [Attachment]): void;
  attachment(name: string, content: Buffer | string, type: ContentType): void;
  stepAttachement(
    name: string,
    content: Buffer | string,
    type: ContentType,
  ): void;
  addPackage(value: string): this;
  addParameter(name: string, value: string): this;
  addParameters(...params: [string, any][]): this;
  addTestPathParameter(
    relativeFrom: string,
    spec: jasmine_.CustomReporterResult,
  ): this;
  addLink(options: { name?: string; url: string; type?: LinkType }): this;
  addIssue(options: { id: string; name?: string; url?: string }): this;
  addTms(options: { id: string; name?: string; url?: string }): this;
  addAttachment(name: string, buffer: any, type: ContentType): this;
  addTestAttachment(name: string, buffer: any, type: ContentType): this;
  addLabel(name: string, value: string): this;
  description(description: string): this;
  descriptionHtml(description: string): this;
  feature(feature: string): void;
  story(story: string): void;
  tag(tag: string): void;
  owner(owner: string): void;
  lead(lead: string): void;
  framework(framework: string): void;
  language(language: string): void;
  as_id(id: string): void;
  host(host: string): void;
  testClass(testClass: string): void;
  testMethod(testMethod: string): void;
  severity(severity: Severity): void;
}

declare namespace JestAllureReporter {
  type ReporterConfig = {
    resultsDir: string;
  };
}

export default class JestAllureReporter implements Reporter {
  private reporterOptions: JestAllureReporter.ReporterConfig;

  constructor(
    globalConfig: jest.GlobalConfig,
    options: Partial<JestAllureReporter.ReporterConfig> = {},
  ) {
    this.reporterOptions = {
      resultsDir: path.resolve('.', options.resultsDir || 'allure-results'),
    };
  }
  onRunStart(
    results: jest.AggregatedResult,
    options: jest.ReporterOnStartOptions,
  ) {}
  onTestStart(test: jest.Test) {
    const setupPath = require.resolve('./setup');
    const setupTestFrameworkScriptFile =
      test.context.config.setupTestFrameworkScriptFile;
    if (!setupTestFrameworkScriptFile) {
      test.context.config = {
        ...test.context.config,
        setupTestFrameworkScriptFile: setupPath,
      };
    }
  }
}
