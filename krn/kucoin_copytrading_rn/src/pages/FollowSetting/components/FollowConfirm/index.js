import {useMemoizedFn, useToggle} from 'ahooks';
import {useGetFormSceneStatus} from 'pages/FollowSetting/hooks/useGetFormSceneStatus';
import React, {
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {css} from '@emotion/native';
import {RichLocale} from '@krn/ui';

import {ConfirmPopup} from 'components/Common/Confirm';
import EllipsisText from 'components/Common/EllipsisText';
import Radio from 'components/Common/Radio';
import {EnhanceRadioType} from 'components/Common/Radio/Radio';
import {AgreementList} from 'components/copyTradeComponents/AgreementList';
import {UserAvatar} from 'components/copyTradeComponents/UserInfo';
import {AGREEMENT_SCENE_TYPE} from 'constants/index';
import {RowWrap} from 'constants/styles';
import {useAgreementListQuery} from 'hooks/copyTrade/queries/useAgreementListCenter';
import useLang from 'hooks/useLang';
import {convertPxToReal} from 'utils/computedPx';
import {useSubmit} from '../../hooks/useSubmit';
import {makeConfirmDescList} from './constant';
import DescItem from './DescItem';
import {
  AgreementText,
  AvatarName,
  ConfirmContent,
  RiskTipCard,
  RiskTipText,
  RiskWarp,
  UserInfoBox,
  userInfoStyles,
} from './styles';

const scene = AGREEMENT_SCENE_TYPE.COPY_TRADE;
const FollowConfirm = forwardRef((props, ref) => {
  const {userInfo} = props;
  const [showCancelFollowerDialog, {setRight: open, setLeft: closeConfirm}] =
    useToggle(false);
  const [confirmPayload, setConfirmPayload] = useState();
  const {isReadonly} = useGetFormSceneStatus();

  const {
    isSignPass,
    isFetched,
    isLoading: isPullAgreementLoading,
  } = useAgreementListQuery({scene, disabled: isReadonly});

  const {_t} = useLang();
  const [isAgree, {toggle: toggleAgreement}] = useToggle(false);

  const {submit, isLoading} = useSubmit({
    confirmPayload,
    closeConfirm,
    isAgree,
    isSignPass,
  });

  const openConfirm = useMemoizedFn(payload => {
    setConfirmPayload(payload);
    open();
  });

  const confirmDescList = useMemo(
    () => makeConfirmDescList(confirmPayload, {_t}),
    [confirmPayload, _t],
  );

  useImperativeHandle(
    ref,
    () => ({
      open: openConfirm,
    }),
    [openConfirm],
  );

  return (
    <ConfirmPopup
      styles={{
        containerStyle: css`
          margin: 16px 16px 0;
        `,
      }}
      id="tag"
      loading={isLoading || isPullAgreementLoading}
      show={showCancelFollowerDialog}
      onClose={closeConfirm}
      onCancel={closeConfirm}
      title={_t('3c462bb835534000ad7c')}
      hiddenCancel
      onOk={submit}
      okText={_t('0e7acbc3475a4000a563')}>
      <ConfirmContent
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <UserInfoBox>
          <UserAvatar styles={userInfoStyles} userInfo={userInfo} />
          <EllipsisText
            width={convertPxToReal(300, false)}
            style={css`
              margin-top: 8px;
            `}>
            <AvatarName>{userInfo?.nickName}</AvatarName>
          </EllipsisText>
        </UserInfoBox>

        {confirmDescList.map(i => (
          <DescItem key={i.key} confirmDetail={confirmPayload} item={i} />
        ))}

        {isFetched && !isSignPass && (
          <RiskWarp>
            <RiskTipCard>
              <RiskTipText>{_t('b693de3e9e174000a8be')}</RiskTipText>
            </RiskTipCard>
            <RowWrap>
              <Radio
                style={css`
                  margin-right: 8px;
                `}
                type={EnhanceRadioType.check}
                checked={isAgree}
                onChange={toggleAgreement}
              />
              <RowWrap
                style={css`
                  flex: 1;
                `}>
                <AgreementText>
                  <RichLocale
                    message={_t('1058274a0f5d4000a184')}
                    renderParams={{
                      DESC: {
                        component: AgreementList,
                        componentProps: {
                          scene,
                        },
                      },
                    }}
                  />
                </AgreementText>
              </RowWrap>
            </RowWrap>
          </RiskWarp>
        )}
      </ConfirmContent>
    </ConfirmPopup>
  );
});
export default memo(FollowConfirm);
