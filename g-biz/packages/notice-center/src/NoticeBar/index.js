/**
 * Owner: willen@kupotech.com
 */
import { Drawer, Empty, MDrawer, styled, useResponsive } from '@kux/mui';
import loadable from '@loadable/component';
import storage from '@utils/storage';
import dayjs from 'dayjs';
import map from 'lodash/map';
import React from 'react';
import { connect } from 'react-redux';
import ConfirmModal from '../components/ConfirmModal';
import useLang from '../hookTool/useLang';
import evtEmitter from '../utils/evtEmitter';
import showDatetime from '../utils/showDatetime';
import MsgList from './MsgList';
import { VOICE_MAP, TYPE_MAP as _TYPE_MAP } from './config';

const ContentBox = loadable(() => import('./ContentBox'));

const evtNoticeEvent = evtEmitter.getEvt('notice_event_notice_center');
const plainObject = {};

const CusDrawer = styled(Drawer)`
  max-width: 480px;
  width: 100%;
`;

const CusMDrawer = styled(MDrawer)`
  max-width: 480px;
  min-width: auto;
  width: 100%;
`;

const Footer = styled.div``;

class NoticeBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDelete: false,
      visible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'notice_event_notice_center/fetch' });
    evtNoticeEvent.on('notice_append', this.showNotice);
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.switchModal(true);
    } else if (this.props.visible && !nextProps.visible) {
      this.switchModal(false, true);
    }
  }

  componentWillUnmount() {
    evtNoticeEvent.off('notice_append', this.showNotice);
  }

  switchModal = (visible, delay) => {
    if (delay) {
      setTimeout(() => {
        this.setState({ visible });
      }, 500);
    } else {
      this.setState({ visible });
    }
  };

  onClose = () => {
    const { zE } = window;
    if (zE) {
      zE('webWidget', 'show');
    }
    this.props.dispatch({
      type: 'notice_event_notice_center/update',
      payload: { barVisible: false },
    });
  };

  audioNotice = (subject) => {
    const { userConditionInfo, currentLang } = this.props;
    const voiceConifg = VOICE_MAP[subject] || {};
    const __otc_voice__ = storage.getItem('__otc_voice__') || 'false'; // localStorage取出来是字符串
    if (!userConditionInfo.merchant || __otc_voice__ === 'false') return;
    try {
      const audio = document.getElementById('__otc__audio');
      audio.muted = false;
      audio.src = voiceConifg[currentLang] || voiceConifg.en_US;
      audio.play();
    } catch (e) {
      console.log('e:', e);
    }
  };

  showNotice = ({ msg, config, triggerNoticeMsg }) => {
    const { dispatch } = this.props;
    const { title, content, context, subject, webActionUrl } = msg;
    const TYPE_MAP = _TYPE_MAP(window.noticePushTo);
    const uiConfig = TYPE_MAP[subject] || {};
    const hookClickConfig = (webActionUrl ? TYPE_MAP._default : TYPE_MAP[subject]) || {};
    this.audioNotice(subject);
    // this.webNotification(title, content, audio);

    let onClick;
    if (typeof hookClickConfig.hookClick === 'function') {
      onClick = () => {
        hookClickConfig.hookClick(context, webActionUrl);
      };
    }

    if (!triggerNoticeMsg) {
      dispatch({
        type: 'notice_notice_center/feed',
        payload: {
          type: 'notification.open',
          message: title,
          extra: {
            description: content,
            ...config,
            ...uiConfig,
            onClick,
          },
        },
      });
    }
  };

  queryMore = () => {
    const { dispatch } = this.props;

    // 将promise返回给InfiniteLoadingList
    return dispatch({
      type: 'notice_event_notice_center/fetchList',
    });
  };

  markAllRead = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notice_event_notice_center/setRead',
      payload: {
        mark: true,
      },
    });
    this.onClose();
  };

  setConfirmDelete = (confirmDelete) => {
    this.setState({
      confirmDelete,
    });
  };

  openConfirm = () => {
    this.setConfirmDelete(true);
  };

  closeConfirm = () => {
    this.setConfirmDelete(false);
  };

  deleteAll = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notice_event_notice_center/setDelete',
      payload: {
        mark: true,
      },
    });
    this.closeConfirm();
    this.onClose();
  };

  shouldUpdateMeasurer = (prev, current) => {
    const indexs = [];

    const prevData = prev.data;
    const currentData = current.data;
    if (prevData !== currentData) {
      const prevLen = prevData.length;
      const currentLen = currentData.length;
      const len = Math.min(prevLen, currentLen);

      // 找相同长度部分
      for (let i = 0; i < len; i++) {
        const _prev = prevData[i];
        const _current = currentData[i];

        // 如果是对应数据行发生了改变，刷新对应CellMeasurerCache
        // 相同部分如果有内部变更的，需要刷新CellMeasurerCache
        if (_prev.date !== _current.date || _prev.items.length !== _current.items.length) {
          indexs.push(i);
          continue; // eslint-disable-line no-continue
        }

        // 检查每一项的read状态是否变更，也做刷新处理
        for (let j = 0; j < _prev.items.length; j++) {
          if (_prev.items[j].read !== _current.items[j].read) {
            indexs.push(i);
            break;
          }
        }
      }

      // 新增部分刷新
      if (currentLen > prevLen) {
        const sub = currentLen - prevLen;
        for (let i = 1; i <= sub; i++) {
          indexs.push(currentLen - i);
        }
      }
    }

    return indexs;
  };

  renderMsgList = (v, i) => <MsgList key={i} {...v} />;

  renderNoRows = () => {
    const { _t } = this.props;
    return (
      <Empty
        size="small"
        style={{ paddingTop: '150px', display: 'block' }}
        description={_t('table.empty')}
      />
    );
  };

  render() {
    const {
      listMapArr,
      loading,
      hasMore,
      visible: propVisible,
      responsive,
      _t,
      userConditionInfo,
    } = this.props;
    const { confirmDelete } = this.state;

    const RDrawer = responsive.sm ? CusDrawer : CusMDrawer;

    const now = dayjs();
    const _today = now.format('YYYY-MM-DD');
    const _day_1 = now.subtract(1, 'day').format('YYYY-MM-DD');

    const dataArr = map(listMapArr, ({ date, list }) => {
      const compareDate = showDatetime(date, 'YYYY-MM-DD');
      const _date = showDatetime(date, 'MM-DD');
      return {
        date:
          compareDate === _today ? _t('today') : compareDate === _day_1 ? _t('yesterday') : _date,
        items: map(list, (item) => {
          return {
            type: item.subject,
            read: item.read,
            sendTime: item.sendTime,
            title: item.title,
            content: item.content,
            messageContext: item,
          };
        }),
      };
    });

    const contentProps = {
      hasMore,
      loading,
      dataArr,
      queryMore: this.queryMore,
      renderMsgList: this.renderMsgList,
      shouldUpdateMeasurer: this.shouldUpdateMeasurer,
      renderNoRows: this.renderNoRows,
      openConfirm: this.openConfirm,
      markAllRead: this.markAllRead,
    };

    return (
      <Footer id="noticeBar">
        <RDrawer
          // title={false}
          anchor="right"
          // maskStyle={_MastStyle}
          onClose={this.onClose}
          show={propVisible}
          back={false}
          title={_t('2HVcFSJMKfjBCfPSUu8PbB')}
          // // 设置getContainer 以防防止其对body 的滚动监听；
          // getContainer={() => document.querySelector('#noticeBar')}
        >
          {propVisible ? <ContentBox {...contentProps} /> : <></>}
        </RDrawer>
        <ConfirmModal
          title={_t('all.clear')}
          content={_t('delete.message.confirm')}
          display={confirmDelete}
          onClose={this.closeConfirm}
          onConfirm={this.deleteAll}
          afterClose={this.afterConfirmClose}
        />
        {userConditionInfo.merchant && (
          <audio id="__otc__audio" muted>
            <track kind="captions" />
          </audio>
        )}
      </Footer>
    );
  }
}

export default connect((state) => {
  return {
    hasMore: state.notice_event_notice_center.hasMore,
    listMapArr: state.notice_event_notice_center.listMapArr,
    visible: state.notice_event_notice_center.barVisible,
    loading: state.loading.effects['notice_event_notice_center/fetchList'],
    userConditionInfo: state.notice_event_notice_center.userConditionInfo || plainObject,
  };
})((props) => {
  const responsive = useResponsive();
  const { t: _t, i18n } = useLang();
  return <NoticeBar _t={_t} responsive={responsive} currentLang={i18n.language} {...props} />;
});
