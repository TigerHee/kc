/**
 * Owner: sean.shi@kupotech.com
 */
import React, { useEffect } from 'react';
import noop from 'lodash/noop';
import { Box } from '@kux/mui';
import useIsMobile from '../../hooks/useIsMobile';
import { kcsensorsManualTrack } from 'tools/sensors';
import { useTranslation } from 'tools/i18n';
import AccountLogin from './AccountLogin';
import { useLang } from '../../hookTool';
import { ACCOUNT_LOGIN_TAB_KEY } from '../constants';
import { NoSSG } from '../../common/tools';
import styles from './index.module.scss';
import { useLoginStore } from '../../Login/model';

interface InputAccountProps {
  classes?: Record<string, string>;
  onSuccess?: (data: any) => void;
  onForgetPwdClick?: () => void;
  customTitle?: React.ReactNode;
  withDrawer?: boolean;
}

const InputAccount: React.FC<InputAccountProps> = (props = {}) => {
  const { classes = {}, onSuccess = noop, onForgetPwdClick = noop, customTitle, withDrawer } = props;
  const update = useLoginStore((state) => state.update);
  const isSm = useIsMobile();
  const { t } = useLang();
  const { t: _t } = useTranslation('entrance');

  useEffect(() => {
    update?.({
      scanLoginShow: false,
    })
  }, []);

  // 登陆组件曝光事件
  useEffect(() => {
    kcsensorsManualTrack({
      spm: ['signinLogin', '1'],
    });
  }, []);

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Box style={{ flex: 1, minHeight: '400px' }}>
        <Box className={styles.titleContainer}>
          {customTitle || (
            <h1 className={`${styles.title} ${withDrawer ? styles.withDrawer : ''} ${classes.title || ''}`}>
              {t('login')}
            </h1>
          )}
          <p className={styles.subtitle}>{_t('76acb52a6c9b4000a583')}</p>
        </Box>
        {/* 大屏不确定用户应该显示二维码还是账号登录，生成ssg可能会导致闪烁，所以禁用ssg */}
        {/* 小屏禁用扫码登录，始终使用账号登录，可以生成ssg模板 */}
        <NoSSG byPass={isSm}>
          <AccountLogin
            tabKey={ACCOUNT_LOGIN_TAB_KEY}
            onSuccess={onSuccess}
            onForgetPwdClick={onForgetPwdClick}
          />
        </NoSSG>
      </Box>
    </Box>
  );
};

export default InputAccount;
