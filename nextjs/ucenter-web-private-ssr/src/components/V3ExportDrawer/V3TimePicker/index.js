/**
 * Owner: willen@kupotech.com
 */
import { injectLocale } from 'components/LoadLocale';
import { Button, ClickAwayListener } from '@kux/mui';
import DateTimeFormat from 'components/common/DateTimeFormat';
import moment from 'moment';
import 'rc-calendar/assets/index.css';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import React from 'react';
import { _t } from 'tools/i18n';
import { CalendarButtons, PopoverStyled, SelectStyled } from './ui';

const FORMAT = 'YYYY/MM/DD';

const CUSTOMTIME = {
  label: 'custom.time',
  value: 'custom',
  type: 'custom',
};

const disabledDateLoop = () => false;

const defaultDateTags = [
  { label: 'xha3g4F2gdNHFds6JSSEMX', value: 7, type: 'days' },
  { label: 'nqNiNre3Y6azKbAJkZC26P', value: 1, type: 'month' },
  { label: 'aCBJGNohUwX9MSfFa7MmvQ', value: 3, type: 'month' },
  { label: '1t8diY2fXE7PYX2xXRuBiJ', value: 12, type: 'month' },
  { ...CUSTOMTIME },
];

const syncTag = (startAt, endAt, recentTags) => {
  let _tagObj = null;
  if (startAt && startAt._isAMomentObject && endAt && endAt._isAMomentObject) {
    if (endAt.format(FORMAT) === moment().subtract(1, 'days').format(FORMAT)) {
      _tagObj = recentTags.find((item) => {
        const { value, type } = item;
        return (
          startAt.format(FORMAT) ===
          moment().subtract(1, 'days').subtract(value, type).format(FORMAT)
        );
      });
    }
  }
  return _tagObj || null;
};

const findValueFromProps = (values, tags) => {
  if (Array.isArray(values)) {
    let [startAt, endAt] = values;
    startAt = moment(startAt).startOf('days');
    endAt = moment(endAt).endOf('days');
    const dateTag = syncTag(startAt, endAt, tags);
    if (dateTag) {
      return dateTag.value;
    } else {
      return CUSTOMTIME.value;
    }
  }
};

export const getInitTime = (isSingleDay) => {
  // 是只需要生成一个时间点，还是时间区间
  return isSingleDay
    ? moment().subtract(1, 'days').endOf('days')
    : [
      moment().subtract(1, 'days').subtract(1, 'month').startOf('days'),
      moment().subtract(1, 'days').endOf('days'),
    ];
};

export const disabledDate = (current, values) => {
  // 最小可选择的UTC时间 2017-09-16T00:00:00.000Z
  // 最大可选为昨天
  const minDate = moment(1505520000000);
  if (current > moment().subtract(1, 'days').endOf('day') || current < minDate) {
    return true;
  }

  if (values?.current?.length) {
    const selectDate = values.current[0];
    const diffMonth = 12;
    const minSelectDate = moment(selectDate).subtract(diffMonth, 'months').startOf('days');
    const maxSelectDate = moment(selectDate).add(diffMonth, 'months').endOf('days');

    return current < minSelectDate || current > maxSelectDate;
  }

  return false;
};

