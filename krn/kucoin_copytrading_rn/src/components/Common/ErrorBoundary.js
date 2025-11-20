import React from 'react';
import * as Sentry from '@sentry/react-native';

export const ErrorBoundary = ({children, fallback = null}) => {
  return (
    <Sentry.ErrorBoundary fallback={fallback}>{children}</Sentry.ErrorBoundary>
  );
};
