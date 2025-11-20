/*
 * Owner: harry.lai@kupotech.com
 */
import styled from '@emotion/styled';
import JsBridge from '@knb/native-bridge';
import { useToggle, useUpdateLayoutEffect } from 'ahooks';
import { pickBy } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import useMainHost from 'routes/SlothubPage/hooks/useMainHost';
import GbizShareV2 from 'src/components/common/GbizShareV2';
import { useSelector } from 'src/hooks/useSelector';
import { updateUrlWithParams } from 'src/utils/formatUrlWithLang';
import { _t } from 'tools/i18n';
import { INVITE_ORIGIN_APPEND_PARAM } from '../../constant';
import AppShare from './AppShare';
import { sharePoster } from './config';
import Content from './Content';

const posterBg = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABK4AAAACAQMAAABLxQa6AAAAA1BMVEUAAACnej3aAAAADElEQVQY02MYBSQAAAEuAAF1p4NfAAAAAElFTkSuQmCC`;

const AppEnhanceWrap = styled.div`
  display: flex;
  background-color: #000;
  width: 265px;
  height: 454px;
`;

const isInApp = JsBridge.isApp();
const keyValueString = (obj = {}) => {
  let key = '';
  try {
    key = JSON.stringify(obj);
  } catch (error) {
    key = '';
  }
  return key;
};

const Share = () => {
  const shareRef = useRef(null);
  const dispatch = useDispatch();
  const mainHost = useMainHost();

  const shareModalConfig = useSelector((state) => state.slothub.shareModalConfig);
  const { visible, scene, data } = shareModalConfig || {};
  const sceneAndDataUniqueKey = useMemo(() => {
    return `${scene}_${keyValueString(data)}`;
  }, [data, scene]);

  const [webShareRerenderFlag, { setLeft, setRight }] = useToggle(false);

  useUpdateLayoutEffect(() => {
    if (sceneAndDataUniqueKey) {
      setLeft();
      setRight();
    }
  }, [sceneAndDataUniqueKey]);

  const shareTexts = [_t('dgU8L3PonhM9bcbNvhETo5'), _t('o9vXUpZzXT6eSpbt74XwdN')];

  const taskInvitationCode = useSelector(
    (state) => state.slothub.basicTasksInfo?.['invitationCode'],
  );
  const userSummary = useSelector((state) => state.slothub.userSummary);
  const invitationCode = userSummary?.invitationCode || taskInvitationCode;

  const inviteLink = useMemo(() => {
    return updateUrlWithParams(
      `${mainHost}/gemslot?${INVITE_ORIGIN_APPEND_PARAM}`,
      pickBy(
        {
          rcode: invitationCode,
        },
        (value) => !!value,
      ),
    );
  }, [mainHost, invitationCode]);

  //WEB端 打开
  const onRefReady = useCallback((node) => {
    shareRef.current = node;
    shareRef.current?.goShare && shareRef.current?.goShare();
  }, []);

  // APP场景时生成base64回调
  const handleImgBase64Callback = useCallback(
    (imgData) => {
      if (isInApp) {
        sharePoster(imgData, invitationCode, inviteLink);
      }
    },
    [invitationCode, inviteLink],
  );

  // App打开
  const openShareModal = useCallback(() => {
    shareRef.current?.goShare && shareRef.current?.goShare(handleImgBase64Callback);
    dispatch({
      type: 'slothub/updateShareModalConfig',
      payload: {
        ...shareModalConfig,
        visible: false,
      },
    });
  }, [dispatch, shareModalConfig, handleImgBase64Callback]);

  useEffect(() => {
    visible && openShareModal();
  }, [openShareModal, visible]);

  if (isInApp) {
    return (
      <AppShare ref={shareRef} width={265} height={454} needPreload>
        <AppEnhanceWrap>
          <Content scene={scene} data={data} />
        </AppEnhanceWrap>
      </AppShare>
    );
  }

  return (
    <>
      {webShareRerenderFlag ? (
        <GbizShareV2
          shareTitle={_t('5zZHSZHmzbyYe8r4Z3JWQ2')}
          shareLink={inviteLink}
          shareImg={posterBg}
          shareTexts={shareTexts}
          onRefReady={onRefReady}
          canvasSize={{ width: 265, height: 453 }}
          shareContent={<Content scene={scene} data={data} />}
        />
      ) : null}
    </>
  );
};

export default Share;
