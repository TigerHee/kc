/**
 * Owner: solar@kupotech.com
 */
import { useMemo } from 'react';
import { styled, Alert, Tag } from '@kux/mui';
import { useTranslation } from 'react-i18next';
import { useProps } from '@transfer/hooks/props';
import storage from '@utils/storage';
import { useTransferSelector } from '@packages/transfer/src/transferv2/utils/redux';

const StyledAlert = styled(Alert)`
  margin-bottom: 20px;
  color: ${(props) => props.theme.colors.text60};
  ${(props) => props.theme.fonts.size.lg}
  .KuxAlert-content {
    & > p {
      color: ${({ theme }) => theme.colors.text40};
      font-weight: 400;
    }
  }
`;

const StyledAlertTag = styled(Tag)`
  background-color: #51fdbf;
  height: 17px;
  color: #1d1d1d;
  ${(props) => props.theme.fonts.size.sm}
`;

const EARN_ALERT_OPENED = 'multi_alert_opened';

export default function SavingsTip() {
  const { t: _t } = useTranslation('transfer');
  const deductionAlertShow = useTransferSelector((state) => state.deductionAlertShow);
  const { isSub } = useProps();

  const handleClose = () => {
    storage.setItem(EARN_ALERT_OPENED, '1');
  };

  const hasAlerted = useMemo(() => storage.getItem(EARN_ALERT_OPENED) === '1', []);

  if (!window._SITE_CONFIG_.functions.financing) return null;
  if (isSub) return null;
  if (hasAlerted) return null;
  if (deductionAlertShow) return null;

  return (
    <StyledAlert
      showIcon
      icon={<StyledAlertTag>{_t('deposit.address.newTag')}</StyledAlertTag>}
      type="success"
      title={_t('kc_transferpro_earn_guide')}
      onClose={handleClose}
    />
  );
}
