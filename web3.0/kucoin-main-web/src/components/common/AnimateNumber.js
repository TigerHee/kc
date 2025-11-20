/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import Animate from 'react-animated-number';

let timer = null;

export default class AnimateNumber extends React.Component {
  state = {
    value: 0,
    timeout: 200,
  };

  handleDoChange = () => {
    const { value } = this.props;
    const { timeout } = this.state;
    timer = setTimeout(() => {
      this.setState({
        value,
      });
      clearTimeout(timer);
    }, timeout);
  };

  componentDidUpdate() {
    this.handleDoChange();
  }

  componentDidMount() {
    this.handleDoChange();
  }

  componentWillUnmount() {
    clearTimeout(timer);
  }

  render() {
    const { duration = 1000, formatValue } = this.props;
    const { value } = this.state;

    return (
      <Animate key={this.props.index} value={value} formatValue={formatValue} duration={duration} />
    );
  }
}
