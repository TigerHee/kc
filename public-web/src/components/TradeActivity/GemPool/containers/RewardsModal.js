/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import {
  Button,
  Divider,
  NumberFormat,
  styled,
  Tab,
  Tabs,
  useResponsive,
  useSnackbar,
} from '@kux/mui';
import { numberFormat } from '@kux/mui/utils';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import Modal from '../../ActivityCommon/Modal';

const CotentWrapper = styled.div`
  padding: ${({ isMulti }) => (isMulti ? '0 0 24px' : '16px 0 24px')};
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: ${({ isMulti }) => (isMulti ? '0 0 40px' : '16px 0 40px')};
  }
`;
const ContentContainer = styled.div`
  .KuxDivider-root {
    margin: 24px 0;
  }
`;
const TabWrapper = styled(Tabs)`
  margin-bottom: 24px;
`;
const SymbolWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  justify-content: center;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};

  img {
    width: 32px;
    height: 32px;
    margin-right: 10px;
    object-fit: cover;
    border-radius: 32px;
  }
`;
const DataWrapper = styled.div`
  margin: 24px 0;

  .total {
    margin-bottom: 8px;
    color: ${(props) => props.theme.colors.textPrimary};
    font-weight: 600;
    font-size: 32px;
    font-style: normal;
    line-height: 130%;
    text-align: center;
  }

  .detail {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;

    .value {
      margin-left: 4px;
      color: ${(props) => props.theme.colors.text};
    }
    .divider {
      margin: 0 4px;
    }
  }

  ${(props) => props.theme.breakpoints.up('sm')} {
    margin: 32px 0;
    font-size: 36px;
  }
`;
const ClaimedWrapper = styled.div`
  .label {
    margin-bottom: 12px;
    color: ${(props) => props.theme.colors.text60};
    font-weight: 500;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
  }
  .value {
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: ${(props) => props.theme.colors.text};
    font-weight: 600;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
    .claimedSymbol {
      display: flex;
      align-items: center;
      margin-right: 16px;
      img {
        width: 24px;
        height: 24px;
        margin-right: 10px;
        object-fit: cover;
        border-radius: 24px;
      }
    }
    .claimedValue {
    }
  }
`;

const ButtonWrapper = styled.div`
  padding: 0;
  .desc {
    margin-top: 12px;
    color: ${(props) => props.theme.colors.text40};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 130%;
    text-align: center;
  }
`;

const emptyObj = {};

const Content = memo((item) => {
  const { currentLang } = useLocale();
  const dispatch = useDispatch();
  const { sm } = useResponsive();
  const { message } = useSnackbar();

  const { campaignId, earnTokenName, earnTokenLogo, claimedRewards, unclaimedRewards, pools } =
    item || {};

  const loading = useSelector((state) => state.loading.effects['gempool/postGemPoolRewards']);

  const handleConfirm = useCallback(() => {
    trackClick(['ProjectDetail', 'gempoolReceiveaward'], {
      amount: unclaimedRewards,
      currency: earnTokenName,
    });
    dispatch({
      type: 'gempool/postGemPoolRewards',
      payload: {
        campaignId,
      },
    }).then((res) => {
      if (res) {
        message.success(_t('2e68b5750b804000a958'));
      }
    });
  }, [dispatch, campaignId, message, unclaimedRewards, earnTokenName]);

  return (
    <ContentContainer>
      <SymbolWrapper>
        <img src={earnTokenLogo} alt="logo" />
        <span>{earnTokenName}</span>
      </SymbolWrapper>
      <DataWrapper>
        <div className="total">
          <NumberFormat lang={currentLang} isPositive={+unclaimedRewards > 0}>
            {unclaimedRewards || '0'}
          </NumberFormat>
        </div>
        <div className="detail">
          (
          {pools?.map((pool, index) => {
            return (
              <>
                {index !== 0 ? <span className="divider">+</span> : ''}
                <span>{`${_t('6c7d61047a164000a18b', {
                  currency: pool?.stakingToken,
                })}:`}</span>
                <span className="value">
                  {numberFormat({
                    number: pool?.poolUnclaimedRewards || '0',
                    lang: currentLang,
                  })}
                </span>
              </>
            );
          })}
          )
        </div>
      </DataWrapper>
      <ButtonWrapper>
        <Button
          fullWidth
          disabled={!+unclaimedRewards}
          size="large"
          onClick={handleConfirm}
          loading={loading}
        >
          {_t('d8d42c2099f44000a9e0')}
        </Button>
        {sm && (
          <div className="desc">{_t('c4aeff8e956f4000aff2', { currency: earnTokenName })}</div>
        )}
      </ButtonWrapper>
      <Divider />
      <ClaimedWrapper>
        <div className="label">{_t('d8c1c4a187d74000aa44', { currency: earnTokenName })}</div>
        <div className="value">
          <div className="claimedSymbol">
            <img src={earnTokenLogo} alt="logo" />
            <span>{earnTokenName}</span>
          </div>
          <div className="claimedValue">
            <NumberFormat lang={currentLang} isPositive={+claimedRewards > 0}>
              {claimedRewards || '0'}
            </NumberFormat>
          </div>
        </div>
      </ClaimedWrapper>
    </ContentContainer>
  );
});

const RewardsModal = () => {
  const { isRTL } = useLocale();
  const dispatch = useDispatch();
  const [tabkey, setTabkey] = useState(0);

  const unclaimedCampaigns = useSelector((state) => state.gempool.unclaimedCampaigns, shallowEqual);
  const rewardsModal = useSelector((state) => state.gempool.rewardsModal);

  useEffect(() => {
    // 打开弹框后重新拉取待领取奖励数据
    if (rewardsModal) {
      dispatch({
        type: 'gempool/pullGemPoolUnclaimedRewards',
      });
    }
  }, [rewardsModal, dispatch]);

  const handleClose = useCallback(() => {
    dispatch({
      type: 'gempool/update',
      payload: {
        rewardsModal: false,
      },
    });
    // 关闭弹框重新拉取数量
    dispatch({
      type: 'gempool/pullGemPoolUnclaimedRewardsNum',
    });
  }, [dispatch]);

  const handleTypeChange = useCallback((event, value) => {
    setTabkey(value);
  }, []);

  const contentItem = useMemo(() => {
    if (unclaimedCampaigns && unclaimedCampaigns[tabkey]) {
      return unclaimedCampaigns[tabkey];
    }
    return emptyObj;
  }, [unclaimedCampaigns, tabkey]);

  return (
    <Modal open={rewardsModal} onClose={handleClose} title={_t('60f24e61b4db4000a631')}>
      <CotentWrapper isMulti={unclaimedCampaigns?.length > 1}>
        {unclaimedCampaigns?.length > 1 && (
          <TabWrapper
            value={tabkey}
            onChange={handleTypeChange}
            variant="line"
            showScrollButtons={false}
            size="medium"
            direction={isRTL ? 'rtl' : 'ltr'}
          >
            {unclaimedCampaigns?.map((item, index) => {
              return <Tab label={item?.earnTokenName} value={index} key={item?.campaignId} />;
            })}
          </TabWrapper>
        )}

        <Content {...contentItem} />
      </CotentWrapper>
    </Modal>
  );
};

export default RewardsModal;
