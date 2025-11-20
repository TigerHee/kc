/**
 * Owner: victor.ren@kupotech.com
 */
import * as React from 'react';
import { configure, fireEvent, getConfig } from '@testing-library/react';

const noWrapper = (callback) => callback();

function withMissingActWarningsIgnored(callback) {
  if (React.version.startsWith('18')) {
    callback();
    return;
  }

  const originalConsoleError = console.error;
  console.error = function silenceMissingActWarnings(message, ...args) {
    const isMissingActWarning = /not wrapped in act\(...\)/.test(message);
    if (!isMissingActWarning) {
      originalConsoleError.call(console, message, ...args);
    }
  };

  const originalConfig = getConfig();
  configure({
    eventWrapper: noWrapper,
  });

  try {
    callback();
  } finally {
    configure(originalConfig);
    console.error = originalConsoleError;
  }
}

export function click(element) {
  return withMissingActWarningsIgnored(() => {
    fireEvent.click(element);
  });
}

/**
 * @param {Element} element
 * @param {{}} [options]
 * @returns {void}
 */
export function keyDown(element, options) {
  return withMissingActWarningsIgnored(() => {
    fireEvent.keyDown(element, options);
  });
}

/**
 * @param {Element} element
 * @param {{}} [options]
 * @returns {void}
 */
export function keyUp(element, options) {
  return withMissingActWarningsIgnored(() => {
    fireEvent.keyUp(element, options);
  });
}

/**
 * @param {Element} element
 * @param {{}} [options]
 * @returns {void}
 */
export function mouseDown(element, options) {
  return withMissingActWarningsIgnored(() => {
    fireEvent.mouseDown(element, options);
  });
}

/**
 * @param {Element} element
 * @param {{}} [options]
 * @returns {void}
 */
export function mouseUp(element, options) {
  return withMissingActWarningsIgnored(() => {
    fireEvent.mouseDown(element, options);
  });
}
