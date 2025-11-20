import { fireEvent } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import ModalSecurity from 'src/components/Account/ModalSecurity';
import { customRender } from 'test/setup';

const mockStore = configureStore([]);
const store = mockStore({
  user: {
    user: {},
  },
  security_new: {
    retryAfterSeconds: 0,
  },
  loading: {
    effects: {
      'security_new/sec_get_code': false,
      'security_new/sec_verify': false,
    },
  },
});

describe('ModalSecurity component', () => {
  it('renders ModalSecurity correctly', () => {
    const { getByText } = customRender(<ModalSecurity visible={true} />, store);
    const titleElement = getByText('security.verify');
    expect(titleElement).toBeInTheDocument();
  });

  it('calls handleResult when result is handled', () => {
    const handleResult = jest.fn();
    const { getByText } = customRender(
      <ModalSecurity
        visible={true}
        handleResult={handleResult}
        verifyConfig={{ bizType: 'test' }}
      />,
      store,
    );
    const result = { success: true };
    fireEvent.submit(getByText('submit'));
    handleResult(result);
    expect(handleResult).toHaveBeenCalled();
  });
});
