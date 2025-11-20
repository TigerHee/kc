/**
 * Owner: willen@kupotech.com
 */
import { styled } from '@kux/mui';
import ErrorBoundary, { SCENE_MAP } from 'components/common/ErrorBoundary';
import Login from 'routes/Ucenter/Login';

const Box = styled.section`
  width: 100%;
  flex: 1;
  .entranceContentRight {
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 4px;
      background: transparent;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: #cccccc;
      border-radius: 2px;
    }
    .entranceContentRightBox {
      height: auto;
    }
  }
`;

export default () => {
  return (
    <ErrorBoundary scene={SCENE_MAP.login.index}>
      <Box data-inspector="signin_page">
        <Login />
      </Box>
    </ErrorBoundary>
  );
};
