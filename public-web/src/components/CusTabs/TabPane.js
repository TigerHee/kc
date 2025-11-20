/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { Link } from 'components/Router';
import classNames from 'classnames';
import styles from './index.less';

const TabsPane = React.forwardRef((props, ref) => {
  const {
    value,
    tab,
    size,
    isFirst,
    isLast,
    showDivider,
    onChange,
    activeValue,
    className,
    path,
    onClick,
    ...otherProps
  } = props;
  const isActive = activeValue === undefined ? isFirst : value === activeValue;
  const cls = classNames(styles.tabsPane, styles[size], {
    [styles.active]: isActive,
    [styles.first]: isFirst,
    [styles.last]: isLast,
    [styles.withDivider]: showDivider,
    [className]: !!className,
  });

  const handleClick = (e) => {
    onClick && onClick(e);
    !isActive && onChange(value);
  };

  if (path) {
    return (
      <Link to={path} className={cls} {...otherProps} onClick={onClick} ref={ref}>
        {tab}
      </Link>
    );
  }
  return (
    <span className={cls} {...otherProps} onClick={handleClick} ref={ref}>
      {tab}
    </span>
  );
});

export default TabsPane;
