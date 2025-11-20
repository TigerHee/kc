import {useMount} from 'ahooks';
import {TRANSFER_ROUTER_SCENE_TYPE} from 'pages/AccountTransfer/constant';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {css} from '@emotion/native';
import {exitRN} from '@krn/bridge';

import {RouterNameMap} from 'constants/router-name-map';
import {ApplyTraderSuccessBackLeadController} from 'hooks/copyTrade/useApplyTraderBackLeadTabGuard';
import {useMutation} from 'hooks/react-query';
import useLang from 'hooks/useLang';
import {usePush} from 'hooks/usePush';
import useTracker from 'hooks/useTracker';
import {queryActiveLeadTraders} from 'services/copy-trade';
import {gotoMainLeadPage} from 'utils/native-router-helper';
import {
  CancelText,
  Container,
  Content,
  FixedBottomArea,
  StyledHeader,
  StyledSubmitBtn,
  SuccessDesc,
  SuccessIcon,
  SuccessText,
} from './styles';

const ApplySuccessResult = () => {
  const {_t} = useLang();
  const {onClickTrack} = useTracker();
  const {push} = usePush();
  const {mutateAsync, isLoading: isQueryUid} = useMutation({
    mutationFn: queryActiveLeadTraders,
    onSuccess: ({data}) => {
      const {uid: subUID} = data?.[0] || {};
      if (!subUID) {
        exitRN();
      }
      push(RouterNameMap.AccountTransfer, {
        subUID,
        scene: TRANSFER_ROUTER_SCENE_TYPE.applySuccess2TransferBackCopyHome,
      });
    },
  });

  useMount(async () => {
    await ApplyTraderSuccessBackLeadController.markBackMainPageActiveLeadTab();
  }, []);

  const gotoMainLeadPageWithTrack = async () => {
    onClickTrack({
      blockId: 'button',
      locationId: 'myLead',
    });
    gotoMainLeadPage();
  };

  const gotoTransferWithTrack = async () => {
    onClickTrack({
      blockId: 'button',
      locationId: 'gotoTransfer',
    });

    await mutateAsync();
  };
  return (
    <Container>
      <StyledHeader />

      <Content>
        <View
          style={css`
            align-items: center;
          `}>
          <SuccessIcon imgType="success" />
        </View>
        <SuccessText>{_t('2b00e42ca5c34000ae5a')}</SuccessText>
        <SuccessDesc>{_t('22f2f797141a4000a569')}</SuccessDesc>
      </Content>

      <FixedBottomArea>
        <StyledSubmitBtn
          loading={isQueryUid}
          size="large"
          onPress={gotoTransferWithTrack}>
          {_t('bb0b551a5f5c4000a62f')}
        </StyledSubmitBtn>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={gotoMainLeadPageWithTrack}>
          <CancelText>{_t('3fc0ca24ddc34000a905')}</CancelText>
        </TouchableOpacity>
      </FixedBottomArea>
    </Container>
  );
};

export default ApplySuccessResult;
