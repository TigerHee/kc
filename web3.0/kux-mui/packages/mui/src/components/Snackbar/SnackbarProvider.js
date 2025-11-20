/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { SnackbarContext } from 'context/index';
import SnackbarContainer from './SnackbarContainer';
import SnackbarItem from './SnackbarItem';
import { DEFAULTS, isDefined, originKeyExtractor, merge } from './config';

class SnackbarProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snacks: [],
      queue: [],
      contextValue: {
        // 兼容老版本
        enqueueSnackbar: {
          success: this.enqueueSnackbarSuccess.bind(this),
          info: this.enqueueSnackbarInfo.bind(this),
          error: this.enqueueSnackbarError.bind(this),
          warning: this.enqueueSnackbarWarning.bind(this),
          loading: this.enqueueSnackbarLoading.bind(this),
        },
        // 兼容老版本
        closeSnackbar: this.closeSnackbar.bind(this),
        message: {
          success: this.enqueueSnackbarSuccess.bind(this),
          info: this.enqueueSnackbarInfo.bind(this),
          error: this.enqueueSnackbarError.bind(this),
          warning: this.enqueueSnackbarWarning.bind(this),
          loading: this.enqueueSnackbarLoading.bind(this),
        },
        onClose: this.closeSnackbar.bind(this),
      },
    };
    this.maxSnack = props.maxSnack || DEFAULTS.maxSnack;
  }

  enqueueSnackbar = (message, opts = {}) => {
    const { key, ...options } = opts;
    const hasSpecifiedKey = isDefined(key);
    const _key = hasSpecifiedKey ? key : new Date().getTime() + Math.random();
    const mergerSnackbar = merge(options, this.props, DEFAULTS);
    const snack = {
      key: _key,
      ...options,
      message,
      open: true,
      entered: false,
      requestClose: false,
      variant: mergerSnackbar('variant'),
      position: mergerSnackbar('position'),
      autoHideDuration: mergerSnackbar('autoHideDuration'),
    };
    if (options.persist) {
      snack.autoHideDuration = undefined;
    }
    this.setState((state) => {
      return this.handleDisplaySnack({
        ...state,
        queue: [...state.queue, snack],
      });
    });
    return _key;
  };

  enqueueSnackbarLoading = (message, opts = {}) => {
    opts.variant = 'loading';
    this.enqueueSnackbar(message, opts);
  };

  enqueueSnackbarSuccess = (message, opts = {}) => {
    opts.variant = 'success';
    this.enqueueSnackbar(message, opts);
  };

  enqueueSnackbarInfo = (message, opts = {}) => {
    opts.variant = 'info';
    this.enqueueSnackbar(message, opts);
  };

  enqueueSnackbarWarning = (message, opts = {}) => {
    opts.variant = 'warning';
    this.enqueueSnackbar(message, opts);
  };

  enqueueSnackbarError = (message, opts = {}) => {
    opts.variant = 'error';
    this.enqueueSnackbar(message, opts);
  };

  handleDisplaySnack = (state) => {
    const { snacks } = state;
    if (snacks.length >= this.maxSnack) {
      return this.handleDismissOldest(state);
    }
    return this.processQueue(state);
  };

  processQueue = (state) => {
    const { queue, snacks } = state;
    if (queue.length > 0) {
      return {
        ...state,
        snacks: [...snacks, queue[0]],
        queue: queue.slice(1, queue.length),
      };
    }
    return state;
  };

  handleDismissOldest = (state) => {
    if (state.snacks.some((item) => !item.open || item.requestClose)) {
      return state;
    }
    let popped = false;
    let ignore = false;
    const persistentCount = state.snacks.reduce(
      (acc, current) => acc + (current.open && current.persist ? 1 : 0),
      0,
    );
    if (persistentCount === this.maxSnack) {
      ignore = true;
    }
    const snacks = state.snacks.map((item) => {
      if (!popped && (!item.persist || ignore)) {
        popped = true;
        if (!item.entered) {
          return {
            ...item,
            requestClose: true,
          };
        }
        if (item.onClose) item.onClose(null, item.key);
        if (this.props.onClose) this.props.onClose(null, item.key);
        return {
          ...item,
          open: false,
        };
      }
      return { ...item };
    });

    return { ...state, snacks };
  };

  handleEnteredSnack = (node, isAppearing, key) => {
    if (!isDefined(key)) {
      throw new Error('undefined key');
    }
    this.setState(({ snacks }) => ({
      snacks: snacks.map((item) => (item.key === key ? { ...item, entered: true } : { ...item })),
    }));
  };

  handleCloseSnack = (event, key) => {
    if (this.props.onClose) {
      this.props.onClose(event, key);
    }
    const shouldCloseAll = key === undefined;
    this.setState(({ snacks, queue }) => ({
      snacks: snacks.map((item) => {
        if (!shouldCloseAll && item.key !== key) {
          return { ...item };
        }
        return item.entered ? { ...item, open: false } : { ...item, requestClose: true };
      }),
      queue: queue.filter((item) => item.key !== key),
    }));
  };

  closeSnackbar = (key) => {
    const toBeClosed = this.state.snacks.find((item) => item.key === key);
    if (isDefined(key) && toBeClosed && toBeClosed.onClose) {
      toBeClosed.onClose(null, key);
    }
    this.handleCloseSnack(null, key);
  };

  handleExitedSnack = (event, key1, key2) => {
    const key = key1 || key2;
    if (!isDefined(key)) {
      throw new Error('handleExitedSnack Cannot be called with undefined key');
    }
    this.setState((state) => {
      const newState = this.processQueue({
        ...state,
        snacks: state.snacks.filter((item) => item.key !== key),
      });
      if (newState.queue.length === 0) {
        return newState;
      }
      return this.handleDismissOldest(newState);
    });
  };

  render() {
    const { contextValue } = this.state;
    const { hideIcon = DEFAULTS.hideIcon, children, ...props } = this.props;
    const categories = this.state.snacks.reduce((acc, current) => {
      const category = originKeyExtractor(current.position);
      const existingOfCategory = acc[category] || [];
      return {
        ...acc,
        [category]: [...existingOfCategory, current],
      };
    }, {});
    const snackbars = Object.keys(categories).map((origin) => {
      const snacks = categories[origin];
      const { vertical, horizontal } = snacks[0].position;
      return (
        <SnackbarContainer key={origin} vertical={vertical} horizontal={horizontal}>
          {snacks.map((snack) => (
            <SnackbarItem
              {...props}
              key={snack.key}
              snack={snack}
              hideIcon={hideIcon}
              onClose={this.handleCloseSnack}
              onExited={this.handleExitedSnack}
              onEntered={this.handleEnteredSnack}
            />
          ))}
        </SnackbarContainer>
      );
    });

    return (
      <SnackbarContext.Provider value={contextValue}>
        {children}
        {snackbars}
      </SnackbarContext.Provider>
    );
  }
}

export default SnackbarProvider;
