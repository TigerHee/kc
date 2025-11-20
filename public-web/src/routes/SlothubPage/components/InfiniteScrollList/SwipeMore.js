/*
 * @Owner: gannicus.zhou@kupotech.com
 */
import { Spin, styled } from '@kux/mui';
import { _t } from 'src/tools/i18n';

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin: 12px 0;
  font-size: 12px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
`;
// const Row = styled.div`
//   padding: 8px 0;
//   position: relative;
// `;
// const Line = styled.div`
//   height: 0;
//   border-top: 1px solid ${props => props.theme.colors.cover12};
// `;
// const Text = styled.span`
//   font-size: 12px;
//   line-height: 130%;
//   padding: 0 4px;
//   color: ${props => props.theme.colors.text40};
//   background-color: #FFF;
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate3d(-50%, -50%, 0);
// `;

const SwipeMore = ({ loading }) => {
  return (
    <Container>{loading ? <Spin spinning size="small" /> : _t('4654a8d762194000a513')}</Container>
  );
};

export default SwipeMore;
