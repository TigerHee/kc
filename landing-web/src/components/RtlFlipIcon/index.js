/**
 * Owner: melon@kupotech.com
 */
/**
 * 图标组件
 * 从右到左的小语种下会左右翻转
 */
import { styled } from '@kufox/mui/emotion';
import { isEmpty } from 'lodash';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const RtlFlipIconImg = styled.img`
  display: inline-block;
  width: ${(props) => (isEmpty(props?.size) ? '16px' : `${props?.size}px`)};
  height: ${(props) => (isEmpty(props?.size) ? '16px' : `${props?.size}px`)};
  [dir='rtl'] & {
    transform: scaleX(-1);
  }
`;

const Index = ({ className, src, size, style, ...rest }) => {
  return (
    <RtlFlipIconImg
      className={classnames('Ku_RtlFlipIcon', className)}
      src={src}
      size={size}
      style={style}
      alt="Ku_RtlFlipIcon"
      {...rest}
    />
  );
};

Index.propTypes = {
  className: PropTypes.any, // 样式名称
  src: PropTypes.string, // 图片地址
  size: PropTypes.number, // 尺寸
  style: PropTypes.object,
};

Index.defaultProps = {
  className: '',
  src: '',
  size: 16,
  style: {},
};

export default Index;
