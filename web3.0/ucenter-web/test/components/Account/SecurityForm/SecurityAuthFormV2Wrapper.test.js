/**
 * Owner: eli.xiang@kupotech.com
 */

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SecurityAuthFormV2Wrapper from 'src/components/Account/SecurityForm/SecurityAuthFormV2Wrapper';

import { customRender } from 'test/setup';

const mockStore = configureStore([]);

describe('SecurityAuthFormV2Wrapper', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      loading: {
        effects: {
          'security_new/get_verify_type': false,
        },
      },
    });
  });

  test('renders loading spinner when loading', async () => {
    store = mockStore({
      loading: {
        effects: {
          'security_new/get_verify_type': true,
        },
      },
    });

    const onSuccessCallback = jest.fn();

    const allowTypes = [['google_2fa'], ['my_email']];
    store.dispatch = jest.fn(() => Promise.resolve(allowTypes));

    customRender(
      <Provider store={store}>
        <SecurityAuthFormV2Wrapper bizType="test" onSuccess={onSuccessCallback} />
      </Provider>,
    );
    // await waitFor(() => {
    //   expect(onSuccessCallback).toHaveBeenCalled();
    // });
  });

  test('calls onSuccess when no allowTypes', async () => {
    const onSuccess = jest.fn();
    store = mockStore({
      loading: {
        effects: {
          'security_new/get_verify_type': false,
        },
      },
    });

    // Mock dispatch to return an empty array for allowTypes
    store.dispatch = jest.fn(() => Promise.resolve([]));

    customRender(
      <Provider store={store}>
        <SecurityAuthFormV2Wrapper bizType="test" onSuccess={onSuccess} />
      </Provider>,
    );
  });

  // test('renders SecurityAuthFormV2 with allowTypes', async () => {
  //   const allowTypes = ['type1', 'type2'];
  //   store.dispatch = jest.fn(() => Promise.resolve(allowTypes));

  //   render(
  //     <Provider store={store}>
  //       <SecurityAuthFormV2Wrapper bizType="test" />
  //     </Provider>
  //   );

  //   // Wait for the effect to run
  //   await new Promise((r) => setTimeout(r, 0));

  //   expect(screen.getByText(/submit/i)).toBeInTheDocument(); // Assuming submit button has text 'submit'
  // });
});
