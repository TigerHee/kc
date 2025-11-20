/**
 * Owner: tom@kupotech.com
 */

import React from 'react';
import { map } from 'lodash';
import { useSelector } from 'dva';
import { styled } from '@kufox/mui/emotion';
import { openPage } from 'helper';
import { _t } from 'utils/lang';
import BlockTitle from '../common/BlockTitle';
import { getRuleUrl, NFT_LIST } from '../config';
import titleSvg from 'assets/cryptoCup/total-prize-bg.png';
import moneySvg from 'assets/cryptoCup/total-prize-money.svg';
import questionSvg from 'assets/cryptoCup/icon-question.svg';
import AntiDuplication from 'components/common/AntiDuplication';

const Wrapper = styled.div`
  margin-top: 24px;
`;

const Content = styled.div`
  margin-top: 16px;
  padding: 16px 12px;
  border: 1px solid #51eaac;
  border-radius: 12px;
  background-color: #fff;
`;

const InfoBox = styled.div`
  background: #f2fff5;
  border-radius: 4px;
  display: flex;
`;

const TitleImg = styled.img`
  width: 107px;
`;

const TitleBox = styled.div``;

const Title = styled.div`
  margin-top: 12px;
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  color: #000d1d;
`;

const Money = styled.img`
  /* margin-top: 6px; */
  margin-top: -2px;
  width: 128px;
`;

const NftBox = styled(InfoBox)`
  padding: 8px 8px;
  margin-top: 12px;
`;

const NftScroll = styled.div`
  padding: 4px 0 4px 4px;
  overflow-x: hidden;
  background: linear-gradient(180deg, #caf5e0 0%, rgba(202, 245, 224, 0) 100%);
  border-radius: 4px;
`;

const SliderWrapper = styled.div`
  display: inline-flex;
  animation: moveAnimation 10s linear infinite;

  @keyframes moveAnimation {
    from {
      transform: translate(0, 0);
    }

    to {
      transform: translate(-50%, 0);
    }
  }
`;

const NftItem = styled.div`
  margin-right: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NftImg = styled.img`
  width: 66px;
  height: 69px;
  border-radius: 4px;
`;

const NftName = styled.div`
  margin-top: -13px;
  padding: 2px 4px 2px 8px;
  width: 74px;
  text-align: center;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  color: #328c6c;
  background-color: #9af6cd;
  border-radius: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Tips = styled.div`
  margin-top: 12px;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: #2dc985;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-align: center;
`;

const TipsIcon = styled.img`
  width: 12px;
  margin-left: 4px;
  margin-top: -2px;
`;

function TotalPrize() {
  const { isInApp, currentLang } = useSelector(state => state.app);

  return (
    <Wrapper>
      <BlockTitle name={_t('cryptoCup.finals.title')} />
      <Content>
        <InfoBox>
          <TitleImg src={titleSvg} alt="" />
          <TitleBox>
            <Title>{_t('cryptoCup.finals.info')}</Title>
            <Money src={moneySvg} alt="" />
          </TitleBox>
        </InfoBox>

        <NftBox>
          <NftScroll>
            <SliderWrapper>
              {map(NFT_LIST.concat(NFT_LIST), (item, index) => (
                <NftItem key={index}>
                  <NftImg src={item.url} alt="" />
                  <NftName>{item.title}</NftName>
                </NftItem>
              ))}
            </SliderWrapper>
          </NftScroll>
        </NftBox>

        <AntiDuplication>
          <Tips onClick={() => openPage(isInApp, getRuleUrl(currentLang))}>
            <span>
              <>{_t('cryptoCup.finals.tips')}</>
              <TipsIcon src={questionSvg} alt="" />
            </span>
          </Tips>
        </AntiDuplication>
      </Content>
    </Wrapper>
  );
}

export default TotalPrize;
