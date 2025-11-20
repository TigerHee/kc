/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ComplianceDialog } from 'gbiz-next/kyc';
import { Button, useTheme } from '@kux/design';
import { HookIcon } from '@kux/iconpack';
import styles from './styles.module.scss';
import { _t } from '@/tools/i18n';
import { EU_KYC1_BENEFITS } from '@/constants/kyc/benefits';
import { KYC_CERT_ENUM, KYC_STATUS_ENUM } from '@/constants/kyc/enums';
import { useRef, useState } from 'react';
import BindDialog from 'src/components/Account/Kyc/KycHome/components/BindDialog';
import { useSelector, useDispatch } from 'react-redux';
import { ReactComponent as ErrorIcon } from 'static/account/kyc/kyc3/alert_error.svg';
import { ReactComponent as WarningIcon } from 'static/account/kyc/kyc3/alert_warning.svg';
import classNames from 'classnames';

const noop = () => {};

const CollectInfo = () => {
  return <>
    <div className={styles.divider} />
    <div>
      <div className={styles.desc}>{/** @todo */ 'We will collect'}</div>
      <ul className={styles.collectList}>
        <li>
          <span>{_t('8a5769cf4cc54800ae5b')}</span>
        </li>
        <li>
          <span>{_t('f9b43fd2ffdf4000a6c5')}</span>
        </li>
        <li>
          <span>{_t('20a114176fde4000a093')}</span>
        </li>
      </ul>
    </div>
  </>;
};

const OnGoing = () => {
  return <>
    <div className={styles.divider} />
    <div className={classNames(styles.resultWrapper, styles.warning)}>
      <div>
        <WarningIcon width={16} height={16} />
        <span>{_t('89e10ef029244000a384')}</span>
      </div>
      <div>{_t('917141689c944000ac18')}</div>
    </div>
  </>;
};

const Verifying = () => {
  return <>
    <div className={styles.divider} />
    <div className={classNames(styles.resultWrapper, styles.warning)}>
      <div>
        <WarningIcon width={16} height={16} />
        <span>{_t('aa73d295784f4000ac75')}</span>
      </div>
      <div>{_t('e998b03ef5b94000a0c3')}</div>
    </div>
  </>;
};

const Reviewing = () => {
  return <>
    <div className={styles.divider} />
    <div className={classNames(styles.resultWrapper, styles.warning)}>
      <div>
        <WarningIcon width={16} height={16} />
        <span>{/** @todo */ 'Reviewing'}</span>
      </div>
      <div>{_t('e998b03ef5b94000a0c3')}</div>
    </div>
  </>;
};

const Rejected = ({ failureReason = [] }: { failureReason: string[] }) => {
  return <>
    <div className={styles.divider} />
    <div className={classNames(styles.resultWrapper, styles.error)}>
      <div>
        <ErrorIcon width={16} height={16} />
        <span>{_t('1c06147f70d74800a0e2')}</span>
      </div>
      <div>
        {
          failureReason.map((reason, index) => {
            return <div key={reason}>{index + 1}. {reason}</div>;
          })
        }
      </div>
    </div>
  </>;
};

