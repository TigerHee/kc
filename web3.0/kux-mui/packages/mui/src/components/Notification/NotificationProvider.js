/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { NotificationContext } from 'context/index';
import { withTheme } from '@emotion/react';
import Portal from '../Portal';
import NotificationContainer from './NotificationContainer';
import NotificationItem from './NotificationItem';
import { DEFAULTS, isDefined, originKeyExtractor, merge } from './config';

@withTheme
class NotificationProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notices: [],
      queue: [],
      contextValue: {
        success: this.openSuccess.bind(this),
        info: this.openInfo.bind(this),
        error: this.openError.bind(this),
        warning: this.openWarning.bind(this),
        close: this.handleCloseNotice.bind(this),
        open: this.openNotice.bind(this),
      },
    };
    this.maxNotice = props.maxNotice || DEFAULTS.maxNotice;
  }

  open = (opts = {}) => {
    const { key, message, description, ...options } = opts;
    const hasSpecifiedKey = isDefined(key);
    const _key = hasSpecifiedKey ? key : new Date().getTime() + Math.random();
    const mergerNotice = merge(options, this.props, DEFAULTS);
    const [vertical, horizontal] = String(mergerNotice('placement')).split('-');
    const position = {
      vertical,
      horizontal,
    };
    const notice = {
      key: _key,
      ...options,
      message,
      description,
      open: true,
      entered: false,
      requestClose: false,
      position,
      closeable: mergerNotice('closeable'),
      autoHideDuration: mergerNotice('autoHideDuration'),
    };
    if (options.persist) {
      notice.autoHideDuration = undefined;
    }
    this.setState((state) => {
      return this.handleDisplayNotice({
        ...state,
        queue: [...state.queue, notice],
      });
    });
    return _key;
  };

  openNotice = (opts = {}) => {
    opts.variant = 'open';
    this.open(opts);
  };

  openSuccess = (opts = {}) => {
    opts.variant = 'success';
    // delete opts.icon;
    this.open(opts);
  };

  openInfo = (opts = {}) => {
    opts.variant = 'info';
    // delete opts.icon;
    this.open(opts);
  };

  openWarning = (opts = {}) => {
    opts.variant = 'warning';
    // delete opts.icon;
    this.open(opts);
  };

  openError = (opts = {}) => {
    opts.variant = 'error';
    // delete opts.icon;
    this.open(opts);
  };

  handleDisplayNotice = (state) => {
    const { notices } = state;
    if (notices.length >= this.maxNotice) {
      return this.handleDismissOldest(state);
    }
    return this.processQueue(state);
  };

  processQueue = (state) => {
    const { queue, notices } = state;
    if (queue.length > 0) {
      return {
        ...state,
        notices: [...notices, queue[0]],
        queue: queue.slice(1, queue.length),
      };
    }
    return state;
  };

  handleDismissOldest = (state) => {
    if (state.notices.some((item) => !item.open || item.requestClose)) {
      return state;
    }
    let popped = false;
    let ignore = false;
    const persistentCount = state.notices.reduce(
      (acc, current) => acc + (current.open && current.persist ? 1 : 0),
      0,
    );
    if (persistentCount === this.maxNotice) {
      ignore = true;
    }
    const notices = state.notices.map((item) => {
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

    return { ...state, notices };
  };

  handleEnteredNotice = (node, isAppearing, key) => {
    if (!isDefined(key)) {
      throw new Error('undefined key');
    }
    this.setState(({ notices }) => ({
      notices: notices.map((item) => (item.key === key ? { ...item, entered: true } : { ...item })),
    }));
  };

  handleCloseNotice = (key) => {
    if (this.props.onClose) {
      this.props.onClose(key);
    }
    const shouldCloseAll = key === undefined;
    this.setState(({ notices, queue }) => ({
      notices: notices.map((item) => {
        if (!shouldCloseAll && item.key !== key) {
          return { ...item };
        }
        return item.entered ? { ...item, open: false } : { ...item, requestClose: true };
      }),
      queue: queue.filter((item) => item.key !== key),
    }));
  };

  handleExitedNotice = (event, key1, key2) => {
    const key = key1 || key2;
    if (!isDefined(key)) {
      throw new Error('handleExitedNotice Cannot be called with undefined key');
    }
    this.setState((state) => {
      const newState = this.processQueue({
        ...state,
        notices: state.notices.filter((item) => item.key !== key),
      });
      if (newState.queue.length === 0) {
        return newState;
      }
      return this.handleDismissOldest(newState);
    });
  };

  render() {
    const { contextValue } = this.state;
    const { hideIcon = DEFAULTS.hideIcon, children, theme, ...props } = this.props;
    const categories = this.state.notices.reduce((acc, current) => {
      const category = originKeyExtractor(current.position);
      const existingOfCategory = acc[category] || [];
      return {
        ...acc,
        [category]: [...existingOfCategory, current],
      };
    }, {});
    const notifications = Object.keys(categories).map((origin) => {
      const notices = categories[origin];
      const { vertical, horizontal } = notices[0].position;
      return (
        <NotificationContainer
          theme={theme}
          key={origin}
          vertical={vertical}
          horizontal={horizontal}
        >
          {notices.map((notice) => (
            <NotificationItem
              {...props}
              key={notice.key}
              notice={notice}
              hideIcon={hideIcon}
              onClose={this.handleCloseNotice}
              onExited={this.handleExitedNotice}
              onEntered={this.handleEnteredNotice}
            />
          ))}
        </NotificationContainer>
      );
    });

    return (
      <NotificationContext.Provider value={contextValue}>
        {children}
        <Portal>{notifications}</Portal>
      </NotificationContext.Provider>
    );
  }
}

export default NotificationProvider;
