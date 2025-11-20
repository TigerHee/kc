/**
 * Owner: chris@kupotech.com
 */
import { Spin, styled } from '@kux/mui';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  background: ${({ theme }) => theme.colors.overlay};
`;

const Spins = styled(Spin)`
  position: absolute;
  top: 50vh;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
`;

function Loading() {
  return (
    <Container>
      <Spins type="brand" size="small" />
    </Container>
  );
}
export default Loading;
