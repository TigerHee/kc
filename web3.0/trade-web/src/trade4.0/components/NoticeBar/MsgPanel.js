/**
 * Owner: willen@kupotech.com
 */
import { ICArrowRight2Outlined, ICCloseOutlined } from '@kux/icons';
import { styled, withTheme } from '@kux/mui';
import clsx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';
import showDatetime from '@/utils/showDatetime';
import { TYPE_MAP } from './config';

const MsgPanelWrapper = styled.div`
  display: flex;
  padding: 24px 32px 0;
  cursor: pointer;
  .close-icon,
  .arrow-right {
    display: none;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px 16px 0;
    .close-icon {
      display: block;
    }
  }

  &:hover {
    background: ${(props) => props.theme.colors.cover2};
    .msgTitle {
      color: ${(props) => props.theme.colors.primary};
    }
    .close-icon,
    .arrow-right {
      display: block;
    }
  }
`;

const IconWrapper = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.primary8};
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 24px;
    height: 24px;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding-bottom: 24px;
  margin-left: 8px;
  border-bottom: 1px solid ${(props) => props.theme.colors.divider4};
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-bottom: 16px;
  }
`;

const MsgHead = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleWrapper = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  line-height: 130%;
  font-weight: 500;
  color: ${(props) => props.theme.colors.text};
`;

const TitleText = styled.span`
  display: flex;
  align-items: center;
  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

const Time = styled.span`
  margin-top: 2px;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text30};
`;

const MsgInfo = styled.div`
  margin-top: 10px;
  font-size: 16px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text60};
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

const ArrowRight = styled(ICArrowRight2Outlined)`
  margin-left: 8px;
  margin-top: 1px;
`;

@withTheme
@connect()
export default class MsgPanel extends React.Component {
  handleClickDelete = (e, eventId) => {
    e.preventDefault();
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'notice_event/setDelete',
      payload: {
        eventIds: [eventId],
      },
    });
  };

  handleClickPanel = async (read, eventId) => {
    const {
      dispatch,
      type,
      messageContext: { context },
      messageContext,
    } = this.props;
    if (!read) {
      await dispatch({
        type: 'notice_event/setRead',
        payload: {
          eventIds: [eventId],
        },
      });
    }

    const { webActionUrl } = messageContext || {};
    // 配置跳转地址情况, 使用 _default hookClick, 未配置跳转地址情况，调用相应templateCode下 hookClick
    const uiConfig = (webActionUrl ? TYPE_MAP._default : TYPE_MAP[type]) || {};
    if (typeof uiConfig.hookClick === 'function') {
      // fix records 这里ren兄弟之前参数传递错了，只传了2个，是需要传递3个的
      uiConfig.hookClick(context, dispatch, webActionUrl);
    }
  };

  render() {
    const { type, read, sendTime, title, content, messageContext, theme } = this.props;
    const msgTypeConfig = TYPE_MAP[type] || TYPE_MAP._default;

    return (
      <MsgPanelWrapper
        className={clsx({ unread: !read })}
        onClick={() => {
          this.handleClickPanel(read, messageContext.id);
        }}
      >
        <IconWrapper>{msgTypeConfig.icon}</IconWrapper>
        <ContentWrapper>
          <MsgHead>
            <TitleWrapper>
              <TitleText className="msgTitle">
                {title}
                <ArrowRight className="arrow-right" size={16} color={theme.colors.primary} />
              </TitleText>
              <ICCloseOutlined
                size={12}
                onClick={(e) => this.handleClickDelete(e, messageContext.id)}
                color={theme.colors.icon40}
                className="close-icon"
              />
            </TitleWrapper>
            <Time>{showDatetime(sendTime, 'HH:mm')}</Time>
          </MsgHead>
          <MsgInfo>{content}</MsgInfo>
        </ContentWrapper>
      </MsgPanelWrapper>
    );
  }
}
