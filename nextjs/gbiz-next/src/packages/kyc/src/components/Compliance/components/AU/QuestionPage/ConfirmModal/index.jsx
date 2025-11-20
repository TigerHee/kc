/**
 * Owner: tiger@kupotech.com
 */
import clsx from 'clsx';
import { Parser } from 'html-to-react';
import { useTheme, useResponsive } from '@kux/mui';
import useLang from 'packages/kyc/src/hookTool/useLang';
import useCommonData from 'kycCompliance/hooks/useCommonData';
import info_light from 'kycCompliance/assets/img/light/info.svg';
import info_dark from 'kycCompliance/assets/img/dark/info.svg';
import { StyledDialog, Wrapper } from './style';

const IMG_CONFIG = {
  light: info_light,
  dark: info_dark,
};

const htmlToReactParser = new Parser();

export default ({ questionnaireConfig, ...otherProps }) => {
  const { _t } = useLang();
  const { currentTheme } = useTheme();
  const { isSmStyle } = useCommonData();
  const rv = useResponsive();
  const isH5 = !rv?.sm;

  return (
    <StyledDialog
      {...otherProps}
      okText={_t('380f04491a814800ac4b')}
      cancelText={_t('7536faa7b9e84800a76d')}
      showCloseX={!(isH5 || isSmStyle)}
      header={isH5 || isSmStyle ? null : ''}
      className={clsx({
        isSmStyle,
      })}
      okButtonProps={{
        size: isSmStyle ? 'basic' : 'basic',
      }}
      cancelButtonProps={{
        variant: isSmStyle ? 'default' : 'text',
        size: isSmStyle ? 'basic' : 'basic',
      }}
      centeredFooterButton={isH5 || isSmStyle}
    >
      <Wrapper
        className={clsx({
          isSmStyle: isH5 || isSmStyle,
        })}
      >
        <img src={IMG_CONFIG[currentTheme]} alt="warn" />
        <div className="title">{_t('509319569f724800aed8')}</div>
        <div className="desc">
          {htmlToReactParser.parse(
            _t('30596ac00eb64800a54c', { num: questionnaireConfig.requiredCorrects || 0 }),
          )}
        </div>
        <div className="tip">{_t('8e904bfbc4454800ad74')}</div>
      </Wrapper>
    </StyledDialog>
  );
};