@injectLocale
export default class V3TimePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      toolTipOpen: false,
    };
    this.changeValueRef = React.createRef();
    this.finalValueRef = React.createRef();
  }

  static defaultProps = {
    format: FORMAT,
  };

  getOptions = () => {
    const { recentTags = defaultDateTags, value: valueFromProps } = this.props;
    let startAt;
    let endAt;
    const tags = recentTags || defaultDateTags;
    const options = tags.map(({ label, value, type }) => {
      return {
        value,
        type,
        label: (isInInput) => {
          if (isInInput) {
            let node = undefined;

            if (Array.isArray(valueFromProps)) {
              [startAt, endAt] = valueFromProps;
              startAt = moment(startAt).startOf('days');
              endAt = moment(endAt).endOf('days');
              node = (
                <>
                  <DateTimeFormat hideTime>{startAt}</DateTimeFormat> -{' '}
                  <DateTimeFormat hideTime>{endAt}</DateTimeFormat>
                </>
              );
            }
            return node;
          }
          return (
            <div
              style={{ height: 40, lineHeight: '40px' }}
              onClick={(event) => {
                event.preventDefault();
                this.handleClick({ value, type });
              }}
            >
              {_t(label)}
            </div>
          );
        },
      };
    });
    return options;
  };

  handleClick = (option) => {
    const { value, type } = option;
    if (type !== 'custom') {
      // 不含今天（选中7天，1个月，3个月，1年时，向前平移1天）
      const rangeValue = [
        moment().subtract(1, 'days').subtract(value, type),
        moment().subtract(1, 'days'),
      ];
      this.triggerChange(rangeValue, option);
    } else {
      setTimeout(() => {
        this.setState({
          toolTipOpen: true,
        });
      });
      this.changeValueRef.current = null;
    }
  };

  onClose = () => {
    this.setState({
      open: false,
    });
  };

  onOpen = () => {
    this.setState({
      open: true,
    });
  };

  triggerChange = (rangeValue) => {
    const { format } = this.props;
    let [startAt, endAt] = rangeValue;
    if (format === FORMAT) {
      startAt = moment(startAt).startOf('days');
      endAt = moment(endAt).endOf('days');
    }
    const { onChange } = this.props;
    if (onChange) {
      onChange([startAt, endAt]);
    }
  };

  handleRangeChange = (value) => {
    this.finalValueRef.current = value;
  };

  toggleOpen = (e) => {
    const { open } = this.state;
    if (!open) {
      this.onOpen();
    } else {
      this.onClose();
    }
  };

  handleClickAway = (event) => {
    this.setState({
      toolTipOpen: false,
    });
  };

  // 用于disable 日期
  onChangeHandle = (value) => {
    this.changeValueRef.current = value;
  };

  disabledDate = (current) => {
    if (this.props?.disabledTime) {
      return this.props?.disabledTime(current);
    }
    const { disabledDate = disabledDateLoop } = this.props;
    return disabledDate(current, this.changeValueRef);
  };

  onOk = () => {
    const { recentTags = defaultDateTags } = this.props;
    const value = this.finalValueRef.current;
    if (value) {
      const [startAt, endAt] = value;
      const dateTag = syncTag(startAt, endAt, recentTags);
      this.triggerChange(value, dateTag);
      this.setState({
        toolTipOpen: false,
        open: false,
      });
      this.finalValueRef.current = undefined;
    }
  };

  onCancel = () => {
    this.setState({
      toolTipOpen: false,
    });
  };

  render() {
    const { open, toolTipOpen } = this.state;
    const {
      value: valueFromProp,
      recentTags = defaultDateTags,
      dateContentClass,
      disablePortal = true,
      placeholder,
      disabledDate = disabledDateLoop,
      ...other
    } = this.props;

    const options = this.getOptions();

    const _value = findValueFromProps(valueFromProp, recentTags);

    return (
      <PopoverStyled
        disablePortal={disablePortal}
        open={toolTipOpen}
        placement="bottom-start"
        arrow={false}
        offset={-60}
        content={
          <ClickAwayListener onClickAway={this.handleClickAway}>
            <div>
              <RangeCalendar
                defaultSelectedValue={valueFromProp}
                onSelect={this.handleRangeChange}
                showDateInput={false}
                showToday={false}
                onChange={this.onChangeHandle}
                disabledDate={this.disabledDate}
              />
              <CalendarButtons>
                <Button variant="text" type="brandGreen" onClick={this.onCancel}>
                  Cancel
                </Button>
                <Button variant="text" type="brandGreen" onClick={this.onOk}>
                  Ok
                </Button>
              </CalendarButtons>
            </div>
          </ClickAwayListener>
        }
      >
        <div>
          <SelectStyled
            {...other}
            onDropDownVisibleChange={this.toggleOpen}
            value={_value}
            open={open}
            options={options}
            onChange={() => {}}
            placeholder={placeholder}
          />
        </div>
      </PopoverStyled>
    );
  }
}
