/**
 * Owner: iron@kupotech.com
 * 由于自己封装 sentry 的异步加载， @sentry/react 提供的 ErrorBoundary 组件无法使用，这里进行实现，并去掉部分不需要的功能
 */
import * as React from 'react';
import { NAMESPACE } from './config';

export function isAtLeastReact17(version) {
  const major = version.match(/^([^.]+)/);
  // eslint-disable-next-line radix
  return major !== null && parseInt(major[0]) >= 17;
}

export const UNKNOWN_COMPONENT = 'unknown';

const INITIAL_STATE = {
  componentStack: null,
  error: null,
  eventId: null,
};

/**
 * A ErrorBoundary component that logs errors to Sentry. Requires React >= 16.
 * NOTE: If you are a Sentry user, and you are seeing this stack frame, it means the
 * Sentry React SDK ErrorBoundary caught an error invoking your application code. This
 * is expected behavior and NOT indicative of a bug with the Sentry React SDK.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }

  componentDidMount() {
    const { onMount } = this.props;
    if (onMount) {
      onMount();
    }
  }

  componentDidCatch(error, { componentStack }) {
    const { beforeCapture, onError } = this.props;
    window[NAMESPACE].withScope((scope) => {
      // If on React version >= 17, create stack trace from componentStack param and links
      // to to the original error using `error.cause` otherwise relies on error param for stacktrace.
      // Linking errors requires the `LinkedErrors` integration be enabled.
      if (isAtLeastReact17(React.version)) {
        const errorBoundaryError = new Error(error.message);
        errorBoundaryError.name = `React ErrorBoundary ${errorBoundaryError.name}`;
        errorBoundaryError.stack = componentStack;

        // Using the `LinkedErrors` integration to link the errors together.
        error.cause = errorBoundaryError;
      }

      if (beforeCapture) {
        beforeCapture(scope, error, componentStack);
      }
      const eventId = window[NAMESPACE].captureException(error, {
        contexts: { react: { componentStack } },
      });
      if (onError) {
        onError(error, componentStack, eventId);
      }

      // componentDidCatch is used over getDerivedStateFromError
      // so that componentStack is accessible through state.
      this.setState({ error, componentStack, eventId });
    });
  }

  componentWillUnmount() {
    const { error, componentStack, eventId } = this.state;
    const { onUnmount } = this.props;
    if (onUnmount) {
      onUnmount(error, componentStack, eventId);
    }
  }

  resetErrorBoundary = () => {
    const { onReset } = this.props;
    const { error, componentStack, eventId } = this.state;
    if (onReset) {
      onReset(error, componentStack, eventId);
    }
    this.setState(INITIAL_STATE);
  };

  render() {
    const { fallback, children } = this.props;
    const { error, componentStack, eventId } = this.state;

    if (error) {
      let element;
      if (typeof fallback === 'function') {
        element = fallback({ error, componentStack, resetError: this.resetErrorBoundary, eventId });
      } else {
        element = fallback;
      }

      if (React.isValidElement(element)) {
        return element;
      }

      // Fail gracefully if no fallback provided or is not valid
      return null;
    }

    if (typeof children === 'function') {
      return children();
    }
    return children;
  }
}

export default ErrorBoundary;
