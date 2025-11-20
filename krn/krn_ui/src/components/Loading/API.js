/**
 * Owner: willen@kupotech.com
 */
import PropTypes from 'prop-types';

export default {
  spin: {
    propTypes: PropTypes.bool,
    type: 'boolean',
    comment: '是否旋转',
  },
  size: {
    propTypes: PropTypes.oneOf(['xxsmall', 'xsmall', 'small', 'medium', 'large']),
    type: 'string',
    comment: '可选不同尺寸, size: xxsmall、xsmall、small、medium、large, 默认medium',
    defaultValue: 'medium',
  },
  color: {
    propTypes: PropTypes.string,
    type: 'string',
    comment: '可选不同颜色, 默认为primary主题色',
  },
  children: {
    propTypes: PropTypes.node,
    type: 'node',
    comment: '包裹元素Loading',
  },
  coverElementStyle: {
    propTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    type: 'object|array',
    comment: '当children有值时，蒙层的样式',
  },
  style: {
    propTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    type: 'object|array',
    comment: '根元素样式，支持@emotion复写',
  },
  showKcIcon: {
    propTypes: PropTypes.bool,
    type: 'boolean',
    comment: '是否显示KC图标',
    defaultValue: true,
  },
  iconSource: {
    propTypes: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    type: 'object|number',
    comment: '展示的icon，themeProvider中如有，优先级最高，其次iconSource，默认kcIcon',
  },
  styles: {
    propTypes: PropTypes.object,
    type: 'object',
    comment: '此参数可覆盖所有元素的样式，具体key值参考源码',
    defaultValue: {},
  },
};
