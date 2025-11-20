/**
 * Owner: John.Qi@kupotech.com
 */
// import 'core-js/es7/reflect';
import '@testing-library/jest-dom';
import { cleanup, fireEvent } from '@testing-library/react';
import { evtEmitter } from 'helper';
import TimerButton from 'src/components/Assets/Withdraw/TimerButton';
import { customRender } from 'src/test/setup';
const event = evtEmitter.getEvt();

const noop = () => {};

describe('test Withdraw', () => {
  test('test Withdraw TimerButton click 1', async () => {
    customRender(<TimerButton onClick={noop} />);
    expect(document.querySelector('button')).toBeInTheDocument();
    fireEvent.click(document.querySelector('button'));
  });

  test('test Withdraw TimerButton click 2', async () => {
    customRender(<TimerButton countAfterClick onClick={noop} />);
    expect(document.querySelector('button')).toBeInTheDocument();
    fireEvent.click(document.querySelector('button'));
  });

  test('test Withdraw TimerButton click 3', async () => {
    customRender(<TimerButton loading onClick={noop} />);
    expect(document.querySelector('button')).toBeInTheDocument();
    fireEvent.click(document.querySelector('button'));
  });

  test('test Withdraw TimerButton event', async () => {
    const id = 'test';
    customRender(<TimerButton id={id} />);
    expect(document.querySelector('button')).toBeInTheDocument();
    event.emit('__TIMER_BTN_COUNT_START__', { send: true, id: id });
    event.emit('__TIMER_BTN_COUNT_SUCCESS__', { success: true, id: id });
    event.emit('__TIMER_BTN_COUNT_START__', { send: false, id: id });
    event.emit('__TIMER_BTN_COUNT_SUCCESS__', { success: false, id: id });
    event.emit('__TIMER_BTN_COUNT_START__', { send: true, id: 'test2' });
    event.emit('__TIMER_BTN_COUNT_SUCCESS__', { success: true, id: 'test2' });
  });

  test('test Withdraw TimerButton event 2', async () => {
    const id = 'test';
    customRender(<TimerButton id={id} countTimeBegin={noop} />);
    expect(document.querySelector('button')).toBeInTheDocument();
    event.emit('__TIMER_BTN_COUNT_START__', { send: true, id: id });
  });

  test('test Withdraw TimerButton exist 1', async () => {
    const prefix = 'kucoinv2';
    const id = 'test';
    const bizType = 'DEF';
    const storagekey = `${prefix}_${id}__${bizType}`;
    const defaultValue = {
      count: 1,
      timestamp: Date.now() - 1000,
    };
    window.localStorage.setItem(storagekey, JSON.stringify(defaultValue));
    customRender(<TimerButton id={id} bizType={bizType} countTimeOver={noop} />);
    expect(document.querySelector('button')).toBeInTheDocument();
  });

  test('test Withdraw TimerButton exist 2', async () => {
    const prefix = 'kucoinv2';
    const id = 'test';
    const bizType = 'DEF';
    const storagekey = `${prefix}_${id}__${bizType}`;
    const defaultValue = {
      count: 1,
      timestamp: Date.now() - 2000, // 直接完成
    };
    window.localStorage.setItem(storagekey, JSON.stringify(defaultValue));
    customRender(<TimerButton id={id} bizType={bizType} />);
    expect(document.querySelector('button')).toBeInTheDocument();
  });

  afterEach(cleanup);
});
