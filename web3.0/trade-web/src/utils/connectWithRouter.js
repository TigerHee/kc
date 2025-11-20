/**
 * Owner: borden@kupotech.com
 */
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const connectWithRouter = (...props) => (component) => {
  return withRouter(connect(...props)(component));
};

export default connectWithRouter;
