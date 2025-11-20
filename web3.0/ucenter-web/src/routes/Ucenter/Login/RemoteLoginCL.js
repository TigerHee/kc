/**
 * Owner: sean.shi@kupotech.com
 */
import { LoginCL } from '@kucoin-gbiz-next/entrance';
import { useMultiSiteConfig } from '@kucoin-gbiz-next/hooks';
import { isPropValid, styled, useResponsive, useTheme } from '@kux/mui';
import { fade } from '@kux/mui/utils/colorManipulator';
import { useQueryParams } from 'components/Entrance/hookTool';
import NoSSG from 'components/NoSSG';
import { useMemo } from 'react';
import LogoComp from 'src/components/Entrance/Logo';
import DialogFailInfoDark from 'static/account/dialog-fail-info-dark.svg';
import DialogFailInfo from 'static/account/dialog-fail-info.svg';
import { _t } from 'tools/i18n';

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

const TextWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.colors.background};
  padding-top: 100px;
`;

const ImgWrap = styled.div`
  display: flex;
  justify-content: center;
  img {
    max-width: 165px;
    height: auto;
    pointer-events: none;
  }
`;

const TipTitle = styled.div`
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  margin-top: 8px;
  margin-bottom: 6px;
`;

const ContentWrap = styled.div`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 16px;
  font-style: normal;
  max-width: 420px;
  font-weight: 400;
  line-height: 150%;
  white-space: pre-wrap;
`;

const ContentItem = styled.div`
  margin-top: 14px;
`;

export default (props) => {
  const { isThird } = useQueryParams();
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
    <NoSSG>
      <TextWrapper>
        <ImgWrap>
          <img
            alt="dialog fail tip"
            src={theme.currentTheme === 'dark' ? DialogFailInfoDark : DialogFailInfo}
          />
        </ImgWrap>
        <TipTitle>{_t('eb07a18a96454000a79b')}</TipTitle>
        <ContentWrap>
          <ContentItem>{_t('5f8f77bd9b8b4000aea1')}</ContentItem>
          <ContentItem>{_t('1310eed584044000aa20')}</ContentItem>
        </ContentWrap>
      </TextWrapper>
    </NoSSG>
  );

  return (
    <LoginCL theme={theme.currentTheme} {...props} multiSiteConfig={multiSiteConfig}>
      <LayoutSlots>
        <Logo>
          <LogoComp />
        </Logo>
        {isH5 ? null : <Text>{text}</Text>}
        {isThird ? (
          <LeftFooter>
            <LeftFooterContent theme={theme}>{_t('kucoin.Right')}</LeftFooterContent>
          </LeftFooter>
        ) : null}
        <RightContentStyle>{rightContentStyle}</RightContentStyle>
      </LayoutSlots>
    </LoginCL>
  );
};
