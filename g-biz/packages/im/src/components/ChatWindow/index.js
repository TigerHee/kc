/**
 * Owner: iron@kupotech.com
 */
import React, {
  useEffect,
  // useImperativeHandle,
  useCallback,
  useState,
  // useMemo,
  useRef,
} from 'react';
// import p from 'es6-promisify';
import { makeStyles } from '@kc/mui/lib/styles';
import { ImgPreview } from '@kc/mui';
import remoteEvent from '@tools/remoteEvent';
import uniqueModel from '@tools/uniqueModel';
import { extendModel } from '@utils';
import clsx from 'clsx';
import _, { find, get, map, omit, assign } from 'lodash';
import dayjs from 'dayjs';
import uuid from 'uuid';
import { getImgBase64 } from '@kc/gbiz-base/lib/utils';
import useConstructor from '@hooks/useConstructor';
import MsgWindow from './MsgWindow';
import MsgInput from './MsgInput';
import { MessageContentType, MessageType } from './types';
import { executeFunc } from './useEventHandler';
import { QuickBlox, DEFAULT_PWD, MsgEventType } from './quickBlox';
import imModel from './model';

const MSG_PAGE_SIZE = 1000;
const DEFAULT_MESSAGE_KEY = 'DEFAULT_MESSAGE';

const APPLICATION_ID = 96210;
const AUTH_KEY = GBIZ_IM_AUTH_KEY;
const AUTH_SECRET = GBIZ_IM_AUTH_SECRET;
const ACCOUNT_KEY = GBIZ_IM_ACCOUNT_KEY;

const DEFAULT_MESSAGE_FILTER = (list) => list;
const useStyle = makeStyles(() => {
  return {
    wrapper: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(0,20,42,0.04)',
    },
  };
});

function isMessageAttachment(attachments) {
  return !!attachments && attachments.length > 0;
}

/**
 * @template {string} T
 * @typedef {(event: T) => void} IEventFunc
 */

/**
 * @typedef {object} IClassNames
 * @property {string=} container 最外层div
 * @property {string=} chatWindow 消息框
 * @property {string=} chatInput 输入框
 *
 * @typedef {object} IChatWindowProps
 * @property {string} sendTo 发送目标用户ID
 * @property {string} currentUser 当前用户ID
 * @property {string} currentUserAvatar 当前用户头像
 * @property {string} otherUserAvatar 发送目标用户头像
 * @property {string=} defaultMessage 默认展示的目标用户消息(展示在对方消息列表中)
 * @property {IEventFunc<void>=} onInit 初始化成功回调
 * @property {string=} onMessageReceived 收到消息回调
 * @property {IClassNames=} classNames 每个容器的class
 * @property {string=} appId applozic的App ID
 * @property {object=} metadata applozic发送消息时的的metadata
 * @property {number=} pageSize applozic消息的每页数量
 * @property {(list: any[]) => any[]=} messageFilter 消息的过滤
 * @property {number=} startTime 消息开始的时间，格式为毫秒时间戳，默认最近七天
 *
 * @param {IChatWindowProps} props
 * @param {*} ref applozic的实例ref，可以参考其文档https://websdk.applozic.com/docs/latest/classes/ApplozicClient.html
 * @returns
 */
