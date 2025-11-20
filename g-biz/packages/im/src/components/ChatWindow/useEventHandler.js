/**
 * Owner: iron@kupotech.com
 */
import { useEffect } from 'react';

export const useEventHandler = (emitterRef, events) => {
  const {
    onInit,
    onMessageDelivered,
    onMessageRead,
    onMessageSent,
    onMessageSentUpdate,
    onMessageDeleted,
    onConversationRead,
    onConversationDeleted,
    onUserActivated,
    onUserConnect,
    onUserOnlineStatus,
    onTypingStatus,
  } = events;

  useEffect(() => {
    return emitterRef.current.on('onInit', () => {
      executeFunc(onInit);
    });
  }, [onInit]);

  useEffect(() => {
    return emitterRef.current.on('onMessageDelivered', (data) => {
      executeFunc(onMessageDelivered, data);
    });
  }, [onMessageDelivered]);

  useEffect(() => {
    return emitterRef.current.on('onMessageRead', (data) => {
      executeFunc(onMessageRead, data);
    });
  }, [onMessageRead]);

  useEffect(() => {
    return emitterRef.current.on('onMessageSent', (data) => {
      executeFunc(onMessageSent, data);
    });
  }, [onMessageSent]);

  useEffect(() => {
    return emitterRef.current.on('onMessageSentUpdate', (data) => {
      executeFunc(onMessageSentUpdate, data);
    });
  }, [onMessageSentUpdate]);

  useEffect(() => {
    return emitterRef.current.on('onMessageDeleted', (data) => {
      executeFunc(onMessageDeleted, data);
    });
  }, [onMessageDeleted]);

  useEffect(() => {
    return emitterRef.current.on('onConversationRead', (data) => {
      executeFunc(onConversationRead, data);
    });
  }, [onConversationRead]);

  useEffect(() => {
    return emitterRef.current.on('onConversationDeleted', (data) => {
      executeFunc(onConversationDeleted, data);
    });
  }, [onConversationDeleted]);

  useEffect(() => {
    return emitterRef.current.on('onUserActivated', (data) => {
      executeFunc(onUserActivated, data);
    });
  }, [onUserActivated]);

  useEffect(() => {
    return emitterRef.current.on('onUserConnect', (data) => {
      executeFunc(onUserConnect, data);
    });
  }, [onUserConnect]);

  useEffect(() => {
    return emitterRef.current.on('onUserOnlineStatus', (data) => {
      executeFunc(onUserOnlineStatus, data);
    });
  }, [onUserOnlineStatus]);

  useEffect(() => {
    return emitterRef.current.on('onTypingStatus', (data) => {
      executeFunc(onTypingStatus, data);
    });
  }, [onTypingStatus]);
};

export const executeFunc = (func, ...data) => {
  if (typeof func === 'function') {
    func(...data);
  }
};
