/**
 * Owner: iron@kupotech.com
 */
import React, { useMemo } from 'react';
import clsx from 'clsx';
import { Box, Row, Col, ThemeProvider } from '@kux/mui';
import useIsMobile from '../hooks/useIsMobile';
import { useMultiSiteConfig } from 'hooks';
import { getTenantConfig } from '../config/tenant';
import styles from './_Layout.module.scss';

const genVoidFunc = () => () => null;

const LayoutSlots: {
  Logo: any;
  BackgroundStyle: any;
  Text: any;
  LeftFooter: any;
  RightFooter: any;
  LeftFull: any;
  BackgroundImg: any;
  RightContentStyle: any;
  BackgroundImgSlot: any;
} = genVoidFunc as any;
const Logo = genVoidFunc();
const BackgroundStyle = genVoidFunc();
const Text = genVoidFunc();
const LeftFooter = genVoidFunc();
const RightFooter = genVoidFunc();
const LeftFull = genVoidFunc();
const BackgroundImg = genVoidFunc();
const BackgroundImgSlot = genVoidFunc();
const RightContentStyle = genVoidFunc();

LayoutSlots.Logo = Logo;
LayoutSlots.BackgroundStyle = BackgroundStyle;
LayoutSlots.BackgroundImg = BackgroundImg;
LayoutSlots.Text = Text;
LayoutSlots.LeftFooter = LeftFooter;
LayoutSlots.RightFooter = RightFooter;
LayoutSlots.LeftFull = LeftFull;
LayoutSlots.RightContentStyle = RightContentStyle;
LayoutSlots.BackgroundImgSlot = BackgroundImgSlot;

interface LayoutProps {
  slots: any[];
  children: React.ReactNode;
  layoutProps?: {
    contentTop?: any;
    centerKey?: string;
    smTop?: boolean;
    padding?: boolean;
  };
}

const Layout: React.FC<LayoutProps> = props => {
  const { slots, children, layoutProps } = props;
  const tenantConfig = getTenantConfig();
  const backgroundStyle = slots.find((slot: any) => slot.type === BackgroundStyle);
  const text = slots.find((slot: any) => slot.type === Text);
  const leftFooter = slots.find((slot: any) => slot.type === LeftFooter);
  const rightFooter = slots.find((slot: any) => slot.type === RightFooter);
  const leftFull = slots.find((slot: any) => slot.type === LeftFull);
  const rightContentStyle = slots.find((slot: any) => slot.type === RightContentStyle);

  const backgroundImg = slots.find((slot: any) => slot.type === BackgroundImg);
  const backgroundImgSlot = slots.find(slot => slot.type === BackgroundImgSlot);
  const isH5 = useIsMobile();
  const { multiSiteConfig } = useMultiSiteConfig();
  const { contentTop, centerKey, smTop = true, padding = true } = layoutProps || {};

  const isRestPwdPage = typeof window !== 'undefined' && window.location?.pathname?.endsWith('/ucenter/reset-password');

  const isValidImage = useMemo(() => {
    if (centerKey === 'login' || centerKey === 'signup') {
      return centerKey === 'login'
        ? multiSiteConfig?.loginConfig?.loginPageContextUrl
        : multiSiteConfig?.registerConfig?.registerPageContextUrl;
    }
    return true;
  }, [centerKey, multiSiteConfig]);

  return (
    <section className={clsx(styles.wrapper)} data-inspector="layouts_slots_wrapper">
      <Row className={styles.row}>
        {/* 主站特有页面 */}
        {(tenantConfig.common.isShowSlotBgImg || isRestPwdPage) && (
          <Col
            style={{
              ...(backgroundStyle && backgroundStyle.props.children),
            }}
            data-inspector="layouts_slots_left"
            className={clsx('banner', styles.banner, styles.bannerCol, !isH5 ? styles.showOnLarge : styles.hideOnSmall)}
            sm={0}
            lg={11}
          >
            {leftFull ? (
              leftFull.props.children
            ) : (
              <Box className={clsx(styles.bannerBox)}>
                {text && text.props.children}
                <Box className={styles.bannerBoxFooter}>{leftFooter && leftFooter.props.children}</Box>
              </Box>
            )}
            {/* background-img 改直接 img 显示的形式，方便做自适应 */}
            {backgroundImg && backgroundImg.props.src && (
              <div className={clsx(styles.backgroundPos)} {...backgroundImg.props}>
                <img className={clsx(styles.backgroundImg)} src={backgroundImg.props.src} />
                {backgroundImg.props?.slogan && backgroundImg.props?.slogan}
              </div>
            )}
            {backgroundImgSlot && (
              <div className={clsx(styles.backgroundPos)} {...backgroundImgSlot.props}>
                {backgroundImgSlot.props && backgroundImgSlot.props?.children}
              </div>
            )}
          </Col>
        )}
        {/* 本地站输出多站点配置的图片，如果有的话,并且不是重置密码页面 */}
        {tenantConfig.common.isShowRemoteBgImg &&
          !isRestPwdPage &&
          (centerKey === 'login'
            ? multiSiteConfig?.loginConfig?.loginPageContextUrl
            : multiSiteConfig?.registerConfig?.registerPageContextUrl) &&
          isValidImage && (
            <Col
              style={{
                ...(backgroundStyle && backgroundStyle?.props.children),
              }}
              className={clsx(
                'banner',
                styles.banner,
                styles.bannerCol,
                rv.lg ? styles.showOnLarge : styles.hideOnSmall
              )}
              sm={0}
              lg={11}
            >
              {/* background-img 改直接 img 显示的形式，方便做自适应 */}
              <div className={clsx(styles.backgroundPos)} {...backgroundImg?.props}>
                <img
                  className={clsx(styles.backgroundImg)}
                  src={
                    centerKey === 'login'
                      ? multiSiteConfig?.loginConfig?.loginPageContextUrl
                      : multiSiteConfig?.registerConfig?.registerPageContextUrl
                  }
                />
              </div>
            </Col>
          )}

        <Col className={clsx(styles.entranceContentRight, styles.entranceContentRightCol)}>
          <Box className={clsx(styles.entranceContentRightBox)}>
            <div
              className={clsx(
                'contentWrapper',
                styles.contentWrapper,
                rightContentStyle && styles.contentWrapperDynamic
              )}
              style={{
                ...(rightContentStyle && rightContentStyle.props.children),
              }}
              data-content-top={contentTop}
              data-sm-top={smTop}
              data-padding={padding}
            >
              {children}
            </div>
            <Box className={styles.rightFooterBox}>{rightFooter && rightFooter.props.children}</Box>
          </Box>
        </Col>
      </Row>
    </section>
  );
};

export const withLayout = (
  WrappedComponent: React.ComponentType<any>,
  layoutProps: LayoutProps['layoutProps'] = {}
) => {
  const ComponentWithLayout = (props: LayoutProps & { theme?: 'light' | 'dark' }) => {
    const { children } = props;
    const slotsWrap = React.Children.toArray(children).find((child: any) => child.type === LayoutSlots);
    const slots = slotsWrap ? React.Children.toArray((slotsWrap as any).props.children) : [];
    return (
      <ThemeProvider theme={props.theme || 'light'}>
        <Layout slots={slots} layoutProps={layoutProps}>
          <WrappedComponent {...props} />
        </Layout>
      </ThemeProvider>
    );
  };

  (ComponentWithLayout as any).LayoutSlots = LayoutSlots;

  return ComponentWithLayout;
};

export default Layout;
