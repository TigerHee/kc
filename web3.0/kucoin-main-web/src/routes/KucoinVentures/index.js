/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect } from 'react';
import { styled } from '@kufox/mui';
import { keyframes } from '@kufox/mui';
import { Row, Col, Button } from '@kufox/mui';
import banner from 'static/ventures/banner.svg';
import kucoinSvg from 'static/ventures/kucoin.svg';
import goldL from 'static/ventures/gold_l.svg';
import goldR from 'static/ventures/gold_r.svg';
import bgSvg from 'static/ventures/bg.svg';
import blofin from 'static/ventures/blofin.svg';
import chingari from 'static/ventures/chingari.svg';
import heros from 'static/ventures/heros.svg';
import idle from 'static/ventures/idle.svg';
import jzl from 'static/ventures/jzl.svg';
import onPay from 'static/ventures/onPay.svg';
import ovo from 'static/ventures/ovo.svg';
import pokt from 'static/ventures/pokt.svg';
import sturdy from 'static/ventures/sturdy.svg';
import { init } from './components/typed';

import Opportunity from './components/Opportunities';

import { Pages, LayoutBox, Content } from './components/StyledComps';

const portfolios = [
  {
    icon: pokt,
    name: 'POKT',
    desc: 'Decentralized Infrastructure',
  },
  {
    icon: ovo,
    name: 'OVO',
    desc: 'AR-NFT Platform',
  },
  {
    icon: heros,
    name: 'Heroes Chained',
    desc: 'Fantasy Action RPG Game ',
  },
  {
    icon: chingari,
    name: 'Chingari',
    desc: 'Bharat Ka Super Entertainment App ',
  },
  {
    icon: idle,
    name: 'Idle StoneAge',
    desc: 'GameFi NFT Card Game',
  },
  {
    icon: jzl,
    name: 'JZL Capital',
    desc: 'First-class Asset Management Company',
  },
  {
    icon: onPay,
    name: 'Onpay&CNHC',
    desc: 'Stablecoin',
  },
  {
    icon: blofin,
    name: 'Blofin',
    desc: 'Financial Asset Management Institution ',
  },
  {
    icon: sturdy,
    name: 'Sturdy',
    desc: 'DeFi Lending Protocol',
  },
];

const Banner = styled.div`
  padding: 80px 0;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 60px 0;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 40px 0;
  }
`;

const Slogan = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-size: 56px;
  line-height: 72px;
  font-weight: 700;
  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 40px;
    line-height: 56px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: 16px;
    line-height: 24px;
  }
`;

const Desc = styled.div`
  color: ${(props) => props.theme.colors.text60};
  font-size: 20px;
  line-height: 32px;
  margin-top: 32px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 20px;
    font-size: 16px;
    line-height: 24px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: 12px;
    font-size: 12px;
    line-height: 16px;
  }
`;

const Image = styled.img`
  width: 100%;
`;

const Story = styled.div`
  position: relative;
  background: #f8f9fc;
  backdrop-filter: blur(40px);
  padding: 72px 48px 52px 48px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding-top: 64px;
    padding-bottom: 48px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 20px 20px 12px 20px;
  }
  &:before {
    position: absolute;
    top: 72px;
    left: 0;
    width: 16px;
    height: 48px;
    background: ${(props) => props.theme.colors.primary};
    content: '';
    ${(props) => props.theme.breakpoints.down('lg')} {
      top: 56px;
    }
    ${(props) => props.theme.breakpoints.down('md')} {
      top: 28px;
      width: 8px;
      height: 24px;
    }
  }
`;

const TextBox = styled.div``;

const Title = styled.h2`
  color: ${(props) => props.theme.colors.text};
  font-weight: 700;
  font-size: 48px;
  line-height: 48px;
  margin-bottom: 0;
  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 32px;
    line-height: 34px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: 20px;
    line-height: 40px;
  }
`;

const Subtitle = styled.h3`
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  font-size: 32px;
  line-height: 32px;
  margin-top: 16px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 16px;
    font-size: 24px;
    line-height: 32px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 16px;
    line-height: 20px;
  }
