import { ContentType } from 'allure-js-commons';
import { allure } from '../../test-helper';

describe('check attachment', () => {
  it('adds attachment to test when no step', () => {
    allure.attachment('test attachment', 'some');
  });

  it('adds attachment to test when no step (test.attachment)', () => {
    allure.test.attachment('test attachment', 'some');
  });

  it('adds attachment to test when there is active step (test.attachment)', () => {
    allure.step('some first step', () => {
      allure.test.attachment('test attachment', 'some');
    });
  });

  it('adds attachment to step', () => {
    allure.step('some first step', () => {
      allure.attachment('step attachment', 'some');
    });
  });

  it('diff content', () => {
    const obj = { ff: { ffs: 1, ffds: 2 } };
    const uri = 'http://sdss.com/asdsad';
    const csv = 'hfdfd;dfdfd;\nsdsd;sdsd;';
    const csv2 = 'hfdfd,dfdfd,zsczx\nsdsd,zxzxc,sdsd';
    const csv3 =
      'hfdfd,dfdfd,zsczx,zsczx,zsczx,zsczx\nhfdfd,dfdfd,zsczx,zsczx,zsczx,zsczx\nhfdfd,dfdfd,zsczx,zsczx,zsczx,zsczx';
    allure.test.attachment('JSON', JSON.stringify(obj), ContentType.JSON);
    allure.test.attachment('TEXT', JSON.stringify(obj), ContentType.TEXT);
    allure.test.attachment('csv', csv, ContentType.CSV);
    allure.test.attachment('csv2', csv2, ContentType.CSV);
    allure.test.attachment('csv3', csv3, ContentType.CSV);
    allure.test.attachment('uri', uri, ContentType.URI);
    //reporter.addAttachment('log2', {'ff': {"ffs": 1, "ffds": 2}}, ContentType.TEXT);
  });

  it('type description 2', () => {
    const obj = { ff: { ffs: 1, ffds: 2 } };
    const uri = 'http://sdss.com/asdsad';
    const csv = 'hfdfd;dfdfd;\nsdsd;sdsd;';
    const csv2 = 'hfdfd,dfdfd,zsczx\nsdsd,zxzxc,sdsd';
    allure.step('attach', () =>
      allure.test.attachment(
        'test attach 2',
        JSON.stringify(obj),
        ContentType.TEXT,
      ),
    );

    allure.step('next step', () => {});
    allure.test.attachment('test attach', uri, ContentType.URI);
  });

  it('step attachement jnjnj', () => {
    const obj = { ff: { ffs: 1, ffds: 2 } };
    const uri = 'http://sdss.com/asdsad';
    const csv = 'hfdfd;dfdfd;\nsdsd;sdsd;';
    const csv2 = 'hfdfd,dfdfd,zsczx\nsdsd,zxzxc,sdsd';
    allure.step('attach', () =>
      allure.attachment('step attach', JSON.stringify(obj), ContentType.TEXT),
    );

    allure.step('next step', () => {});
    allure.test.attachment('test attach', uri, ContentType.URI);
  });
});
