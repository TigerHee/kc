/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import useTheme from 'hooks/useTheme';
import StatusErrorDark from '@kux/icons/static/status-error-dark.svg';
import StatusErrorLight from '@kux/icons/static/status-error-light.svg';
import StatusLoadingLight from '@kux/icons/static/status-loading-light.svg';
import StatusLoadingDark from '@kux/icons/static/status-loading-dark.svg';
import StatusSuccessLight from '@kux/icons/static/status-success-light.svg';
import StatusSuccessDark from '@kux/icons/static/status-success-dark.svg';
import StatusWarningDark from '@kux/icons/static/status-warning-dark.svg';
import StatusWarningLight from '@kux/icons/static/status-warning-light.svg';
import StatusInfoLight from '@kux/icons/static/status-info-light.svg';
import StatusInfoDark from '@kux/icons/static/status-info-dark.svg';
import StatusLockDark from '@kux/icons/static/status-lock-dark.svg';
import StatusLockLight from '@kux/icons/static/status-lock-light.svg';
import StatusSafeDark from '@kux/icons/static/status-safe-dark.svg';
import StatusSafeLight from '@kux/icons/static/status-safe-light.svg';

import { Image } from './kux';
import useClassNames from './useClassNames';

const ImgMap = {
  'error': {
    light: StatusErrorLight,
    dark: StatusErrorDark,
  },
  'loading': {
    light: StatusLoadingLight,
    dark: StatusLoadingDark,
  },
  'success': {
    light: StatusSuccessLight,
    dark: StatusSuccessDark,
  },
  'warning': {
    light: StatusWarningLight,
    dark: StatusWarningDark,
  },
  'info': {
    light: StatusInfoLight,
    dark: StatusInfoDark,
  },
  'lock': {
    light: StatusLockLight,
    dark: StatusLockDark,
  },
  'safe': {
    light: StatusSafeLight,
    dark: StatusSafeDark,
  },
};

const Status = React.forwardRef(({ name, className, ...others }, ref) => {
  const theme = useTheme();
  const Img = ImgMap[name] || ImgMap.success;
  const imgTarget = Img[theme.currentTheme];

  const _classNames = useClassNames({ theme: theme.currentTheme });

  return (
    <Image
      ref={ref}
      className={clsx(_classNames.img, className)}
      src={imgTarget}
      alt="status"
      {...others}
    />
  );
});

Status.displayName = 'Status';

Status.propTypes = {
  name: PropTypes.oneOf(['error', 'loading', 'success', 'warning', 'info', 'lock', 'safe']),
};

Status.defaultProps = {
  name: 'success',
};

export default Status;
