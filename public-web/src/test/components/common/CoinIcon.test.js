/**
 * Owner: larvide.peng@kupotech.com
 */
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import CoinIcon from 'components/common/CoinIcon';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { customRender } from 'src/test/setup';
import storage from 'utils/storage';

const mockStore = configureStore([]);

describe('CoinIcon Component', () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      categories: {
        bitcoin: {
          iconUrl: 'https://example.com/bitcoin.png',
        },
      },
    });
  });

  it('renders with default icon when no logoUrl is provided', () => {
    customRender(
      <Provider store={store}>
        <CoinIcon coin="bitcoin" />
      </Provider>,
    );

    const img = screen.getByAltText('Coin Icon');

    expect(img).toHaveAttribute(
      'src',

      'https://example.com/bitcoin.png',
    );
  });

  it('renders with provided logoUrl', () => {
    customRender(
      <Provider store={store}>
        <CoinIcon coin="bitcoin" logoUrl="https://example.com/custom.png" />
      </Provider>,
    );

    const img = screen.getByAltText('Coin Icon');

    expect(img).toHaveAttribute('src', 'https://example.com/custom.png');
  });

  it('renders with default source when no iconUrl is found', () => {
    customRender(
      <Provider store={store}>
        <CoinIcon coin="unknown" />
      </Provider>,
    );

    const img = screen.getByAltText('Coin Icon');

    expect(img).toHaveAttribute(
      'src',

      'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    );
  });

  it('uses local storage when persist is true', () => {
    storage.setItem('coinIconUrlMap', { ethereum: 'https://example.com/ethereum.png' });

    customRender(
      <Provider store={store}>
        <CoinIcon coin="ethereum" persist={true} />
      </Provider>,
    );

    const img = screen.getByAltText('Coin Icon');

    expect(img).toHaveAttribute('src', 'https://example.com/ethereum.png');
  });

  it('renders LazyImg when lazyImg is true', () => {
    customRender(
      <Provider store={store}>
        <CoinIcon coin="bitcoin" lazyImg={true} />
      </Provider>,
    );

    const lazyImg = screen.getByRole('img');

    expect(lazyImg).toBeInTheDocument();
  });

  it('renders CoinIcon when hiddenLoading is true and coin unknown', () => {
    customRender(
      <Provider store={store}>
        <CoinIcon coin="unknown" hiddenLoading />
      </Provider>,
    );

    const lazyImg = screen.getByRole('img');

    expect(lazyImg).toBeInTheDocument();
  });

  it('renders LazyImg when lazyImg hiddenLoading is true', () => {
    customRender(
      <Provider store={store}>
        <CoinIcon coin="bitcoin" lazyImg hiddenLoading />
      </Provider>,
    );

    const lazyImg = screen.getByRole('img');

    expect(lazyImg).toBeInTheDocument();
  });

  it('renders LazyImg when lazyImg is false', () => {
    customRender(
      <Provider store={store}>
        <CoinIcon coin="bitcoin" lazyImg={false} hiddenLoading />
      </Provider>,
    );

    const lazyImg = screen.getByRole('img');

    expect(lazyImg).toBeInTheDocument();
  });

  it('renders maskConfig ', () => {
    customRender(
      <Provider store={store}>
        <CoinIcon coin="bitcoin" lazyImg={false} maskConfig={{}} />
      </Provider>,
    );

    const lazyImg = screen.getByRole('img');

    expect(lazyImg).toBeInTheDocument();
  });

  it('lazy maskConfig ', () => {
    customRender(
      <Provider store={store}>
        <CoinIcon coin="bitcoin" lazyImg maskConfig={{}} />
      </Provider>,
    );

    const lazyImg = screen.getByRole('img');

    expect(lazyImg).toBeInTheDocument();
  });
});
