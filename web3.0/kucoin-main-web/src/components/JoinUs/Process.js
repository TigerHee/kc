/**
 * Owner: willen@kupotech.com
 */
import React, { useCallback } from 'react';
import { px2rem } from '@kufox/mui';
import { styled } from '@kufox/mui';
import { Box, Button } from '@kufox/mui';
import { push } from 'utils/router';
import Card1 from 'static/join-us/01.svg';
import Card2 from 'static/join-us/02.svg';
import Card3 from 'static/join-us/03.svg';
import Card4 from 'static/join-us/04.svg';
import Card1_h5 from 'static/join-us/01_h5.svg';
import Card2_h5 from 'static/join-us/02_h5.svg';
import Card3_h5 from 'static/join-us/03_h5.svg';
import Card4_h5 from 'static/join-us/04_h5.svg';
// import Modal from 'components/PositionList/Modal';
import { useMediaQuery } from '@kufox/mui';
import { useResponsive } from '@kufox/mui';
import { _t, addLangToPath } from 'src/tools/i18n';
import { trackClick } from 'utils/ga';
import { TipProvider, useTipDialogStore } from 'components/JoinUs/TipDialog';

const Wrapper = styled(Box)`
  width: 100%;
  background: #f7f8fa;
  padding: ${px2rem(60)} ${px2rem(24)};
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: ${px2rem(40)} ${px2rem(12)};
  }
`;

const Content = styled(Box)`
  margin: auto;
  width: 100%;
  max-width: ${px2rem(1200)};
  padding-top: ${px2rem(60)};
  ${(props) => props.theme.breakpoints.down('md')} {
    position: relative;
    width: 60%;
  }
`;

const Title = styled.h2`
  font-weight: 500;
  color: ${(props) => props.theme.colors.text};
  line-height: ${px2rem(40)};
  text-align: center;
  font-size: ${px2rem(38)};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: ${px2rem(24)};
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: ${(props) => props.theme.colors.divider};
  position: absolute;
  left: 0;
  right: 0;
  top: ${px2rem(96)};
`;

const CardsWrapper = styled.div`
  width: 100%;
`;

const Cards = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Card = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  width: ${px2rem(90)};
  height: ${px2rem(108)};
`;

const Dot = styled.div`
  width: ${px2rem(12)};
  height: ${px2rem(12)};
  border-radius: 100%;
  background: ${(props) => props.theme.colors.primary};
  margin-top: ${px2rem(-18)};
`;

const Boxes = styled(Box)`
  position: relative;
  clear: both;
`;
const Tips = styled.div`
  font-size: ${px2rem(24)};
  line-height: ${px2rem(24)};
  color: ${(props) => props.theme.colors.text};
  margin-top: ${px2rem(22)};
`;

const CardH5 = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  list-style-type: none;
`;

const DividerH5 = styled.div`
  width: 1px;
  height: ${px2rem(298)};
  margin: auto;
  background: ${(props) => props.theme.colors.divider};
  position: absolute;
  top: ${px2rem(78)};
  left: 50%;
  transform: translateX(-50%);
`;

const DotH5 = styled.div`
  width: ${px2rem(12)};
  height: ${px2rem(12)};
  border-radius: 100%;
  background: ${(props) => props.theme.colors.primary};
  &:first-child {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  &:nth-child(2) {
    position: absolute;
    top: 33.3%;
    left: 50%;
    transform: translateX(-50%);
  }
  &:nth-child(3) {
    position: absolute;
    top: 66.6%;
    left: 50%;
    transform: translateX(-50%);
  }
  &:nth-child(4) {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const ImageH5 = styled.img``;

const TipsH5 = styled.div`
  font-size: ${px2rem(20)};
  line-height: ${px2rem(24)};
  color: ${(props) => props.theme.colors.text};
  max-width: 35%;
  text-align: right;
`;

const CardWrapperH5 = styled.ul`
  width: 100%;
  height: ${px2rem(332)};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default () => {
  useResponsive();
  const sm = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { openDialog: openTipDialog } = useTipDialogStore();
  const onBtnClick = useCallback(
    (e) => {
      e?.preventDefault();
      /** 点击埋点 */
      trackClick(['AppleNow', '1']);
      /** 打开三方跳转提醒弹窗 */
      openTipDialog();
    },
    [openTipDialog],
  );

  return (
    <div data-inspector="careers_join" className="wow fadeInUp">
      <Wrapper>
        <Title>{_t('application.joinus')}</Title>
        {sm ? (
          <Content>
            <CardWrapperH5>
              <CardH5>
                <ImageH5 src={Card1_h5} />
                <TipsH5>{_t('application.joinus.16.1')}</TipsH5>
              </CardH5>
              <CardH5>
                <ImageH5 src={Card2_h5} />
                <TipsH5>{_t('application.joinus.16.2')}</TipsH5>
              </CardH5>
              <CardH5>
                <ImageH5 src={Card3_h5} />
                <TipsH5>{_t('application.joinus.16.3')}</TipsH5>
              </CardH5>
              <CardH5>
                <ImageH5 src={Card4_h5} />
                <TipsH5>{_t('application.joinus.16.4')}</TipsH5>
              </CardH5>
            </CardWrapperH5>
            <DividerH5>
              <DotH5 />
              <DotH5 />
              <DotH5 />
              <DotH5 />
            </DividerH5>
            <Box display="flex" justifyContent="center" mt={px2rem(40)}>
              <Button onClick={onBtnClick} size="large" data-inspector="ApplyNowBtn">
                {_t('application.joinus.16.5')}
              </Button>
            </Box>
          </Content>
        ) : (
          <Content>
            <Boxes>
              <Divider />
              <CardsWrapper>
                <Cards>
                  <Card>
                    <Image src={Card1} />
                    <Dot />
                    <Tips>{_t('application.joinus.16.1')}</Tips>
                  </Card>
                  <Card>
                    <Image src={Card2} />
                    <Dot />
                    <Tips>{_t('application.joinus.16.2')}</Tips>
                  </Card>
                  <Card>
                    <Image src={Card3} />
                    <Dot />
                    <Tips>{_t('application.joinus.16.3')}</Tips>
                  </Card>
                  <Card>
                    <Image src={Card4} />
                    <Dot />
                    <Tips>{_t('application.joinus.16.4')}</Tips>
                  </Card>
                </Cards>
              </CardsWrapper>
            </Boxes>
            <Box display="flex" justifyContent="center" mt={px2rem(56)}>
              <Button onClick={onBtnClick} size="large" data-inspector="ApplyNowBtn">
                {_t('application.joinus.16.5')}
              </Button>
            </Box>
          </Content>
        )}
      </Wrapper>
    </div>
  );
};
