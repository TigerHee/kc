/**
 * Owner: iron@kupotech.com
 */
import React, { useState, useCallback, useRef } from 'react';
import { Spin, message } from 'antd';
import { get, keys, map } from 'lodash';
import 'antd/dist/antd.css';
import { makeStyles } from '@kc/mui/lib/styles';
import { ChatWindow } from '@kc/im/lib/componentsBundle';
// import { filter } from 'lodash';
// import ChatWindow from '../../im/src/components/ChatWindow';
import { searchToJson } from './helper';
// import 'antd/dist/antd.css';

const useStyle = makeStyles(() => {
  return {
    wrapper: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    msgWindow: {
      padding: '17px 12px 0 12px',
    },
    loadingWrapper: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
      background: 'rgba(255, 255, 255, .9)',
    },
  };
});

// const currentUser = 'f420628a-e25b-417f-aa19-f217f4af057c';
// const sendTo = '9ad945e1-5259-4c57-a381-05b161bce91e';
const currentUserAvatar =
  'https://www.gravatar.com/avatar/b3f3853ea9332f37a7450a2b014ede2a?s=64&d=identicon&r=PG';
const otherUserAvatar =
  'https://www.gravatar.com/avatar/a3c289b4608d119d65c3b67c8de7ca60?s=64&d=identicon&r=PG&f=1';

const extras = { bizType: 'otc', oId: '123456789' };

const IMDemo = () => {
  const [loadingIm, setLoadedIm] = useState(true);
  const styles = useStyle();
  const chatRef = useRef(null);
  const {
    defaultMsg = '默认发送消息',
    // isMine = 'false',
    currentUser = '69f028bd58ea034836e901cc8fca9129',
    sendTo = 'guowilling01',
  } = searchToJson();

  // const sendDefaultMsg = useCallback(() => {
  //   if (!defaultMsg) return;
  //   chatRef.current.sendStaticMsg({
  //     msg: decodeURIComponent(defaultMsg),
  //     isMine: isMine !== 'false',
  //     remarkFrom: sendTo, // 为商家imId
  //   });
  // }, []);

  // const userLogin = useCallback(() => {
  //   chatRef.current.login({ username: currentUser }); // 当前im登录
  // }, [currentUser]);

  const onError = useCallback((error) => {
    console.log('onError', error);
    const err = get(error, ['message', 'errors']) || {};
    const errKeys = keys(err);
    message.error(
      map(errKeys, (o) => {
        return `${o} ${err[o]}`;
      }).join('\n'),
    );
  }, []);

  const handleCommonFilter = useCallback((msg) => {
    if (msg.msg_body.extras) {
      const { bizType, oId } = msg.msg_body.extras;
      if (bizType === extras.bizType && oId === extras.oId) {
        return true;
      }
      return false;
    }
    return false;
  }, []);

  // useEffect(() => {
  //   if (loadingIm || !currentUser || !sendTo) return;
  //   userLogin();
  // }, [currentUser, loadingIm, sendTo, userLogin]);

  return (
    <>
      {loadingIm && (
        <div className={styles.loadingWrapper}>
          <Spin />
        </div>
      )}
      <div className={styles.wrapper}>
        <ChatWindow
          ref={chatRef} // IM 实例
          onInit={() => setLoadedIm(false)} // IM 初始化成功回到 是/否
          currentUser={currentUser}
          sendTo={sendTo} // 聊天对手
          className={styles.msgWindow} // 聊天窗口样式
          onError={onError}
          env="DEV"
          currentUserAvatar={currentUserAvatar}
          otherUserAvatar={otherUserAvatar}
          extras={extras}
          commonFilter={handleCommonFilter} // 根据自定义条件过滤消息
          currentLang="en_US"
          defaultMessage={defaultMsg}
          metadata={{ oId: '123123123123', bizType: 'otc' }}
          appId="2f81ec2f48d31cac4908bce7295c91"
          messageFilter={(list) => {
            // return filter(list, (o) => {
            //   return o.extension && o.extension.oId === '123123';
            // });
            return list;
          }}
        />
      </div>
    </>
  );
};

export default IMDemo;
