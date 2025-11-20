/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { isNull } from 'lodash-es';
import useTheme from 'hooks/useTheme';
import NetWorkErrorDark from '@kux/icons/static/network-error-dark.svg';
import NetWorkErrorLight from '@kux/icons/static/network-error-light.svg';
import NoRecordLight from '@kux/icons/static/no-record-light.svg';
import NoRecordDark from '@kux/icons/static/no-record-dark.svg';
import SuspensionOfTradingLight from '@kux/icons/static/suspension-of-trading-light.svg';
import SuspensionOfTradingDark from '@kux/icons/static/suspension-of-trading-dark.svg';
import SystemBusyLight from '@kux/icons/static/system-busy-light.svg';
import SystemBusyDark from '@kux/icons/static/system-busy-dark.svg';
import Box from '../Box';
import { EmptyRoot, Description, SubDescription, Image } from './kux';
import useClassNames from './useClassNames';

const ImgMap = {
  'network-error': {
    light: NetWorkErrorLight,
    dark: NetWorkErrorDark,
    title: 'Network error',
  },
  'no-record': {
    light: NoRecordLight,
    dark: NoRecordDark,
    title: 'No records',
  },
  'suspension-of-trading': {
    light: SuspensionOfTradingLight,
    dark: SuspensionOfTradingDark,
    title: 'Suspension of trading',
  },
  'system-busy': {
    light: SystemBusyLight,
    dark: SystemBusyDark,
    title: 'System busy',
  },
};

const Empty = React.forwardRef(
  ({ size, description, subDescription, name, className, ...others }, ref) => {
    const theme = useTheme();
    const Img = ImgMap[name] || ImgMap['no-record'];
    const imgTarget = Img[theme.currentTheme];

    const _classNames = useClassNames({ size, theme: theme.currentTheme });

    return (
      <EmptyRoot {...others} theme={theme} ref={ref} className={clsx(_classNames.root, className)}>
        <Image className={_classNames.img} size={size} src={imgTarget} alt="empty" />
        <Box>
          {isNull(description) ? null : (
            <Description className={_classNames.description} theme={theme}>
              {description || Img.title}
            </Description>
          )}
          {subDescription && (
            <SubDescription className={_classNames.subDescription} theme={theme}>
              {subDescription}
            </SubDescription>
          )}
        </Box>
      </EmptyRoot>
    );
  },
);

Empty.displayName = 'Empty';

Empty.propTypes = {
  size: PropTypes.oneOf(['small', 'large']),
  name: PropTypes.oneOf(['network-error', 'no-record', 'suspension-of-trading', 'system-busy']),
  description: PropTypes.node,
  subDescription: PropTypes.node,
};

Empty.defaultProps = {
  size: 'large',
  name: 'no-record',
};

export default Empty;
