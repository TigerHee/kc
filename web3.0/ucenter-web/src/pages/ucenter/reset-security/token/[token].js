import ResetSecurity from 'routes/Ucenter/ResetSecurity';
import { withRouter } from 'src/components/Router';

export default withRouter()(({ query }) => {
  return <ResetSecurity token={query.token} />;
});
