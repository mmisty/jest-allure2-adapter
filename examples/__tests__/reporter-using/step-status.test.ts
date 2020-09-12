import { allure } from '../../test-helper';
import { Status } from 'allure-js-commons';

describe('step-status', () => {
  /*it('should be orange', async () => {
    allure.step('Some failed step, not thown', () => {
      const err = new Error('err');
      allure.stepStatus(Status.BROKEN, {
        message: err.message,
        trace: err.stack,
      });
      expect(1).toBe(1);
    });

    allure.step('Some failed step, not thown no details', () => {
      const err = new Error('err');
      allure.stepStatus(Status.BROKEN);
      expect(1).toBe(1);
    });

    allure.step('Some passing step', () => {
      expect(1).toBe(1);
    });

    allure.step('Some failed step with details', () => {
      allure.stepStatus(Status.FAILED, {
        message: 'sadasdsa DETAILS',
        trace: 'sdsadsadad',
      });
      expect(1).toBe(1);
    });
  });*/

  it('should be orange - fails', async () => {
    allure.step('Some failed step, not thown', () => {
      try {
        expect(1).toBe(3);
      } catch (e) {
        allure.stepStatus(Status.FAILED, e.message);
      }
    });
    allure.step('Some failed step, not thown', () => {
      try {
        throw new Error('some custom error');
      } catch (e) {
        allure.stepStatus(Status.FAILED, `${e.message}\n ${e.stack}`);
      }
    });

    allure.step('Some failed step with NSTING', () => {
      try {
        allure.step('Some failed nestede step, not thown', () => {
          try {
            expect(1).toBe(3);
          } catch (err) {
            allure.stepStatus(Status.FAILED, err.message + 'asdsad');
            throw err;
          }
        });
      } catch (e) {
        allure.stepStatus(Status.FAILED, e.message);
      }
    });

    /*allure.step('Some failed step, not thown no details', () => {
      const err = new Error('err');
      allure.stepStatus(Status.BROKEN);
      expect(1).toBe(1);
    });

    allure.step('Some passing step', () => {
      expect(1).toBe(1);
    });

    allure.step('Some failed step with details', () => {
      allure.stepStatus(Status.FAILED, {
        message: 'sadasdsa DETAILS',
        trace: 'sdsadsadad',
      });
      expect(1).toBe(1);
    });

    allure.step('Some failed step with details throws', () => {
      throw new Error('sfsefsdfsd');
    });*/
  });
});
