/**
 * Owner: willen@kupotech.com
 */
import { Login } from '@kucoin-gbiz-next/entrance';
import { useMultiSiteConfig } from '@kucoin-gbiz-next/hooks';
import { isPropValid, styled, useResponsive, useTheme } from '@kux/mui';
import { fade } from '@kux/mui/utils/colorManipulator';
import CompliantBox from 'components/common/CompliantBox';
import { useQueryParams } from 'components/Entrance/hookTool';
import LogoComp from 'components/Entrance/Logo';
import NoSSG from 'components/NoSSG';
import { tenantConfig } from 'config/tenant';
import { useMemo } from 'react';
import { _t } from 'tools/i18n';
import LeftBanner from './LeftBanner';

const LeftFooterContent = styled('div', {
  shouldForwardProp: (props) => isPropValid(props),
})(({ theme }) => {
  return {
    color: fade(theme.colors.base, 0.6),
    padding: '0 32px 32px 0',
    textAlign: 'right',
    margin: 0,
    fontSize: '12px',
    lineHeight: '20px',
  };
});

const SloganWrapper = styled.div`
  width: 570px;
  position: absolute;
  top: 56px;
  left: 50px;
  [dir='rtl'] & {
    right: 50px;
  }
  ${(props) => props.theme.breakpoints.down('xl')} {
    top: 70px;
    left: 40px;
    width: 400px;
    [dir='rtl'] & {
      right: 40px;
    }
  }
`;

const Title = styled.div`
  width: 100%;
  color: #ffffff;
  font-family: 'Kufox Sans';
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  line-height: 140%; /* 61.6px */
  margin-bottom: 11px;
`;

const SubTitle = styled.div`
  word-break: break-word;
  color: #ffffff;
  font-family: 'Kufox Sans';
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 61.6px */
  .highlight {
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: red;
  }
`;

export default (props) => {
  const { isThird } = useQueryParams();
  const theme = useTheme();
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
    <NoSSG>
      <SloganWrapper>
        <CompliantBox spm="compliance.signin.slogan.1">
          {/* ip 是英国 不展示以下内容 */}
          <Title data-inspector="signin_slogan">{tenantConfig.signin.sloganTitle(_t)}</Title>
          <SubTitle>{tenantConfig.signin.sloganSubTitle(_t)}</SubTitle>
        </CompliantBox>
      </SloganWrapper>
    </NoSSG>
  );

  return (
    <Login theme={theme.currentTheme} {...props} multiSiteConfig={multiSiteConfig}>
      <LayoutSlots>
        <Logo>
          <LogoComp />
        </Logo>
        {isH5 ? null : (
          <BackgroundImgSlot>
            <LeftBanner />
            {slogan}
          </BackgroundImgSlot>
        )}
        {isThird ? (
          <LeftFooter>
            <LeftFooterContent theme={theme}>{_t('kucoin.Right')}</LeftFooterContent>
          </LeftFooter>
        ) : null}
        <RightContentStyle>{rightContentStyle}</RightContentStyle>
      </LayoutSlots>
    </Login>
  );
};
