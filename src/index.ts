import path from 'path';
import {
  AllureStep,
  Attachment,
  Category,
  ContentType,
  LinkType,
  Severity,
  Stage,
  Status,
  StatusDetails,
  StepInterface,
} from 'allure-js-commons';
import { AllureReporter } from './allure-reporter';
import { JasmineAllureReporter } from './jasmine-allure-reporter';

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
export interface AllureCurrentApi {
  attachment(name: string, content: Buffer | string, type?: ContentType): void;
  addParameter(name: string, value: string): void;
  addParameters(...params: [string, any][]): this;

  description(description: string): void;
  descriptionHtml(description: string): void;
  addDescription(description: string): void;
}
export interface AllureReporterApi {
  test: AllureCurrentApi; // actions for current test
  isTestActive: boolean;
  startGroup(name: string): void;
  startTest(spec: jasmine_.CustomReporterResult, start?: number): void;
  startStep(name: string, start?: number): AllureStep;
  stepStatus(status: Status, details?: StatusDetails | any): void;
  step<T>(
    name: string,
    body?: (step: StepInterface) => T,
    start?: number,
    ...args: any[]
  ): any;
  endStep(
    status?: Status,
    stage?: Stage,
    details?: StatusDetails | any,
    end?: number,
  ): void;
  endTest(spec: jasmine_.CustomReporterResult, stop?: number): void;
  endGroup(): void;

  writeCategories(categories: Category[]): void;
  addEnvironment(name: string, value: string): this;

  logStep(name: string, status: Status, attachments?: [Attachment]): void;

  // todo: ContentType | string | AttachmentOptions
  attachment(name: string, content: Buffer | string, type?: ContentType): void;
  addParameter(name: string, value: string): this;
  addParameters(...params: [string, any][]): this;

  description(description: string): this; // sets description to current executable (test / step)
  descriptionHtml(description: string): this; // sets description to current executable (test / step)
  addDescription(description: string): void; // adds html description to test

  setFullName(fullName: string): void;
  setHistoryId(uid: string): void;

  addPackage(value: string): this;
  addLink(options: { name?: string; url: string; type?: LinkType }): this;
  addIssue(options: { id: string; name?: string; url?: string }): this;
  addTms(options: { id: string; name?: string; url?: string }): this;
  addLabel(name: string, value: string): this;
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

export type AllureAdapterConfig = {
  resultsDir?: string;
  stepTimestamp?: boolean;
  addStepStatusDetailsAttachment?: boolean; // add attachment with step status details
  autoHistoryId?: boolean; // when false you need to set historyId manually
  tmsLink?: (id: string) => string;
  issueLink?: (id: string) => string;
};

export function registerAllureReporter(
  config?: AllureAdapterConfig,
  jasmineCustom?: (r: AllureReporterApi) => jasmine_.CustomReporter,
) {
  const reporter = ((global as any).reporter = new AllureReporter(config));

  (jasmine as any)
    .getEnv()
    .addReporter(
      jasmineCustom
        ? jasmineCustom(reporter)
        : new JasmineAllureReporter(reporter),
    );
}

declare global {
  export const reporter: AllureReporterApi;
}

declare namespace JestAllureReporter {
  type ReporterConfig = {
    resultsDir: string;
  };
}

export default class JestAllureReporter implements jest.Reporter {
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
    const setupPath = require.resolve('./setup-default');
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
