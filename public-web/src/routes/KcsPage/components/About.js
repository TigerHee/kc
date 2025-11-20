/**
 * Owner: chris@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { ICArrowRight2Outlined } from '@kux/icons';
import { styled, useTheme } from '@kux/mui';
import { Link } from 'components/Router';
import sensors from 'tools/ext/kc-sensors';

import { ReactComponent as AboutSvgs } from 'static/kcs-intro/about.svg';
import { _t } from 'tools/i18n';
import { levelConfigMap } from '../config';
import { callJump } from '../utils';
const Wrapper = styled.section`
  max-width: 1200px;
  width: 100%;
  margin: 0px auto;
  padding-top: 100px;
  position: relative;
  .aboutkcs {
    position: absolute;
    bottom: 78px;
    width: 178px;
    height: 240px;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: calc(100% - 48px);
    padding-top: 64px;
    .aboutkcs {
      bottom: 138px;
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: calc(100% - 32px);
    padding-top: 40px;
    text-align: center;
    .aboutkcs {
      position: static;
      width: 118px;
      height: 158px;
    }
  }
`;
const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: 36px;
  font-weight: 600;
  line-height: 130%;
  width: 100%;
  text-align: center;
  margin-bottom: 24px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 24px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 18px;
  }
`;
const Content = styled.div`
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  background: linear-gradient(180deg, rgba(29, 29, 29, 0.02) 0%, rgba(29, 29, 29, 0) 100%);
  display: flex;
  padding: 48px 40px 48px 160px;
  flex-direction: column;
  align-items: center;
  gap: 48px;
  align-self: stretch;
  margin-left: 80px;
  .subTitle {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
    font-size: 20px;
    line-height: 130%;
  }
  p {
    margin-top: 12px;
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
  }
  .rightCon {
    display: flex;
    align-items: center;
    margin-top: 24px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 400;
    font-size: 16px;
    cursor: pointer;
    &:hover {
      color: ${({ theme, currentLevel }) =>
        levelConfigMap[currentLevel]?.hoverColor || theme.colors.primary};
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    grid-gap: 24px;
    margin-left: 0;
    padding: 24px 16px 16px 16px;
    border-radius: 12px;
    .subTitle {
      font-weight: 600;
      font-size: 16px;
      text-align: left;
    }
    p {
      font-weight: 400;
      font-size: 14px;
    }
  }
`;
const Top = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider8};
  padding-bottom: 48px;
  width: 100%;
  p {
    text-align: left;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-bottom: 24px;
  }
`;
const Bottom = styled.div`
  width: 100%;
  p {
    text-align: left;
  }
`;

const About = ({ isSm, currentLevel }) => {
  const isInApp = JsBridge.isApp();
  const { theme } = useTheme();
  const aboutHref = 'https://www.kcs.foundation/kcs-whitepaper.pdf';

  const toWhitePaper = () => {
    sensors.trackClick([`whitepaper`, `1`]);
    callJump(
      {
        url: `/external/link?url=${encodeURIComponent(aboutHref)}`,
      },
      aboutHref,
    );
  };
  return (
    <Wrapper data-inspector="kcs_about">
      <Title>{_t('6952d26504264000a92a')}</Title>
      {!isSm && <AboutSvgs className="aboutkcs" />}
      <Content currentLevel={currentLevel}>
        {isSm && <AboutSvgs className="aboutkcs" />}
        <Top>
          <div className="subTitle">{_t('06696a882c234000a048')}</div>
          <p>{_t('dad63e2679d44000ab75')}</p>
          <Link dontGoWithHref href={aboutHref} className="rightCon" onClick={toWhitePaper}>
            {_t('e14bc6acd3674000a0d6')}
            <ICArrowRight2Outlined
              className="ml-4 kcs-arrow"
              size={16}
              color={theme?.colors?.primary}
            />
          </Link>
        </Top>
        <Bottom>
          <div className="subTitle">{_t('b9c1a68321ee4000acbe')}</div>
          <p>{_t('e67144987b274000aa45')}</p>
        </Bottom>
      </Content>
    </Wrapper>
  );
};

export default About;
