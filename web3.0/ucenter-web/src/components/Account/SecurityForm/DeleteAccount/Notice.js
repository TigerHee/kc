/**
 * Owner: borden@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import remoteTools from '@kucoin-biz/tools';
import { useMultiSiteConfig } from '@kucoin-gbiz-next/hooks';
import { Alert, Box, Button, Checkbox, styled, useResponsive } from '@kux/mui';
import { map } from 'lodash';
import { Fragment, memo, useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t, _tHTML } from 'tools/i18n';
import { kcsensorsManualExpose, saTrackForBiz, trackClick } from 'utils/ga';
import { tips, warnings } from './config';
import { Context } from './index';

const { getTermId, getTermUrl } = remoteTools;
// --- 样式 start ---

const SubTitle = styled.h2`
  color: ${(props) => props.theme.colors.text};
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  margin-bottom: 0;
  line-height: 130%; /* 26px */
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;

const Desc = styled.div`
  color: ${(props) => props.theme.colors.text60};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
`;

const Tip = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 130%;
  padding-left: 14px;
  position: relative;
  color: ${(props) => props.theme.colors.text60};
  :not(:first-of-type) {
    margin-top: 14px;
  }
  [dir='rtl'] & {
    padding-right: 8px;
    padding-left: unset;
  }

  ::before {
    position: absolute;
    top: 9px;
    left: 0;
    width: 4px;
    height: 4px;
    background: ${(props) => props.theme.colors.text60};
    border-radius: 50%;
    content: ' ';
    [dir='rtl'] & {
      right: 0;
      left: unset;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    :not(:first-of-type) {
      margin-top: 6px;
    }
  }
`;

const StyledAlert = styled(Alert)`
  margin: 20px 0;
  border-radius: 8px;
  line-height: 200%;
  .KuxAlert-description {
    margin: 0;
  }
  .KuxAlert-icon {
    margin-top: 5px;
  }
`;

const WarnBox = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 14px;
  line-height: 200%;
  font-weight: 400;
`;

const Policy = styled.div`
  display: block;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${(props) => props.theme.colors.text60};
`;

const ExBox = styled(Box)`
  margin-top: 48px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 40px;
  }

  .KuxCheckbox-inner {
    background: none;
    border-color: ${(props) => props.theme.colors.text60};
  }
  .KuxCheckbox-checked {
    .KuxCheckbox-inner {
      background: ${(props) => props.theme.colors.text};
      border-color: ${(props) => props.theme.colors.text};
    }
  }
  [dir='rtl'] & {
    .KuxCheckbox-wrapper span {
      margin-right: unset;
      margin-left: 6px;
    }
  }
`;

// --- 样式 end ---

export default memo(() => {
  useLocale();
  const dispatch = useDispatch();
  const responsive = useResponsive();
  const isH5 = !responsive.sm;
  const { changeStep } = useContext(Context);

  const loading = useSelector(
    (state) => state.loading.effects['account_security/queryCancellationOverview'],
  );
  // 勾选已读须知
  const [checked, setChecked] = useState(false);
  const { multiSiteConfig } = useMultiSiteConfig();

  useEffect(() => {
    trackClick(['oneStepNextButton', '1']);
    kcsensorsManualExpose(['Statement', '1']);
  }, []);

  const handleSubmit = useCallback(() => {
    saTrackForBiz({}, ['oneStepNextButton', '1']);
    trackClick(['Statement', 'Confirm']);
    dispatch({
      type: 'account_security/queryCancellationOverview',
    }).then((res) => {
      if (changeStep) changeStep(res?.data?.canCancellation ? 'reason' : 'accountInfo');
    });
  }, [changeStep]);

  return (
    <Fragment>
      <Box as="section">
        <Desc>{_t('eTotV6VTT16J45f7tHeRaU')}</Desc>
        <Box style={{ height: isH5 ? '24px' : '40px' }} />
        <SubTitle>{_t('3f93ffe3238d4000ae3c')}</SubTitle>
        <Box style={{ height: isH5 ? '8px' : '24px' }} />
        {map(tips, (item) => {
          return <Tip key={item}>{_t(item)}</Tip>;
        })}
      </Box>
      <StyledAlert
        showIcon
        type="warning"
        description={
          <WarnBox
            onClick={(e) => {
              // 检查点击的是否是 a 标签
              if (e.target && e.target.tagName === 'A') {
                kcsensorsManualExpose(['Statement', 'ContactSupport']);
              }
            }}
          >
            {map(warnings, (item, index) => {
              return (
                <div key={item}>
                  {index + 1}. {_tHTML(item, { a: '/support' })}
                </div>
              );
            })}
          </WarnBox>
        }
      />
      <Policy
        onClick={() => {
          trackClick(['Statement', 'PrivacyPolicy']);
        }}
      >
        <span>{_t('3S7ix7cpvuZUqVvLb2yvV4')}</span>
        &nbsp;
        <span>
          {_tHTML('2a193069b91c4000a107', {
            url: getTermUrl(getTermId('privacyUserTerm', multiSiteConfig?.termConfig)),
          })}
        </span>
      </Policy>
      <ExBox display="flex" flexDirection="column">
        <Box marginBottom={24}>
          <Checkbox
            data-inspector="deleteAccount_agree"
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
              if (e.target.checked) {
                trackClick(['Statement', 'Checkbox']);
              }
            }}
          >
            {_t('vBAmDYxehhAufKqcsSf1Yc')}
          </Checkbox>
        </Box>
        <Button
          data-inspector="deleteAccount_next"
          loading={loading}
          size="large"
          disabled={!checked}
          onClick={handleSubmit}
        >
          {_t('account.del.title')}
        </Button>
      </ExBox>
    </Fragment>
  );
});
