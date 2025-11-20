/**
 * Owner: willen@kupotech.com
 */
import { ICArrowRight2Outlined } from '@kux/icons';
import { styled, useTheme } from '@kux/mui';
import { useSelector } from 'react-redux';
import { tenantConfig } from 'src/config/tenant';
import getStarted1 from 'static/account/overview/get_started_1.png';
import getStarted1Dark from 'static/account/overview/get_started_1_dark.png';
import getStarted2 from 'static/account/overview/get_started_2.png';
import getStarted2Dark from 'static/account/overview/get_started_2_dark.png';
import getStartedBg from 'static/account/overview/get_started_bg.svg';
import getStartedBgDark from 'static/account/overview/get_started_bg_dark.svg';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';
import { bootConfig } from 'kc-next/boot';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const GetStartedWrapper = styled.div`
  padding: 28px 32px;
  background: linear-gradient(105.4deg, rgba(1, 188, 76, 0.12) 0%, rgba(1, 188, 53, 0.04) 98.37%);
  border: 1px solid ${({ theme }) => theme.colors.primary20};
  border-radius: 20px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    background-image: url(${({ theme }) =>
    theme.currentTheme === 'dark' ? getStartedBgDark : getStartedBg});
    background-repeat: no-repeat;
    background-position: center right;
    background-size: auto 100%;
    content: '';
  }
  ${({ theme }) => theme.breakpoints.down('lg')} {
    padding: 32px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 20px;
    padding: 24px 20px;
  }
`;

const GetStartedInner = styled.div`
  position: relative;
  z-index: 1;
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 18px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 6px;
    font-size: 16px;
  }
`;
const Desc = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text40};
  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
const SubItem = styled.a`
  display: flex;
  align-items: center;
  margin-top: 28px;
  & + div {
    margin-top: 24px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 24px;
    & + div {
      margin-top: 16px;
    }
  }
  .SubMore {
    color: ${({ theme }) => theme.colors.text};
    [dir='rtl'] & {
      transform: scaleX(-1);
    }
  }
  &:hover {
    .SubMore {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;
const SubIconBox = styled.div`
  width: 56px;
  height: 56px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
`;
const SubIcon = styled.img`
  width: 50px;
  height: 50px;
`;
const SubItemMain = styled.div`
  margin-right: 48px;
  flex: 1;
`;
const SubTitle = styled.h3`
  font-weight: 700;
  font-size: 16px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 3px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;
const SubDesc = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text40};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;
const SubMore = styled.a`
  border: 1px solid ${({ theme }) => theme.colors.cover12};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  cursor: pointer;
  color: inherit;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 28px;
    height: 28px;
  }
`;
const OverviewGetStarted = () => {
  const assetOverview = useSelector((s) => s.accountOverview.assetOverview) || {};
  const { isSub = false } = useSelector((state) => state.user.user) || {};
  const rv = useResponsiveSSR();
  const downSmall = !rv.sm;
  const theme = useTheme();

  // 未请求到资产结果 或 资产大于0，不展示组件
  if (isSub || typeof assetOverview.totalAssets === 'undefined' || +assetOverview.totalAssets > 0) {
    return null;
  }

  return (
    <GetStartedWrapper data-inspector="account_overview_get_started">
      <GetStartedInner>
        <Title>{_t('w8trypo12XpjtpFxGL6V34')}</Title>
        {tenantConfig.account.showGetStartDesc && <Desc>{_tHTML('bjZS7Fmim2bAB3hBPqDKNY')}</Desc>}
        <SubItem href={addLangToPath(`/assets/coin/${bootConfig._BASE_CURRENCY_}`)} target="_blank">
          {downSmall ? null : (
            <SubIconBox>
              <SubIcon src={theme.currentTheme === 'light' ? getStarted1 : getStarted1Dark} />
            </SubIconBox>
          )}
          <SubItemMain>
            <SubTitle>{_t('iXYh1zbAxb851gxyF5Sb3h')}</SubTitle>
            <SubDesc>{_t('vQcNgyr5bkafjvbLYneZ4s')}</SubDesc>
          </SubItemMain>
          <SubMore
            className="SubMore"
            href={addLangToPath(`/assets/coin/${bootConfig._BASE_CURRENCY_}`)}
            target="_blank"
          >
            <ICArrowRight2Outlined />
          </SubMore>
        </SubItem>
        <SubItem href={addLangToPath('/express?currency=USD')} target="_blank">
          {downSmall ? null : (
            <SubIconBox>
              <SubIcon src={theme.currentTheme === 'light' ? getStarted2 : getStarted2Dark} />
            </SubIconBox>
          )}
          <SubItemMain>
            <SubTitle>{_t('fyMvhfJFXBK5bJBAY74GQL')}</SubTitle>
            <SubDesc>{_t('abcfUgDiA5XQjETu3y6F4R')}</SubDesc>
          </SubItemMain>
          <SubMore
            className="SubMore"
            href={addLangToPath('/express?currency=USD')}
            target="_blank"
          >
            <ICArrowRight2Outlined />
          </SubMore>
        </SubItem>
      </GetStartedInner>
    </GetStartedWrapper>
  );
};

export default OverviewGetStarted;
