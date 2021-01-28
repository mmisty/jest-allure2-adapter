# Jest-Allure-2 reporting plugin

Originally forked from jest-allure.

Add more power to your tests using Jest-Allure. Easily generate nice reports at the end of the execution.

[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/jest-community/awesome-jest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

[![GitHub followers](https://img.shields.io/github/followers/zaqqaz.svg?style=social)](https://github.com/zaqqaz)
[![GitHub stars](https://img.shields.io/github/stars/zaqqaz/jest-allure.svg?style=social)](https://github.com/zaqqaz/jest-allure/stargazers)
[![GitHub watchers](https://img.shields.io/github/watchers/zaqqaz/jest-allure.svg?style=social)](https://github.com/zaqqaz/jest-allure/watchers)

## Table of Contents

1. [Examples](#examples)
2. [Installation](#installation)
3. [Cofiguration](#cofiguration)
4. [How to get a report](#how-to-get-a-report)
5. [Advanced features](#advanced-features)
   - [Custrom Jasmine reporter](#custrom-jasmine-reporter)
   - [Warning](#warning)
6. [What's next](#whats-next)
7. [Feature Notes](#feature-notes)
8. [Releases](#releases)

#### Examples

- todo

![Allure Report](https://user-images.githubusercontent.com/2823336/40350093-59cad576-5db1-11e8-8210-c4db3bf825a1.png)

[Allure Framework](https://github.com/allure-framework/allure2) is a flexible lightweight multi-language test report tool that not only
shows a very concise representation of what have been tested in a neat web report form,
but allows everyone participating in the development process to extract maximum of useful
information from everyday execution of tests.

### Installation

```
yarn add -D jest-allure2-adapter
```

or

```
npm install --save-dev jest-allure2-adapter
```

#### jest -v >24 ?

Then add `jest-allure2-adapter/dist/setup-default` to `setupFilesAfterEnv` section of your config.

```
setupFilesAfterEnv: ["jest-allure2-adapter/dist/setup-default"]
```

#### jest -v < 24 ?

#### add reporter to jest.config.js

```
reporters: ["default", "jest-allure2-adapter"],
```

Run tests. Results will be generated and stored in `allure-results` folder.

---

### Cofiguration

Object of the following type can be added into registerAllureReporter as first argument.

```javascript
  resultsDir?: string;
  stepTimestamp?: boolean;
  addStepStatusDetailsAttachment?: boolean; // add attachment with step status details
  tmsLink?: (id: string) => string;
  issueLink?: (id: string) => string;
```

---

### How to get a report

You need to install the [CLI](https://github.com/allure-framework/allure2#download) in order to obtain a report.

For example see [allure-commandline](https://www.npmjs.com/package/allure-commandline).

To see a report in browser, run in console

```
allure serve
```

If you want to generate html version, run in console

```
allure generate
```

## Advanced features

You can add description, screenshots, steps, severity and lots of other
fancy stuff to your reports.

Global variable `reporter` available in your tests with such methods:

```
    test: AllureCurrentApi; // actions for current test

      startGroup(name: string): void;
      startTest(spec: jasmine_.CustomReporterResult): void;
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
      endTest(spec: jasmine_.CustomReporterResult): void;
      endGroup(): void;

      writeCategories(categories: Category[]): void;
      addEnvironment(name: string, value: string): this;

      logStep(name: string, status: Status, attachments?: [Attachment]): void;

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

```

### Custrom Jasmine reporter

To use custom jasmine reporter - for example to add smth into allure when spec or suite started you can use custom jasmine reporter.
In this case you do NOT need to add `jest-allure2-adapter/dist/setup-default` into SetupFilesAfterEnv section.
Just call registerAllureReporter with yur custom jasmine reporter.

see example:

```json
// jest.setup.ts
...
setupFilesAfterEnv: [
    './config/jest-custom-reporter.ts',
  ],
...
```

```typescript
// jest-custom-reporter.ts

import {
  AllureReporterApi,
  jasmine_,
  registerAllureReporter,
} from 'jest-allure2-adapter';

class JasmineAllureReporter implements jasmine_.CustomReporter {
  private allure: AllureReporterApi;

  constructor(allure: AllureReporterApi) {
    this.allure = allure;
  }

  suiteStarted(suite?: jasmine_.CustomReporterResult) {
    this.allure.startGroup(suite.description);
    // some actions here on suite started
  }

  suiteDone() {
    // some actions here on suite end
    this.allure.endGroup();
  }

  specStarted(spec: jasmine_.CustomReporterResult) {
    this.allure.startTest(spec);
    // some actions here on test started
  }

  specDone(spec: jasmine_.CustomReporterResult) {
    // some actions here on spec end
    this.allure.endTest(spec);
  }
}

registerAllureReporter(
  undefined,
  (allure) => new JasmineAllureReporter(allure),
);
```

**Example (todo)**

```
import { Severity } from "jest-allure/dist/Reporter";
import { Feature } from "somwhere in your project";

describe("Fancy test", () => {
        ...

        it("Test your amazing feature", async () => {
            reporter
                .description("Feature should work cool")
                .severity(Severity.Critical)
                .feature(Feature.Betting)
                .story("BOND-007");

            reporter.startStep("Check it's fancy");
            // expect that it's fancy
            reporter.endStep();

            reporter.startStep("Check it's cool");
            // expect that it's cool
            reporter.endStep();

            const screenshotBuffer = await page.screenshot();
            reporter.addAttachment("Screenshot", screenshotBuffer, "image/png");
        });

        ...
    }
);

```

## What's next

- [x] Ability to implement own JasmineAllureReporter (0.2.16)
- [ ] Add before/after hooks
- [ ] Add examples
- [x] Ability to config (timestamp to step, jira link) (0.2.53)
- [x] historyId (group retries)
- [ ] Add param to stepStatus to add attachment with details or not
- [ ] Cleanup statusDetails

---

#### Warning

`jest-allure2-adapter` reporter dynamically configure "setupTestFrameworkScriptFile" option in Jest configuration.
**If you have your own setupTestFrameworkScriptFile file**, you need to manually register allure reporter, for it you need to import jest-allure/dist/setup-default.

```typescript
import 'jest-allure2-adapter/dist/setup-default';
```

In case if you have jest version > 24 just add `jest-allure/dist/setup-default` to `setupFilesAfterEnv` section of your config.

## Feature Notes

#### Setting feature, story to all tests in file

As far as describe is async setting feature/story under describe or in any other place in the file except test will add feature/story to all tests in this file (feature/story can be overridden in test)

Todo: add example

## Releases

#### 0.3.6:

- ability to setup historyId and fullName
- added historyIdByName into config (when false need to setup historyId manually to have correct retries, by default it is true and historyId is being generated by spec full name)

#### 0.3.5:

- fixed grouping into retries

#### 0.3.0:

- added ability to configure reporter:
  - resultsDir: where allure results are stored, default `allure-results`
  - stepTimestamp: add timestamp to step or not, false by default
  - addStepStatusDetailsAttachment: add step status details attachment (status details doesn't work in report, so this is workaround), false by default
  - tmsLink / issueLink: links pattern for adding issues (`tmsLink: (id) => http://someissue.com/${id}`)

#### 0.2.52:

- added addDescription (adds html description to test). Previously there was only ability to SET description.

  - ex:
    ```javascript
    allure.test.addDescription('<h1>Heading</h1><br>');
    ...
    allure.test.addDescription('line<br>');
    ```
    It will add description to test `<h1>Heading</h1><br>line<br>`

- cleanup

#### 0.2.51:

- fix stepStatus details in case when step throws error

#### 0.2.46:

- JEST_WORKER_ID to 0x format (for timeline in report)
- fix groupping
- fix stripAnsi
- stepStatus details as string

#### 0.2.45:

- step status details as any

#### 0.2.44:

- step status without details when throws

#### 0.2.43:

- feature for suite / story for suite

#### 0.2.42:

- step status and status details

#### 0.2.23 [stable]

- default and custom reporter, timestamps in steps

## Contributors

| [<img src="https://avatars0.githubusercontent.com/u/16957275?s=400&v=4" width="100px;"/><br/><sub><b>Taisia Pitko</b></sub>](https://github.com/mmisty) |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- |

