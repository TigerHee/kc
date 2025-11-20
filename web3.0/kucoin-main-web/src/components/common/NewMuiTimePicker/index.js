/**
 * Owner: pike@kupotech.com
 */
import React from 'react';
import { _t } from 'tools/i18n';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import moment from 'moment';
import 'rc-calendar/assets/index.css';
import styles from './style.less';
import { Popover, Select, ClickAwayListener } from '@kux/mui';
import { injectLocale } from '@kucoin-base/i18n';
import clsx from 'clsx';

const FORMAT = 'YYYY/MM/DD';

const CUSTOMTIME = {
  label: 'custom.time',
  value: 'custom',
  type: 'custom',
};

const disabledDateLoop = () => false;

const defaultDateTags = [
  // type值默认为month，可不填，如需天，则用days，eg: {label: '近7天', value: 7, type: 'days'}
  { label: 'today', value: 0, type: 'days' },
  { label: 'one.month', value: 1, type: 'month' },
  { label: 'three.month', value: 3, type: 'month' },
  { label: 'one.year', value: 12, type: 'month' },
  { ...CUSTOMTIME },
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

@injectLocale
export default class MuiTimePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      toolTipOpen: false,
    };
    this.containerRef = React.createRef();
    this.changeValueRef = React.createRef();
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

              const dateTag = syncTag(startAt, endAt, recentTags);
              if (dateTag) {
                node = _t(dateTag.label);
              } else {
                const startAtString = startAt.format(FORMAT);
                const entString = endAt.format(FORMAT);
                node = `${startAtString}-${entString}`;
              }
            }
            return node;
          }
          return (
            <div
              style={{ lineHeight: '40px' }}
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
      const rangeValue = [moment().subtract(value, type), moment()];
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
    const { recentTags = defaultDateTags } = this.props;
    if (value) {
      const [startAt, endAt] = value;
      const dateTag = syncTag(startAt, endAt, recentTags);
      this.triggerChange(value, dateTag);
      this.setState({
        toolTipOpen: false,
        open: false,
      });
    }
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
      return this.props?.disabledTime(current, this.changeValueRef.current);
    }
    const { disabledDate = disabledDateLoop } = this.props;
    return disabledDate(current, this.changeValueRef);
  };

  render() {
    const { open, toolTipOpen } = this.state;
    const {
      value: valueFromProp,
      recentTags = defaultDateTags,
      dateContentClass,
      disablePortal = true,
      placeholder,
      containerStyle = { height: '40px' },
      disabledDate = disabledDateLoop,
      size = 'middle',
    } = this.props;

    const options = this.getOptions();

    const _value = findValueFromProps(valueFromProp, recentTags);

    return (
      <Popover
        disablePortal={disablePortal}
        open={toolTipOpen}
        placement="bottom-start"
        arrow={false}
        interactive
        offset={-60}
        contentClass={clsx(styles.toolTip, dateContentClass)}
        content={
          <ClickAwayListener onClickAway={this.handleClickAway}>
            <div className={styles.picker}>
              <RangeCalendar
                onSelect={this.handleRangeChange}
                showDateInput={false}
                showToday={false}
                onChange={this.onChangeHandle}
                disabledDate={this.disabledDate}
              />
            </div>
          </ClickAwayListener>
        }
      >
        <div style={containerStyle}>
          <Select
            onDropDownVisibleChange={this.toggleOpen}
            value={_value}
            open={open}
            options={options}
            onChange={() => {}}
            placeholder={placeholder}
            size={size}
          />
        </div>
      </Popover>
    );
  }
}
