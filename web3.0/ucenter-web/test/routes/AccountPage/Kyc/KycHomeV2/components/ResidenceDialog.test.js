import ResidenceDialog from 'src/components/Account/Kyc/ResidenceDialog/index';
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { customRender } from "test/setup";

test('test ResidenceDialog', () => {
  const mockCancel = jest.fn();
  customRender(<ResidenceDialog open={true} regionCode="AU" onCancel={mockCancel} />, {
    kyc: {
      residenceConfig: {
        display: true,
        verifyStatus: -1
      }
    }
  });
});

test('test ResidenceDialog shouldAlert', () => {
  const mockCancel = jest.fn();
  customRender(<ResidenceDialog open={true} regionCode="AU" shouldAlert onCancel={mockCancel} />, {
    kyc: {
      residenceConfig: {
        display: true,
        verifyStatus: -1
      }
    }
  });
});