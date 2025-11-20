import React from 'react';
import {Confirm} from '@krn/ui';

import {CommonStatusImageMap} from 'constants/image';
import {useIsLight} from 'hooks/useIsLight';
import useLang from 'hooks/useLang';
import {openH5Link} from 'utils/native-router-helper';
import {useAuKycLevelModalControl} from '../MountGlobalModal/hooks/useAuKycLevelModalControl';
import {AU_KYC_RESTRICT_TYPE} from './constant';
import {
  ButtonBox,
  CancelButton,
  CenterImg,
  ConfirmButton,
  Content,
  Desc,
  DescScroller,
  Title,
  Wrapper,
} from './styles';

/**
 * @param {(key: string) => string}
 * @param {string} restrictType
 * @returns {{title: string, desc: string, okText: string}}
 */
const getRestrictConfig = (_t, restrictType) => {
  // 文案调整：目前 跟单 申请带单两张场景 文案一致
  const configMap = {
    [AU_KYC_RESTRICT_TYPE.interceptApplyLeader]: {
      title: _t('e037f3b326e84000a59d'),
      desc: _t('d327fe7f9db24000a446'),
      okText: _t('ab22f93a54ae4000a77e'),
    },

    [AU_KYC_RESTRICT_TYPE.interceptCopyTrade]: {
      title: _t('e037f3b326e84000a59d'),
      desc: _t('d327fe7f9db24000a446'),
      okText: _t('ab22f93a54ae4000a77e'),
    },
  };

  return configMap[restrictType] || {};
};

/**
 * KYC地区限制modal
 */
const AuKycRestrictModal = () => {
  const {visible, interceptType, closeModal} = useAuKycLevelModalControl();
  const {_t} = useLang();
  const isLight = useIsLight();
  const {title, desc, okText} = getRestrictConfig(_t, interceptType);

  const gotoAccountPage = () => openH5Link('/account/kyc');

  return (
    <Confirm id="restrictModal" show={visible} onClose={closeModal}>
      <Wrapper>
        <Content>
          <CenterImg
            source={
              isLight
                ? CommonStatusImageMap.FailIcon
                : CommonStatusImageMap.FailDarkIcon
            }
          />
          <Title>{title}</Title>
          <DescScroller>
            <Desc>{desc}</Desc>
          </DescScroller>
          <ButtonBox>
            <CancelButton type="secondary" onPress={closeModal}>
              {_t('2f425ecc58da4000a949')}
            </CancelButton>

            <ConfirmButton onPress={gotoAccountPage}>{okText}</ConfirmButton>
          </ButtonBox>
        </Content>
      </Wrapper>
    </Confirm>
  );
};
export default AuKycRestrictModal;
