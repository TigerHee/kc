import ErrorBoundary from "./ErrorBoundary";
import newFetch from "./common/newFetch";
import newXhr from "./common/newXhr";
import { NAMESPACE } from "./config";
import {
  setTag,
  setTags,
  setUser,
  captureEvent,
  captureException,
  captureMessage,
  captureUserFeedback,
} from "./funcs";
import init from "./init";
newFetch();
newXhr();
const sentry = {
  ...window[NAMESPACE],
  captureEvent,
  captureException,
  captureMessage,
  captureUserFeedback,
  init,
  setUser,
  setTag,
  setTags,
};
export default sentry;
export { ErrorBoundary };
