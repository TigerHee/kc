/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'dva';
import { styled } from '@kufox/mui/emotion';
import { _t } from 'utils/lang';
import CupCommonDialog from 'components/$/CryptoCup/common/CupCommonDialog';
import { HELP_WAY2_START_TIME } from '../config';
import useInviteLink from '../hooks/useInviteLink';
import Components from './Common';
import HelpPng from 'assets/cryptoCup/help.png';

const { BannerBox, Banner } = Components;

const Title = styled.h2`
  margin: 12px 0 4px;
  font-weight: 500;
  font-size: 18px;
  line-height: 26px;
  color: ${props => props.theme.colors.text};
`;

const Text = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 18px;
  color: ${props => props.theme.colors.text40};
`;

const IndentText = styled(Text)`
  padding-left: 11px;
  text-indent: -11px;
`;

const LinkText = styled.div`
  margin-top: 4px;
  padding: 7px 6px;
  font-size: 12px;
  line-height: 18px;
  color: rgba(0, 13, 29, 0.68);
  border: 1px solid rgba(0, 13, 29, 0.08);
  border-radius: 6px;
`;

const SubTitle = styled.h3`
  position: relative;
  margin: 12px 0 6px;
  padding-left: 11px;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: ${props => props.theme.colors.text};

  &::before {
    position: absolute;
    top: 5px;
    left: 0;
    content: '';
    height: 4px;
    width: 4px;
    display: block;
    background: #7ff2c0;
    border-radius: 50%;
  }
`;

const InviteModal = () => {
  const dispatch = useDispatch();
  const { inviteLink } = useInviteLink();
  const { serverTime } = useSelector(state => state.app);
  const { innviteModalVisible } = useSelector(state => state.cryptoCup);
  const startWay2 = typeof serverTime === 'number' && serverTime >= HELP_WAY2_START_TIME;

  const handleCancel = useCallback(
    () => {
      dispatch({
        type: 'cryptoCup/update',
        payload: { innviteModalVisible: false },
      });
    },
    [dispatch],
  );

  return (
    <CupCommonDialog
      open={innviteModalVisible}
      header={null}
      okText={_t('wHgKMikEBu4hBMhs9PTjSS')}
      onOk={handleCancel}
    >
      <BannerBox>
        <Banner src={HelpPng} alt="banner" />
      </BannerBox>
      <Title>{_t('s4HiQpaMnSGyxW2Y7xfqy8')}</Title>
      <Text>{_t('jvAiu8d4YkkLtwS4XbW9Mq')}</Text>
      <LinkText>{inviteLink}</LinkText>
      <SubTitle>{_t('ezxjjuiuDgzf14Pam2Ds8q')}</SubTitle>
      <IndentText>{_t('fojvg3TV4PeDy4XgV3mMzh')}</IndentText>
      <IndentText>{_t('rRo6XMrEpcUqvwiSQintEb')}</IndentText>
      <>
        {startWay2 ? (
          <>
            <SubTitle>{_t('jZgzjomiPdVRAgi2uunzxm')}</SubTitle>
            <IndentText>{_t('4kSb1kLeY9p9uYLDVk1y9Q')}</IndentText>
            <IndentText>{_t('3EmM4sq5m2qhU7cZQqKDMA')}</IndentText>
          </>
        ) : null}
      </>
    </CupCommonDialog>
  );
};

export default InviteModal;
