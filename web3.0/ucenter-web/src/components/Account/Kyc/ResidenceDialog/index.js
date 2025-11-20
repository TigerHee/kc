/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Button, useSnackbar, useTheme } from '@kux/mui';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tenantConfig } from 'src/config/tenant';
import { KYC_STATUS_ENUM } from 'src/constants/kyc/enums';
import { getResidenceList } from 'src/services/kyc';
import { _t } from 'src/tools/i18n';
import warnSrc from 'static/account/kyc/warn_green.svg';
import warnDarkSrc from 'static/account/kyc/warn_green_dark.svg';
import KycUnverified from './components/KycUnverified';
import KycVerified from './components/KycVerified';
import {
  DialogButtonGroup,
  DialogDesc,
  DialogIcon,
  DialogTitle,
  MigrateDialog,
} from './components/styled';

export default function ResidenceDialog({ open: originOpen, regionCode, shouldAlert, onCancel }) {
  const dispatch = useDispatch();
  const { message } = useSnackbar();
  const theme = useTheme();
  const { residenceConfig } = useSelector((state) => state.kyc ?? {});
  const { verifyStatus } = residenceConfig || {};

  const [result, setResult] = useState({
    status: KYC_STATUS_ENUM.UNVERIFIED,
    failReasonList: [],
    extraInfo: { lastResidenceRegion: '', unlockSeconds: 0, isLocking: false },
  });
  const [residenceList, setResidenceList] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const countries = useMemo(() => {
    return residenceList
      .filter((item) => item.siteType)
      .map((item) => ({
        label: item.regionName,
        value: item.regionCode,
        siteType: item.siteType,
      }));
  }, [residenceList]);

  const handleRefresh = async () => {
    try {
      const data = await dispatch({ type: 'kyc/pullKycResidence' });
      setResult(data);
    } catch (error) {
      console.error(error);
    }
  };
  const handlePullConfig = async () => {
    try {
      const data = await dispatch({ type: 'kyc/pullResidenceConfig' });
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  const handlePullResidenceList = async () => {
    try {
      const { data, success, msg } = await getResidenceList();
      if (!success) throw new Error(msg);
      setResidenceList(data || []);
    } catch (error) {
      console.error(error);
      message.error(error?.msg || error?.message);
    }
  };

  useEffect(() => {
    if (originOpen) {
      if (shouldAlert) {
        setAlertOpen(true);
      } else {
        setOpen(true);
      }
    } else {
      setAlertOpen(false);
      setOpen(false);
    }
  }, [originOpen, shouldAlert]);

  useEffect(() => {
    if (open) {
      handleRefresh();
      handlePullConfig();
      handlePullResidenceList();
    }
  }, [open]);

  return (
    <>
      {shouldAlert ? (
        <MigrateDialog open={alertOpen} header={null} footer={null} onCancel={() => onCancel}>
          <DialogIcon src={theme.currentTheme === 'dark' ? warnDarkSrc : warnSrc} />
          <DialogTitle>{_t('modal.title.notice')}</DialogTitle>
          <DialogDesc data-inspector="residence-update-desc">
            {_t('2f26574ae0694800a161', {
              Region: _t(tenantConfig.kyc.siteRegion),
            })}
          </DialogDesc>
          <DialogButtonGroup>
            <Button variant="outlined" onClick={onCancel}>
              {_t('cancel')}
            </Button>
            <Button
              onClick={() => {
                setAlertOpen(false);
                setOpen(true);
              }}
            >
              {_t('624d767436b54800a9d9')}
            </Button>
          </DialogButtonGroup>
        </MigrateDialog>
      ) : null}
      {
        // 有无 kyc (假失败也当成功) 是两套 ui
        verifyStatus === 1 || verifyStatus === 5 ? (
          <KycVerified
            result={result}
            countries={countries}
            open={open}
            onCancel={onCancel}
            onRefresh={handleRefresh}
            onPullConfig={handlePullConfig}
          />
        ) : (
          <KycUnverified
            result={result}
            countries={countries}
            open={open}
            regionCode={regionCode}
            onCancel={onCancel}
            onRefresh={handleRefresh}
            onPullConfig={handlePullConfig}
          />
        )
      }
    </>
  );
}
