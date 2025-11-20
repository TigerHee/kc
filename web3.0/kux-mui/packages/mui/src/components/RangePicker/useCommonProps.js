import React from 'react';
import momentGenerateConfig from 'rc-picker/es/generate/moment';
import en_US from 'config/locale/picker/en_US';
import {
  ICCloseFilled,
  ICLeftMultiOutlined,
  ICRightMultiOutlined,
  ICArrowLeftOutlined,
  ICArrowRightOutlined,
  ICTriangleBottom2Outlined,
} from '@kux/icons';
import useTheme from 'hooks/useTheme';
import { IconContainer } from './kux';

const iconStyles = {
  cursor: 'pointer',
};

export default function useCommonProps(props) {
  const theme = useTheme();
  const { onChange, format, value, inFocus, ...resetProps } = props;
  const { icon40, cover20, icon60, text } = theme.colors;

  return React.useMemo(() => {
    return {
      onChange,
      format,
      value,
      generateConfig: momentGenerateConfig,
      locale: en_US,
      popupClassName: 'KuxRangePicker-Dropdown',
      allowClear: {
        clearIcon: (
          <IconContainer theme={theme}>
            <ICCloseFilled color={icon40} size={16} style={iconStyles} />
          </IconContainer>
        ),
      },
      superPrevIcon: <ICLeftMultiOutlined color={icon60} size={16} />,
      superNextIcon: <ICRightMultiOutlined color={icon60} size={16} />,
      prevIcon: <ICArrowLeftOutlined color={icon60} size={16} />,
      nextIcon: <ICArrowRightOutlined color={icon60} size={16} />,
      suffixIcon: (
        <ICTriangleBottom2Outlined
          size={12}
          color={props.disabled ? cover20 : text}
          style={{
            transform: inFocus ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      ),
      ...resetProps,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);
}
