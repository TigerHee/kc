/**
 * Owner: garuda@kupotech.com
 * 弹框的勾选
 */
import React, { useCallback, useMemo, useState } from 'react';

import { styled } from '@kux/mui/emotion';
import { useTheme } from '@kux/mui/hooks';

import { _t } from 'utils/lang';

import storage from 'utils/storage';

import { Checkbox } from '@kux/mui';

import { LOCAL_SETTLE_WARNING_KEY } from './config';

// 自定义 Checkbox ，不使用 @mui 里的

const CheckWrapper = styled.div`
  text-align: left;
  user-select: none;
  height: 24px;
  margin: 24px 0;

  .KuxCheckbox-wrapper {
    > span {
      font-size: 14px;
      &:first-of-type {
        margin-right: 8px;
      }
    }
  }
`;

const CheckBoxItem = styled(Checkbox)`
  display: inline-flex;
  align-items: center;
  margin-right: 14px;

  > span {
    top: 0;
    margin-left: 0;
    color: ${(props) => props.theme.colors.text40};
    font-size: 12px;
    line-height: 1.3;
    &:first-of-type {
      margin-right: 4px;
    }
  }

  .KuxCheckbox-inner {
    width: 16px;
    height: 16px;
    background: ${(props) =>
      (props.isChecked
        ? props.isLight
          ? props.theme.colors.text
          : props.theme.colors.primary
        : 'transparent')};
    border-color: ${(props) => (props.isChecked ? 'transparent' : props.theme.colors.icon40)};
    border-width: 1px;
  }

  &.KuxCheckbox-wrapper-checked {
    > span {
      &:last-of-type {
        color: ${(props) => props.theme.colors.text};
      }
    }
  }
`;

const CheckboxTip = ({ symbol, className }) => {
  const [isChecked, setChecked] = useState(false);

  const { currentTheme } = useTheme();

  const isLight = useMemo(() => currentTheme === 'light', [currentTheme]);

  const handleChange = useCallback(
    (e) => {
      const status = e.target.checked;
      const localWarningMap = storage.getItem(LOCAL_SETTLE_WARNING_KEY) || {};
      localWarningMap[symbol] = status;
      storage.setItem(LOCAL_SETTLE_WARNING_KEY, localWarningMap);
      setChecked(status);
    },
    [symbol],
  );

  return (
    <CheckWrapper className={className}>
      <CheckBoxItem
        checkOptions={{
          type: 2, // 1黑色 2 灰色
          checkedType: 2, // 1黑色 2 绿色
        }}
        onChange={handleChange}
        isChecked={isChecked}
        isLight={isLight}
      >
        {_t('preferences.display')}
      </CheckBoxItem>
    </CheckWrapper>
  );
};

export default React.memo(CheckboxTip);
