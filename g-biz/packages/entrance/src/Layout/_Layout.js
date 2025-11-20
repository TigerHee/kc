/**
 * Owner: iron@kupotech.com
 */
import React, { useMemo } from 'react';
import { useResponsive, Box, Row, Col, styled, ThemeProvider } from '@kux/mui';
import useMultiSiteConfig from '@hooks/useMultiSiteConfig';
import { tenantConfig } from '@packages/entrance/src/config/tenant';
import RootEmotionCacheProvider from './RootEmotionCacheProvider';

const Wrapper = styled.section`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.colors.backgroundMajor};
  .banner {
    flex: 0 0 45%;
  }
`;

const BackgroundPos = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  display: flex;
`;

const StyledBackgroundImg = styled.img`
  flex: 1 1 55%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
`;

const ContentWrapper = styled(Box)`
  position: relative;
  flex: 1;
  width: 100%;
  margin-top: 100px;
  margin-bottom: 100px;
  @media screen and (max-height: 650px) {
    margin-top: 40px;
    margin-bottom: 40px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
    margin-bottom: 40px;
  }
`;

const genVoidFunc = () => () => null;

const LayoutSlots = genVoidFunc();
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
LayoutSlots.BackgroundImgSlot = BackgroundImgSlot;
LayoutSlots.Text = Text;
LayoutSlots.LeftFooter = LeftFooter;
LayoutSlots.RightFooter = RightFooter;
LayoutSlots.LeftFull = LeftFull;
LayoutSlots.RightContentStyle = RightContentStyle;

const Layout = (props) => {
  const { slots, children, layoutProps } = props;
  const backgroundStyle = slots.find((slot) => slot.type === BackgroundStyle);
  const text = slots.find((slot) => slot.type === Text);
  const leftFooter = slots.find((slot) => slot.type === LeftFooter);
  const rightFooter = slots.find((slot) => slot.type === RightFooter);
  const leftFull = slots.find((slot) => slot.type === LeftFull);
  const rightContentStyle = slots.find((slot) => slot.type === RightContentStyle);

  const backgroundImg = slots.find((slot) => slot.type === BackgroundImg);
  const backgroundImgSlot = slots.find((slot) => slot.type === BackgroundImgSlot);
  const rv = useResponsive();
  const { multiSiteConfig } = useMultiSiteConfig();
  const { contentTop, centerKey, smTop = true, padding = true } = layoutProps || {};

  const isRestPwdPage = window?.location?.pathname?.endsWith('/ucenter/reset-password');

  const isValidImage = useMemo(() => {
    if (centerKey === 'login' || centerKey === 'signup') {
      return centerKey === 'login'
        ? multiSiteConfig?.loginConfig?.loginPageContextUrl
        : multiSiteConfig?.registerConfig?.registerPageContextUrl;
    }
    return true;
  }, [centerKey, multiSiteConfig]);

  return (
    <RootEmotionCacheProvider>
      <Wrapper data-inspector="layouts_slots_wrapper">
        <Row style={{ flex: 1 }}>
          {/* 主站特有页面 */}
          {(tenantConfig.common.isShowSlotBgImg || isRestPwdPage) && (
            <Col
              style={{
                ...(rv.lg
                  ? {
                      display: 'block',
                    }
                  : {
                      display: 'none',
                    }),
                ...(backgroundStyle && backgroundStyle.props.children),
                position: 'relative',
                height: '100%',
              }}
              data-inspector="layouts_slots_left"
              className="banner"
              sm={0}
              lg={11}
            >
              {leftFull ? (
                leftFull.props.children
              ) : (
                <Box
                  position="relative"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                >
                  {text && text.props.children}
                  <Box position="absolute" bottom={0} let={0} width="100%">
                    {leftFooter && leftFooter.props.children}
                  </Box>
                </Box>
              )}
              {/* background-img 改直接 img 显示的形式，方便做自适应 */}
              {backgroundImg && backgroundImg.props.src && (
                <BackgroundPos {...backgroundImg.props}>
                  <StyledBackgroundImg src={backgroundImg.props.src} />
                  {backgroundImg.props?.slogan && backgroundImg.props?.slogan}
                </BackgroundPos>
              )}
              {backgroundImgSlot && (
                <BackgroundPos {...backgroundImgSlot.props}>
                  {backgroundImgSlot.props && backgroundImgSlot.props?.children}
                </BackgroundPos>
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
                  ...(rv.lg
                    ? {
                        display: 'block',
                      }
                    : {
                        display: 'none',
                      }),
                  ...(backgroundStyle && backgroundStyle?.props.children),
                  position: 'relative',
                  height: '100%',
                }}
                className="banner"
                sm={0}
                lg={11}
              >
                {/* background-img 改直接 img 显示的形式，方便做自适应 */}
                <BackgroundPos {...backgroundImg?.props}>
                  <StyledBackgroundImg
                    src={
                      centerKey === 'login'
                        ? multiSiteConfig?.loginConfig?.loginPageContextUrl
                        : multiSiteConfig?.registerConfig?.registerPageContextUrl
                    }
                  />
                </BackgroundPos>
              </Col>
            )}

          <Col
            style={{
              display: 'flex',
              justifyContent: 'center',
              height: '100%',
              flex: 1,
              maxWidth: '100%',
            }}
            className="entranceContentRight"
          >
            <Box
              position="relative"
              display="flex"
              alignItems="flex-start"
              justifyContent="flex-start"
              style={{
                flexDirection: 'column',
              }}
              height="100%"
              width="100%"
              className="entranceContentRightBox"
            >
              <ContentWrapper
                contentTop={contentTop}
                smTop={smTop}
                padding={padding}
                style={{
                  ...(rightContentStyle && rightContentStyle.props.children),
                }}
              >
                {children}
              </ContentWrapper>
              <Box position="absolute" bottom={0} right={0} width="100%">
                {rightFooter && rightFooter.props.children}
              </Box>
            </Box>
          </Col>
        </Row>
      </Wrapper>
    </RootEmotionCacheProvider>
  );
};

export const withLayout = (WrappedComponent, layoutProps = {}) => {
  const ComponentWithLayout = (props) => {
    const { children } = props;
    const slotsWrap = React.Children.toArray(children).find((child) => child.type === LayoutSlots);
    const slots = slotsWrap ? React.Children.toArray(slotsWrap.props.children) : [];
    return (
      <ThemeProvider theme={props.theme || 'light'}>
        <Layout slots={slots} layoutProps={layoutProps}>
          <WrappedComponent {...props} />
        </Layout>
      </ThemeProvider>
    );
  };

  ComponentWithLayout.LayoutSlots = LayoutSlots;

  return ComponentWithLayout;
};

export default Layout;
