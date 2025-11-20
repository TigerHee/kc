/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, {memo} from 'react';
import styled from '@emotion/native';
import useTracker from 'hooks/useTracker';

import {openLink} from 'utils/helper';
import {isUndef} from 'utils/helper';
import {openNative} from '@krn/bridge';
import {TouchableOpacity} from 'react-native';
import explore from 'assets/convert/explore.png';
import exploreDark from 'assets/convert/explore_dark.png';
import crypto from 'assets/convert/crypto.png';
import cryptoDark from 'assets/convert/crypto_dark.png';
import arrowDark from 'assets/convert/arrow_dark.png';
import arrowLight from 'assets/convert/arrow_light.png';
import ThemeImage from 'components/Common/ThemeImage';
import useLang from 'hooks/useLang';
import {getIsKC} from 'site/index';
import CompliantRule from 'components/Common/CompliantRule';
import {useSelector} from 'react-redux';

const LIST = [
  {
    title: '22Wx6pcmGnR7nE6tKPuFmf',
    content: 'jkawe4taCfxkXrLWecboEP',
    icon: 'explore',
    id: 'ConvertPlus',
    track: {blockId: 'ConvertPlusNew', locationId: '1'},
    callback: () => openLink('/earn-h5/convert-plus?isBanner=1'),
    spmId: 'kcApp.BSfastTradeNew.ConvertPlusNew.1',
  },
  {
    title: '6z7WHe6QY5Bz5cUu7ZBfd2',
    content: 'i7oi63cpvd6VHHYJ9LeEud',
    icon: 'crypto',
    id: 'Express',
    track: {blockId: 'ExpressNew', locationId: '1'},
    callback: () => openNative('/otc?type=2'),
    spmId: 'kcApp.BSfastTradeNew.ExpressNew.1',
  },
];

const Wrapper = styled.View`
  margin-top: 48px;
`;

const Title = styled.Text`
  font-size: 18px;
  color: ${({theme}) => theme.colorV2.text};
  line-height: 23.4px;
  margin-bottom: 4px;
  font-weight: 700;
`;

const Item = styled.View`
  border-radius: 12px;
  background-color: ${({theme}) => theme.colorV2.cover2};
  padding: 20px 16px;

  margin-top: 12px;
`;

const ItemTitleWrapper = styled.View`
  align-items: center;
  flex-direction: row;
`;

const ItemTitle = styled.Text`
  font-size: 14px;
  font-weight: 700;
  line-height: 18.2px;
  color: ${({theme}) => theme.colorV2.text};
`;

const ItemArrow = styled(ThemeImage)`
  width: 16px;
  height: 16px;
  margin-left: 8px;
`;

const ItemContent = styled.Text`
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  color: ${({theme}) => theme.colorV2.text40};
  margin-right: 68px;
  margin-top: 8px;
`;

const ItemImage = styled(ThemeImage)`
  position: absolute;
  right: 16px;
  bottom: 15px;
  width: 48px;
  height: 48px;
`;

/**
 * More
 */
const More = memo(props => {
  const {...restProps} = props;
  const {_t} = useLang();
  const {onClickTrack} = useTracker();
  const isKC = getIsKC();
  const configs = useSelector(state => state.app.compliantRuleConfigs);

  const handlePress = (track, callback) => {
    onClickTrack(track);

    callback && callback();
  };

  const showTitle =
    configs !== null && LIST.some(({spmId}) => isUndef(configs[spmId]));

  return (
    <Wrapper {...restProps}>
      {showTitle && <Title>{_t('emvtMKZCSLm7GwXK3afhBX')}</Title>}

      {LIST.map(({title, content, icon, track, spmId, id, callback}) => {
        if (!isKC && id === 'ConvertPlus') return null;

        return (
          <CompliantRule spmId={spmId} key={id}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => handlePress(track, callback)}
              key={id}>
              <Item bg={icon}>
                <ItemTitleWrapper>
                  <ItemTitle>{_t(title)}</ItemTitle>
                  <ItemArrow lightSrc={arrowLight} darkSrc={arrowDark} />
                </ItemTitleWrapper>
                <ItemContent>{_t(content)}</ItemContent>
                <ItemImage
                  lightSrc={icon === 'explore' ? explore : crypto}
                  darkSrc={icon === 'explore' ? exploreDark : cryptoDark}
                  pointerEvents="none"
                />
              </Item>
            </TouchableOpacity>
          </CompliantRule>
        );
      })}
    </Wrapper>
  );
});

export default More;
