/**
 * Owner: sean.shi@kupotech.com
 */
import { useEffect } from 'react';
import clsx from 'clsx';
import { Button } from '@kux/mui';
import { ICArrowRight2Outlined } from '@kux/icons';
import { useLang } from '../../../hookTool';
import { useLoginStore } from '../../model';
import ThirdPartyCreateAccount from '../../../../static/third-party-create-account.svg';
import ThirdPartyBindAccount from '../../../../static/third-party-bind-account.svg';
import { LOGIN_STEP, THIRD_PARTY_LOGIN_PLATFORM } from '../../constants';
import { kcsensorsManualTrack, trackClick } from 'tools/sensors';
import { compose } from '../../../common/tools';
import styles from './index.module.scss';

interface AccountDiversionProps {
  handleNewAccount: () => void;
  handleBindExistAccount: () => void;
}

export const AccountDiversion: React.FC<AccountDiversionProps> = ({ handleNewAccount, handleBindExistAccount }) => {
  const { t } = useLang();
  const thirdPartyPlatform = useLoginStore(s => s.thirdPartyPlatform)!;
  const thirdPartyDecodeInfo = useLoginStore(s => s.thirdPartyDecodeInfo);
  const prevStepList = useLoginStore(s => s.prevStepList);

  const platformLabel = THIRD_PARTY_LOGIN_PLATFORM?.(t)?.[thirdPartyPlatform]?.labelLocale || '';

  const onHandleNewAccount = () => {
    trackClick(['easyRegisterPage', 'newKCAccount']);
    handleNewAccount();
  };

  const onHandleBindExistAccount = () => {
    trackClick(['easyRegisterPage', 'bindExistingKCAccount']);
    handleBindExistAccount();
  };

  useEffect(() => {
    const isFromSimpleSignup = prevStepList?.length
      ? prevStepList[prevStepList.length - 1] === LOGIN_STEP.SIGN_IN_STEP_THIRD_PARTY_SIMPLE
      : false;

    try {
      kcsensorsManualTrack({
        spm: ['accountDiversionPage', '1'],
        data: {
          pre_spm_id: isFromSimpleSignup
            ? compose(['easyRegisterPage', 'bindOtherAccount'])
            : compose(['thirdAccount', 'thirdPartyPlatform']),
        },
      });
    } catch (e) {
      console.error('Error tracking account diversion:', e);
    }
  }, []);

  return (
    <>
      <div className={clsx(styles.title)}>{t('169f9aaaa7164000a396')}</div>
      <div className={clsx(styles.desc)}>
        <div>{t('1e51fc6a27c64800a6e1')}</div>
        <div>{t('acbb9c5a25734000abc2', { platform: platformLabel })}</div>
        <div>{t('34c3197622024000a061')}</div>
      </div>
      <div className={clsx(styles.accountInfo)}>
        {t('7f84a595a85b4000aa38', {
          platform: platformLabel,
          account: thirdPartyDecodeInfo?.userInfo,
        })}
      </div>
      {/* 三方注册 绑定新账号 */}
      <Button variant="outlined" fullWidth className={clsx(styles.buttonWrap)} onClick={onHandleNewAccount}>
        <div className={clsx(styles.icon)}>
          <img src={ThirdPartyCreateAccount} alt="create new account" />
          <span>{t('ce7aea3fa3b24800a9cd')}</span>
        </div>
        <ICArrowRight2Outlined size="24" />
      </Button>
      {/* 三方注册 绑定已有账号 */}
      <Button variant="outlined" fullWidth className={clsx(styles.buttonWrap)} onClick={onHandleBindExistAccount}>
        <div className={clsx(styles.icon)}>
          <img src={ThirdPartyBindAccount} alt="bind other account" />
          <span>{t('9fabaa38d6f74800a6bb')}</span>
        </div>
        <ICArrowRight2Outlined size="24" />
      </Button>
    </>
  );
};

export default AccountDiversion;
