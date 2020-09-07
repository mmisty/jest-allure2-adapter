import { ContentType } from 'allure-js-commons';
import { allure } from '../../test-helper';

describe('check attachement', () => {
  it('type description', () => {
    const obj = { ff: { ffs: 1, ffds: 2 } };
    const uri = 'http://sdss.com/asdsad';
    const csv = 'hfdfd;dfdfd;\nsdsd;sdsd;';
    const csv2 = 'hfdfd,dfdfd,zsczx\nsdsd,zxzxc,sdsd';
    const csv3 =
      'hfdfd,dfdfd,zsczx,zsczx,zsczx,zsczx\nhfdfd,dfdfd,zsczx,zsczx,zsczx,zsczx\nhfdfd,dfdfd,zsczx,zsczx,zsczx,zsczx';
    allure.addTestAttachment('JSON', JSON.stringify(obj), ContentType.JSON);
    allure.addTestAttachment('TEXT', JSON.stringify(obj), ContentType.TEXT);
    allure.addTestAttachment('csv', csv, ContentType.CSV);
    allure.addTestAttachment('csv2', csv2, ContentType.CSV);
    allure.addTestAttachment('csv3', csv3, ContentType.CSV);
    allure.addTestAttachment('uri', uri, ContentType.URI);
    //reporter.addAttachment('log2', {'ff': {"ffs": 1, "ffds": 2}}, ContentType.TEXT);
  });

  it('type description 2', () => {
    const obj = { ff: { ffs: 1, ffds: 2 } };
    const uri = 'http://sdss.com/asdsad';
    const csv = 'hfdfd;dfdfd;\nsdsd;sdsd;';
    const csv2 = 'hfdfd,dfdfd,zsczx\nsdsd,zxzxc,sdsd';
    allure.step('attach', () =>
      allure.addAttachment(
        'step attach',
        JSON.stringify(obj),
        ContentType.TEXT,
      ),
    );

    allure.step('next step', () => {});
    allure.addTestAttachment('test attach', uri, ContentType.URI);
  });
});
