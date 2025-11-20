/**
 * Owner: willen@kupotech.com
 */
import { styled } from '@kufox/mui';
import { Spin } from '@kufox/mui';
const Container = styled.div`
  height: ${(props) => props.containerHeight};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CustomLoading = (props) => {
  const { containerHeight = '100%', size = 'medium', className = '' } = props;
  return (
    <Container containerHeight={containerHeight} className={className}>
      <Spin size={size} />
    </Container>
  );
};

export default CustomLoading;