const ChatWindow = (props, ref) => {
  useConstructor(() => {
    remoteEvent.emit(remoteEvent.evts.GET_DVA, (dva, m) => {
      uniqueModel(dva, extendModel(m, imModel));
    });
  });
  const {
    // env = 'DEV',
    onError,
    sendTo,
    currentUser,
    currentUserAvatar,
    otherUserAvatar,
    // currentLang = 'zh_CN',
    defaultMessage,
    onMessageReceived,
    classNames = {},
    // appId,
    metadata = {},
    pageSize = MSG_PAGE_SIZE,
    messageFilter = DEFAULT_MESSAGE_FILTER,
    startTime = parseInt(
      dayjs()
        .subtract(7, 'days')
        .valueOf() / 1000,
      10,
    ),
    credentials = {
      appId: APPLICATION_ID,
      authKey: AUTH_KEY,
      authSecret: AUTH_SECRET,
      accountKey: ACCOUNT_KEY,
    },
    onInit,
    debug = false,
    // ...restEvents
  } = props;

  const styles = useStyle();
  // const dispatch = useDispatch();
  const [msgData, setMsgData] = useState([]);
  // const [msgReads, setMsgReads] = useState([]);
  const [prevImgShow, setShowPrevImg] = useState(false);
  const [prevImg, setPrevImg] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyEndTime] = useState(parseInt(Date.now() / 1000, 10));
  const [historyIndex, setHistoryIndex] = useState(0);
  const [historyHasMore, setHistoryHasMore] = useState(true);
  // quickblox client的ref对象
  const qbRef = useRef(null);

  // 处理绑定的事件监听
  // useEventHandler(emitter, restEvents);

  const formatMsgFromHistory = (items) => {
    const qb = qbRef.current;
    const output = map(items, (o) => {
      return assign(
        o,
        {
          isMine: o.sender_id === qb.userId,
        },
        isMessageAttachment(o.attachments) && qb
          ? {
              fileMeta: {
                thumbnailUrl: qb.qb.content.privateUrl(get(o.attachments[0], 'id')),
              },
              contentType: MessageContentType.FILE,
            }
          : {
              contentType: MessageContentType.TEXT,
            },
      );
    });
    return output;
  };

  /**
   * 获取IM的历史聊天记录
   */
  const getIMHistory = useCallback(async () => {
    const client = qbRef.current;
    if (!historyHasMore || !client) {
      return;
    }
    setIsLoadingHistory(true);
    try {
      const { items } = await client.getChatHistory({
        limit: pageSize,
        skip: historyIndex,
        sort_desc: 'date_sent',
        date_sent: {
          lte: historyEndTime,
        },
      });
      addMessages(_.reverse(messageFilter(formatMsgFromHistory(items))));
      const hasMore = items.length >= pageSize;
      if (hasMore) {
        setHistoryIndex(historyIndex + pageSize);
      }
      setHistoryHasMore(hasMore);
      setIsLoadingHistory(false);
    } catch (error) {
      setIsLoadingHistory(false);
      client.emit('onError', error);
    }
  }, [
    historyIndex,
    historyEndTime,
    historyHasMore,
    msgData,
    addDefaultMessage,
    pageSize,
    startTime,
  ]);

  /**
   * 加载更多历史记录
   */
  const handleLoadMoreHistory = useCallback(async () => {
    if (isLoadingHistory) {
      return;
    }
    getIMHistory();
  }, [getIMHistory, isLoadingHistory]);

  const addMessages = (messages) => {
    setMsgData((prev) => {
      return [...messages, ...prev];
    });
  };

  /**
   * 更新消息，通过targetKey更新messageItem
   * forceAdd为true时，才会新增messageItem，否则只进行更新
   */
  const updateMessage = useCallback((messageItem, targetKey, forceAdd = true) => {
    setMsgData((prev) => {
      const targetIndex = _.findIndex(prev, (o) => o.key === targetKey);
      if ((targetKey === undefined || targetIndex < 0) && forceAdd) {
        return [...prev, messageItem];
      }
      if (targetIndex >= 0) {
        const item = prev[targetIndex];
        prev[targetIndex] = { ...item, ...messageItem };
        return [...prev];
      }
      return prev;
    });
  }, []);

  // 添加展示的默认消息(非applozic服务器内的消息)
  const addDefaultMessage = useCallback(() => {
    if (!defaultMessage) {
      return;
    }
    updateMessage(
      {
        to: currentUser,
        type: MessageType.OTHERS,
        isMine: false,
        contentType: MessageContentType.TEXT,
        createdAtTime: new Date().getTime(),
        read: true,
        key: DEFAULT_MESSAGE_KEY,
        message: defaultMessage,
      },
      DEFAULT_MESSAGE_KEY,
    );
  }, [defaultMessage]);

  // 输入框发送消息
  const sendInputMsg = useCallback(
    async (values) => {
      const { message, contentType, file } = values;
      const isImage = contentType === MessageContentType.FILE;
      const client = qbRef.current;
      if (!client) {
        return;
      }
      const key = uuid();
      try {
        // 初始化通用的消息数据，并展示消息和加载状态
        const dataOriginal = {
          key,
          loading: true,
          type: 'chat',
          body: isImage ? '[attachment]' : message,
          contentType: isImage ? MessageContentType.FILE : MessageContentType.TEXT,
          extension: {
            ...metadata,
          },
          to: sendTo,
          isMine: true,
          error: false,
          // 保存文件对象到数据中，成功后再移除。用于发生错误时重新上传
          file,
        };
        if (isImage) {
          // 如果是图片，先根据本地图片获取图片url
          const thumbnailUrl = await new Promise((res) => {
            getImgBase64(file, (img) => {
              res(img);
            });
          });
          dataOriginal.fileMeta = {
            thumbnailUrl,
          };
        }
        dataOriginal.message = dataOriginal.body;
        // 更新UI展示
        updateMessage(dataOriginal);
        if (isImage) {
          // 如果是图片，则进行上传，完成后展示返回的小图
          if (window.navigator.onLine === false) {
            dataOriginal.error = true;
            dataOriginal.loading = false;
            updateMessage(dataOriginal, key);
            return;
          }
          const fileResult = await client.uploadFile(file);
          dataOriginal.file = null;
          dataOriginal.extension.attachments = [{ id: fileResult.uid, type: 'image' }];
          // dataOriginal.fileMeta.thumbnailUrl = client.getFileUrlFromId(fileResult.uid);
          updateMessage(dataOriginal, key);
        }
        if (window.navigator.onLine === false) {
          dataOriginal.error = true;
          dataOriginal.loading = false;
          updateMessage(dataOriginal, key);
          return;
        }

        // 发送消息至服务器
        const msgId = client.sendMessage(
          omit(dataOriginal, [
            'key',
            'loading',
            'message',
            'fileMeta',
            'to',
            'isMine',
            'error',
            'file',
          ]),
        );
        // 完成发送后，更新消息的
        updateMessage({ id: msgId, key: msgId }, key);
      } catch (error) {
        // 如果出现错误，则展示错误状态
        updateMessage(
          {
            error: true,
            loading: false,
          },
          key,
        );
      }
    },
    [updateMessage, metadata, sendTo],
  );

  /**
   * 重发消息
   * @param {*} key 重发的消息key
   * @returns void
   */
  const resendMessage = async (key) => {
    const item = find(msgData, (o) => o.key === key);
    const client = qbRef.current;
    if (!item || !client) {
      return;
    }
    item.loading = true;
    updateMessage(item, key);
    try {
      // 如果文件没有上传，则重新上传
      if (item.file && !get(item.extension, ['attachments', 0])) {
        if (window.navigator.onLine === false) {
          item.error = true;
          item.loading = false;
          updateMessage(item, key);
          return;
        }
        const fileResult = await client.uploadFile(item.file);
        item.file = null;
        item.extension.attachments = [{ id: fileResult.uid, type: 'image' }];
        updateMessage(item, key);
      }
      if (window.navigator.onLine === false) {
        item.error = true;
        item.loading = false;
        updateMessage(item, key);
        return;
      }
      const msgId = client.sendMessage(
        omit(item, ['key', 'loading', 'message', 'fileMeta', 'to', 'isMine', 'error', 'file']),
      );
      updateMessage({ ...item, key: msgId, error: false, id: msgId }, key);
    } catch (error) {
      updateMessage({ error: true, loading: false }, key);
    }
  };

  const showPrevImg = useCallback((data, visible = true) => {
    setPrevImg(data);
    setShowPrevImg(visible);
  }, []);

  useEffect(() => {
    const qb = qbRef.current;
    if (qb && isLogin) {
      return qb.on(MsgEventType.message, (opponentId, msg) => {
        updateMessage(
          assign(
            msg,
            {
              key: msg.id,
              message: msg.body,
              to: currentUser,
              isMine: opponentId === qb.userId,
            },
            isMessageAttachment(get(msg.extension, 'attachments'))
              ? {
                  fileMeta: {
                    thumbnailUrl: qb.getFileUrlFromId(get(msg.extension, ['attachments', 0, 'id'])),
                  },
                  contentType: MessageContentType.FILE,
                }
              : {
                  contentType: MessageContentType.TEXT,
                },
          ),
          msg.id,
          true,
        );
        executeFunc(onMessageReceived, msg);
      });
    }
    return () => {};
  }, [isLogin, onMessageReceived]);

  // 处理消息发送后的回调状态
  useEffect(() => {
    const qb = qbRef.current;
    if (qb && isLogin) {
      return qb.on(MsgEventType.messageSent, (messageLost, messageSent) => {
        if (messageLost) {
          updateMessage({ error: true, loading: false }, messageLost.id);
        } else {
          updateMessage({ error: false, loading: false }, messageSent.id);
        }
        // executeFunc(onMessageReceived, event);
      });
    }
    return () => {};
  }, [isLogin, updateMessage]);

  useEffect(() => {
    const initQb = async () => {
      try {
        const qb = qbRef.current;
        const loginInfos = { login: currentUser, password: DEFAULT_PWD };
        const userId = await qb.login(loginInfos);
        await qb.connect({ userId, password: DEFAULT_PWD });
        await qb.chatWith(sendTo);
        setIsLogin(true);
        qb.emit('onInit');
        await getIMHistory(Date.now());
        addDefaultMessage();
      } catch (error) {
        if (qb) {
          qb.emit('onError', error);
        }
        console.log('error', qb, error);
      }
    };

    const qb = new QuickBlox(credentials, {
      streamManagement: {
        enable: true,
      },
      debug: debug ? { mode: 1 } : false,
    });
    qbRef.current = qb;
    if (ref) {
      ref.current = qb;
    }
    initQb();
    return () => {
      qb.destroy();
      qbRef.current = null;
    };
  }, []);

  useEffect(() => {
    const client = qbRef.current;
    if (!client || !onInit) {
      return () => {};
    }
    return client.on('onInit', onInit);
  }, [onInit]);

  useEffect(() => {
    const client = qbRef.current;
    if (!client || !onError) {
      return () => {};
    }
    return client.on('onError', onError);
  }, [onError]);

  return (
    <div className={clsx(styles.wrapper, classNames.container)}>
      <MsgWindow
        msgData={msgData}
        className={classNames.chatWindow}
        onScrollToTop={handleLoadMoreHistory}
        currentAvatar={currentUserAvatar}
        otherAvatar={otherUserAvatar}
        showPrevImg={(data) => showPrevImg(data, true)}
        loading={isLoadingHistory}
        hasMore={historyHasMore}
        currentUser={currentUser}
        onResendClick={resendMessage}
      />
      <MsgInput className={classNames.chatInput} sendInputMsg={sendInputMsg} disabled={!isLogin} />
      <ImgPreview show={prevImgShow} url={prevImg} onClose={() => showPrevImg(null, false)} />
    </div>
  );
};

export default React.forwardRef(ChatWindow);
