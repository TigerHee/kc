/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2019-05-21 15:42:51
 * @LastEditTime: 2019-05-30 11:51:35
 * @Description: 语音提醒
 */
import React from 'react';
import PropTypes from 'prop-types';

export default class Beep extends React.Component {
  constructor(props) {
    super(props);
    this.audio = React.createRef();
  }

  componentDidMount() {
    const { onStop } = this.props;
    const audio = this.audio.current;
    if (audio && onStop) {
      audio.loop = false;
      audio.addEventListener(
        'ended',
        onStop,
        false,
      );
    }
  }

  render() {
    const { src } = this.props;
    return <audio autoPlay ref={this.audio} src={src} />;
  }
}

Beep.propTypes = {
  src: PropTypes.string,
  onStop: PropTypes.func,
};
