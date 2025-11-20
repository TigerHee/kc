import voiceQueue from 'src/trade4.0/utils/voice/index.js';


jest.mock('@/utils/tools', () => ({
  execMaybeFn: jest.fn(),
}));


describe('VoiceQueue', () => {

  describe('init', () => {
    it('should initialize the voice queue', () => {
      voiceQueue.init({ volume: 50, muted: false });

      expect(voiceQueue.volume).toBe(0.5);

      expect(voiceQueue.muted).toBe(false);

      expect(voiceQueue.disabled).toBe(false);

      expect(voiceQueue.destroyed).toBe(false);

      // Add more assertions as needed
    });
  });

  describe('setVolume', () => {
    it('should set the volume', () => {
      voiceQueue.setVolume(0.5);

      expect(voiceQueue.volume).toBe(0.5);
    });
  });

  describe('setMuted', () => {
    it('should set the muted status', () => {
      voiceQueue.setMuted(true);

      expect(voiceQueue.muted).toBe(true);
    });
  });

  describe('disable', () => {
    it('should disable the voice queue', () => {
      voiceQueue.disable();

      expect(voiceQueue.disabled).toBe(true);
    });
  });

  describe('enable', () => {
    it('should enable the voice queue', () => {
      voiceQueue.enable();

      expect(voiceQueue.disabled).toBe(false);
    });
  });

  describe('destroy', () => {
    it('should destroy the voice queue', () => {
      voiceQueue.destroy();

      expect(voiceQueue.destroyed).toBe(true);
    });
  });

  describe('enqueue', () => {
    it('should add the voice to the queue', () => {
      voiceQueue.enqueue('voice1');

      expect(voiceQueue.queue.player1).toBeUndefined();
    });
  });

  describe('requeue', () => {
    it('should remove the voice from the queue', () => {
      voiceQueue.enqueue('voice1');

      voiceQueue.requeue('voice1');

      expect(voiceQueue.queue.player1).toBeUndefined();
    });
  });

  describe('stop', () => {
    it('should stop the voice', () => {
      voiceQueue.playing.player1 = { audio: { pause: jest.fn(), currentTime: 0 } };

      voiceQueue.stop('player1');

      expect(voiceQueue.playing.player1.audio.pause).not.toBeCalled();

    });
  });


  describe('play', () => {
    it('should play the voice', () => {
      const mockPlay = jest.fn();

      voiceQueue.voiceStore.voice1 = { onended: null };

      voiceQueue.playing.player1 = { audio: { play: mockPlay } };

      voiceQueue.play('voice1');

      expect(mockPlay).not.toBeCalled();
    });
  });

  describe('audiometric', () => {
    it('should audiometric the voice', async () => {
      const mockPlay = jest.fn();

      voiceQueue.voiceStore.voice1 = { onended: null };

      voiceQueue.playing.player1 = { audio: { play: mockPlay } };

      await voiceQueue.audiometric('voice1');

      expect(mockPlay).not.toBeCalled();
    });
  });

  describe('notify', () => {
    it('should notify the voice', async () => {
      const mockPlay = jest.fn();

      voiceQueue.voiceStore.voice1 = { onended: null };

      voiceQueue.playing.player1 = { audio: { play: mockPlay } };

      await voiceQueue.notify('voice1');

      expect(mockPlay).not.toBeCalled();
    });
  });

  describe('close', () => {
    it('should close the voice', () => {
      voiceQueue.close('voice1');

      expect(voiceQueue.blacklist.voice1).toBe(undefined);
    });
  });

  describe('open', () => {
    it('should open the voice', () => {
      voiceQueue.open('voice1');

      expect(voiceQueue.blacklist.voice1).toBeUndefined();
    });
  });

  // Add more tests for other methods as needed
});
