/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import Animate from 'react-animated-number';

export default class AnimateNumber extends React.Component {

  state = {
    value: 0
  };

  componentDidMount() {
    const { value, duration } = this.props;

    setTimeout(() => {
      this.setState({
        value,
      });
    }, 200);
  }

  render() {
    const { duration, formatValue, ...rest } = this.props;
    const { value } = this.state;

    return (
      <Animate
        {...rest}
        value={value}
        formatValue={formatValue}
        duration={duration}
      />
    );
  }
}
