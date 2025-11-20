/**
 * Owner: tiger@kupotech.com
 * 绑定交易团队
 */

import { currentLang } from '@kucoin-base/i18n';
import { Captcha } from '@kucoin-biz/captcha';
import remoteTools from '@kucoin-biz/tools';
import { useMultiSiteConfig } from '@kucoin-gbiz-next/hooks';
import { Checkbox, css, Dialog, Form, Input, Steps, styled, Switch, useSnackbar } from '@kux/mui';
import classnames from 'classnames';
import SecForm from 'components/NewCommonSecurity';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { bindHostedSubAccount, getTradeTeamInfoEmail } from 'services/account';
import { _t } from 'tools/i18n';
import storage from 'utils/storage';
import { FUTURE_AGREEMENT, HOSTED_AGREEMENT, MARGIN_AGREEMENT } from './agreement';
import { TRADE_TYPE_FUTURE, TRADE_TYPE_MARGIN } from './config';

const { getTermId, getTermUrl } = remoteTools;

const StyledDialog = styled(Dialog)`
  .KuxModalFooter-buttonWrapper {
    display: ${(props) => (props.curStep === 2 ? 'none' : 'flex')};
  }

  .KuxInput-label {
    div {
      max-width: 200px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .KuxInput-focus {
    .KuxInput-label {
      div {
        width: 100%;
        max-width: 100%;
        overflow: hidden;
      }
    }
  }
`;

const BindHostedMain = styled.div`
  .KuxStep-title {
    margin-top: 12px;
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 400;
    font-size: 12px;
    font-style: normal;
    line-height: 12px;
    text-align: center;
  }

  .KuxCheckbox-wrapper {
    color: ${({ theme }) => theme.colors.text};
  }

  .beautyScroll {
    &:first-of-type {
      margin-right: 12px;
    }
    &::-webkit-scrollbar {
      width: 8px;
      background-color: ${({ theme }) => theme.colors.background};
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${({ theme }) => theme.colors.icon40};
      border-radius: 4px;
    }

    &::-webkit-scrollbar-track {
      background-color: ${({ theme }) => theme.colors.background};
      border-radius: 4px;
    }
  }
`;
const StepContent = styled.section`
  padding-top: 28px;
  &.stepContent2 {
    padding-top: 13px;
  }
  .KuxCheckbox-group {
    display: flex;
    justify-content: space-between;
    .KuxCheckbox-wrapper {
      display: flex;
      flex: 1;
      align-items: center;
      &:first-of-type {
        margin-right: 12px;
      }
      .KuxCheckbox-checkbox {
        top: 0;
      }
    }
  }
`;
const TipsBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px 0;
`;
const Tips = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  flex: 1;
  white-space: normal;
  word-break: break-word;
  margin-right: 12px;
  min-width: 40px;
  &.error {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;
const DiscoverTrans = styled.div`
  display: flex;
  align-items: center;
`;
const DiscoverTransLabel = styled.span`
  color: ${({ theme }) => theme.colors.text60};
  margin-right: 8px;
`;
const Protocol = styled.div`
  padding: 12px;
  width: 100%;
  max-height: 286px;
  overflow-y: auto;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.background};
`;
const TradeAgreementBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  div {
    margin-bottom: 6px;
  }
`;
const TradeAgreementItem = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.cover2};
  border: 0.5px solid ${({ theme }) => theme.colors.divider8};
  border-radius: 12px;
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text30};
  height: 230px;
  &:first-of-type {
    margin-right: 12px;
  }
