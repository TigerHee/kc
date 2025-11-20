import JsBridge from '@knb/native-bridge';
import { toast } from '@kux/design';
import { Email } from 'components/Account/Security/Email';
import { postSendCode, postVerifyCode } from 'src/services/ucenter/reset-security';
import { _t } from 'src/tools/i18n';
import * as commonStyles from '../styles.module.scss';
import * as styles from './styles.module.scss';

const IS_IN_APP = JsBridge.isApp();
const BIZ_TYPE = 'PRE_BIND_EMAIL';

export default function BindEmail({ token, onNext }) {
  const customSendRequest = async ({ email }) => {
    try {
      const res = await postSendCode({
        bizType: BIZ_TYPE,
        token,
        address: email,
        sendChannel: 'EMAIL',
      });
      return res.data;
    } catch (error) {
      toast.error(error?.msg || error?.message);
    }
  };
  const handleSubmit = async ({ email, code }) => {
    try {
      await postVerifyCode({
        bizType: BIZ_TYPE,
        token,
        address: email,
        [`validations[email]`]: code,
      });
      if (!token && IS_IN_APP) {
        JsBridge.open(
          {
            type: 'func',
            params: { name: 'asyncRefreshAppUser' },
          },
          () => {
            onNext({ preBindEmail: email });
          },
        );
      } else {
        onNext({ preBindEmail: email });
      }
    } catch (error) {
      toast.error(error?.msg || error?.message);
    }
  };

  return (
    <div className={commonStyles.container}>
      <div className={commonStyles.header}>{_t('01ec7d2744564000abad')}</div>
      <div className={styles.tips}>{_t('b8de608797784000a893')}</div>
      <Email isBind={true} customSendRequest={customSendRequest} onSubmit={handleSubmit} />
    </div>
  );
}
