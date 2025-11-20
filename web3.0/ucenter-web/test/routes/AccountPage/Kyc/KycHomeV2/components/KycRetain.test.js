import KycRetain from "src/routes/AccountPage/Kyc/components/KycRetain/index";
import { customRender } from "test/setup";

describe('test KycRetain', () => {
  test('test KycRetain', () => {
    customRender(
      <KycRetain amount={99} />,
      {
        kyc: {
          kycInfo: {
            verifyStatus: -1
          },
          kycClearInfo: {
            clearStatus: -1
          }
        }
      }
    );
  });
});