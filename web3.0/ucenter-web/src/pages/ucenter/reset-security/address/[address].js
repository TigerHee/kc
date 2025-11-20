import ResetSecurityWithAddress from 'routes/Ucenter/ResetSecurityWithAddress';
import { withRouter } from 'src/components/Router';

export default withRouter()(({ query }) => {
  const address = decodeURIComponent(query.address);
  return <ResetSecurityWithAddress address={address} />;
});
