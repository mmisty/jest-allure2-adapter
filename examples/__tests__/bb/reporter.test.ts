import { allure } from '../../test-helper';
import { LabelName, Severity } from 'allure-js-commons';

describe('reporter-suite', () => {
  it('sim', () => {
    //reporter.step('expect? ', () => expect(10).toBe(10));
    expect(10).toBe(10);
    allure.startStep('sdfsdf');
    allure.addLabel('package', 'some package');
    allure.addLabel(LabelName.AS_ID, 'IDDDD');
    allure.addEnvironment('bvdd', 'sfsd');
    allure.addLink({ name: 'BBB', url: 'Bla.com' });
    allure.addIssue({ id: 'ABFX-000', url: 'http://ggggg.com' });
    allure.addIssue({ id: 'ABFX-NOURL' });
    allure.addTms({ id: 'ABFX-111', url: 'http://bbbbbb.com' });
    allure.addTms({ id: 'ABFX-NOURL' });
    allure.severity(Severity.BLOCKER);
    allure.description('Some desc 1 ');
    allure.tag('#testRunnerTag');
    allure.tag('#testRunnerTag2');
    allure.as_id('as-id');
    allure.lead('TAISIA LEAD');
    allure.owner('TAISIA OWNER');
    allure.framework('framework');
    allure.host('host OWNER');
    allure.language('language OWNER');
  });

  it('sim 2', () => {
    allure.step('expect? ', () => expect(10).toBe(10));
    allure.startStep('sdfsdf');
    allure.descriptionHtml('</br></br><h1>SSASASAS</h1>');
    allure.descriptionHtml('</br></br><h1>SSASASAS4241421</h1>');
    expect(10).toBe(9);
  });
});
