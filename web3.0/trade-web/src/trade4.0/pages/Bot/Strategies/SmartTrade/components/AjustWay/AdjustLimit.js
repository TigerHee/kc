/**
 * Owner: mike@kupotech.com
 */
import React, { useCallback, useState, useImperativeHandle } from 'react';
import { useSelector, shallowEqual } from 'dva';
import useStateRef from '@/hooks/common/useStateRef';
import useDeepCompareEffect from 'Bot/hooks/useDeepCompareEffect';
import _ from 'lodash';
import { Switch, Divider } from '@kux/mui';
import styled from '@emotion/styled';
import { dropNull } from 'SmartTrade/util';
import { _t } from 'Bot/utils/lang';
import { Text, Flex } from 'Bot/components/Widgets';
import { useBindDialogButton } from 'Bot/components/Common/DialogRef.js';

const RadioButton = styled.span`
  background-color: ${(props) => props.theme.colors.cover4};
  color: ${({ theme }) => theme.colors.text40};
  border-radius: 6px;
  text-align: center;
  height: 24px;
  font-size: 12px;
  line-height: 24px;
  padding: 0 12px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.3s linear;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary8};
  }
  ${({ active, theme }) => {
    if (active) {
      return {
        backgroundColor: theme.colors.primary8,
        color: theme.colors.primary,
      };
    }
  }}
`;

const RadioButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-row-gap: 8px;
  grid-column-gap: 8px;
`;
/**
 * @description: 按钮radio组
 * @param {*} value
 * @param {*} onChange
 * @param {Array} labels 显示的文本数据
 * @return {*}
 */
const RadioGroup = ({ value, onChange, labels = [] }) => {
  const onChangeJack = useCallback(
    (e) => {
      e = e.currentTarget.dataset.value;
      onChange(e);
    },
    [onChange],
  );
  return (
    <RadioButtonGroup>
      {labels.map((el) => {
        return (
          <RadioButton
            active={value === el.value}
            key={el.value}
            onClick={onChangeJack}
            data-value={el.value}
          >
            {typeof el.text === 'function' ? el.text() : el.text}
          </RadioButton>
        );
      })}
    </RadioButtonGroup>
  );
};

// 格式化提交数据
const formatForSubmit = (adjust) => {
  if (adjust.autoChange === false) {
    return {
      autoChange: false,
    };
  }

  const key = adjust.checked;
  const value = adjust[adjust.checked];
  if (!value) return null;
  let submitFormat;
  if (key === 'byLimit') {
    // 组装好提交的格式数据
    submitFormat = { threshold: value, autoChange: true };
  } else {
    submitFormat = { interval: value, autoChange: true };
  }
  return submitFormat;
};
// 将method格式化成需要的数据
const formatForHereUse = ({ threshold, interval, autoChange }) => {
  let obj = {};
  if (autoChange === false) {
    return (obj = {
      checked: '',
      byTime: '',
      byLimit: '',
      autoChange: false,
    });
  }
  if (threshold) {
    obj = {
      checked: 'byLimit',
      byTime: '',
      byLimit: threshold,
      autoChange: true,
    };
  } else if (interval) {
    obj = {
      checked: 'byTime',
      byTime: interval,
      byLimit: '',
      autoChange: true,
    };
  }
  return obj;
};
/**
 * @description: 调仓方式选择
 * @return {*}
 */
export default React.forwardRef(({ dialogRef, onChange, value: defaultValue }, ref) => {
  const { intervalOptions: byTimeLabels, thresholdOptions: byLimitLabels } = useSelector(
    (state) => state.smarttrade.adjustWays || {},
    shallowEqual,
  );
  // 调仓方式字段
  const [adjust, setAdjust] = useState({
    byLimit: 0.01,
    byTime: '',
    checked: 'byLimit',
    autoChange: true, // 自动调仓字段
  });
  const useDataRef = useStateRef({ adjust, onChange, defaultValue });
  useImperativeHandle(
    ref,
    () => {
      return {
        // 获取
        getAjustWays: () => formatForSubmit(adjust),
        // 设置
        setAjustWays: (method) => {
          const nowMethod = formatForHereUse(method);
          if (!_.isEqual(nowMethod, adjust)) {
            setAdjust(nowMethod);
          }
        },
      };
    },
    [adjust],
  );
  // 同步value变化
  useDeepCompareEffect(() => {
    const submitFormat = defaultValue;
    if (!_.isEmpty(submitFormat)) {
      const nowMethod = formatForHereUse(submitFormat);
      if (!_.isEqual(nowMethod, adjust)) {
        setAdjust(nowMethod);
      }
    }
  }, [defaultValue]);
  // 事件出发向外抛出
  const onConfirm = useCallback(() => {
    const { onChange: Change, adjust: ways } = useDataRef.current;
    if (Change) {
      Change(formatForSubmit(ways));
    }
  }, []);
  // 阈值变化事件
  const onByLimitChange = useCallback((val) => {
    const key = 'byLimit';
    const adjustHere = {
      byLimit: '',
      byTime: '',
      [key]: +val,
      checked: key,
      autoChange: true,
    };
    setAdjust(adjustHere);
  }, []);
  // 时间变化事件
  const onByTimeChange = useCallback((val) => {
    const key = 'byTime';
    const adjustHere = {
      byLimit: '',
      byTime: '',
      [key]: val,
      checked: key,
      autoChange: true,
    };
    setAdjust(adjustHere);
  }, []);

  // 自动调仓变化事件
  const onAutoChange = useCallback((e) => {
    // 关闭 清空调仓方式选择
    const ajustObj = e
      ? {
          byLimit: 0.01,
          byTime: '',
          checked: 'byLimit',
          autoChange: true,
        }
      : {
          byLimit: '',
          byTime: '',
          checked: '',
          autoChange: false,
        };
    setAdjust(ajustObj);
  }, []);
  const disabled = _.isEqualWith(formatForSubmit(adjust), dropNull(defaultValue));
  useBindDialogButton(dialogRef, onConfirm);
  return (
    <React.Fragment>
      <Flex sb vc>
        <Text fs={16} color="text" fw={500}>
          {_t('autoajust')}
        </Text>
        <Switch onChange={onAutoChange} checked={adjust.autoChange} />
      </Flex>
      <Divider />
      <div className="radio-item">
        <Text fs={14} color="text" fw={500} as="div" mb={8}>
          {_t('smart.byyuzhi')}
        </Text>
        <Text fs={12} color="text60" as="div" mb={16}>
          {_t('rebalancebyrate')}
        </Text>
        <RadioGroup labels={byLimitLabels} onChange={onByLimitChange} value={adjust.byLimit} />
      </div>
      <div className="radio-item mt-22">
        <Text fs={14} color="text" fw={500} as="div" mb={8}>
          {_t('smart.bytime')}
        </Text>
        <Text fs={12} color="text60" as="div" mb={16}>
          {_t('rebalancebytime')}
        </Text>
        <RadioGroup labels={byTimeLabels} onChange={onByTimeChange} value={adjust.byTime} />
      </div>
    </React.Fragment>
  );
});
