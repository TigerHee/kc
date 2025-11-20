/**
 * Owner: judith@kupotech.com
 */
import { Global, isPropValid, styled } from '@kux/mui';

import { ICArrowUpOutlined, ICSearchOutlined } from '@kux/icons';

export const SelectedOption = styled.div`
  .isolatedLabel {
    display: flex;
    align-items: center;
    svg {
      path {
        fill: ${({ theme }) => theme.colors.icon60};
      }
      flex-shrink: 0;
      margin-right: 16px;
    }
    .account {
      font-weight: 700;
      font-size: 16px;
    }
    .symbol {
      margin-top: 2px;
      color: ${({ theme }) => theme.colors.text30};
      font-weight: 500;
      font-size: 14px;
    }
  }
`;

export const StyledTriangleUpOutlined = styled(ICArrowUpOutlined, {
  shouldForwardProp: (props) => isPropValid(props),
})((props) => {
  return {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: `translateY(-50%) rotate(${props.isShow ? 0 : -180}deg)`,
    transition: 'transform 0.3s',
    marginLeft: '6px',
    color: '#737E8D',
  };
});

export const ICSearch = styled(ICSearchOutlined)`
  fill: ${({ theme }) => theme.colors.icon60};
`;

export const Adden = styled.div`
  height: 104px;
  padding: 12px;
  > svg {
    margin-bottom: 8px;
  }
`;

export const Dropdown = styled.section`
  .kc-cascader-20210430-menu {
    display: none;
    &:nth-of-type(${({ currentLevel }) => currentLevel + 1}) {
      display: block;
    }
  }
`;

export const KcCascaderWrapper = styled.div`
  display: flex;
  .input {
    &,
    & > * {
      background-color: transparent !important;
    }
    width: 100%;
    cursor: pointer;
    caret-color: transparent;
    input {
      padding-right: 28px;
    }
  }
  .picker {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 40px;
    color: ${(props) => props.theme.colors.text};
    font-size: 14px;
    border-radius: 4px;
    outline: 0;
    cursor: pointer;
    &:hover {
      .pickerClear {
        opacity: 1;
      }
    }
    &.disabled {
      color: ${(props) => props.theme.colors.text30};
      background: transparent;
      cursor: not-allowed;
      .input {
        cursor: not-allowed;
      }
    }
  }

  .pickerLabel {
    // position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0 18px 0 16px;
    font-weight: 700;
    font-weight: 700;
    font-size: 16px;
    line-height: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .pickerClear {
    position: absolute;
    top: 50%;
    right: 8px;
    z-index: 2;
    width: 14px;
    height: 14px;
    margin-top: -7px;
    line-height: 14px;
    background: #fff;
    cursor: pointer;
    opacity: 0;
    path {
      fill: ${({ theme }) => theme.colors.icon40};
    }
  }
  .pickerArrow {
    position: absolute;
    top: 50%;
    right: 8px;
    z-index: 1;
    width: 10px;
    height: 0;
    margin-top: -2px;
    border: 5px solid transparent;
    border-top-color: ${({ theme }) => theme.colors.text} !important;
    transform: rotate(0deg);
    transform-origin: 5px 2px;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    &Expand {
      transform: rotate(180deg);
    }
  }
`;

export const GlobalStyle = ({ theme }) => (
  <Global
    styles={{
      '.kcCascader-popup': {
        position: 'absolute',
        zIndex: 9999,
        fontSize: '13px',
        whiteSpace: 'nowrap',
        background: theme.colors.layer,
        borderRadius: '8px',
        border: `1px solid ${theme.colors.cover4}`,
        boxShadow: `0px 2px 4px 0px ${(props) => props.theme.divider4}, 0px 0px 1px 0px ${(props) =>
          props.theme.divider4}`,
      },
      '.kc-cascader-20210430-menus': {
        '&-empty, &-hidden': {
          display: 'none',
        },
      },
      '.kc-cascader-20210430-menu': {
        display: 'inline-block',
        minWidth: '320px',
        maxHeight: '333px',
        margin: 0,
        padding: 0,
        overflow: 'auto',
        verticalAlign: 'top',
        listStyle: 'none',
        // '&:not(:last-child)': {
        //   display: 'none',
        // },

        '&-item': {
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px',
          color: '#00142a',
          fontSize: '16px',
          fontWeight: 500,
          cursor: 'pointer',
          '&:hover': {
            background: 'rgba(29, 29, 29, 0.02)',
          },
          '&-disabled': {
            color: 'fade(#01081e, 38)',
            cursor: 'not-allowed',
            '&:hover': {
              background: 'transparent',
            },
          },
          '&-active': {
            background: 'rgba(29, 29, 29, 0.02)',
            '&:not(&-disabled)': {
              '&, &:hover': {
                fontWeight: '500 !important',
                background: 'rgba(29, 29, 29, 0.02)',
              },
            },
          },

          '&-expand-icon': {
            display: 'flex',
            alignItems: 'center',
            'svg path': {
              fill: 'rgba(140, 140, 140, 0.6)',
            },
          },
        },
      },
      '::-webkit-scrollbar': {
        width: '4px',
        height: '4px',
        background: 'transparent',
      },
      '::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'fade(#01081e, 16)',
        borderRadius: '2px',
      },
    }}
  />
);
