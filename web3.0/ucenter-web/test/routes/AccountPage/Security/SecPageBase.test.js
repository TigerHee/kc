import { waitFor } from '@testing-library/react';
import SecPageBase from 'src/routes/AccountPage/Security/SecPageBase';
import { customRender } from 'test/setup';

const bizType = 'FORGET_WITHDRAWAL_PASSWORD';

class Test extends SecPageBase {
  render() {
    return <div>Test</div>;
  }
}

describe('test modalBase', () => {
  test('test modalBase', () => {
    customRender(<Test bizType={bizType} />);
  });

  test('should call getAuthType and update state correctly', async () => {
    const mockDispatch = jest.fn().mockResolvedValueOnce([]);
    const props = {
      bizType,
      dispatch: mockDispatch,
    };
    customRender(<Test {...props} />);
    await waitFor(() => {
      // Check if the dispatch function was called
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'security_new/get_verify_type',
        payload: { bizType },
      });

      // Check if the component state is updated correctly
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });

  test('should update state with allowTypes', async () => {
    const mockAllowTypes = ['type1', 'type2'];
    const mockDispatch = jest.fn().mockResolvedValueOnce(mockAllowTypes);
    const props = {
      bizType,
      dispatch: mockDispatch,
    };

    customRender(<Test {...props} />);

    await waitFor(() => {
      // Check if the dispatch function was called
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'security_new/get_verify_type',
        payload: { bizType },
      });
    });
  });
});
