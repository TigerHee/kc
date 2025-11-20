/**
 * Owner: borden@kupotech.com
 */
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import KCSvgIcon from 'components/KCSvgIcon';
import styles from './style.less';

const PureTooltip = (props) => {
  const {
    title,
    placement,
    visible,
    overlayClassName,
    overlayStyle,
    children,
    isErrors,
  } = props;

  const [infoVisible, setInfoVisible] = useState(visible);

  useEffect(() => {
    setInfoVisible(visible);
  }, [visible]);

  const closeToolTip = useCallback(() => {
    setInfoVisible(false);
  }, []);

  const _sty = useMemo(() => {
    return {
      ...(overlayStyle || {}),
      opacity: infoVisible ? 1 : 0,
      pointerEvents: infoVisible ? 'inherit' : 'none',
      // opacity: : visible ? 'inherit' : 'hidden',
    };
  }, [infoVisible]);

  const tooltipType = {
    topLeft: 'tooltipTopLeft',
    topRight: 'tooltipTopRight',
    topCenter: 'tooltipTopCenter',
  };

  return (
    <div className={`${styles.wrapper}`}>
      <div>
        {children}
      </div>
      <div
        className={classnames([styles.tooltip, styles[tooltipType[placement]], overlayClassName])}
        style={_sty}
      >
        <div className={styles.tooltipContent}>
          <div className={classnames([styles.tooltipArrow, styles[placement]])} />
          <div className={styles.tooltipInner} role="tooltip">
            {title}
            {
              isErrors && (
                <span role="button" className="pointer" style={{ display: 'inline-flex' }} onClick={closeToolTip}>
                  <KCSvgIcon
                    className={styles.closeIcon}
                    iconId="close2"
                  />
                </span>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

PureTooltip.propTypes = {
  title: PropTypes.any,
  placement: PropTypes.oneOf(['topLeft', 'topRight']),
  visible: PropTypes.bool,
  overlayClassName: PropTypes.string,
  overlayStyle: PropTypes.object,
};

export default PureTooltip;
