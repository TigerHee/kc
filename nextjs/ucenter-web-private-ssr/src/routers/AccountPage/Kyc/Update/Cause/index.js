/**
 * Owner: tiger@kupotech.com
 */
import JsBridge from 'gbiz-next/bridge';
import { ComplianceDialog } from 'gbiz-next/kyc';
import { Alert, Button, Checkbox, Select, useSnackbar, useTheme } from '@kux/mui';
import { debounce } from 'lodash-es';
import { useEffect, useState } from 'react';
import { postKycUpdateChoose } from 'services/kyc';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import { kcsensorsManualExpose, trackClick } from 'utils/ga';
import { DownIcon, Wrapper } from './style';
import { getSiteConfig } from 'kc-next/boot';

const optionsList = [
  { label: _t('6684e8dfc1a74000a09a'), value: 'IDENTITY_EXPIRED' },
  { label: _t('5456a73b2c304000a73e'), value: 'UPDATE_NAME' },
  { label: _t('b185183e48a04000a720'), value: 'UPDATE_ID_NUMBER' },
  { label: _t('d24041544c7c4000a9da'), value: 'UPDATE_IDENTITY_OTHER_INFO' },
];

export default ({ onGetStatus }) => {
  const siteConfig = getSiteConfig();
  const KUCOIN_HOST = siteConfig.KUCOIN_HOST;
  const { message } = useSnackbar();
  const theme = useTheme();
  const isInApp = JsBridge.isApp();
  const [reason, setReason] = useState(optionsList[0].value);
  const [checked, setChecked] = useState(false);
  const [isComplianceDialogOpen, setComplianceDialogOpen] = useState(false);
  const [complianceType, setComplianceType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    kcsensorsManualExpose(['KYCUpdate', '1']);
  }, []);

  const onContact = (e) => {
    const targetNode = e?.target;
    if (
      targetNode?.nodeName?.toLocaleUpperCase() === 'SPAN' &&
      targetNode?.innerHTML === targetNode?.innerText
    ) {
      const hrefPath = '/support';

      if (isInApp) {
        if (KUCOIN_HOST) {
          JsBridge.open({
            type: 'jump',
            params: {
              url: `/link?url=${KUCOIN_HOST}${hrefPath}`,
            },
          });
        } else {
          window.location.href = addLangToPath(hrefPath);
        }
      } else {
        window.open(addLangToPath(hrefPath));
      }
    }
  };

  const onSubmit = debounce(async () => {
    trackClick(['Start', '1']);
    setLoading(true);

    postKycUpdateChoose({ type: 'IDENTITY', updateReason: reason })
      .then((res) => {
        const standardAlias = res?.data?.standardAlias;
        if (standardAlias) {
          if (JsBridge.isApp()) {
            const url = `${KUCOIN_HOST}/account-compliance?complianceType=${standardAlias}&loading=2&dark=true&needLogin=true&appNeedLang=true&isIgnoreExitModal=true`;
            JsBridge.open({
              type: 'jump',
              params: {
                url: `/link?url=${encodeURIComponent(url)}`,
              },
            });
          } else {
            setComplianceType(standardAlias);
            setComplianceDialogOpen(true);
          }
        } else {
          message.error(_t('763e6358279f4000a5eb'));
        }
      })
      .catch((err) => {
        if (err.msg) {
          message.error(err.msg);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, 100);

  return (
    <Wrapper>
      <div className="title">{_t('766002f7286a4000aa2d')}</div>
      <div className="subTitle">{_t('d79a933d89c24000a3e6')}</div>

      <Select
        label={_t('12d822bd214c4000aee0')}
        size="xlarge"
        dropdownIcon={<DownIcon />}
        options={optionsList}
        value={reason}
        onChange={(v) => {
          trackClick(['ChooseReason', '1'], { reason });
          setReason(v);
        }}
      />

      <div className="more" onClick={onContact} role="button" tabIndex="0">
        {_tHTML('8d3c46ca595b4000aeb5')}
      </div>

      <Alert
        showIcon
        type="info"
        title={<div className="alertTitle">{_t('cf6e9cc9c5ee4000ab73')}</div>}
        description={
          <div>
            <div className="alertDesc">{_t('6d02b690d52e4000a517')}</div>
            <div className="alertDesc">{_t('fc8c1f2ab5e74000a6a3')}</div>
            <div className="alertDesc" onClick={onContact} role="button" tabIndex="0">
              {_tHTML('4ec042d252664000a16b')}
            </div>
          </div>
        }
      />

      <div className="CheckboxWrapper">
        <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)}>
          {_t('03608927f02c4000a66f')}
        </Checkbox>
      </div>

      <Button onClick={onSubmit} disabled={!checked} size="large" loading={loading} fullWidth>
        {_t('8ab468f83e754000aabe')}
      </Button>

      {complianceType && (
        <ComplianceDialog
          open={isComplianceDialogOpen}
          onCancel={() => setComplianceDialogOpen(false)}
          onOk={onGetStatus}
          theme={theme.currentTheme}
          complianceType={complianceType}
          isIgnoreExitModal
        />
      )}
    </Wrapper>
  );
};
