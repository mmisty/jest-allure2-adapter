import { execSync } from 'child_process';
import {
  AllureTest,
  parseAllure,
  getSummary,
  getParentsArray,
} from 'allure-js-parser';
import { existsSync } from 'fs';
import path from 'path';

describe('simple.test.ts check', () => {
  const examples = path.resolve(process.cwd(), './examples');
  const allureDir = path.resolve(examples + '/allure-results');
  let tests: AllureTest[];

  beforeAll(() => {
    if (existsSync(allureDir)) {
      execSync(`rm -rf ${allureDir}`);
    }
    const cmd = `cd examples && jest --testNamePattern=^simple-suite --runTestsByPath ${examples}/__tests__/simple.test.ts && true`;
    console.log(cmd);
    try {
      execSync(cmd);
    } catch (e) {
      // ignore
    }
    tests = parseAllure('./examples/allure-results');
  });

  it('test names', () => {
    expect(tests.map((t) => t.name).sort()).toEqual([
      'simple-test',
      'simple-test-2-fail#tag',
    ]);
  });

  it('test parents', () => {
    expect(
      tests
        .map((t) => ({
          name: t.name,
          parents: getParentsArray(t).map((t) => t.name),
        }))
        .sort((a, b) => (b.name && a.name && a.name > b.name ? -1 : 1)),
    ).toEqual([
      {
        name: 'simple-test-2-fail#tag',
        parents: ['simple-suite'],
      },
      {
        name: 'simple-test',
        parents: ['simple-suite'],
      },
    ]);
  });

  it('test summary', () => {
    expect(getSummary(tests)).toEqual({
      broken: 0,
      failed: 1,
      passed: 1,
      skipped: 0,
      unknown: 0,
    });
  });

  it('test all tests have thread', () => {
    expect(
      tests.every(
        (t) => t.labels.filter((l) => l.name === 'thread').length > 0,
      ),
    ).toEqual(true);
  });

  it('test all tests have feature', () => {
    expect(
      tests.every(
        (t) => t.labels.filter((l) => l.name === 'feature').length > 0,
      ),
    ).toEqual(true);
  });

  it('test all tests have feature feature1', () => {
    expect(
      tests.map((t) => t.labels.find((l) => l.name === 'feature')?.value),
    ).toEqual(['feature1', 'feature1']);
  });
});
