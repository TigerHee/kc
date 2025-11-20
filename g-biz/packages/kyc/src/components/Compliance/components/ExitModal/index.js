/**
 * Owner: tiger@kupotech.com
 * 退出弹窗
 */
import { useTheme } from '@kux/mui';
import classnames from 'classnames';
import useLang from '@packages/kyc/src/hookTool/useLang';
import { NDIDPendingPageCode } from '@kycCompliance/config';
import useCommonData from '@kycCompliance/hooks/useCommonData';
import { StyledDialog, DialogContent } from './style';
import icon from './img/icon.svg';
import iconDark from './img/icon-dark.svg';

const IMG_CONFIG = {
  light: icon,
  dark: iconDark,
};

const getCustomConfig = ({ _t, pageCode }) => {
  const config = {
    'page_42': {
      desc: _t('1f29b52610a84000a945'),
    },
    'page_44': {
      desc: _t('1f29b52610a84000a945'),
    },
    [NDIDPendingPageCode]: {
      title: _t('3594bf7f32db4000a708'),
      desc: _t('cb288a098cf54000ad57'),
      cancelText: _t('9b80a7307f8c4000a19c'),
      exitText: _t('63dac61cb1ba4000a62d'),
    },
  };
  return config[pageCode] || {};
};

export default ({ onCancel, onOk, pageCode, ...otherProps }) => {
  const { currentTheme } = useTheme();
  const { _t } = useLang();

  const customConfig = getCustomConfig({ _t, pageCode });

  const { isSmStyle } = useCommonData();

  const getTitle = () => {
    return customConfig.title || _t('eV5ULEYnuXnPr9MLMD7Nhu');
  };

  const getDesc = () => {
    return customConfig.desc || _t('oFY4YGXHFZMjr7J8inggzT');
  };

  const getCancelText = () => {
    return customConfig.cancelText || _t('cHGhPEiCiaW9EGwHRHhkfp');
  };

  const getExitText = () => {
    return customConfig.exitText || _t('n8muC6uWj7DLRRz24UmrVo');
  };

  return (
    <StyledDialog
      {...otherProps}
      size="basic"
      onCancel={onCancel}
      onOk={onOk}
      okText={getExitText()}
      okButtonProps={{
        variant: 'text',
        size: isSmStyle ? 'large' : 'basic',
      }}
      cancelText={getCancelText()}
      cancelButtonProps={{
        fullWidth: true,
        variant: 'contained',
        type: 'primary',
        size: isSmStyle ? 'large' : 'basic',
      }}
      className={classnames({
        isSmStyle,
      })}
      showCloseX
      maskClosable={isSmStyle}
    >
      <DialogContent
        className={classnames({
          isSmStyle,
        })}
      >
        <img className="icon" src={IMG_CONFIG[currentTheme]} alt="exit-icon" />
        <div className="title">{getTitle()}</div>
        <div className="desc">{getDesc()}</div>
      </DialogContent>
    </StyledDialog>
  );
};