`;

const StoryDesc = styled.p`
  color: ${(props) => props.theme.colors.text};
  font-size: 24px;
  line-height: 40px;
  margin-bottom: 0;
  margin-top: 20px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 20px;
    line-height: 32px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: 12px;
    line-height: 16px;
  }
  &[data-role='second'] {
    margin-top: 12px;
  }
`;

const PortfolioBox = styled.div`
  margin-top: 100px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-top: 90px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: 48px;
  }
`;

const Portfolio = styled.div`
  h2.title {
    margin-bottom: 40px;
    color: ${(props) => props.theme.colors.text};
    font-weight: 700;
    font-size: 48px;
    line-height: 72px;
    ${(props) => props.theme.breakpoints.down('lg')} {
      font-size: 32px;
      line-height: 40px;
    }
    ${(props) => props.theme.breakpoints.down('md')} {
      margin-bottom: 24px;
      font-size: 20px;
      line-height: 32px;
    }
  }
`;

const PortfolioItem = styled.div`
  background: ${(props) => props.theme.colors.backgroundMajor};
  border-radius: ${(props) => props.theme.radius.middle};
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  height: 208px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  ${(props) => props.theme.breakpoints.down('lg')} {
    height: 146px;
    padding: 16px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    height: 86px;
    padding: 8px;
  }
  &:hover {
    box-shadow: ${(props) => props.theme.shadows.middle};
    transform: translate(0, -5px);
  }
  img {
    display: inline-block;
    width: 48px;
    height: 48px;
    ${(props) => props.theme.breakpoints.down('md')} {
      width: 32px;
      height: 32px;
    }
  }
  p[data-role='title'] {
    margin-top: 32px;
    margin-bottom: 0;
    color: ${(props) => props.theme.colors.text};
    font-size: 24px;
    line-height: 24px;
    ${(props) => props.theme.breakpoints.down('lg')} {
      margin-top: 16px;
      font-size: 20px;
    }
    ${(props) => props.theme.breakpoints.down('md')} {
      margin-top: 8px;
      font-size: 12px;
      line-height: 16px;
    }
  }
  p[data-role='desc'] {
    margin-top: 12px;
    margin-bottom: 0;
    color: ${(props) => props.theme.colors.text};
    font-size: 16px;
    line-height: 20px;
    ${(props) => props.theme.breakpoints.down('lg')} {
      display: none;
    }
  }
`;

const ContractBox = styled.div`
  padding: 100px 0;
  margin-top: 100px;
  background: url(${bgSvg}) no-repeat center;
  background-size: cover;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 60px 0;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: 40px;
    padding: 40px 0;
  }
`;

const ContractTitle = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-weight: 700;
  font-size: 42px;
  line-height: 72px;
  text-align: center;
  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 32px;
    line-height: 72px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: 24px;
    line-height: 72px;
  }
`;

const ContractDesc = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 24px;
  line-height: 32px;
  text-align: center;
  margin-top: 8px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 16px;
    line-height: 24px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: 12px;
    line-height: 16px;
  }
  a {
    color: ${(props) => props.theme.colors.primary};
    &:hover,
    &:active,
    &:focus {
      color: ${(props) => props.theme.colors.primary};
      text-decoration: none;
    }
  }
`;

const ButtonBox = styled.div`
  width: 274px;
  margin: auto;
  margin-top: 32px;
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 186px;
  }
  a {
    color: ${(props) => props.theme.colors.textEmphasis};
    &:hover,
    &:active,
    &:focus {
      color: ${(props) => props.theme.colors.textEmphasis};
      text-decoration: none;
    }
  }
`;

const bounceDownLg = keyframes`
  0%{
    transform: translate3d(0, 0, 0);
  },
  30%{
    transform: translate3d(0, -5%, 0);
  }
  60%{
    transform: translate3d(0, -10%, 0);
  }
  100%{
    transform: translate3d(0, 0,0);
  }
`;

const bounceDown = keyframes`
  0%{
    transform: translate3d(0, 0, 0);
  },
  30%{
    transform: translate3d(0, -20%, 0);
  }
  60%{
    transform: translate3d(0, -30%, 0);
  }
  100%{
    transform: translate3d(0, 0,0);
  }
