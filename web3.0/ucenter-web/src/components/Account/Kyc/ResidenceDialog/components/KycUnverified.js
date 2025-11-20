/**
 * Owner: vijay.zhou@kupotech.com
 */
import { ICArrowUpOutlined } from '@kux/icons';
import { Button, Select, useResponsive, useSnackbar, useTheme } from '@kux/mui';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _t } from 'src/tools/i18n';
import getSiteName from 'src/utils/getSiteName';
import getSource from 'src/utils/getSource';
import { push } from 'src/utils/router';
import warnSrc from 'static/account/kyc/warn_green.svg';
import warnDarkSrc from 'static/account/kyc/warn_green_dark.svg';
import ResponsiveDialog from './ResponsiveDialog';
import {
  ChangeResidence,
  Content,
  CurResidence,
  Desc,
  DialogButtonGroup,
  DialogDesc,
  DialogIcon,
  DialogTitle,
  Footer,
  MigrateDialog,
  Title,
} from './styled';

export default function KycUnverified({
  result,
  countries,
  open,
  regionCode: originRegionCode,
  onCancel,
  onRefresh,
  onPullConfig,
}) {
  const { residenceConfig } = useSelector((state) => state.kyc ?? {});
  const { message } = useSnackbar();
  const theme = useTheme();
  const dispatch = useDispatch();
  const rv = useResponsive();

  const { residenceRegionCode, verifyStatus } = residenceConfig || {};
  const isDark = theme.currentTheme === 'dark';
  const isKycVerifying = [0, 3, 6, 7].includes(verifyStatus);
  const isH5 = !rv?.sm;

  const [migrateDialogOpen, setMigrateDialogOpen] = useState(false);
  const [regionCode, setResidenceCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (isKycVerifying) {
      onCancel();
      return;
    }
    try {
      setLoading(true);
      await dispatch({
        type: 'kyc/postKycResidence',
        payload: { regionCode, source: getSource(isH5) },
      });
      onRefresh();
      onCancel();
      message.info(_t('93203828ef874000a03f'));
      const { isMigrateNow } = await onPullConfig();
      if (isMigrateNow) {
        setMigrateDialogOpen(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setMigrateDialogOpen(false);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setResidenceCode(originRegionCode);
    }
  }, [open, originRegionCode]);

  return (
    <>
      <ResponsiveDialog
        open={open}
        title={_t('624d767436b54800a9d9')}
        footer={
          <Footer>
            <Button
              size={isH5 ? 'large' : 'basic'}
              disabled={!regionCode || isKycVerifying}
              loading={loading}
              onClick={handleSubmit}
            >
              {<span>{_t('9c061821d8a44800af7f')}</span>}
            </Button>
          </Footer>
        }
        onCancel={onCancel}
      >
        <Content>
          {residenceRegionCode ? (
            <CurResidence>
              <p>{_t('80844e1282694800a89d')}</p>
              <p>{residenceConfig?.residenceRegionName}</p>
            </CurResidence>
          ) : null}
          <ChangeResidence>
            <Title>
              {residenceRegionCode ? (
                <span>{_t('297aa0ec11a84000ad6f')}</span>
              ) : (
                <span>{_t('0728a4046a164800ac87')}</span>
              )}
            </Title>
            <Select
              size="xlarge"
              placeholder={_t('454ba7febb3e4800a123')}
              options={countries}
              value={regionCode}
              onChange={setResidenceCode}
              disabled={isKycVerifying || result.extraInfo?.isLocking}
              dropdownIcon={<ICArrowUpOutlined size={20} />}
            />
            {isKycVerifying ? <Desc>{_t('9f4d86cab30b4800adf5')}</Desc> : null}
          </ChangeResidence>
        </Content>
      </ResponsiveDialog>
      <MigrateDialog open={migrateDialogOpen} header={null} footer={null}>
        <DialogIcon src={isDark ? warnDarkSrc : warnSrc} />
        <DialogTitle>{_t('34b9def8544a4800a99b')}</DialogTitle>
        <DialogDesc>
          {_t('14068a2c5ed64800adbd', {
            targetSiteName: getSiteName(result.extraInfo?.lastResidenceRegionSiteType),
          })}
        </DialogDesc>
        <DialogButtonGroup>
          <Button onClick={() => push('/account/transfer')}>{_t('8cd98c36e6854000abbc')}</Button>
          <Button variant="text" onClick={() => setMigrateDialogOpen(false)}>
            {_t('cancel')}
          </Button>
        </DialogButtonGroup>
      </MigrateDialog>
    </>
  );
}
