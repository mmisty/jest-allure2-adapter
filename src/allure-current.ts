import { AllureCurrentApi } from './index';
import {
  AllureRuntime,
  AllureTest,
  ContentType,
  ExecutableItemWrapper,
} from 'allure-js-commons';
import { getContent } from './utils';
import { AttachmentOptions } from 'allure-js-commons/dist/src/model';

export class AllureCurrent implements AllureCurrentApi {
  protected descriptionParts: string[] = [];
  constructor(
    private runtime: AllureRuntime,
    private runningExecutable: () => ExecutableItemWrapper,
  ) {}

  private action(
    action: (current: ExecutableItemWrapper | AllureTest) => void,
  ) {
    action(this.runningExecutable());
  }

  public attachment(
    name: string,
    content: Buffer | string,
    type: ContentType | string | AttachmentOptions = ContentType.JSON,
  ) {
    const file = this.runtime.writeAttachment(getContent(content, type), type);
    this.action((current) => current.addAttachment(name, type, file));
  }

  addParameter(name: string, value: string) {
    this.action((current) => current.addParameter(name, value));
    return this;
  }

  addParameters(...params: [string, any][]) {
    params.forEach((p) => {
      const value = typeof p[1] !== 'string' ? JSON.stringify(p[1]) : p[1];
      this.action((current) => current.addParameter(p[0], value));
    });
    return this;
  }

  description(description: string) {
    this.action((current) => (current.description = description));
    return this;
  }

  descriptionHtml(description: string) {
    this.action((current) => (current.descriptionHtml = description));
    return this;
  }

  addDescription(description: string): void {
    this.descriptionParts.push(description);
  }

  initDescription() {
    this.descriptionParts = [];
  }

  applyDescription() {
    if (this.descriptionParts.length > 0) {
      this.descriptionHtml(this.descriptionParts.join(''));
    }
    this.initDescription();
  }

  getDescription(): string[] {
    return this.descriptionParts;
  }
}
