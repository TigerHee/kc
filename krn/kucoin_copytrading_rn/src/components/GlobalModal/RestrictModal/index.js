import React, {useMemo} from 'react';
import {Confirm} from '@krn/ui';

import {CommonStatusImageMap} from 'constants/image';
import {useIsLight} from 'hooks/useIsLight';
import useLang from 'hooks/useLang';
import {useRestrictModalControl} from '../MountGlobalModal/hooks/useRestrictModalControl';
import {RestrictType} from './constant';
import {
  ButtonBox,
  CenterImg,
  ConfirmButton,
  Content,
  Desc,
  DescScroller,
  Title,
  Wrapper,
} from './styles';

const getRestrictConfig = (_t, restrictType) => {
  const configMap = {
    [RestrictType.copyTradeRestrictFail]: {
      title: _t('e037f3b326e84000a59d'),
      desc: _t('c4769621841f4000ad2c'),
      okText: _t('bhfjS7Y6HXsKuQzsXGDpgQ'),
    },

    [RestrictType.restrictAreaLimit]: {
      title: _t('contract.restricted.area'),
      desc: _t('contract.restricted.area.content'),
      okText: _t('i.already.know'),
    },
  };

  return configMap[restrictType] || {};
};

const RestrictModal = () => {
  const {visible, restrictType, closeModal} = useRestrictModalControl();
  const {_t} = useLang();
  const isLight = useIsLight();
  const {title, desc, okText} = useMemo(
    () => getRestrictConfig(_t, restrictType),
    [_t, restrictType],
  );

  return (
    <Confirm id="restrictModal" show={visible} onClose={closeModal}>
      <Wrapper>
        <Content>
          <CenterImg
            source={
              isLight
                ? CommonStatusImageMap.WarnIcon
                : CommonStatusImageMap.WarnDarkIcon
            }
          />
          <Title>{title}</Title>
          <DescScroller>
            <Desc>{desc}</Desc>
          </DescScroller>
          <ButtonBox>
            <ConfirmButton onPress={closeModal}>{okText}</ConfirmButton>
          </ButtonBox>
        </Content>
      </Wrapper>
    </Confirm>
  );
};
export default RestrictModal;
