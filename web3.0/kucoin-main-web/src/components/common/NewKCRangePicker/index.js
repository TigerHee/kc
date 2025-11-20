/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { _t } from 'tools/i18n';
// 暂时换不了 kux/mui 因为RangePicker要用kux/mui2.0
import { Radio, Divider, RangePicker } from '@kufox/mui';
import { map } from 'lodash';
import moment from 'moment';
import { injectLocale } from '@kucoin-base/i18n';
import clsx from 'clsx';
import { styled, Global } from '@kux/mui/emotion';
import { withTheme } from '@kux/mui';

const NewRangePicker = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  .rc-picker {
    &.rc-picker-range {
      background: ${({ theme }) => theme.colors.cover4};
    }
    .rc-picker-input {
      input {
        color: ${({ theme }) => theme.colors.text};
      }
    }
    .rc-picker-range-separator {
      color: ${({ theme }) => theme.colors.text};
    }
  }
  .rc-picker-suffix {
    svg {
      color: ${({ theme }) => theme.colors.text};
      fill: ${({ theme }) => theme.colors.text};
    }
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }

  .label {
    max-width: 100px;
    padding-right: 16px;
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 500;
    font-size: 13px;
    line-height: 24px;
  }
  .miniDivider {
    display: inline-block;
    width: 1px;
    height: 24px;
    margin: 0 14px;
    background: ${({ theme }) => theme.colors.cover40};
    /* 小屏样式 */

    @media screen and (max-width: 768px) {
      display: none;
    }
  }
  .list {
    display: flex;
    flex-direction: row;
    align-items: center;
    /* 小屏样式 */
    @media screen and (max-width: 768px) {
      margin-top: 10px;
    }

    .tag {
      min-width: 52px;
      padding-right: 8px;
      color: ${({ theme }) => theme.colors.text};
      font-size: 12px;
      word-break: break-all;
      cursor: pointer;
    }
    .KuxRadio-wrapper {
      margin: 0 8px 8px 0;
      color: ${({ theme }) => theme.colors.text60};
      background: ${({ theme }) => theme.colors.cover4};
    }
    .KuxRadio-wrapper-checked {
      color: ${({ theme }) => theme.colors.primary};
      background: ${({ theme }) => theme.colors.primary4};
    }
  }
`;

const FORMAT = 'YYYY/MM/DD';

const defaultDateTags = [
  // type值默认为month，可不填，如需天，则用days，eg: {label: '近7天', value: 7, type: 'days'}
  { label: 'today', value: 0, type: 'days' },
  { label: 'one.month', value: 1, type: 'month' },
  { label: 'three.month', value: 3, type: 'month' },
  { label: 'one.year', value: 12, type: 'month' },
];

const syncTag = (startAt, endAt, recentTags) => {
  let _tagObj = null;
  if (startAt && startAt._isAMomentObject && endAt && endAt._isAMomentObject) {
    if (endAt.format(FORMAT) === moment().format(FORMAT)) {
      _tagObj = recentTags.find((item) => {
        const { value, type } = item;
        return startAt.format(FORMAT) === moment().subtract(value, type).format(FORMAT);
      });
    }
  }
  return _tagObj || null;
};

@injectLocale
@withTheme
export default class KCRangePicker extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps && Array.isArray(nextProps.value)) {
      let [startAt, endAt] = nextProps.value;
      startAt = moment(`${moment(startAt).format('YYYY-MM-DD')} 00:00:00`);
      endAt = moment(`${moment(endAt).format('YYYY-MM-DD')} 23:59:59`);
      const { recentTags = defaultDateTags } = nextProps;
      const dateTag = syncTag(startAt, endAt, recentTags);
      return {
        dateTag,
        startAt,
        endAt,
      };
    }
    return null;
  }

  static defaultProps = {
    format: FORMAT,
  };

  constructor(props) {
    super(props);
    let startAt;
    let endAt;
    if (Array.isArray(props.value)) {
      [startAt, endAt] = props.value;
    }
    startAt = moment(`${moment(startAt).format('YYYY-MM-DD')} 00:00:00`);
    endAt = moment(`${moment(endAt).format('YYYY-MM-DD')} 23:59:59`);
    const { recentTags = defaultDateTags } = props;
    const dateTag = syncTag(startAt, endAt, recentTags);
    this.state = {
      dateTag,
      startAt,
      endAt,
    };
  }

  handleRangeChange = (value) => {
    const { recentTags = defaultDateTags } = this.props;
    if (value) {
      const [startAt, endAt] = value;
      const dateTag = syncTag(startAt, endAt, recentTags);
      this.triggerChange(value, dateTag);
    }
  };

  handleDateRadioChange = (e) => {
    const dateTag = e.target.value;
    const { value, type } = dateTag;
    const rangeValue = [moment().subtract(value, type), moment()];
    this.triggerChange(rangeValue, dateTag);
  };

  triggerChange = (rangeValue, dateTag) => {
    const { format } = this.props;
    let [startAt, endAt] = rangeValue;
    // 起始时间： 00:00:00 截止时间：23:59:59
    if (format === FORMAT) {
      startAt = moment(`${startAt.format('YYYY-MM-DD')} 00:00:00`);
      endAt = moment(`${endAt.format('YYYY-MM-DD')} 23:59:59`);
    }
    const { onChange } = this.props;
    if (!('value' in this.props)) {
      this.setState({
        startAt,
        endAt,
        dateTag,
      });
    }
    if (onChange) {
      onChange([startAt, endAt]);
    }
  };

  render() {
    const { format, size = 'small', recentTags = defaultDateTags, classNames, theme } = this.props;
    const { startAt, endAt, dateTag } = this.state;
    return (
      <NewRangePicker theme={theme} className={clsx('kcRangePicker', classNames)}>
        <RangePicker
          value={[startAt, endAt]}
          onChange={this.handleRangeChange}
          size={size}
          format={format}
          allowClear={false}
        />
        <Divider type="vertical" className={'miniDivider'} />
        <div className={'list'}>
          <span className={'tag'}>{_t('recent')} : </span>
          <Radio.Group buttonStyle="solid" onChange={this.handleDateRadioChange} value={dateTag}>
            {map(recentTags, (item, index) => {
              return (
                <Radio.Button wave={false} value={item} key={index}>
                  {_t(item.label)}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </div>
      </NewRangePicker>
    );
  }
}
