/**
 * Owner: borden@kupotech.com
 */
import { Box } from '@kux/mui';
import SecurityAuthForm from 'components/Account/SecurityForm/SecurityAuthForm';
import SecuritySetting from 'components/SecuritySetting';
import SecurityVerifyModal from 'src/components/SecurityVerifyModal';
import { addLangToPath, _t } from 'tools/i18n';
import { composeSpmAndSave, trackClick } from 'utils/ga';
import AccountInfo from './AccountInfo';
import Notice from './Notice';
import Reason from './Reason';

export const bizType = 'USER_CANCELLATION';

export const StepComps = {
  notice: () => <Notice />,
  accountInfo: () => <AccountInfo />,
  reason: () => <Reason />,
  security: ({ noSecurityItem, ...props }) =>
    noSecurityItem ? (
      <>
        <Box style={{ height: '40px' }} />
        <SecuritySetting tip={_t('deposit.requirement')} />
      </>
    ) : (
      <SecurityVerifyModal visible={true}>
        <SecurityAuthForm
          withPwd
          showTitle={false}
          showTip
          passError
          bizType={bizType}
          switchAble={false}
          type="withdraw_password"
          submitBtnTxt={_t('account.del.title')}
          {...props}
        />
      </SecurityVerifyModal>
    ),
};

export const windowOpen = (url, spms) => {
  if (spms) {
    trackClick(spms);
    composeSpmAndSave(url, spms);
  }
  if (url) {
    const newWindow = window.open(addLangToPath(url));
    if (newWindow) {
      newWindow.opener = null;
    }
  }
};

export const REASON_TYPES = [
  {
    value: '6',
    label: '7XDaZMkoZRbHmdS84ESFBm',
  },
  {
    value: '7',
    showGuideModal: true,
    label: 'ap6UTZfUfpRaN82MW2yQo5',
  },
  {
    value: '8',
    label: '2XeKbRT99nsacV1y3rbtxg',
  },
  {
    value: '5',
    label: '1dR6Ncoty7Y6NTQa71zJjC',
    remarkRequired: true,
  },
];
const REASON_TYPES_MAP = {};
REASON_TYPES.forEach((item) => {
  REASON_TYPES_MAP[item.value] = item;
});
export { REASON_TYPES_MAP };

export const tips = [
  '315tkjrnwNKJE1nW8qrCoY',
  'account.del.influence3',
  'qaGpEJ626ZW1muMQg3w3gK',
  'account.del.influence5',
  'd6d41e328f3a4000a1b7',
];
export const warnings = [
  '93bamwKq383WFycaKTMQEd',
  'afCqem5jUM91B2qJUw7S6Q',
  'deiSSVEgv6zYWWoiwemyBf',
];
