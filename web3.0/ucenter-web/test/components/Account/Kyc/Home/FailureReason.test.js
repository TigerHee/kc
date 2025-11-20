import FailureReason from 'src/components/Account/Kyc/KycHome/FailureReason';
import { customRender } from 'test/setup';

describe('test FailureReason', () => {
  test('test FailureReason', () => {
    customRender(<FailureReason />, {});
    customRender(<FailureReason failureReasonLists={['aaa', 'bbb', 'cc \n cc \n']} />, {});
    customRender(<FailureReason failureReasonLists={null} />, {});
  });
});
