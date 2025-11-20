/**
 * Owner: jennifer.y.liu@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, NumberFormat, styled, useResponsive } from '@kux/mui';
import LazyImg from 'components/common/LazyImg';
import isNil from 'lodash/isNil';
import { _t, _tHTML } from 'tools/i18n';
import Modal from 'TradeActivity/ActivityCommon/Modal';
import PumpFun from 'static/spotlight7/pumpFun.svg';
import Warning from 'static/spotlight7/ic2_warning.svg';
import { BASE_CURRENCY } from 'config/base';
import { locateToUrl } from 'TradeActivity/utils';
import { callJump } from 'src/routes/KcsPage/utils';
import HOST from 'utils/siteConfig';
import { useSelector } from 'src/hooks/useSelector';
import { shallowEqual } from 'react-redux';
import get from 'lodash/get';

const { MAINSITE_HOST } = HOST;

const StyledModal = styled(Modal)`
  .modal-content {
    padding: 24px;
  }
  .KuxDialog-content {
    padding: 0px 32px 24px 32px;
  }

  .modal-header {
    margin-bottom: 24px;
    padding: 0;

    .modal-title {
      font-weight: 500;
      font-size: 20px;
    }
  }
  .radio-group {
    position: relative;
    z-index: 2;
    padding-top: 28px;
  }

  .KuxDrawer-content {
    ${(props) => props.theme.breakpoints.down('sm')} {
        padding: 24px 16px 34px;
    }
  }

  .KuxModalHeader-root {
    ${(props) => props.theme.breakpoints.down('sm')} {
      padding: 24px 16px 12px;
      border-bottom: none;
    }
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  .reward-text {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    font-size: 20px;
    line-height: 130%;
    img {
      width: 32px;
      height: 32px;
      margin-right: 10px;
      border-radius: 32px;
    }
  }
  .reward-num {
    margin-bottom: 24px;
    color: ${(props) => props.theme.colors.primary};
    font-weight: 600;
    font-size: 36px;
    line-height: 130%;
    text-align: center;
    ${(props) => props.theme.breakpoints.down('sm')} {
      font-size: 32px;
    }
  }

  .reward-amount {
    color: ${(props) => props.theme.colors.text60};
    font-weight: 400;
    font-size: 16px;
    font-style: normal;
    line-height: 140%;
    display: flex;
    justify-content: space-between;
    .value {
      margin-left: 4px;
      color: ${(props) => props.theme.colors.text};
      font-size: 16px;
      font-weight: 500;
      line-height: 140%;
    }
  }
  .reward-amount:not(:last-child) {
    margin-bottom: 10px;

  }
  .tips {
    display: flex;
    padding: 12px 16px;
    align-self: stretch;
    border-radius: 8px;
    background: ${(props) => props.theme.colors.complementary8};
    color: ${(props) => props.theme.colors.text60};
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%;
    align-items: center;
    
    ${(props) => props.theme.breakpoints.down('sm')} {
      align-items: flex-start;
      margin-bottom: 10px;
      img {
        margin-top: 2px;
      }
    }
  }
  ${(props) => props.theme.breakpoints.up('sm')} {
    .reward-text {
      margin-bottom: 12px;
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  align-self: stretch;
  justify-content: center;
  padding: 12px 16px;

  ${(props) => props.theme.breakpoints.up('sm')} {
    border-top: 1px solid ${(props) => props.theme.colors.divider8};
    padding: 20px 32px;
    justify-content: flex-end;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 26px 0 12px 0px;
    .KuxButton-root {
      padding: 10px 24px;
      height: 48px;
      flex: 1 0 0;
    }
    .KuxButton-text {
      background: ${(props) => props.theme.colors.cover8};
    }
  }

  .KuxButton-contained {
    border-radius: 24px;
    background: ${(props) => props.theme.colors.text};
    color: ${(props) => props.theme.colors.textEmphasis};
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 140%;
    &:hover {
      background: ${(props) => props.theme.colors.text};
    }
  }
`;



const SubscriptionResultModal = ({ visible, onClose, subscriptionInfo }) => {
  const { currentLang } = useLocale();
  const { sm } = useResponsive();
  const pageData = useSelector((state) => state.spotlight7.pageData, shallowEqual);
  const {
    baseCurrencyName: currencyFullName,
  } = useSelector((state) => state.spotlight7.detailInfo, shallowEqual);
  const pageId = get(pageData, 'id');
  const tokePath = get(pageData, 'token_path');
  const subscriptionModal = visible;
  const {
    campaignId,
    // 结果值
    userTokenAmount,
    // 用户投入
    userSubAmount,
    // 用户剩余投入
    userSubFailAmountTotal,
    // 认购价格
    tokenPrice,
    // 部分申购成功
    userSubFailExists
  } = subscriptionInfo || {};

  const viewSubscribeHistory = () => {
    locateToUrl(`/spotlight7/purchase-record/${tokePath?.trim() || pageId}`);
  };

  const viewAssetsAccount = () => {
    let backUrl =`spotlight7/${campaignId}`;
    callJump(
      {
        url: `/account/asset?${
          backUrl ? `&backUrl=${encodeURIComponent(backUrl)}` : ''
        }`,
      },
      `${MAINSITE_HOST}/assets`,
    )
  };
  const Footer = () =>  {
    return (
      <ButtonWrapper>
      <Button variant={sm?"outlined":"text" }onClick={viewAssetsAccount}>
        {_t('1ef7646fd0c94800a692')}
      </Button>
      <Button variant="contained" onClick={viewSubscribeHistory}>
        {_t('464e51a934924800adc9')}
      </Button>
    </ButtonWrapper>
    );
  }

  const show = userSubFailExists === 1;
  return (
    <>
      <StyledModal
        onClose={onClose}
        destroyOnClose
        open={subscriptionModal}
        title={_t('d5d26d5fd39f4000a99f')}
        footer={<Footer campaignId={campaignId} />}
      >
        <ContentWrapper>
          <div className="reward-text">
            <LazyImg src={PumpFun} alt="logo" />
            <span>{'PUMP'}</span>
          </div>
          <div className="reward-num">
            {isNil(userTokenAmount) ? (
              '--'
            ) : (
              <NumberFormat lang={currentLang} isPositive={+userTokenAmount > 0}>
                {userTokenAmount}
              </NumberFormat>
            )}
          </div>

          {/* 认购价格 */}
          <div className="reward-amount">
            {_t('33eaa7b290c34000a318')}
            <span className="value">
              {isNil(tokenPrice) ? '--' : <NumberFormat lang={currentLang}>{tokenPrice} {BASE_CURRENCY}</NumberFormat>}
            </span>
          </div>
          {/* 总计投入 */}
          <div className="reward-amount">
            {_t('2a645a8c4f1d4800a2d1')}
            <span className="value">
              {isNil(userSubAmount) ? '--' : <NumberFormat lang={currentLang}>{userSubAmount} {BASE_CURRENCY}</NumberFormat>}
            </span>
          </div>
           {/* 剩余投入  有剩余金额才显示*/}
          {show && <>
            <div className="reward-amount">
              {_t('4ad5f3b316c74000a6f9')}
              <span className="value">
                {isNil(userSubFailAmountTotal) ? '--' : <NumberFormat lang={currentLang}>{userSubFailAmountTotal} {BASE_CURRENCY}</NumberFormat>}
              </span>
            </div>
            <div className="tips">
              <LazyImg src={Warning} alt="Warning" className="mr-8" /> {_t('0b877884ffb74000aa06')}
            </div>
            </>
          }
          {!sm && <Footer campaignId={campaignId} />}
        </ContentWrapper>
      </StyledModal>
    </>
  );
};

export default SubscriptionResultModal;
