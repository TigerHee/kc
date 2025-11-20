/**
 * Owner: willen@kupotech.com
 */
import { styled, useTheme } from '@kux/mui';
import { ICDeleteOutlined } from '@kux/icons';
import map from 'lodash/map';
import React from 'react';
import { connect } from 'react-redux';
import MsgPanel from './MsgPanel';

const List = styled.div`
  &:hover {
    .delete-all {
      visibility: visible;
    }
  }
`;

const H2 = styled.h2`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-top: 24px;
  margin-bottom: 0px;
  padding: 0 32px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;

const ICDelete = styled(ICDeleteOutlined)`
  cursor: pointer;
  visibility: hidden;
  ${(props) => props.theme.breakpoints.down('sm')} {
    visibility: visible;
  }
`;

class MsgList extends React.Component {
  handleRmDate = (items) => {
    const { dispatch } = this.props;
    const eventIds = map(items, (item) => item.messageContext.id);

    dispatch({
      type: 'notice_event_notice_center/setDelete',
      payload: {
        eventIds,
      },
    });
  };

  render() {
    const { date, items, theme } = this.props;
    return (
      <List>
        <H2>
          {date}
          <ICDelete
            size={16}
            color={theme.colors.icon40}
            className="delete-all"
            onClick={() => this.handleRmDate(items)}
          />
        </H2>
        {map(items, (item, i) => {
          return <MsgPanel {...item} key={i} />;
        })}
      </List>
    );
  }
}

export default connect()((props) => {
  const theme = useTheme();
  return <MsgList theme={theme} {...props} />;
});
