/**
 * Owner: tiger@kupotech.com
 */
import PropTypes from 'prop-types';

export default {
  value: {
    propTypes: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.number]),
    type: 'string|array|number',
    comment: '当前选中的value',
  },
  onChange: {
    propTypes: PropTypes.func,
    type: 'func',
    comment: '选择回调函数',
  },
  options: {
    propTypes: PropTypes.array,
    type: 'array',
    comment: '选项，每项需有label，value字段',
  },
  multiple: {
    propTypes: PropTypes.bool,
    type: 'boolean',
    comment: '是否多选',
    defaultValue: false,
  },
  listDirection: {
    propTypes: PropTypes.oneOf(['column', 'row']),
    type: 'string',
    comment: '布局方式，支持: column:竖, row:横',
    defaultValue: 'column',
  },
  colNumber: {
    propTypes: PropTypes.number,
    type: 'number',
    comment: '横向布局列数',
    defaultValue: 3,
  },
  layoutPercentConfig: {
    propTypes: PropTypes.object,
    type: 'object',
    comment: '横向元素宽度及间距百分比',
    defaultValue: {
      marginLeft: 4,
      marginTop: 4,
    },
  },
  styles: {
    propTypes: PropTypes.object,
    type: 'object',
    comment: '此参数可覆盖所有元素的样式，具体key值参考源码',
    defaultValue: {},
  },
};
