/**
 * Owner: sean.shi@kupotech.com
 */
import { LoginCL } from 'gbiz-next/entrance';
import { useMultiSiteConfig } from 'gbiz-next/hooks';
import { useResponsive, useTheme } from '@kux/mui';
import { useQueryParams } from '@/components/Entrance/hookTool';
import { useMemo } from 'react';
import LogoComp from 'src/components/Entrance/Logo';
import useTranslation from '@/hooks/useTranslation';
import DialogFailInfoDark from '../img/dialog-fail-info-dark.svg';
import DialogFailInfo from '../img/dialog-fail-info.svg';
import styles from '../styles.module.scss';

export default (props) => {
  const { t: _t } = useTranslation();
  const { query, ...otherProps } = props;
  const { isThird } = useQueryParams(query);
  const theme = useTheme();
  const { LayoutSlots } = LoginCL;
  const { Logo, LeftFooter, RightContentStyle, Text } = LayoutSlots;
  const rv = useResponsive();
  const isH5 = !rv?.sm;
  const { multiSiteConfig } = useMultiSiteConfig();

  // 改变 H5 的间距样式
  const rightContentStyle = useMemo(() => {
    return isH5
      ? {
        marginTop: 32,
      }
      : null;
  }, [isH5]);

  const text = (
    <div className={styles.textWrapper}>
      <div className={styles.imgWrap}>
        <img
          alt="dialog fail tip"
          src={theme.currentTheme === 'dark' ? DialogFailInfoDark : DialogFailInfo}
        />
      </div>
      <div className={styles.tipTitle}>{_t('eb07a18a96454000a79b')}</div>
      <div className={styles.contentWrap}>
        <div className={styles.contentItem}>{_t('5f8f77bd9b8b4000aea1')}</div>
        <div className={styles.contentItem}>{_t('1310eed584044000aa20')}</div>
      </div>
    </div>
  );

  return (
    <LoginCL theme={theme.currentTheme} {...otherProps} multiSiteConfig={multiSiteConfig}>
      <LayoutSlots>
        <Logo>
          <LogoComp />
        </Logo>
        {isH5 ? null : <Text>{text}</Text>}
        {isThird ? (
          <LeftFooter>
            <div className={styles.leftFooterContent}>{_t('kucoin.Right')}</div>
          </LeftFooter>
        ) : null}
        <RightContentStyle>{rightContentStyle}</RightContentStyle>
      </LayoutSlots>
    </LoginCL>
  );
};
