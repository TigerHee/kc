/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import * as ReactDOMServer from 'react-dom/server';

import ThemeProvider from '../src/components/ThemeProvider';

import {
  render as testingLibraryRender,
  cleanup,
  queries,
  act as rtlAct,
  within,
} from '@testing-library/react';

import { useFakeTimers } from 'sinon';

function traceByStackSync(interactionName, callback) {
  const { stack } = new Error();
  const testLines = stack
    .split(/\r?\n/)
    .map((line) => {
      const fileMatch = line.match(/([^\s(]+\.test\.(js|ts|tsx)):(\d+):(\d+)/);
      if (fileMatch === null) {
        return null;
      }
      return { name: fileMatch[1], line: +fileMatch[3], column: +fileMatch[4] };
    })
    .filter((maybeTestFile) => {
      return maybeTestFile !== null;
    })
    .map((file) => {
      return `${file.name.replace(workspaceRoot, '')}:${file.line}:${file.column}`;
    });
  const originLine = testLines[testLines.length - 1] ?? 'unknown line';

  interactionID += 1;

  const interaction = {
    id: interactionID,
    name: `${originLine} (${interactionName})`,
    timestamp: performance.now(),
  };

  interactionStack.push(interaction);
  try {
    return callback();
  } finally {
    interactionStack.pop();
  }
}

const traceSync = traceByStackSync;

function createClock(defaultMode, config) {
  let clock = null;

  let mode = defaultMode;

  beforeEach(() => {
    if (mode === 'fake') {
      clock = useFakeTimers({
        now: config,

        shouldClearNativeTimers: true,
      });
    }
  });

  afterEach(() => {
    clock?.restore();
    clock = null;
  });

  return {
    tick(timeoutMS) {
      if (clock === null) {
        throw new Error(`Can't advance the real clock. Did you mean to call this on fake clock?`);
      }
      traceSync('tick', () => {
        rtlAct(() => {
          clock?.tick(timeoutMS);
        });
      });
    },
    runAll() {
      if (clock === null) {
        throw new Error(`Can't advance the real clock. Did you mean to call this on fake clock?`);
      }
      traceSync('runAll', () => {
        rtlAct(() => {
          clock?.runAll();
        });
      });
    },
    runToLast() {
      if (clock === null) {
        throw new Error(`Can't advance the real clock. Did you mean to call this on fake clock?`);
      }
      traceSync('runToLast', () => {
        rtlAct(() => {
          clock?.runToLast();
        });
      });
    },
    isReal() {
      return setTimeout.hasOwnProperty('clock') === false;
    },
    withFakeTimers() {
      beforeAll(() => {
        mode = 'fake';
      });

      afterAll(() => {
        mode = defaultMode;
      });
    },
  };
}

let workspaceRoot;
let interactionID = 0;
const interactionStack = [];

function render(element, configuration) {
  const { container, hydrate, wrapper } = configuration;

  const testingLibraryRenderResult = traceSync('render', () =>
    testingLibraryRender(element, {
      container,
      hydrate,
      queries: { ...queries },
      wrapper,
    }),
  );
  const result = {
    ...testingLibraryRenderResult,
    forceUpdate() {
      traceSync('forceUpdate', () =>
        testingLibraryRenderResult.rerender(
          React.cloneElement(element, {
            'data-force-update': String(Math.random()),
          }),
        ),
      );
    },
    setProps(props) {
      traceSync('setProps', () =>
        testingLibraryRenderResult.rerender(React.cloneElement(element, props)),
      );
    },
  };

  return result;
}

function renderToString(element, configuration) {
  const { container, wrapper: Wrapper } = configuration;

  traceSync('renderToString', () => {
    container.innerHTML = ReactDOMServer.renderToString(<Wrapper>{element}</Wrapper>);
  });

  return {
    container,
    hydrate() {
      return render(element, { ...configuration, hydrate: true });
    },
  };
}

const createRender = (globalOptions = {}) => {
  const { clock: clockMode = 'fake', clockConfig } = globalOptions;

  const clock = createClock(clockMode, clockConfig);

  let prepared = false;
  beforeEach(function beforeEachHook() {
    prepared = true;
  });

  afterEach(function afterEachHook() {
    cleanup();
  });

  function createWrapper() {
    return function Wrapper({ children }) {
      return (
        <ThemeProvider>
          <React.Fragment>{children}</React.Fragment>
        </ThemeProvider>
      );
    };
  }

  return {
    clock,
    render: (component, options = {}) => {
      if (!prepared) {
        throw new Error(
          'Unable to finish setup before `render()` was called. ' +
          'This usually indicates that `render()` was called in a `before()` or `beforeEach` hook. ' +
          'Move the call into each `it()`. Otherwise you cannot run a specific test and we cannot isolate each test.',
        );
      }
      return render(component, {
        ...options,
        hydrate: false,
        wrapper: createWrapper(),
      });
    },
    renderToString(element, options) {
      if (!prepared) {
        throw new Error(
          'Unable to finish setup before `render()` was called. ' +
          'This usually indicates that `render()` was called in a `before()` or `beforeEach` hook. ' +
          'Move the call into each `it()`. Otherwise you cannot run a specific test and we cannot isolate each test.',
        );
      }

      const { container = serverContainer, ...localOptions } = options;
      return renderToString(element, {
        ...localOptions,
        container,
        wrapper: createWrapper(options),
      });
    },
  };
};

export default createRender;

export const screen = within(document.body, { ...queries });
