/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { px2rem } from '@kufox/mui';
import { styled } from '@kufox/mui';
import { Box } from '@kufox/mui';
import card1 from 'static/join-us/card1.svg';
import card2 from 'static/join-us/card2.svg';
import card3 from 'static/join-us/card3.svg';
import { _t } from 'src/tools/i18n';

const Wrapper = styled(Box)`
  margin-top: ${px2rem(60)};
  padding: 0 ${px2rem(24)};
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: ${px2rem(40)};
    padding: 0 ${px2rem(12)};
  }
`;

const Cards = styled.div`
  display: grid;
  max-width: ${px2rem(1200)};
  margin: ${px2rem(60)} auto 0 auto;
  width: 100%;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: ${px2rem(64)};
  ${(props) => props.theme.breakpoints.down('lg')} {
    grid-row-gap: ${px2rem(40)};
    grid-column-gap: ${px2rem(18)};
    grid-template-columns: repeat(2, 1fr);
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    grid-template-columns: repeat(1, 1fr);
    margin-top: ${px2rem(20)};
  }
`;

const Title = styled.h2`
  font-weight: 500;
  line-height: ${px2rem(40)};
  font-size: ${px2rem(38)};
  text-align: center;
  ${(props) => props.theme.breakpoints.up('sm')} {
    display: block;
    margin: auto;
  }
`;

const Card = styled.div`
  width: 100%;
`;

const Image = styled.img`
  width: 100%;
`;

const CardTitle = styled.h3`
  font-weight: 500;
  line-height: ${px2rem(24)};
  color: ${(props) => props.theme.colors.text};
  margin-top: ${px2rem(33)};
  ${(props) => props.theme.breakpoints.up('sm')} {
    font-size: ${px2rem(20)};
  }
  ${(props) => props.theme.breakpoints.up('md')} {
    font-size: ${px2rem(24)};
  }
  ${(props) => props.theme.breakpoints.up('lg')} {
    font-size: ${px2rem(24)};
  }
`;

const CardTip = styled.p`
  color: ${(props) => props.theme.colors.text60};
  line-height: ${px2rem(26)};
  margin-top: ${px2rem(16)};
  font-size: ${px2rem(16)};
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: ${px2rem(8)};
    font-size: ${px2rem(14)};
  }
  p {
    margin: 0;
  }
`;

const Describe = styled.div`
  width: 100%;
`;

export default () => {
  return (
    <div data-inspector="careers_advantage" className="wow fadeInUp">
      <Wrapper>
        <Title>{_t('application.joinus.1')}</Title>
        <Box mt={px2rem(40)} display="flex" justifyContent="center">
          <Cards>
            <Card className="wow fadeInUp" data-wow-delay="0.1s">
              <Image src={card1} />
              <Describe>
                <CardTitle>{_t('application.joinus.2')}</CardTitle>
                <CardTip>
                  <p>{_t('application.joinus.3')}</p>
                  <p>{_t('application.joinus.4')}</p>
                </CardTip>
              </Describe>
            </Card>
            <Card className="wow fadeInUp" data-wow-delay="0.2s">
              <Image src={card2} />
              <Describe>
                <CardTitle>{_t('application.joinus.5')}</CardTitle>
                <CardTip>
                  <p>{_t('application.joinus.6')}</p>
                  <p>{_t('application.joinus.7')}</p>
                  <p>{_t('application.joinus.8')}</p>
                </CardTip>
              </Describe>
            </Card>
            <Card className="wow fadeInUp" data-wow-delay="0.3s">
              <Image src={card3} />
              <Describe>
                <CardTitle>{_t('application.joinus.9')}</CardTitle>
                <CardTip>
                  <p>{_t('application.joinus.10')}</p>
                  <p>{_t('application.joinus.11')}</p>
                  <p>{_t('application.joinus.12')}</p>
                </CardTip>
              </Describe>
            </Card>
          </Cards>
        </Box>
      </Wrapper>
    </div>
  );
};
