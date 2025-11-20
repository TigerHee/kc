/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './index.less';

const noop = () => {};

export default class MarginTabs extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
    size: PropTypes.oneOf(['small', 'default', 'large']),
    showDivider: PropTypes.bool,
  };

  static defaultProps = {
    size: 'default',
    showDivider: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeValue: props.defaultActiveValue,
    };
  }

  // 切换tab触发的钩子
  handleChange = (activeValue) => {
    this.setState({ activeValue }, () => (this.props.onChange || noop)(activeValue));
  };

  // 获取tab项
  getTabPane = () => {
    const { size, showDivider, activeKey, children } = this.props;
    const { activeValue } = this.state;
    const len = React.Children.count(children);
    if (len) {
      return React.Children.map(children, (element, index) => {
        return React.cloneElement(element, {
          isFirst: len > 1 && index === 0,
          isLast: len > 1 && index === len - 1,
          activeValue: activeKey === undefined ? activeValue : activeKey,
          showDivider,
          size,
          onChange: this.handleChange,
        });
      });
    }
    return null;
  };

  render() {
    const { className } = this.props;
    const cls = classNames(styles.tabsContainer, {
      [className]: !!className,
    });
    return <div className={cls}>{this.getTabPane()}</div>;
  }
}
