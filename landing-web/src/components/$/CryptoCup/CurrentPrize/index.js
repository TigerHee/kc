/**
 * Owner: tom@kupotech.com
 */

import React from 'react';
import { map } from 'lodash';
import { styled } from '@kufox/mui/emotion';
import { _t } from 'utils/lang';
import BlockTitle from '../common/BlockTitle';
import PrizeTitle from './PrizeTitle';
import Tips from './Tips';
import { WIN_LIST, FAIL_LIST } from '../config';
import prizeWordSvg from 'assets/cryptoCup/prize-word.svg';
import prizeFailSvg from 'assets/cryptoCup/prize-fail.png';
import failBoxSvg from 'assets/cryptoCup/prize-fail-box.svg';
import prizeBlindBoxSvg from 'assets/cryptoCup/prize-blind-box.png';

const Wrapper = styled.div`
  margin-top: 24px;
`;

const Content = styled.div`
  margin-top: 18px;
  padding: 18px 12px 12px 12px;
  border: 1px solid #51eaac;
  border-radius: 12px;
  position: relative;
  background-color: #fff;
`;

const TitleBox = styled.div`
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
`;

const WinBox = styled.div`
  padding: 12px;
  background: linear-gradient(
    178.97deg,
    rgba(255, 255, 224, 0.5) 0.88%,
    rgba(255, 244, 204, 0.7) 124.85%
  );
  border-radius: 4px;
  position: relative;
`;

const PrizeImgBox = styled.div`
  margin: 20% 0 20% -12px;
  width: calc(100% + 24px);
  position: relative;
`;

const PrizeWord = styled.img`
  width: 100%;
`;

const PrizeBlindBox = styled.img`
  width: 66.2%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const WinPrizeBox = styled.div`
  overflow-x: hidden;
  padding: 8px 0 10px 0;
  border: 1px solid #ffe78a;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.4);
`;

const SliderWrapper = styled.div`
  display: inline-flex;
  animation: moveAnimation ${props => props.time || '10s'} linear infinite;

  @keyframes moveAnimation {
    from {
      transform: translate(0, 0);
    }

    to {
      transform: translate(-50%, 0);
    }
  }
`;

const WinPrizeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 2px;
`;

const WinPrizeImg = styled.img`
  width: 40px;
`;

const WinPrizeName = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
  color: #2dc985;
  text-align: center;
  word-break: break-word;
`;

const FailBox = styled.div`
  margin-top: 22px;
  padding: 31px 12px 12px 12px;
  background: #f7f7f7;
  border-radius: 4px;
  position: relative;
`;

const FailContent = styled.div`
  margin-top: 19px;
  display: flex;
  position: relative;
`;

const FailImg = styled.img`
  width: 61px;
  height: 80px;
  margin-left: 7px;
`;

const FailPrizeBoxImg = styled.img`
  width: 8px;
  position: absolute;
  left: 76px;
  top: 50%;
  transform: translateY(-50%);
`;

const FailPrizeBox = styled.div`
  overflow-x: hidden;
  flex: 1;
  margin-left: 15px;
  padding: 7px 0 10px 0;
  border: 1px solid #b6efff;
  border-radius: 8px;
  background-color: #fff;
`;

const FailPrizeItem = styled(WinPrizeItem)``;

const FailPrizeImg = styled(WinPrizeImg)``;

const FailPrizeName = styled(WinPrizeName)`
  color: rgba(0, 13, 29, 0.68);
`;

function CurrentPrize() {
  return (
    <Wrapper>
      <BlockTitle name={_t('cryptoCup.blindBox.title')} />
      <Content>
        <TitleBox>
          <PrizeTitle title={_t('cryptoCup.blindBox.win')} />
        </TitleBox>

        <WinBox>
          <Tips title={_t('xpUoij8QjxvK99td8gWdTM')} type={1} />
          <PrizeImgBox>
            <PrizeWord src={prizeWordSvg} alt="" />
            <PrizeBlindBox src={prizeBlindBoxSvg} alt="" />
          </PrizeImgBox>
          <WinPrizeBox>
            <SliderWrapper>
              {map(WIN_LIST.concat(WIN_LIST), (item, index) => (
                <WinPrizeItem key={index}>
                  <WinPrizeImg src={item.icon} alt="" />
                  <WinPrizeName>{item.title()}</WinPrizeName>
                </WinPrizeItem>
              ))}
            </SliderWrapper>
          </WinPrizeBox>
        </WinBox>

        <FailBox>
          <TitleBox>
            <PrizeTitle title={_t('cryptoCup.blindBox.fail')} />
          </TitleBox>
          <Tips title={_t('bHmL6A1iGh6SQbkdbLuT72')} type={2} />
          <FailContent>
            <FailImg src={prizeFailSvg} alt="" />
            <FailPrizeBoxImg src={failBoxSvg} alt="" />
            <FailPrizeBox>
              <SliderWrapper time="6s">
                {map(FAIL_LIST.concat(FAIL_LIST), (item, index) => (
                  <FailPrizeItem key={index}>
                    <FailPrizeImg src={item.icon} alt="" />
                    <FailPrizeName>{item.title()}</FailPrizeName>
                  </FailPrizeItem>
                ))}
              </SliderWrapper>
            </FailPrizeBox>
          </FailContent>
        </FailBox>
      </Content>
    </Wrapper>
  );
}

export default CurrentPrize;
