/**
 * Owner: borden@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Box, Button, Checkbox, keyframes, Spin, styled } from '@kux/mui';
import { numberFormat } from '@kux/mui/utils';
import { throttle } from 'lodash';
import { memo, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { relinquishAssetsAagrement } from 'services/security';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { kcsensorsManualExpose, saTrackForBiz, trackClick } from 'utils/ga';
import { windowOpen } from '../config';
import { Context } from '../index';

import refreshSvg from 'static/account/refresh.svg';

const ButtonCommonProps = {
  className: 'delete-account-button',
  size: 'small',
  variant: 'outlined',
  style: { position: 'relative' },
};
// --- 样式 start ---
const circle = keyframes`
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
`;
const AlignCenter = styled.div`
  display: flex;
  align-items: center;
`;
const SpaceBetween = styled(AlignCenter)`
  justify-content: space-between;
`;
const Title = styled.h2`
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0;
  font-size: 36px;
  /* KuFox Sans/36px/Bold */
  font-family: 'KuFox Sans';
  font-style: normal;
  font-weight: 700;
  line-height: 140%; /* 33.6px */
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
  }
`;
const SubTitle = styled.div`
  color: ${(props) => props.theme.colors.text40};
  margin-top: 12px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 8px;
  }
`;
const RefreshButton = styled(AlignCenter)`
  opacity: ${(props) => (props.loading === 'true' ? 0.4 : 1)};
  cursor: ${(props) => (props.loading === 'true' ? 'default' : 'pointer')};
  img {
    width: 16px;
    height: 16px;
    animation: ${circle} infinite 1s linear;
    animation-play-state: ${(props) => (props.loading === 'true' ? 'running' : 'paused')};
  }
  span {
    margin-left: 4px;
    color: ${(props) => props.theme.colors.text60};
    font-weight: 400;
    font-size: 14px;
    font-family: 'KuFox Sans';
    font-style: normal;
    line-height: 140%; /* 19.6px */
    [dir='rtl'] & {
      margin-right: 4px;
      margin-left: unset;
    }
  }
`;
const Wrapper = styled.section`
  margin-top: 40px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 24px;
  }
`;
const PanelContent = styled(SpaceBetween)`
  padding: 32px 28px;
  margin-top: 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 22px;
  flex-flow: no-wrap;
  ${(props) => (props.hide ? 'display: none;' : '')}
  color: ${(props) => props.theme.colors.text};
  background: ${(props) => props.theme.colors.overlay};
  border: 1px solid;
  border-color: ${(props) => props.theme.colors.cover8};

  .account-info-text {
    width: 424px;
    margin-right: 20px;
    font-weight: 400;
    font-size: 16px;
    font-family: 'KuFox Sans';
    font-style: normal;
    line-height: 140%;
  }

  .delete-account-button {
    padding: 7.5px 16px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 700;
    font-size: 12px;
    font-family: 'KuFox Sans';
    font-style: normal;
    line-height: 140%;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-flow: wrap;
    padding: 20px 16px;
    .account-info-text {
      width: 100%;
      margin-right: 0;
      margin-bottom: 12px;
    }
  }
`;
const RiskDesc = styled.div`
  margin-top: 8px;
  margin-bottom: 24px;
  padding-left: 20px;
  color: ${(props) => props.theme.colors.text60};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 140%; /* 16.8px */
`;
const Operate = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  .KuxCheckbox-wrapper {
    & > span {
      &:last-child {
        margin-left: 4px;
      }
    }
  }
  .KuxCheckbox-inner {
    background: none;
  }
  .KuxCheckbox-checked {
    .KuxCheckbox-inner {
      background: ${(props) => props.theme.colors.text};
      border-color: ${(props) => props.theme.colors.text};
    }
  }

  .delete-account-checkbox-text {
    color: ${(props) => props.theme.colors.text};
    font-weight: 400;
    font-size: 14px;
    font-style: normal;
    line-height: 140%; /* 19.6px */
  }
`;

// --- 样式 end ---

