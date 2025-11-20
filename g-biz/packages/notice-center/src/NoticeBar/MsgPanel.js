/**
 * Owner: willen@kupotech.com
 */
import { ICArrowRight2Outlined, ICCloseOutlined } from '@kux/icons';
import { styled, useTheme } from '@kux/mui';
import React from 'react';
import { connect } from 'react-redux';
import showDatetime from '../utils/showDatetime';
import { TYPE_MAP as _TYPE_MAP } from './config';

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

const UnReadWrapper = styled.div`
  position: absolute;
  right: 0;
  top: -2px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6px;
  height: 6px;
  border-radius: 100%;
  background: ${(props) => props.theme.colors.textEmphasis};
`;

const UnReadDot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 100%;
  background: ${(props) => props.theme.colors.secondary};
`;

const IconWrapper = styled.div`
  position: relative;
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

class MsgPanel extends React.Component {
  handleClickDelete = (e, eventId) => {
    e.preventDefault();
    e.stopPropagation();
    const { dispatch } = this.props;
    dispatch({
      type: 'notice_event_notice_center/setDelete',
      payload: {
        eventIds: [eventId],
      },
    });
  };

  handleClickPanel = async (read, eventId) => {
    const TYPE_MAP = _TYPE_MAP(window.noticePushTo);
    const {
      dispatch,
      type,
      messageContext: { context },
      messageContext,
    } = this.props;
    if (!read) {
      await dispatch({
        type: 'notice_event_notice_center/setRead',
        payload: {
          eventIds: [eventId],
        },
      });
    }

    const { webActionUrl } = messageContext || {};
    // 配置跳转地址情况, 使用 _default hookClick, 未配置跳转地址情况，调用相应templateCode下 hookClick
    const uiConfig = (webActionUrl ? TYPE_MAP._default : TYPE_MAP[type]) || {};
    if (typeof uiConfig.hookClick === 'function') {
      uiConfig.hookClick(context, webActionUrl);
    }
  };

  render() {
    const { type, read, sendTime, title, content, messageContext, theme } = this.props;
    const TYPE_MAP = _TYPE_MAP(window.noticePushTo);
    const msgTypeConfig = TYPE_MAP[type] || TYPE_MAP._default;

    return (
      <MsgPanelWrapper
        onClick={() => {
          this.handleClickPanel(read, messageContext.id);
        }}
      >
        <IconWrapper>
          {msgTypeConfig.icon}
          {!read && (
            <UnReadWrapper>
              <UnReadDot />
            </UnReadWrapper>
          )}
        </IconWrapper>
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

export default connect()((props) => {
  const theme = useTheme();
  return <MsgPanel theme={theme} {...props} />;
});
