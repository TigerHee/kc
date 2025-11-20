/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import PropTypes from 'prop-types';
import Picker from 'rc-picker';
import moment from 'moment';
import momentGenerateConfig from 'rc-picker/es/generate/moment';
import zhTw from 'rc-picker/es/locale/zh_TW';
import enUs from 'rc-picker/es/locale/en_US';
import 'rc-picker/assets/index.css';
import { styled, Global, css, variant } from '@kufox/mui';
import { useTheme } from '@kufox/mui';
import {
  CalendarOutlined,
  LeftMultiOutlined,
  RightMultiOutlined,
  LeftOutlined,
  RightOutlined,
} from '@kufox/icons';
import { useUpdateEffect } from '@kufox/mui';
import { useLocale } from '@kucoin-base/i18n';

const IconSize = {
  basic: 16,
  large: 18,
};

const getFormat = ({ picker, showTime, format }) => {
  if (format) {
    return format;
  }
  if (showTime) {
    return 'YYYY/MM/DD HH:mm:ss';
  }
  if (picker) {
    const pickerMap = {
      time: 'HH:mm:ss',
      date: 'YYYY/MM/DD',
      month: 'YYYY/MM',
      year: 'YYYY',
    };
    return pickerMap?.[picker];
  }
  return 'YYYY/MM/DD';
};

export const IconContainer = styled.div`
  width: 24px;
  height: 24px;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  &:hover {
    background: ${({ theme }) => theme.colors.cover4};
  }
`;

const DateWrapper = styled(Picker)`
  width: 246px;
  height: 40px;
  border: 1px solid transparent;
  border-radius: 4px;
  .rc-picker-input {
    padding-right: 14px;
    background: ${(props) => props.theme.colors.cover4};
    border-radius: 4px;
    input {
      padding-left: 12px;
      color: ${(props) => props.theme.colors.text};
      font-weight: 400;
      font-family: ${(props) => props.theme.fonts.family};
      background: transparent;
      border: none;
      outline: none;
      caret-color: ${(props) => props.theme.colors.primary};
      &::placeholder {
        color: ${(props) => props.theme.colors.text40};
      }
      ${variant({
        prop: 'size',
        variants: {
          basic: {
            fontSize: 14,
          },
          large: {
            fontSize: 16,
          },
        },
      })}
    }
    .rc-picker-suffix {
      display: ${({ allowClear }) => (allowClear ? 'none' : 'flex')};
      align-items: center;
      background: transparent;
    }
    .rc-picker-clear {
      position: absolute;
      right: 10px;
      display: flex;
      align-items: center;
      width: 16px;
      height: 100%;
    }
  }
  &:hover {
    .rc-picker-input {
      background: ${(props) => props.theme.colors.cover8};
    }
  }
  &.rc-picker-focused {
    background: ${(props) => props.theme.colors.cover8};
    border: 1px solid ${(props) => props.theme.colors.primary};
  }
  &.rc-picker-disabled {
    .rc-picker-input {
      background: ${(props) => props.theme.colors.cover4};
      input {
        &::placeholder {
          color: ${(props) => props.theme.colors.text20};
        }
      }
    }
  }
  ${variant({
    prop: 'size',
    variants: {
      basic: {
        height: 40,
      },
      large: {
        width: 268,
        height: 48,
      },
    },
  })}
`;

