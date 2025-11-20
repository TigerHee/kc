import { getStateFromStore } from '@/utils/stateGetter';

import voice from 'src/trade4.0/utils/voice/index';

import {
  isClickable,
  isolatedLiquidationNotify,
  crossLiquidationNotify,
  clickEventNotify,
  inputEventNotify,
} from 'src/trade4.0/utils/voice/trigger.js';

jest.mock('@/utils/stateGetter');

jest.mock('src/trade4.0/utils/voice/index');

describe('voiceEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isClickable', () => {
    it('should return true if the element is clickable', () => {
      const mockElement = {
        getAttribute: jest.fn().mockReturnValue('onclick'),

        tagName: 'A',

        type: 'button',
      };

      window.getComputedStyle = jest.fn().mockReturnValue({ cursor: 'pointer' });

      expect(isClickable(mockElement)).toBe(true);
    });

    it('should return false if the element is not clickable', () => {
      const mockElement = {
        getAttribute: jest.fn().mockReturnValue(null),

        tagName: 'DIV',

        type: 'text',
      };

      window.getComputedStyle = jest.fn().mockReturnValue({ cursor: 'auto' });

      expect(isClickable(mockElement)).toBe(false);
    });
  });

  describe('isolatedLiquidationNotify', () => {
    it('should notify bankruptcy if status is IN_LIQUIDATION', () => {
      getStateFromStore.mockReturnValue({
        positionMap: {
          BTC: { status: 'NOT_IN_LIQUIDATION' },
        },
      });

      isolatedLiquidationNotify({ tag: 'BTC', status: 'IN_LIQUIDATION' });

      expect(voice.notify).toHaveBeenCalledWith('bankruptcy');
    });
  });

  describe('crossLiquidationNotify', () => {
    it('should notify bankruptcy if data type is FROZEN_RENEW or FROZEN_FL', () => {
      getStateFromStore.mockReturnValue({
        userPosition: { status: 'NOT_FROZEN' },
      });

      crossLiquidationNotify({ data: { type: 'FROZEN_RENEW' } });

      expect(voice.notify).toHaveBeenCalledWith('bankruptcy');
    });
  });

  describe('clickEventNotify', () => {
    it('should notify click_event if the element is clickable', () => {
      const mockElement = {
        getAttribute: jest.fn().mockReturnValue('onclick'),

        tagName: 'A',

        type: 'button',
      };

      window.getComputedStyle = jest.fn().mockReturnValue({ cursor: 'pointer' });

      clickEventNotify(mockElement, false);

      expect(voice.notify).toHaveBeenCalledWith('click_event');
    });
  });

  describe('inputEventNotify', () => {
    it('should notify keyboard_input if inputType is insertText', () => {
      const mockEvent = { inputType: 'insertText' };

      inputEventNotify(mockEvent);

      expect(voice.notify).toHaveBeenCalledWith('keyboard_input');
    });

    it('should notify keyboard_delete if inputType is deleteContentBackward', () => {
      const mockEvent = { inputType: 'deleteContentBackward' };

      inputEventNotify(mockEvent);

      expect(voice.notify).toHaveBeenCalledWith('keyboard_delete');
    });
  });
});
