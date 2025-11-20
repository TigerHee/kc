/**
 * Owner: willen@kupotech.com
 */
import React from 'react';

import { px2rem } from '@kufox/mui';
import { styled } from '@kufox/mui';
import { Box } from '@kufox/mui';
import Icon1 from 'static/join-us/icon_1.png';
import Icon2 from 'static/join-us/icon_2.png';
import Icon3 from 'static/join-us/icon_3.png';
import Icon4 from 'static/join-us/icon_4.png';
import Icon5 from 'static/join-us/icon_5.png';
import Icon6 from 'static/join-us/icon_6.png';
import { _t } from 'src/tools/i18n';

const Wrapper = styled(Box)`
  background: #fff;
  padding: ${px2rem(60)} 0;
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: ${px2rem(40)} 0;
  }
`;

const LayoutBox = styled.div`
  padding: 0 ${px2rem(24)};
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 0 ${px2rem(12)};
  }
`;

const Content = styled.div`
  margin: auto;
  width: 100%;
  max-width: ${px2rem(1200)};
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text};
  font-size: ${px2rem(36)};
  line-height: ${px2rem(40)};
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(24)};
    line-height: ${px2rem(40)};
  }
`;

const Cards = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(6, 1fr);
  margin-top: ${px2rem(60)};
  ${(props) => props.theme.breakpoints.down('lg')} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    grid-row-gap: ${px2rem(30)};
    grid-template-columns: repeat(2, 1fr);
    margin-top: ${px2rem(20)};
  }
`;

const Card = styled.div``;

const Icon = styled.img`
  width: ${px2rem(70)};
  height: ${px2rem(64)};
`;

const CardTitle = styled.h3`
  font-weight: 500;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${px2rem(20)};
  margin-top: ${px2rem(50)};
  font-size: ${px2rem(24)};
  line-height: ${px2rem(24)};
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: ${px2rem(28)};
    font-size: ${px2rem(20)};
    line-height: ${px2rem(32)};
  }
`;
const CardDesc = styled.p`
  p {
    margin: 0;
    color: ${(props) => props.theme.colors.text60};
    font-weight: 400;
    font-size: ${px2rem(16)};
    line-height: ${px2rem(26)};
    ${(props) => props.theme.breakpoints.down('sm')} {
      font-size: ${px2rem(14)};
      line-height: ${px2rem(22)};
    }
  }
`;

const configs = [
  {
    icon: Icon1,
    title: () => _t('application.joinus.14.1'),
    desc: () => [
      <p key={1}>{_t('application.joinus.14.1.1')}</p>,
      <p key={2}>{_t('application.joinus.14.1.2')}</p>,
    ],
  },
  {
    icon: Icon2,
    title: () => _t('application.joinus.14.2'),
    desc: () => [
      <p key={3}>{_t('application.joinus.14.2.1')}</p>,
      <p key={4}>{_t('application.joinus.14.2.2')}</p>,
    ],
  },
  {
    icon: Icon3,
    title: () => _t('application.joinus.14.3'),
    desc: () => [
      <p key={5}>{_t('application.joinus.14.3.1')}</p>,
      <p key={6}>{_t('application.joinus.14.3.2')}</p>,
      <p key={7}>{_t('application.joinus.14.3.3')}</p>,
    ],
  },
  {
    icon: Icon4,
    title: () => _t('application.joinus.14.4'),
    desc: () => [
      <p key={8}>{_t('application.joinus.14.4.1')}</p>,
      <p key={9}>{_t('application.joinus.14.4.2')}</p>,
    ],
  },
  {
    icon: Icon5,
    title: () => _t('application.joinus.14.5'),
    desc: () => [
      <p key={14}>{_t('application.joinus.14.5.2')}</p>,
      <p key={15}>{_t('application.joinus.14.5.3')}</p>,
      <p key={16}>{_t('application.joinus.14.5.4')}</p>,
      <p key={17}>{_t('application.joinus.14.5.5')}</p>,
      <p key={18}>{_t('application.joinus.14.5.6')}</p>,
      <p key={19}>{_t('application.joinus.14.5.7')}</p>,
      <p key={20}>{_t('application.joinus.14.5.8')}</p>,
    ],
  },
  {
    icon: Icon6,
    title: () => _t('application.joinus.15'),
    desc: () => [
      <p key={10}>{_t('application.joinus.15.2')}</p>,
      <p key={11}>{_t('application.joinus.15.3')}</p>,
      <p key={12}>{_t('application.joinus.15.4')}</p>,
      <p key={13}>{_t('application.joinus.15.5')}</p>,
    ],
  },
];

export default () => {
  return (
    <div data-inspector="careers_welfare" className="wow fadeInUp">
      <Wrapper>
        <LayoutBox>
          <Content>
            <Title>{_t('application.joinus.DB')}</Title>
            <Cards>
              {configs.map(({ icon, title, desc }, idx) => {
                let className = 'wow slideInLeft';
                if (+idx > 2) {
                  className = 'wow slideInRight';
                }
                return (
                  <Card key={idx} className={className}>
                    <Icon src={icon} />
                    <CardTitle>{title()}</CardTitle>
                    <CardDesc>{desc()}</CardDesc>
                  </Card>
                );
              })}
            </Cards>
          </Content>
        </LayoutBox>
      </Wrapper>
    </div>
  );
};
