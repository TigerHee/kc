/**
 * Owner: solar@kupotech.com
 */
import { useTheme } from '@kux/mui';
import { useSelector } from 'src/hooks/useSelector';
import AssetsWebCompManager from 'src/mfRemoteComponents/AssetsWebCompManager';
import AccountWrapper from '../AccountWrapper';

const SubMainAccount = AssetsWebCompManager.SubMainAccount;
const SubTradeAccount = AssetsWebCompManager.SubTradeAccount;
const SubFuturesAccount = AssetsWebCompManager.SubFuturesAccount;
const SubMarginAccount = AssetsWebCompManager.SubMarginAccount;
const SubOptionAccount = AssetsWebCompManager.SubOptionAccount;

export default function Account() {
  const { currentTheme } = useTheme();
  const subUid = useSelector((state) => state.MF_assets_web_subAssets?.subUid);
  const prices = useSelector((state) => state.currency.prices);
  const fiatCurrency = useSelector((state) => state.currency.currency);
  const balanceCurrency = useSelector((state) => state.user.balanceCurrency);
  const categories = useSelector((state) => state.categories);
  const commonProps = {
    prices,
    fiatCurrency,
    balanceCurrency,
    categories,
    theme: currentTheme,
  };
  return (
    <AccountWrapper>
      {(value) => {
        return (
          <>
            {value === 'main' && <SubMainAccount {...commonProps} />}
            {value === 'trade' && <SubTradeAccount {...commonProps} />}
            {value === 'margin' && <SubMarginAccount {...commonProps} />}
            {value === 'futures' && (
              <SubFuturesAccount isSubAccount subUid={subUid} theme={currentTheme} />
            )}
            {value === 'option' && <SubOptionAccount {...commonProps} />}
          </>
        );
      }}
    </AccountWrapper>
  );
}