`;

const ImageBox = styled.div`
  position: relative;
  width: 100%;
  img[data-role='logo'] {
    position: absolute;
    top: 3%;
    left: 30%;
    width: 40%;
    animation: ${bounceDownLg} 3s linear infinite;
  }
  img[data-role='goldL'] {
    position: absolute;
    bottom: 50%;
    left: 12%;
    width: 8%;
    animation: ${bounceDown} 3s linear infinite;
    animation-delay: 0.2s;
  }
  img[data-role='goldR'] {
    position: absolute;
    top: 10%;
    right: 15%;
    width: 6.6%;
    animation: ${bounceDown} 3s linear infinite;
    animation-delay: 0.5s;
  }
`;

export default () => {
  const typeRef = React.useRef(null);
  useEffect(() => {
    if (typeRef) {
      init(typeRef.current, { strings: ['Empowering Web3.0 & Next Generation Technology '] });
    }
  }, []);
  return (
    <Pages data-inspector="ventures_page">
      <Banner data-inspector="ventures_page_banner">
        <LayoutBox>
          <Content>
            <Row align="center" justify="space-between">
              <Col lg={11} md={11} sm={14}>
                <Slogan ref={typeRef} />
                <Desc>
                  KuCoin Ventures supports crypto and Web 3.0 builders both financially and
                  strategically with deep insights and global resources.
                </Desc>
              </Col>
              <Col lg={10} md={10} sm={10}>
                <ImageBox>
                  <img data-role="goldL" src={goldL} alt="gold logo" />
                  <img data-role="logo" src={kucoinSvg} alt="logo" />
                  <Image src={banner} alt="banner" />
                  <img data-role="goldR" src={goldR} alt="gold r" />
                </ImageBox>
              </Col>
            </Row>
          </Content>
        </LayoutBox>
      </Banner>
      <LayoutBox>
        <Content>
          <Story data-inspector="ventures_story" className="wow fadeInUp">
            <TextBox>
              <Title>Our Story</Title>
              <Subtitle>The leading investment arm of KuCoin Exchange.</Subtitle>
              <StoryDesc>
                KuCoin Ventures aims to invest in the most disruptive crypto and blockchain projects
                of the Web 3.0 era.
              </StoryDesc>
              <StoryDesc data-role="second">
                As a community-friendly and research-driven investor, KuCoin Ventures works closely
                with portfolio projects throughout the entire life cycle, with a focus on DeFi,
                GameFi, and other Web3.0 infrastructures.
              </StoryDesc>
            </TextBox>
          </Story>
        </Content>
      </LayoutBox>
      <PortfolioBox>
        <LayoutBox>
          <Content>
            <Portfolio data-inspector="ventures_portfolio">
              <h2 className="title">Portfolio</h2>
              <Row
                gutter={[
                  { lg: 48, md: 40, sm: 12 },
                  { lg: 48, md: 40, sm: 12 },
                ]}
              >
                {portfolios.map(({ icon, name, desc }) => {
                  return (
                    <Col span={6} key={name} className="wow fadeInUp">
                      <PortfolioItem>
                        <img src={icon} alt="portfolio icon" />
                        <p data-role="title">{name}</p>
                        <p data-role="desc">{desc}</p>
                      </PortfolioItem>
                    </Col>
                  );
                })}
              </Row>
            </Portfolio>
          </Content>
        </LayoutBox>
      </PortfolioBox>
      <Opportunity />
      <ContractBox>
        <LayoutBox>
          <Content className="wow fadeInUp">
            <ContractTitle>You could find us via</ContractTitle>
            <ContractDesc>
              Email
              <a
                style={{ margin: '0 4px' }}
                href="mailto:KCBP@corp.kucoin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                KCBP@corp.kucoin.com
              </a>
              or
              <a
                style={{ margin: '0 4px' }}
                href="https://twitter.com/KuCoinVentures"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </ContractDesc>
            <ButtonBox>
              <Button as="a" href="mailto:KCBP@corp.kucoin.com" fullWidth size="large">
                Apply Now
              </Button>
            </ButtonBox>
          </Content>
        </LayoutBox>
      </ContractBox>
    </Pages>
  );
};
