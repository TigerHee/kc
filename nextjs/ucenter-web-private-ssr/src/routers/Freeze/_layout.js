/**
 * Owner: willen@kupotech.com
 */
import { styled } from '@kux/mui';
import requireProps from 'hocs/requireProps';
import React from 'react';
import { connect } from 'react-redux';
import { replace } from 'utils/router';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  min-height: calc(100vh - 80px);
`;

@connect((state) => {
  return {
    frozen: state.user.frozen,
  };
})
@requireProps({
  frozen(value) {
    return value !== undefined;
  },
})
export default class Freeze extends React.Component {
  componentDidUpdate() {
    const { frozen } = this.props;
    if (!frozen) {
      replace('/');
    }
  }

  render() {
    const { frozen } = this.props;
    if (!frozen) {
      return null;
    }
    return <Wrapper>{this.props.children}</Wrapper>;
  }
}
