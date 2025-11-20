import init from './init';
import bizType from './config';
import report from './report';
import ErrorBoundary from './ErrorBoundary';

import {
  setUser,
  setTag,
  setTags,
  configureScope,
  withScope,
  captureException,
  captureMessage,
  captureEvent,
  addBreadcrumb,
} from './funcs';

export default {
  init,
  bizType,
  setTag,
  setTags,
  setUser,
  configureScope,
  withScope,
  report,
  captureException,
  captureMessage,
  captureEvent,
  addBreadcrumb,
};

export { ErrorBoundary };