export default memo(() => {
  const { currentLang } = useLocale();
  const dispatch = useDispatch();
  const { changeStep } = useContext(Context);

  const { cancellationOverview } = useSelector((state) => state.account_security);
  const loading = useSelector(
    (state) => state.loading.effects['account_security/queryCancellationOverview'],
  );

  const { canGiveUp, totalAmount, bizErrorList = [] } = cancellationOverview;

  // 勾选放弃资产
  const [checked, setChecked] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const refresh = () =>
    throttle(
      () => {
        trackClick(['refresh', '1']);
        dispatch({
          type: 'account_security/queryCancellationOverview',
        });
      },
      5000,
      { leading: true },
    );

  const handleSubmit = () => {
    trackClick(['twoStepNextButton', '1']);
    kcsensorsManualExpose(['UnableDelete', 'Confirm']);
    setConfirmLoading(true);
    relinquishAssetsAagrement()
      .then((res) => {
        if (res?.success && changeStep) changeStep('reason');
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };

  useEffect(() => {
    kcsensorsManualExpose(['UnableDelete', '1']);
    saTrackForBiz({}, ['refresh', '1']);

    // 不可注销原因：【总资产待结清】曝光
    if (totalAmount) {
      kcsensorsManualExpose(['UnableDelete', 'TotalAssets']);
    }
    // 不可注销原因 后端接口下发code
    bizErrorList.forEach((item) => {
      kcsensorsManualExpose(['UnableDelete', item.code]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 【放弃资产协议】曝光
    if (canGiveUp) {
      kcsensorsManualExpose(['UnableDelete', 'AssetAbandon']);
    }
  }, [canGiveUp]);

  return (
    <div>
      <div>
        <SpaceBetween>
          <Title>{_t('pkKr1BncmUxPtiQ37HaH7f')}</Title>
          <RefreshButton loading={`${loading}`} onClick={refresh}>
            <img src={refreshSvg} alt="refresh-icon" />
            <span>{_t('8Bm1LMJGquUmbFBUNAuGsh')}</span>
          </RefreshButton>
        </SpaceBetween>
        <SubTitle>{_t('eu6ci2veUJVGbu3UFtcxkH')}</SubTitle>
      </div>
      <Spin spinning={!!loading}>
        <Wrapper>
          <Box display={totalAmount > 0 ? 'block' : 'none'}>
            <PanelContent>
              <div className="account-info-text">
                {_t('2492bcfd2cb04800a656', {
                  account: numberFormat({
                    lang: currentLang || window._DEFAULT_LANG_,
                    number: totalAmount,
                  }),
                })}
              </div>
              <Button
                {...ButtonCommonProps}
                onClick={() => {
                  trackClick(['UnableDelete', 'TotalAssets']);
                  windowOpen('/assets/withdraw', ['UnableDelete', 'TotalAssets']);
                }}
              >
                {_t('ed4cd4b467924000ae77')}
              </Button>
            </PanelContent>
          </Box>
          {bizErrorList.map((item) => {
            return (
              <Box key={item.code}>
                <PanelContent>
                  <div className="account-info-text">{item.desc}</div>
                  {item.webUrl && (
                    <Button
                      {...ButtonCommonProps}
                      onClick={() => {
                        trackClick(['UnableDelete', item.code]);
                        windowOpen(item.webUrl, ['UnableDelete', item.code]);
                      }}
                    >
                      {_t('81ce1c7d99c34800ad86')}
                    </Button>
                  )}
                </PanelContent>
              </Box>
            );
          })}
        </Wrapper>
      </Spin>
      {!!canGiveUp && (
        <Operate>
          <Checkbox
            data-inspector="deleteAccount_agree2"
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
              if (e.target.checked) {
                trackClick(['UnableDelete', 'Checkbox']);
              }
            }}
          >
            <span className="delete-account-checkbox-text">{_t('vWRKmnSxPhKxJFrLM7WvCX')}</span>
          </Checkbox>
          <RiskDesc>{_t('qQYGvhVuHGQH8B8QPa8MBT', { a: totalAmount, b: 'USD' })}</RiskDesc>
          <Button
            data-inspector="deleteAccount_next"
            disabled={!checked}
            onClick={handleSubmit}
            size="large"
            loading={confirmLoading}
          >
            {_t('account.del.title')}
          </Button>
        </Operate>
      )}
    </div>
  );
});
