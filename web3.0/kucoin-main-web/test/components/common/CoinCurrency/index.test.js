/**
 * Owner: solar@kupotech.com
 */
import { customRender } from 'test/setup';
import CoinCurrency from 'src/components/common/CoinCurrency/index.js';

describe('CoinCurrency', () => {
  // it('should render correct value with currency', () => {
  //   const { getByText } = customRender(<CoinCurrency coin="BTC" value={2} />);
  //   expect(getByText('≈ $100000')).toBeInTheDocument();
  // });

  // it('should render correct value without currency if hideLegalCurrency is true', () => {
  //   const { getByText } = customRender(<CoinCurrency coin="BTC" value={2} hideLegalCurrency />);
  //   expect(getByText('≈ 100000')).toBeInTheDocument();
  // });

  // it('should render correct value with legal chars if useLegalChars is true', () => {
  //   const { getByText } = customRender(<CoinCurrency coin="BTC" value={2} useLegalChars />);
  //   expect(getByText('≈ $100000')).toBeInTheDocument();
  // });

  it('should render default value if rate or value is not available', () => {
    const { getByText } = customRender(<CoinCurrency coin="LTC" value={2} defaultValue="N/A" />);
    expect(getByText('N/A')).toBeInTheDocument();
  });
});
