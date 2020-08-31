# Jest-Allure-2 reporting plugin

Originally forked from jest-allure.

#### Add more power to your tests using Jest-Allure. Easily generate nice reports at the end of the execution.

[![Awesome](https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg)](https://github.com/jest-community/awesome-jest)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

[![GitHub followers](https://img.shields.io/github/followers/zaqqaz.svg?style=social)](https://github.com/zaqqaz)
[![GitHub stars](https://img.shields.io/github/stars/zaqqaz/jest-allure.svg?style=social)](https://github.com/zaqqaz/jest-allure/stargazers)
[![GitHub watchers](https://img.shields.io/github/watchers/zaqqaz/jest-allure.svg?style=social)](https://github.com/zaqqaz/jest-allure/watchers)

#### Examples

- todo

<hr>

![Allure Report](https://user-images.githubusercontent.com/2823336/40350093-59cad576-5db1-11e8-8210-c4db3bf825a1.png)

[Allure Framework](https://github.com/allure-framework/allure2) is a flexible lightweight multi-language test report tool that not only
shows a very concise representation of what have been tested in a neat web report form,
but allows everyone participating in the development process to extract maximum of useful
information from everyday execution of tests.

#### Installation

```
yarn add -D jest-allure2-adapter
```

or

```
npm install --save-dev jest-allure2-adapter
```

### jest -v >24 ?

Then add `jest-allure2-adapter/dist/setup-default` to `setupFilesAfterEnv` section of your config.

```
setupFilesAfterEnv: ["jest-allure2-adapter/dist/setup-default"]
```

### jest -v < 24 ?

#### add reporter to jest.config.js

```
reporters: ["default", "jest-allure2-adapter"],
```

Run tests. Results will be generated and stored in `allure-results` folder.

---

#### How to get a report

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

# Advanced features

You can add description, screenshots, steps, severity and lots of other
fancy stuff to your reports.

Global variable `reporter` available in your tests with such methods:

```
    description(description: string): this;
    descriptionHtml(description: string): this;
    severity(severity: Severity): this;
    epic(epic: string): this;
    feature(feature: string): this;
    story(story: string): this;
    owner(story: string): this;

    step<T>(name: string, body: () => any): T;
    startStep(name: string): this;
    endStep(status?: Status): this;

    addEnvironment(name: string, value: string): this;

    addAttachment(name: string, buffer: any, type: string): this;
    addTestAttachment(name: string, buffer: any, type: string): this;

    addLabel(name: string, value: string): this;
    addParameter(paramName: string, name: string, value: string): this;
    addParameters(...params: [string, any][]): this;

    addLink(options: {
        name?: string;
        url: string;
        type?: LinkType;
    }): this;

    addIssue(options: {
        id: string;
        name?: string;
        url?: string;
    }): this;

    addTms(options: {
        id: string;
        name?: string;
        url?: string;
    }): this;

```

## Custrom Jasmine reporter

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

registerAllureReporter((allure) => new JasmineAllureReporter(allure));
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

#### What's next

- [x] Ability to implement own JasmineAllureReporter (0.2.16)
- [ ] Add before/after hooks
- [ ] Add examples
- [ ] Ability to config (timestamp to step, jira link)

---

#### Warning

`jest-allure2-adapter` reporter dynamically configure "setupTestFrameworkScriptFile" option in Jest configuration.
**If you have your own setupTestFrameworkScriptFile file**, you need to manually register allure reporter, for it you need to import jest-allure/dist/setup.

```typescript
import 'jest-allure2-adapter/dist/setup-default';
```

In case if you have jest version > 24 just add `jest-allure/dist/setup-default` to `setupFilesAfterEnv` section of your config.

## Releases
0.2.23 default and custom reporter, timestamps in steps

## Contributors

| [<img src="https://avatars0.githubusercontent.com/u/16957275?s=400&v=4" width="100px;"/><br/><sub><b>Taisia Pitko</b></sub>](https://github.com/mmisty) |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- |