`;
const TradeOption = styled.div``;

const { Step } = Steps;
const { useForm } = Form;

const bizType = 'HOSTED_SUB_BIND_TRADE';
// const captchaBizType = 'FORGOT_PASSWORD';
const captchaBizType = 'HOSTED_APPLY_UID';

const tradeOptions = [
  {
    label: <TradeOption>{_t('pqPAVnph8dBRksv2sLAyte')}</TradeOption>,
    value: TRADE_TYPE_MARGIN,
    agreement: (
      <>
        {MARGIN_AGREEMENT.map((i) => (
          <div key={i}>{i}</div>
        ))}
      </>
    ),
  },
  {
    label: <TradeOption>{_t('vJKKPUP1hn11P4p8MhG7dM')}</TradeOption>,
    value: TRADE_TYPE_FUTURE,
    agreement: FUTURE_AGREEMENT,
  },
];

export default ({ open, onCancel, curItem, dispatchWrapper }) => {
  const { message } = useSnackbar();
  const [form] = useForm();
  // 当前步骤
  const [curStep, setCurStep] = useState(0);
  // 输入的UID
  const [uidVal, setUidVal] = useState('');
  // 交易团队信息
  const [tradeTeamInfo, setTradeTeamInfo] = useState({});
  // 是否披露交易记录
  const [isOpenTransRecord, setOpenTransRecord] = useState(storage.getItem('isOpenTransRecord'));
  // 是否同意协议
  const [accept, setAccept] = useState(false);
  // 安全校验类型
  const [verifyType, setVerifyType] = useState('');
  // ok按钮loading
  const [isConfirmLoading, setConfirmLoading] = useState(false);
  // 人机校验是否展示
  const [isCaptchaOpen, setCaptchaOpen] = useState(false);
  // 交易团队信息是否加载中
  const [isTradeTeamInfoLoading, setTradeTeamInfoLoading] = useState(false);
  // 交易权限
  const [tradeType, setTradeType] = useState(tradeOptions.map((i) => i.value));

  const { multiSiteConfig } = useMultiSiteConfig();

  // 获取交易团队信息
  const onGetTradeTeamInfo = useCallback(
    debounce(async (uid) => {
      setTradeTeamInfo({});
      setTradeTeamInfoLoading(true);

      getTradeTeamInfoEmail({ uid })
        .then((res) => {
          setTradeTeamInfo({
            errMsg: '',
            data: res?.data,
          });
        })
        .catch((err) => {
          // 冻结的uid 93548
          if (err && err.code === '40011') {
            setCaptchaOpen(true);
            return;
          }
          setTradeTeamInfo({
            errMsg: err?.msg,
          });
        })
        .finally(() => setTradeTeamInfoLoading(false));
    }, 800),
    [],
  );

  useEffect(() => {
    if (uidVal) {
      onGetTradeTeamInfo(uidVal);
    } else {
      setTradeTeamInfo({});
    }
  }, [uidVal, onGetTradeTeamInfo]);

  const onOk = async () => {
    if (curStep === 0) {
      setCurStep(curStep + 1);
    }

    if (curStep === 1) {
      const verifyTypeVal = await dispatchWrapper(
        'get_verify_type',
        {
          bizType,
        },
        {},
        'security_new',
      );
      setVerifyType(verifyTypeVal);
      setCurStep(curStep + 1);
    }

    if (curStep === 2) {
      setCurStep(curStep + 1);
    }

    if (curStep === 3) {
      const { uid } = curItem;
      setConfirmLoading(true);
      bindHostedSubAccount({
        subUid: uid,
        hostedUid: Number(uidVal),
        openMargin: tradeType.includes(TRADE_TYPE_MARGIN),
        openFutures: tradeType.includes(TRADE_TYPE_FUTURE),
        riskVersion: 1.0,
        userVersion: 1.0,
        recordSwitch: isOpenTransRecord ? 1 : 0,
      })
        .then((res) => {
          message.success(_t('convert.order.status.success'));
          dispatchWrapper('getAccountList', {
            refreshAmount: true,
          });
          onCancel();
        })
        .catch((err) => {
          err?.msg && message.error(err?.msg);
          onCancel();
        })
        .finally(() => {
          setConfirmLoading(false);
        });
    }
  };

  // ok按钮是否禁用
  const isOkDisabled = useMemo(() => {
    if (curStep === 0) {
      if (!uidVal || tradeTeamInfo?.errMsg) {
        return true;
      }
      if (!tradeTeamInfo?.data || tradeTeamInfo?.data === '-') {
        return true;
      }
    }

    if (curStep === 1 && !accept) {
      return true;
    }

    return false;
  }, [curStep, accept, uidVal, tradeTeamInfo]);

  // ok按钮文案
  const okText = useMemo(() => {
    if (curStep === 1) {
      return _t('7mzuKLoTFaxqbvdacfbGRd');
    }
    if (curStep === 3) {
      return _t('done');
    }
    return _t('iECAJ24wQyPUCR8nUqw6Kp');
  }, [curStep]);

  const bindAgreement = HOSTED_AGREEMENT[['zh_CN', 'zh_HK'].includes(currentLang) ? 'zh' : 'en'](
    getTermUrl(getTermId('agreementTerm', multiSiteConfig?.termConfig)),
  );

  return (
    <StyledDialog
      curStep={curStep}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      style={{ margin: 24 }}
      title={_t('krCDftXKbTcazuiccudW5t')}
      cancelText={_t('jcrNiqR1ykWLB4AZF9igRS')}
      okText={okText}
      cancelButtonProps={{
        style: { display: curStep === 1 ? 'flex' : 'none' },
        onClick: () => setCurStep(0),
      }}
      okButtonProps={{
        className:
          curStep === 2
            ? css`
                display: none;
              `
            : '',
        disabled: isOkDisabled,
        loading: isTradeTeamInfoLoading || isConfirmLoading,
      }}
    >
      <BindHostedMain>
        <Steps current={curStep} size="small" labelPlacement="vertical">
          <Step title={_t('iFtjfD7LgcXQo8J9zpH77B')} />
          <Step title={_t('o6YFcXV93garDE5s8pEv5b')} />
          <Step title={_t('security.verify')} />
          <Step title={_t('w9MYXUzReNi4CoxQ6jck4N')} />
        </Steps>
        {/* 第一步 */}
        {curStep === 0 && (
          <StepContent>
            <Input
              value={uidVal}
              onChange={(e) => setUidVal(e.target.value)}
              placeholder={_t('4YrGzQsYpAiwog7N4kwAjt')}
              allowClear
            />
            <TipsBox>
              <Tips
                className={classnames({
                  error: tradeTeamInfo?.errMsg,
                })}
              >
                {tradeTeamInfo?.errMsg || tradeTeamInfo?.data || ''}
              </Tips>
              <DiscoverTrans>
                <DiscoverTransLabel>{_t('cEfNTnTNsASEheQWMSxdaZ')}</DiscoverTransLabel>
                <Switch
                  checked={isOpenTransRecord}
                  onChange={(v) => {
                    setOpenTransRecord(v);
                    storage.setItem('isOpenTransRecord', v);
                  }}
                />
              </DiscoverTrans>
            </TipsBox>
          </StepContent>
        )}

        {/* 第二步 */}
        {curStep === 1 && (
          <StepContent
            className={classnames({
              stepContent2: true,
            })}
          >
            <Protocol className="beautyScroll">
              {bindAgreement.map((i) => (
                <div key={i}>{i}</div>
              ))}
            </Protocol>
            <Checkbox checked={accept} onChange={(e) => setAccept(e?.target?.checked)}>
              {_t('r5VpcZ6stph6ca9aA4Hzav')}
            </Checkbox>
          </StepContent>
        )}

        {/* 第三步 */}
        {curStep === 2 && (
          <StepContent
            className={classnames({
              stepContent2: true,
            })}
          >
            <Form form={form}>
              <SecForm
                autoSubmit
                form={form}
                allowTypes={verifyType}
                bizType={bizType}
                // modalLabelPre={`${_t('master.account')} - `}
                customKeyValue={{
                  google_2fa: _t('g2fa.code'),
                }}
                submitBtnTxt={_t('confirm')}
                confirmLoading={isConfirmLoading}
                callback={(res) => {
                  if (res?.success) {
                    onOk();
                  } else {
                    res?.msg && message.error(res?.msg);
                  }
                }}
              />
            </Form>
          </StepContent>
        )}

        {curStep === 3 && (
          <StepContent>
            <TradeAgreementBox>
              {tradeOptions.map((i) => (
                <TradeAgreementItem className="beautyScroll" key={i.value}>
                  {i.agreement}
                </TradeAgreementItem>
              ))}
            </TradeAgreementBox>

            <Checkbox.Group value={tradeType} onChange={setTradeType} options={tradeOptions} />
          </StepContent>
        )}

        <Captcha
          open={isCaptchaOpen}
          onClose={() => setCaptchaOpen(false)}
          bizType={captchaBizType}
          onValidateSuccess={() => onGetTradeTeamInfo(uidVal)}
        />
      </BindHostedMain>
    </StyledDialog>
  );
};
