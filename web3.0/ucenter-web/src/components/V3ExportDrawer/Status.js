/**
 * Owner: tiger@kupotech.com
 */
import { styled } from '@kux/mui';

const STATUS = {
  pending: {
    color: 'complementary',
    backgroundColor: 'complementary12',
  },
  success: {
    color: 'primary',
    backgroundColor: 'primary12',
  },
  faild: {
    color: 'secondary',
    backgroundColor: 'secondary12',
  },
};

export default styled.div`
  width: fit-content;
  height: 20px;
  font-size: 12px;
  padding: 0 6px;
  border-radius: 4px;
  color: ${(props) => props.theme.colors[(STATUS[props.status] || STATUS.success).color]};
  background: ${(props) =>
    props.theme.colors[(STATUS[props.status] || STATUS.success).backgroundColor]};
  display: flex;
  align-items: center;
  img {
    width: 14px;
    height: 14px;
    margin-left: 2px;
  }
`;
