/**
 * Owner: willen@kupotech.com
 */
import { Spin, styled } from '@kux/mui';

const SpinCustom = styled(Spin)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, 50%, 0);
`;

const AbsoluteLoading = (props) => {
  return <SpinCustom size="small" {...props} />;
};

export default AbsoluteLoading;
