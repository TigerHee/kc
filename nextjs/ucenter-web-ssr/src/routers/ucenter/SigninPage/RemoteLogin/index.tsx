/**
 * Owner: tiger@kupotech.com
 */
import { Login } from 'gbiz-next/entrance';
import { useMultiSiteConfig } from 'gbiz-next/hooks';
import { useResponsive, useTheme } from '@kux/mui';
import { CompliantBox } from 'gbiz-next/compliantCenter';
import { useQueryParams } from '@/components/Entrance/hookTool';
import { useMemo } from 'react';
import LogoComp from '@/components/Entrance/Logo';
import LoginBanner from '@/components/LoginBanner';
import useTranslation from '@/hooks/useTranslation';
import styles from '../styles.module.scss';
import { getTenantConfig } from '@/tenant';

export default (props) => {
  const { query, ...otherProps } = props;

  const { isThird } = useQueryParams(query);
  const theme = useTheme();
  const { t: _t } = useTranslation();
  const { LayoutSlots } = Login;
  const { Logo, BackgroundImgSlot, LeftFooter, RightContentStyle } = LayoutSlots;

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

  const slogan = (
    <div className={styles.sloganWrapper}>
      <CompliantBox spm="compliance.signin.slogan.1">
        {/* ip 是英国 不展示以下内容 */}
        <div className={styles.title}>{getTenantConfig().signin.sloganTitle(_t)}</div>
        <div className={styles.subTitle} data-inspector="signin_slogan">
          {getTenantConfig().signin.sloganSubTitle(_t)}
        </div>
      </CompliantBox>
    </div>
  );

  return (
    <Login theme={theme.currentTheme} {...otherProps} multiSiteConfig={multiSiteConfig}>
      <LayoutSlots>
        <Logo>
          <LogoComp />
        </Logo>
        {isH5 ? null : (
          <BackgroundImgSlot>
            <LoginBanner />
            {slogan}
          </BackgroundImgSlot>
        )}
        {isThird ? (
          <LeftFooter>
            <div className={styles.leftFooterContent}>{_t('kucoin.Right')}</div>
          </LeftFooter>
        ) : null}
        <RightContentStyle>{rightContentStyle}</RightContentStyle>
      </LayoutSlots>
    </Login>
  );
};
