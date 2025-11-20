/**
 * Owner: willen@kupotech.com
 */
import map from 'lodash/map';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { _t } from 'utils/lang';
import { evtEmitter } from 'helper';
import { Drawer, Empty, MDrawer, ModalFooter, Spin, styled, withResponsive } from '@kux/mui';
import ConfirmModal from '@/components/NoticeDeleteConfirmModal';
import InfiniteLoadingList from '@/components/Virtualized/InfiniteLoadingList';
import showDatetime from '@/utils/showDatetime';
import { TYPE_MAP } from './config';
import MsgList from './MsgList';

const evtNoticeEvent = evtEmitter.getEvt('notice_event');

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Body = styled.div`
  flex: auto;
  .ReactVirtualized__List {
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const LoadingWrapper = styled.div`
  text-align: center;
  margin: 8px 0;
`;

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

const CusModalFooter = styled(ModalFooter)`
  padding: 20px 32px;
  button:first-of-type {
    margin-right: 24px;
    color: ${(props) => props.theme.colors.text60};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 20px 16px;
  }
`;

@withResponsive
@connect((state) => {
  return {
    hasMore: state.notice_event.hasMore,
    listMapArr: state.notice_event.listMapArr,
    visible: state.notice_event.barVisible,
    loading: state.loading.effects['notice_event/fetchList'],
  };
})
export default class NoticeBar extends React.Component {
  state = {
    confirmDelete: false,
    visible: false,
  };

  componentDidMount() {
    evtNoticeEvent.on('notice_append', this.showNotice);
  }

  componentWillUnmount() {
    evtNoticeEvent.off('notice_append', this.showNotice);
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.switchModal(true);
    } else if (this.props.visible && !nextProps.visible) {
      this.switchModal(false, true);
    }
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
      type: 'notice_event/update',
      payload: { barVisible: false },
    });
  };

  // webNotification = (title, content, audio) => {
  //   const notice = () => {
  //     const notification = new Notification(title, {
  //       body: content,
  //       sound: audio,
  //       silent: false,
  //     });
  //     notification.onclick = (() => {
  //       notification.close();
  //     });
  //   };

  //   if (window.Notification) {
  //     if (Notification.permission === 'granted') {
  //       notice(title, content);
  //     } else {
  //       Notification.requestPermission().then((permission) => {
  //         if (permission === 'granted') {
  //           notice(title, content);
  //         }
  //       });
  //     }
  //   }
  // }

  showNotice = ({ msg, config }) => {
    const { dispatch } = this.props;
    const { title, content, context, subject, webActionUrl } = msg;
    const uiConfig = TYPE_MAP[subject] || {};
    const hookClickConfig = (webActionUrl ? TYPE_MAP._default : TYPE_MAP[subject]) || {};
    // this.webNotification(title, content, audio);

    let onClick;
    if (typeof hookClickConfig.hookClick === 'function') {
      onClick = () => {
        hookClickConfig.hookClick(context, dispatch, webActionUrl);
      };
    }

    dispatch({
      type: 'notice/feed',
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
  };

  queryMore = () => {
    const { dispatch } = this.props;

    // 将promise返回给InfiniteLoadingList
    return dispatch({
      type: 'notice_event/fetchList',
    });
  };

  markAllRead = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notice_event/setRead',
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
      type: 'notice_event/setDelete',
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

  renderNoRows = () => (
    <Empty
      size="small"
      style={{ paddingTop: '150px', display: 'block' }}
      description={_t('table.empty')}
    />
  );

  // getDrawerAnchorDir = () => {
  //   const { isRTL } = this.props;
  //   console.log('isRTL',isRTL)

  //   if (isRTL) {
  //     return 'left';
  //   }

  //   return 'rgiht';
  // };

  render() {
    const {
      listMapArr,
      loading,
      hasMore,
      visible: propVisible,
      responsive,
    } = this.props;
    const { confirmDelete } = this.state;
    // const { pathname } = window.location;
    // let extraCls = '';
    // if (pathname === '/') {
    //   extraCls = style.underHome;
    // }

    const RDrawer = responsive.sm ? CusDrawer : CusMDrawer;

    const now = moment();
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
    // if (!visible) {
    //   return null;
    // }
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
          <Content>
            <Body>
              <InfiniteLoadingList
                hasNextPage={hasMore}
                isNextPageLoading={loading}
                data={dataArr}
                loadNextPage={this.queryMore}
                renderRow={this.renderMsgList}
                shouldUpdateMeasurer={this.shouldUpdateMeasurer}
                loadingPlaceHolder={
                  <LoadingWrapper>
                    {/* <Spin smile bgColor="#f1f2f5" /> */}
                    <Spin spinning type="normal" />
                  </LoadingWrapper>
                }
                noRowsRender={this.renderNoRows}
              />
            </Body>
            <Footer>
              <CusModalFooter
                okText={_t('all.read')}
                cancelText={_t('all.clear')}
                onCancel={this.openConfirm}
                onOk={this.markAllRead}
                okButtonProps={{ size: 'basic', disabled: !dataArr.length }}
                cancelButtonProps={{ variant: 'text', size: 'basic', disabled: !dataArr.length }}
              />
            </Footer>
          </Content>
        </RDrawer>
        <ConfirmModal
          title={_t('all.clear')}
          content={_t('notice.delete.message.confirm')}
          display={confirmDelete}
          onClose={this.closeConfirm}
          onConfirm={this.deleteAll}
          afterClose={this.afterConfirmClose}
        />
        <audio id="__otc__audio" muted>
          <track kind="captions" />
        </audio>
      </Footer>
    );
  }
}
