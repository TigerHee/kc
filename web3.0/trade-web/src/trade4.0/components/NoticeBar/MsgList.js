/**
 * Owner: willen@kupotech.com
 */
import { styled } from '@kux/mui';
import map from 'lodash/map';
import React from 'react';
import { connect } from 'react-redux';
import MsgPanel from './MsgPanel';

const List = styled.div``;

const H2 = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-top: 24px;
  margin-bottom: 0px;
  padding-left: 32px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-left: 16px;
  }
`;

@connect()
export default class MsgList extends React.Component {
  handleRmDate = (items) => {
    const { dispatch } = this.props;
    const eventIds = map(items, (item) => item.messageContext.id);

    dispatch({
      type: 'notice_event/setDelete',
      payload: {
        eventIds,
      },
    });
  };

  render() {
    const { date, items } = this.props;
    return (
      <List>
        <H2>{date}</H2>
        {map(items, (item, i) => {
          return <MsgPanel {...item} key={i} />;
        })}
      </List>
    );
  }
}
