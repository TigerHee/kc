/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ComplianceDialog } from '@kucoin-gbiz-next/kyc';
import { ErrorOutlined, ICArrowUpOutlined } from '@kux/icons';
import { Button, Select, Tooltip, useResponsive, useSnackbar, useTheme } from '@kux/mui';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import { _t } from 'src/tools/i18n';
import getSiteName from 'src/utils/getSiteName';
import getSource from 'src/utils/getSource';
import { push } from 'src/utils/router';
import FailureReason from '../../KycHome/FailureReason';
import ResponsiveDialog from './ResponsiveDialog';
import { ChangeResidence, Content, CurResidence, Desc, Footer, Title } from './styled';

export default function KycVerified({
  result,
  countries,
  regionCode: originRegionCode,
  open,
  onCancel,
  onRefresh,
  onPullConfig,
}) {
  const { residenceConfig } = useSelector((state) => state.kyc ?? {});
  const dispatch = useDispatch();
  const theme = useTheme();
  const { message } = useSnackbar();
  const rv = useResponsive();

  const { isMigrateNow } = residenceConfig;
  const isVerifying = result.status === KYC_STATUS_ENUM.VERIFYING;
  const isRejected = result.status === KYC_STATUS_ENUM.REJECTED;
  const isH5 = !rv?.sm;
  const size = isH5 ? 'large' : 'basic';

  const [regionCode, setRegionCode] = useState(originRegionCode);
  const [complianceDialogOpen, setComplianceDialogOpen] = useState(false);
  const [complianceType, setComplianceType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (isVerifying) {
      onCancel();
      return;
    }
    try {
      setLoading(true);
      if (result.status === KYC_STATUS_ENUM.SUSPEND) {
        // 前一次认证还没结束时，需要重置
        await dispatch({ type: 'kyc/restartKycResidence' });
      }
      const { standardAlias } = await dispatch({
        type: 'kyc/postKycResidence',
        source: getSource(isH5),
        payload: { regionCode },
      });
      setComplianceType(standardAlias);
      setComplianceDialogOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (showMessage) => {
    showMessage && message.info(_t('38562820ab774000acac'));
    onRefresh();
    onPullConfig();
    setComplianceDialogOpen(false);
  };

  useEffect(() => {
    if (!open) {
      setComplianceDialogOpen(false);
    }
  }, [open]);

  useEffect(() => {
    if (result.extraInfo?.lastResidenceRegion) {
      setRegionCode(result.extraInfo.lastResidenceRegion);
    }
  }, [result]);

  return (
    <>
      <ResponsiveDialog
        open={open}
        title={_t('624d767436b54800a9d9')}
        footer={
          <Footer>
            {isMigrateNow ? (
              <Button size={size} onClick={() => push('/account/transfer')}>
                <span>{_t('34b9def8544a4800a99b')}</span>
              </Button>
            ) : (
              <Button
                size={size}
                disabled={!regionCode || isVerifying}
                loading={loading}
                onClick={handleSubmit}
              >
                {isRejected ? (
                  <span>{_t('b4c0cd8052fe4800af35')}</span>
                ) : (
                  <span>{_t('9c061821d8a44800af7f')}</span>
                )}
              </Button>
            )}
          </Footer>
        }
        onCancel={onCancel}
      >
        <Content>
          <CurResidence>
            <p>{_t('80844e1282694800a89d')}</p>
            <p>{residenceConfig?.residenceRegionName}</p>
          </CurResidence>
          <ChangeResidence>
            <Title>{_t('297aa0ec11a84000ad6f')}</Title>
            <Select
              size="xlarge"
              placeholder={_t('454ba7febb3e4800a123')}
              options={countries}
              value={regionCode}
              onChange={setRegionCode}
              disabled={isMigrateNow || isVerifying}
              dropdownIcon={<ICArrowUpOutlined size={20} />}
            />
            {isRejected ? (
              <Desc error>
                <ErrorOutlined size={16} />
                {_t('602e8dc569fc4000a94c')}
                <Tooltip title={<FailureReason failureReasonLists={result.failReasonList} />}>
                  <u>{_t('c7541c19adb54800a447')}</u>
                </Tooltip>
              </Desc>
            ) : null}
            {isVerifying ? (
              <Desc warn>{_t('df4025e353c94800a554')}</Desc>
            ) : isMigrateNow ? (
              <Desc warn>
                {_t('07c2e8bcf3204000a92b', {
                  targetSiteName: getSiteName(result.extraInfo?.lastResidenceRegionSiteType),
                })}
              </Desc>
            ) : null}
          </ChangeResidence>
        </Content>
      </ResponsiveDialog>
      <ComplianceDialog
        open={complianceDialogOpen}
        onCancel={() => handleSuccess(false)}
        onOk={() => handleSuccess(true)}
        theme={theme.currentTheme}
        complianceType={complianceType}
      />
    </>
  );
}