export const dropDownStyles = (theme) => {
  const { colors, fonts } = theme;

  return css`
    .MUI-DatePicker-Dropdown {
      z-index: 1000;
      background: ${colors.base};
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1) !important;
      .rc-picker-panel {
        background: transparent;
        border: none;

        .rc-picker-header,
        .rc-picker-header-view {
          height: 40px;
          padding: 0 8px;
          font-weight: 500;
          font-size: 14px;
          border-bottom: 1px solid ${colors.divider};

          button {
            color: ${colors.text} !important;
            font-size: 14px;
            background: transparent;
            border: none;
            outline: none;
            &.rc-picker-month-btn,
            &.rc-picker-year-btn,
            &.rc-picker-decade-btn {
              margin-left: 4px;
              font-weight: 500;
              font-family: ${fonts.family};
            }
          }
        }
        .rc-picker-header-view {
          border: none;
        }
        .rc-picker-header-super-prev-btn,
        .rc-picker-header-super-next-btn,
        .rc-picker-header-prev-btn,
        .rc-picker-header-next-btn {
          padding: 0 8px;
        }
        .rc-picker-header-view {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rc-picker-body {
          width: 100%;
          padding: 16px 12px 20px;
          .rc-picker-content {
            width: 252px;
          }
          table {
            border-spacing: 0;
          }
          thead {
            th {
              width: 36px;
              height: 40px;
              color: ${colors.text40};
              font-size: 12px;
              line-height: 20px;
            }
          }
          tbody {
            td {
              height: 36px;
              padding: 2px 0;
              color: ${colors.text20};
              &.rc-picker-cell-in-view {
                color: ${colors.text};
              }
              &.rc-picker-cell:hover {
                cursor: pointer;
                .rc-picker-cell-inner {
                  background: ${colors.cover8};
                }
              }
              .rc-picker-cell-inner {
                position: relative;
                z-index: 2;
                height: 24px;
                font-size: 14px;
                line-height: 24px;
                border: none;
                border-radius: 12px;
              }
              &.rc-picker-cell-today {
                .rc-picker-cell-inner {
                  position: relative;
                  &::after {
                    position: absolute;
                    bottom: -6px;
                    left: 50%;
                    width: 4px;
                    height: 4px;
                    margin-left: -2px;
                    background: ${colors.primary};
                    border-radius: 100%;
                    content: '';
                  }
                }
              }
              &.rc-picker-cell-selected {
                &.rc-picker-cell-in-view {
                  &:hover {
                    .rc-picker-cell-inner {
                      background: ${colors.primary} !important;
                    }
                  }
                  .rc-picker-cell-inner {
                    color: ${colors.base};
                    background: ${colors.primary};
                  }
                }
                .rc-picker-cell-inner {
                  background: transparent;
                }
              }
            }
          }
        }

        .rc-picker-time-panel {
          border-left: 1px solid ${colors.divider};
          .rc-picker-content {
            max-height: 300px;
          }
          .rc-picker-time-panel-column > li .rc-picker-time-panel-cell-inner {
            height: 25px;
            padding: 0;
            color: ${colors.text};
            line-height: 25px;
            text-align: center;
            &:hover {
              background: ${colors.cover8};
            }
          }
        }

        .rc-picker-footer {
          padding: 0 8px;
          font-size: 14px;
          line-height: 22px;
          background: transparent;
          border-top: 1px solid ${colors.divider};
          .rc-picker-ranges {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 40px;
            .rc-picker-now .rc-picker-now-btn {
              color: ${colors.text};
              cursor: pointer;
            }
            .rc-picker-ok button {
              color: ${colors.text};
            }
          }
        }

        .rc-picker-year-panel,
        .rc-picker-decade-panel,
        .rc-picker-month-panel,
        .rc-picker-date-panel,
        .rc-picker-quarter-panel {
          width: 280px;
        }
        .rc-picker-quarter-panel {
          .rc-picker-cell-inner {
            width: 53px;
            text-align: center;
          }
        }
        .rc-picker-date-panel {
          .rc-picker-cell-inner {
            width: 24px;
          }
        }
        .rc-picker-year-panel,
        .rc-picker-decade-panel,
        .rc-picker-month-panel {
          .rc-picker-cell-inner {
            width: 75px;
          }
        }
      }
    }
  `;
};

const iconStyles = {
  cursor: 'pointer',
};

const DatePicker = React.forwardRef((props, ref) => {
  const { currentLang } = useLocale();
  const isZhCn = currentLang === 'zh_CN' || currentLang === 'zh_HK';
  const theme = useTheme();
  const [allowClear, setAllowClear] = React.useState(false);

  const handleShowClear = React.useCallback(() => {
    if (props.allowClear && (props.value || props.defaultValue)) {
      setAllowClear(true);
    }
  }, [props.allowClear, props.defaultValue, props.value]);

  const handleChange = (newValue, formatString) => {
    const formatType = getFormat(props);
    const newFormatValue =
      formatType && newValue ? moment(moment(newValue).format(formatType)) : newValue;
    props?.onChange?.(newFormatValue, formatString);
  };

  useUpdateEffect(() => {
    if (!props.value || !props.defaultValue) {
      setAllowClear(false);
    }
  }, [props.value]);

  const commonProps = {
    generateConfig: momentGenerateConfig,
    locale: isZhCn ? zhTw : enUs,
    format: getFormat(props),
    dropdownClassName: 'MUI-DatePicker-Dropdown',
    superPrevIcon: (
      <IconContainer theme={theme}>
        <LeftMultiOutlined color={theme.colors.text40} size={12} style={iconStyles} />
      </IconContainer>
    ),
    superNextIcon: (
      <IconContainer theme={theme}>
        <RightMultiOutlined color={theme.colors.text40} size={12} style={iconStyles} />
      </IconContainer>
    ),
    prevIcon: (
      <IconContainer theme={theme}>
        <LeftOutlined color={theme.colors.text40} size={14} style={iconStyles} />
      </IconContainer>
    ),
    nextIcon: (
      <IconContainer theme={theme}>
        <RightOutlined color={theme.colors.text40} size={14} style={iconStyles} />
      </IconContainer>
    ),
    theme,
    ref,
    suffixIcon: (
      <CalendarOutlined
        size={IconSize[props.size]}
        color={props.disabled ? theme.colors.cover20 : theme.colors.text}
      />
    ),
    ...props,
    allowClear,
    onChange: handleChange,
  };

  return (
    <div
      onMouseOver={handleShowClear}
      onFocus={handleShowClear}
      onMouseLeave={() => {
        setAllowClear(false);
      }}
    >
      <DateWrapper {...commonProps} />
      <Global styles={dropDownStyles(theme)} />
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

DatePicker.propTypes = {
  size: PropTypes.oneOf(['basic', 'large']),
  disabled: PropTypes.bool,
};

DatePicker.defaultProps = {
  size: 'basic',
  disabled: false,
};

export default DatePicker;

// 参考 rc-picker 2.6.7 API