export default function BasicCertCard({ regionCode, identityType }: { regionCode: string, identityType: string }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [bindDialogOpen, setBindDialogOpen] = useState(false);
  const { emailValidate, phoneValidate } = useSelector((state: any) => state.user?.user ?? {});
  const [complianceType, setComplianceType] = useState<string | null>(null);
  const [complianceOpen, setComplianceOpen] = useState(false);
  const verifyCallbackRef = useRef(noop);
  const { basicResult, basicCraResult } = useSelector((state: any) => state.kyc_eu ?? {});
  const basicLoading = useSelector((state: any) => state.loading.effects['kyc_eu/pullBasicResult'] || state.loading.effects['kyc_eu/pullBasicCraStandardAlias'] || state.loading.effects['kyc_eu/cancelBasicCert']);
  const basicCraLoading = useSelector((state: any) => state.loading.effects['kyc_eu/pullBasicCraResult'] || state.loading.effects['kyc_eu/pullBasicCraStandardAlias'] || state.loading.effects['kyc_eu/cancelBasicCraCert']);

  const withVerify = (callback: () => Promise<string>) => async () => {
    if (!emailValidate || !phoneValidate) {
      setBindDialogOpen(true);
      return;
    }
    try {
      const standardAlias = await callback();
      if (standardAlias) {
        setComplianceType(standardAlias);
        setComplianceOpen(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return <div className={styles.container}>
    <div className={styles.unverifiedContent}>
      <div className={styles.unlocks}>
        <div>{_t('9524c661b3304000ab4c')}</div>
        <div>
          {
            EU_KYC1_BENEFITS().map((benefit) => (
              <div key={benefit}>
                <HookIcon size="small" />
                {benefit}
              </div>
            ))
          }
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.certWrapper}>
        <div className={styles.desc}>{_t('25aa644f1a0d4000ac7a')}</div>
        <div className={styles.certList}>
          <div className={styles.certItem}>
            <div className={styles.certHeader}>
              <div>1</div>
              <div>{/** @todo */ 'Identity Verification'}</div>
              {
                [KYC_STATUS_ENUM.UNVERIFIED, KYC_STATUS_ENUM.SUSPEND, KYC_STATUS_ENUM.REJECTED].includes(basicResult.status) ? (
                  <Button
                    size="small"
                    type="primary"
                    loading={basicLoading}
                    onClick={withVerify(() => {
                      verifyCallbackRef.current = () => dispatch({ type: 'kyc_eu/pullBasicResult' });
                      return dispatch({ type: 'kyc_eu/pullBasicStandardAlias', payload: {
                        type: KYC_CERT_ENUM.EU_BASIC_KYC,
                        extraInfo: {
                          region: regionCode,
                          identityType,
                        }
                      } }) as unknown as Promise<string>;
                    })}
                  >
                    {
                      basicResult.status === KYC_STATUS_ENUM.UNVERIFIED
                        ? /** @todo */ 'Start'
                        : basicResult.status === KYC_STATUS_ENUM.SUSPEND
                          ? /** @todo */ 'Continue'
                          : /** @todo */ 'Try Again'
                    }
                  </Button>
                ) : basicResult.status === KYC_STATUS_ENUM.VERIFIED ? (
                  <div className={styles.tag}>{/** @todo */ 'Verified'}</div>
                ) : null
              }
            </div>
            {
              basicResult.status === KYC_STATUS_ENUM.UNVERIFIED
                ? <CollectInfo />
                : basicResult.status === KYC_STATUS_ENUM.SUSPEND
                  ? <OnGoing />
                  : basicResult.status === KYC_STATUS_ENUM.VERIFYING
                    ? <Verifying />
                    : basicResult.status === KYC_STATUS_ENUM.REJECTED
                      ? <Rejected failureReason={basicResult.failReasonList || []} />
                      : null
            }
          </div>
          <div className={styles.certItem}>
            <div className={styles.certHeader}>
              <div>2</div>
              <div>
                {/** @todo */ 'Additional Questions'}
                <div className={styles.desc}>{/** @todo */ 'Please complete identity verification before starting this one.'}</div>
              </div>
              {
                [KYC_STATUS_ENUM.UNVERIFIED, KYC_STATUS_ENUM.SUSPEND, KYC_STATUS_ENUM.REJECTED].includes(basicCraResult.status)
                  ? (
                    <Button
                      size="small"
                      type="primary"
                      disabled={basicResult.status !== KYC_STATUS_ENUM.VERIFIED}
                      loading={basicCraLoading}
                      onClick={withVerify(() => {
                        verifyCallbackRef.current = () => dispatch({ type: 'kyc_eu/pullBasicCraResult' });
                        return dispatch({ type: 'kyc_eu/pullBasicCraStandardAlias', payload: {
                          type: KYC_CERT_ENUM.EU_BASIC_KYC_CRA,
                        } }) as unknown as Promise<string>;
                      })}
                    >
                      {
                        basicCraResult.status === KYC_STATUS_ENUM.UNVERIFIED
                          ? /** @todo */ 'Start'
                          : basicCraResult.status === KYC_STATUS_ENUM.SUSPEND
                            ? /** @todo */ 'Continue'
                            : /** @todo */ 'Try Again'
                      }
                    </Button>
                  )
                  : basicCraResult.status === KYC_STATUS_ENUM.VERIFIED ? (
                    <div className={styles.tag}>{/** @todo */ 'Reviewed'}</div>
                  ) : null
              }
            </div>
            {
              basicCraResult.status === KYC_STATUS_ENUM.SUSPEND
                ? <OnGoing />
                : basicCraResult.status === KYC_STATUS_ENUM.VERIFYING
                  ? <Reviewing />
                  : basicCraResult.status === KYC_STATUS_ENUM.REJECTED
                    ? <Rejected failureReason={basicCraResult.failReasonList || []} />
                    : null
            }
          </div>
        </div>
      </div>
    </div>
    <BindDialog open={bindDialogOpen} onCancel={() => setBindDialogOpen(false)} />
    <ComplianceDialog
      open={complianceOpen}
      onCancel={() => {
        setComplianceOpen(false);
        verifyCallbackRef.current();
        dispatch({ type: 'kyc/pullKycInfo' });
        verifyCallbackRef.current = noop;
      }}
      theme={theme}
      complianceType={complianceType}
    />
  </div>;
};
