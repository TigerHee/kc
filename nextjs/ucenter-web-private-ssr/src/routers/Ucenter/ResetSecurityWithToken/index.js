import ResetSecurity from '../ResetSecurity';
import { withRouter } from 'components/Router';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';

function ResetSecurityWithToken({ query }) {
  return <ErrorBoundary scene={SCENE_MAP.resetSecurity.token}>
    <ResetSecurity token={query.token} />
  </ErrorBoundary>;
}

export default withRouter()(ResetSecurityWithToken);
