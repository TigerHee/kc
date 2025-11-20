/**
 * Owner: willen@kupotech.com
 */
import { DownOutlined } from '@kux/icons';
import { Popover, styled, withTheme } from '@kux/mui';
import { map } from 'lodash-es';
import React from 'react';
import { bgGray, LangItem, Pointer, SelectWrapper } from './styled';

/**
 * value
 * items [{ value: '', label: '' },...]
 * placement Popover.placement
 * wrapperClassName
 * itemClassName
 * onChange (value) => {}
 */

const StyledPopover = styled(Popover)`
  .KuxPopover-root {
    background: ${({ theme }) => theme.colors.overlay} !important;
  }
`;

@withTheme
export default class SelectPane extends React.PureComponent {
  render() {
    const {
      value,
      items,
      placement,
      className,
      wrapperClassName,
      itemClassName,
      onChange,
      children,
      theme,
    } = this.props;
    return (
      <StyledPopover
        placement={placement}
        title={null}
        content={
          <SelectWrapper className={`${wrapperClassName || ''}`}>
            {map(items, (item) => {
              return (
                <LangItem
                  key={item.value}
                  className={`${itemClassName || ''}`}
                  css={item.value === value ? bgGray(theme) : {}}
                  title={item.title || ''}
                  onClick={() => {
                    if (item.value !== value) {
                      if (onChange) {
                        onChange(item.value);
                      }
                    }
                  }}
                >
                  {item.label}
                </LangItem>
              );
            })}
          </SelectWrapper>
        }
      >
        <Pointer className={`${className || ''}`}>
          {children}
          <DownOutlined />
        </Pointer>
      </StyledPopover>
    );
  }
}
