/**
 * Owner: solar@kupotech.com
 */
import { moduleFederation } from '@kucoin-biz/common-base';
import { ICArrowLeft2Outlined } from '@kux/icons';
import { Divider, styled, useTheme } from '@kux/mui';
import { withRouter } from 'components/Router';
import { useSelector } from 'react-redux';
import { _t } from 'tools/i18n';
import { replace } from 'utils/router';
import { SubAccountCommonWrapper } from '../StyledComponents';
import { useAssetsDetail } from './hooks';

const { loadRemote } = moduleFederation;
// 加载组件
const SubAssetTotal = loadRemote('assets-web/SubAssetTotal');
const StyledTitle = styled.div`
  .back-skip {
    display: flex;
    gap: 8px;
    align-items: center;
    color: ${(props) => props.theme.colors.text60};
    cursor: pointer;
    ${(props) => props.theme.breakpoints.down('sm')} {
      font-size: 14px;
    }
  }
  .title {
    margin-bottom: 0;
    padding: 28px 0;
    color: ${(props) => props.theme.colors.text};
    ${(props) => props.theme.fonts.size.x4l}
    font-weight: 600;
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 12px 0;
      font-size: 18px;
    }
  }
  .title-divider {
    margin: 0;
  }
`;

function Overview({ subUserName }) {
  const detail = useAssetsDetail(subUserName);
  const prices = useSelector((state) => state.currency.prices);
  const fiatCurrency = useSelector((state) => state.currency.currency);
  const balanceCurrency = useSelector((state) => state.user.balanceCurrency);
  const categories = useSelector((state) => state.categories);
  const { currentTheme } = useTheme();
  const props = {
    total: detail?.totalAssets,
    balanceCurrency,
    prices,
    fiatCurrency,
    categories,
    theme: currentTheme,
  };
  return <SubAssetTotal {...props} />;
}

function Title({ query }) {
  const theme = useTheme();
  const handleSkip = () => {
    replace('/account/sub');
  };
  return (
    <StyledTitle>
      <SubAccountCommonWrapper>
        <div className="back-skip" onClick={handleSkip}>
          <ICArrowLeft2Outlined size="16" color={theme.colors.icon} />
          {_t('back')}
        </div>
        <h1 className="title">{query.sub}</h1>
      </SubAccountCommonWrapper>
      <Divider className="title-divider" />
      <SubAccountCommonWrapper>
        <Overview subUserName={query.sub} />
      </SubAccountCommonWrapper>
    </StyledTitle>
  );
}

export default withRouter()(Title);
