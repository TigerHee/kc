/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { styled } from '@kufox/mui/emotion';
import { map, slice } from 'lodash';
import { px2rem as _r } from '@kufox/mui/utils';
import { useEventCallback } from '@kufox/mui/hooks';
import groupIcon from 'assets/NFTQuiz/nft-group.png';
import { sensors } from 'utils/sensors';
import { openPage } from 'helper';
import { addLangToPath } from 'utils/lang';
import { KUCOIN_HOST } from 'utils/siteConfig';
import { _t } from 'utils/lang';
import Card from '../Card';
import { useQuizContext } from '../context';
import {
  Row,
  Title,
  DESC,
} from './styled';


const BuyDesc =styled(DESC)`
  margin-bottom: ${_r(20)};
`;
const LogoGroup = styled.section`
  position: relative;
`;
const LogoItem = styled.img`
  position: relative;
  align-self: center;
  width: ${_r(71)};
  height: ${_r(56)};
`;

const LogoItemWithFloat = styled(LogoItem)`
  position: absolute;
  left: 44%;
  top: 10%;
`;


const Wrapper = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${_r(16)} 0;
  min-height: ${_r(100)};
  background: rgba(29, 33, 36, 0.4);
  padding: ${_r(16)};
`;

const logoList = [groupIcon];

const Buy = () => {
  const showList = slice(logoList, 0, 2);
  const { btnClickCheck, currentLang, isInApp } = useQuizContext();
  const clickBuy = useEventCallback(async () => {
    if (!(await btnClickCheck())) return;
    // 跳转购买NFT界面
    const nftUrl = addLangToPath(`${KUCOIN_HOST}/nft-token/intro`);
    openPage(isInApp, nftUrl);
    sensors.trackClick(['NFT', '1'], {
      language: currentLang,
    });
  });
  return (
    <Wrapper onClick={clickBuy}>
      <Row>
        <div style={{ flex: 1, marginRight: _r(6) }}>
          <Title>{_t('d7XZLj47wfzcJLVfvwsCCG')}</Title>
          <BuyDesc>{_t('qdvz3KN2aLGAmL3Z2K2XGM')}</BuyDesc>
        </div>
      </Row>
      <LogoGroup>
        {
          map(showList, (logo, index) => {
            const View = index === 0 ? LogoItem : LogoItemWithFloat;
            return (
              <View
                key={index}
                src={logo}
              >
              </View>
            )
          })
        }
      </LogoGroup>
    </Wrapper>
  );
};

export default Buy;