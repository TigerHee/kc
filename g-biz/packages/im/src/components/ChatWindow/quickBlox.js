/**
 * Owner: iron@kupotech.com
 */
import QB from 'quickblox/quickblox';
import EventEmitter from '@tools/EventEmitter';

export const MsgEventType = {
  message: 'message',
  messageError: 'messageError',
  messageSent: 'messageSent',
};
export const DEFAULT_PWD = GBIZ_IM_DEFAULT_PWD;

export class QuickBlox extends EventEmitter {
  constructor(credentials = {}, config = {}) {
    super();
    const { appId, authKey, authSecret, accountKey } = credentials;
    this.qb = new QB.QuickBlox();
    this.qb.init(appId, authKey, authSecret, accountKey, config);
    this.userId = null;
    this.user = {};
    this.currentDialog = {};
    this.opponentUser = {};
    this.qb.chat.onMessageListener = (userId, msg) => {
      if (msg.dialog_id === this.currentDialog._id) {
        this.emit(MsgEventType.message, userId, msg);
      }
    };
    this.qb.chat.onMessageErrorListener = (messageId, err) => {
      this.emit(MsgEventType.messageError, messageId, err);
    };
    this.qb.chat.onSentMessageCallback = (messageLost, messageSent) => {
      this.emit(MsgEventType.messageSent, messageLost, messageSent);
    };
    // this.qb.chat.onDisconnectedListener = () => {
    //   // this.emit(MsgEventType.messageSent, messageLost, messageSent);
    // };
    // this.qb.chat.onReconnectListener = () => {
    //   // this.emit(MsgEventType.messageSent, messageLost, messageSent);
    // };
    // this.qb.chat.onDeliveredStatusListener = (messageId, dialogId, userId) => {
    //   // this.emit(MsgEventType.messageSent, messageLost, messageSent);
    // };
  }

  async login(user) {
    return new Promise((res, rej) => {
      // 登陆
      this.qb.createSession(user, (errSessionUser, sessionUser) => {
        // 如果错误，说明没有该用户，然后创建新用户
        if (errSessionUser) {
          this.qb.createSession(() => {
            this.qb.users.create(user, (errCreateUser) => {
              if (errCreateUser) {
                rej(errCreateUser);
              } else {
                this.qb.createSession(user, (errSessionUserNew, sessionUserNew) => {
                  if (errSessionUserNew) {
                    rej(errSessionUserNew);
                  } else {
                    this.userId = sessionUserNew.user_id;
                    this.user = user;
                    res(this.userId);
                  }
                });
              }
            });
          });
        } else {
          this.userId = sessionUser.user_id;
          this.user = user;
          res(this.userId);
        }
      });
    });
  }

  connect() {
    return new Promise((res, rej) => {
      this.qb.chat.connect(
        { userId: this.userId, password: this.user.password },
        (err, contactList) => {
          if (err) {
            rej(err);
          } else {
            res(contactList);
          }
        },
      );
    });
  }

  destroy() {
    if (this.qb) {
      this.qb.chat.onMessageListener = null;
      this.qb.chat.onMessageErrorListener = null;
      this.qb.chat.onSentMessageCallback = null;
      this.qb.chat.disconnect();
    }
  }

  chatWith = async (loginName) => {
    let user;
    try {
      user = await this._getUser({ login: loginName });
    } catch (error) {
      user = await this._createUser({
        login: loginName,
        password: DEFAULT_PWD,
      });
    }
    this.opponentUser = user;
    if (user) {
      const dialog = await this._createDialog({
        type: 3,
        occupants_ids: [user.id],
      });
      this.currentDialog = dialog;
      return dialog;
    }
    return null;
  };

  getChatHistory = (params = {}) => {
    return new Promise((res, rej) => {
      if (!this.currentDialog || !this.currentDialog._id) {
        rej(new Error('未获取当前与对方聊天者的dialog'));
      }
      this.qb.chat.message.list(
        {
          chat_dialog_id: this.currentDialog._id,
          ...params,
        },
        (err, user) => {
          if (err) {
            rej(err);
          } else {
            res(user);
          }
        },
      );
    });
  };

  /**
   * 发送消息
   * @param {*} message
   * @returns
   */
  sendMessage(message) {
    const opponentUserId = this.opponentUser.id;
    if (message.extension) {
      message.extension.dialog_id = this.currentDialog._id;
      message.extension.save_to_history = 1;
    } else {
      message.extension = {
        dialog_id: this.currentDialog._id,
        save_to_history: 1,
      };
    }
    try {
      if (opponentUserId) {
        const msgId = this.qb.chat.send(opponentUserId, message);
        return msgId;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * 上传文件
   * @param {*} inputFile
   * @returns
   */
  uploadFile(inputFile) {
    const fileParams = {
      name: inputFile.name,
      file: inputFile,
      type: inputFile.type,
      size: inputFile.size,
      public: false,
    };
    return new Promise((res, rej) => {
      this.qb.content.createAndUpload(fileParams, (error, result) => {
        if (error) {
          rej(res);
        } else {
          res(result);
        }
      });
    });
  }

  getFileUrlFromId(id) {
    return this.qb.content.privateUrl(id);
  }

  _createUser(user) {
    return new Promise((res, rej) => {
      this.qb.users.create(user, (err, user) => {
        if (err) {
          rej(err);
        } else {
          res(user);
        }
      });
    });
  }

  _createDialog(params) {
    return new Promise((res, rej) => {
      this.qb.chat.dialog.create(params, (err, user) => {
        if (err) {
          rej(err);
        } else {
          res(user);
        }
      });
    });
  }

  _getUser(params = {}) {
    return new Promise((res, rej) => {
      this.qb.users.get(params, (err, user) => {
        if (err) {
          rej(err);
        } else {
          res(user);
        }
      });
    });
  }
}
