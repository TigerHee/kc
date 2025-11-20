/**
 * Owner: willen@kupotech.com
 */
import _ from 'lodash';
import React from 'react';
import { Popover } from '@kufox/mui';
import { DownOutlined } from '@kufox/icons';
import style from './style.less';

/**
 * value
 * items [{ value: '', label: '' },...]
 * placement Popover.placement
 * wrapperClassName
 * itemClassName
 * onChange (value) => {}
 */

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
    } = this.props;
    return (
      <Popover
        placement={placement}
        title={null}
        content={
          <div className={`${style.select} ${wrapperClassName || ''}`}>
            {_.map(items, (item) => {
              return (
                <div
                  key={item.value}
                  className={`${style.langItem} ${itemClassName || ''} ${
                    item.value === value ? style.bgGray : ''
                  }`}
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
                </div>
              );
            })}
          </div>
        }
      >
        <div className={`${style.pointer} ${className || ''}`}>
          {children}
          <DownOutlined />
        </div>
      </Popover>
    );
  }
}
