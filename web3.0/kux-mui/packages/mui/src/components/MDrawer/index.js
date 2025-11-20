/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import MModalHeader from '../MModalHeader';
import { MDrawerRoot } from './kux';
import useClassNames from './useClassNames';

const MDrawer = React.forwardRef(
  ({ anchor, title, back, show, onClose, onBack, children, className,
    headerBorder, headerProps, ...restProps }, ref) => {

    const _classNames = useClassNames({ anchor, show });

    return (
      <MDrawerRoot
        show={show}
        onClose={onClose}
        className={clsx(_classNames.root, className)}
        anchor={anchor}
        ref={ref}
        header={
          <MModalHeader
            back={back}
            title={title}
            onClose={onClose}
            onBack={onBack}
            border={headerBorder}
            {...headerProps}
          />
        }
        {...restProps}
      >
        {children}
      </MDrawerRoot>
    );
  },
);

MDrawer.propTypes = {
  children: PropTypes.node.isRequired,
  anchor: PropTypes.oneOf(['bottom', 'top', 'left', 'right']),
  show: PropTypes.bool,
  onClose: PropTypes.func,
  headerBorder: PropTypes.bool,
  back: PropTypes.bool,
  title: PropTypes.node,
  onBack: PropTypes.func,
  headerProps: PropTypes.object,
};

MDrawer.defaultProps = {
  anchor: 'right',
  show: false,
  onClose: () => { },
  headerBorder: true,
  title: '',
  back: true,
  onBack: () => { },
  headerProps: {},
};

MDrawer.displayName = 'MDrawer';

export default MDrawer;