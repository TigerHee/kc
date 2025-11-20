/**
 * Owner: garuda@kupotech.com
 * 二次确认弹框的勾选
 */
import React from 'react';
import { useDispatch } from 'react-redux';
import { styled } from '@/style/emotion';

import { _t } from 'utils/lang';

// 自定义 Checkbox ，不使用 @mui 里的
import { Checkbox } from '@kux/mui';

const CheckWrapper = styled.div`
  text-align: left;
  user-select: none;
  height: 24px;
  margin: 32px 0 16px;

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
    font-size: 12px;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text40};
    &:first-of-type {
      margin-right: 4px;
    }
  }

  .KuxCheckbox-inner {
    width: 14px;
    height: 14px;
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

const PreferencesCheckbox = ({ type, value, className }) => {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const status = e.target.checked;
    dispatch({
      type: 'futuresSetting/setPreferencesByBool',
      payload: {
        type,
        value,
        status,
      },
    });
  };

  return (
    <CheckWrapper className={className}>
      <CheckBoxItem
        checkOptions={{
          type: 2, // 1黑色 2 灰色
          checkedType: 1, // 1黑色 2 绿色
        }}
        onChange={handleChange}
      >
        {_t('preferences.display')}
      </CheckBoxItem>
    </CheckWrapper>
  );
};

export default React.memo(PreferencesCheckbox);
