/**
 * Owner: pike@kupotech.com
 */
import React from 'react';
import { Select, Global } from '@kux/mui';
import _ from 'lodash';

const defaultFilter = (inputValue, opt) => {
  return opt.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
};

const defaultFormatOptions = (options) => {
  return _.map(options, (option) => {
    return {
      ...option,
      value: option.code !== undefined ? option.code : option.value,
    };
  });
};

export default class MuiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  static getDerivedStateFromProps({ value }, prevState) {
    const newState = {
      ...prevState,
    };
    newState.value = value;
    return {
      ...newState,
    };
  }

  formatOptions = () => {
    const { formatOptions = defaultFormatOptions, options } = this.props;
    const _options = formatOptions(options);
    return _options;
  };

  handleChange = (value) => {
    this.setState({ value }, () => {
      this.triggerChange(value);
    });
  };

  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    let _changedValue = changedValue;
    if (!('value' in this.props)) {
      this.setState({
        value: changedValue,
      });
    }
    if (onChange) {
      onChange(_changedValue);
    }
  };

  render() {
    const {
      placeholder,
      onFilter = defaultFilter,
      allowSearch = true,
      allowClear = false,
    } = this.props;
    const { value } = this.state;
    const options = this.formatOptions();

    return (
      <>
        <Select
          optionLabelProp="label"
          options={options}
          allowClear={allowClear}
          placeholder={placeholder}
          filterOption={onFilter}
          allowSearch={allowSearch}
          onChange={this.handleChange}
          value={value}
          searchIcon={null}
          label={null}
        />
        <Global
          styles={`
            .KuxSelect-optionItem {
              .KuxSelect-itemLabel{
                font-weight: 500;
              }
            }
          `}
        />
      </>
    );
  }
}
