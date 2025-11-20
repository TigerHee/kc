/**
 * Owner: clyne@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';

export default class Hover extends React.PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  state = {
    hover: false,
  };

  mouseEnter = () => {
    this.setState({
      hover: true,
    });
  };

  mouseLeave = () => {
    this.setState({
      hover: false,
    });
  };

  render() {
    const { children } = this.props;
    const { hover } = this.state;
    const child = children(hover);
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        ...child.props,
        onMouseEnter: this.mouseEnter,
        onMouseLeave: this.mouseLeave,
      });
    }
    return child;
  }
}
