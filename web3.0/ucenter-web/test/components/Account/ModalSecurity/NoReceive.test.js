import '@testing-library/jest-dom/extend-expect';
import configureStore from 'redux-mock-store';
import NoReceiveEmail from 'src/components/NewCommonSecurity/NoReceiveEmail';
import { customRender } from 'test/setup';

describe('Dialog component', () => {
  const mockStore = configureStore([]);
  const initialState = {
    user: {
      user: {
        email: 'test@example.com',
      },
    },
  };
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('renders Dialog correctly', () => {
    customRender(<NoReceiveEmail />, store);
  });
});
