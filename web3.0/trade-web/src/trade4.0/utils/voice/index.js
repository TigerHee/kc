/*
 * @owner: borden@kupotech.com
 * @desc: 交易大厅声音模块(https://k-devdoc.atlassian.net/wiki/spaces/frontend/pages/183271834)
 */
import { forOwn, flatten, cloneDeep, isArray, noop, isBoolean } from 'lodash';
import { execMaybeFn } from '@/utils/tools';
import { getVoiceStatusByCode } from './useVoiceStatus';
import {
  VOICE,
  PLAYER,
  INIT_QUEUE,
  INIT_PLAYING,
  getTypeConfigByVoice,
} from './config';

class VoiceQueue {
  constructor() {
    // 加载锁
    this.loadLock = {};
    // 音频黑名单，关闭某个声音即将其加入黑名单
    this.blacklist = {};
    // 音频集合
    this.voiceStore = {};
    // 系统音量
    this.volume = 0;
    // 系统是否ready，主要检查是否已支持自动播放
    this.ready = undefined;
    // 禁用系统。默认是禁用的
    this.disabled = true;
    // 销毁系统. 它与disabled的区别是它只在初始化的时候被赋值，而disabled可以在业务中临时启用
    this.destroyed = true;
    // 系统静音
    this.muted = false;
    // 音频队列
    this.queue = cloneDeep(INIT_QUEUE);
    // 正在播放的音频信息
    this.playing = cloneDeep(INIT_PLAYING);
  }
  // 初始化。处理配置init以及preload audio文件
  init = (params) => {
    this.enable();
    this.destroyed = false;
    this.muted = params.muted;
    this.volume = params.volume / 100;
    forOwn(VOICE, (value, key) => {
      const { preload, url } = value || {};
      const voiceStatus = getVoiceStatusByCode(key, params);
      this.blacklist[key] = !voiceStatus;
      if (execMaybeFn(preload, params) && url) {
        try {
          this.load(key);
        } catch (e) {
          console.log('load error', e);
        }
      }
    });
    // 自动播放检测
    this.checkAutoplay().then((supported) => {
      if (!supported) {
        window.addEventListener('click', this.handleWindowClick);
      }
    });
  }
  handleWindowClick = () => {
    if (isBoolean(this.ready)) return;
    this.ready = false;
    this.checkAutoplay();
  }
  // 检测页面是否支持自动播放
  checkAutoplay = () => {
    return new Promise((resolve) => {
      if (this.ready) {
        return resolve(true);
      }
      const audio = new Audio();
      audio.onplay = () => {
        this.ready = true;
        window.removeEventListener('click', this.handleWindowClick);
        resolve(true);
      };
      const catchCb = () => {
        // 页面点击交互也无法绕开限制的，放弃播放
        if (this.ready === false) {
          window.removeEventListener('click', this.handleWindowClick);
        }
        resolve(false);
      };
      try {
        audio.play().catch(catchCb);
      } catch (e) {
        catchCb();
      }
    });
  }
  // 获取某个音频的音量
  getVolumeByVoice = (voice) => {
    const { volume } = VOICE[voice] || {};
    return this.volume ? (volume || this.volume) : 0;
  }
  // 调整音量
  setVolume = (volume) => {
    this.volume = volume;
    Object.values(PLAYER).forEach((player) => {
      if (this.playing[player]) {
        this.playing[player].audio.volume = this.getVolumeByVoice(this.playing[player].code);
      }
    });
  }
  // 设置静音
  setMuted = (muted) => {
    this.muted = muted;
    Object.values(PLAYER).forEach((player) => {
      if (this.playing[player]) {
        this.playing[player].audio.muted = muted;
      }
    });
  }
  // 读取队首音频
  front = (key) => {
    return flatten(this.queue[key])[0];
  }
  // 清理队列
  clear = (params) => {
    const { key, start } = params || {};
    if (!INIT_QUEUE[key]) {
      this.queue = cloneDeep(INIT_QUEUE);
    } else if (!start) {
      this.queue[key] = cloneDeep(INIT_QUEUE[key]);
    } else {
      for (let i = start, len = this.queue[key].length; i < len; i++) {
        this.queue[key][i].length = 0;
      }
    }
  }
  // 重置整个音频系统
  reset = () => {
    this.stop();
    this.clear();
  }
  // 禁用整个系统
  disable = () => {
    this.disabled = true;
    this.reset();
  }
  // 解除禁用
  enable = () => {
    this.disabled = false;
  }
  // 销毁
  destroy = () => {
    this.destroyed = true;
  }
  // 入队列
  enqueue = (voice) => {
    const { player, addFn, sequence } = getTypeConfigByVoice(voice);
    if (this.blacklist[voice] || [player, addFn].some(v => !v)) return;
    const priorityVoices = this.queue[player].slice(0, sequence);
    if (!priorityVoices.length || priorityVoices.every(v => !v.length)) {
      this.queue[player][sequence] = addFn(voice, this.queue[player][sequence]);
    } else {
      this.queue[player][sequence].length = 0;
    }
    // 清空低优先级的
    this.clear({ key: player, start: sequence + 1 });
  }
  // 从队列里移除某个音频
  requeue = (voice) => {
    const { player, sequence } = getTypeConfigByVoice(voice);
    if (!this.queue[player]?.[sequence]) return;
    this.queue[player][sequence] = this.queue[player][sequence].filter(v => v !== voice);
  }
  // 终止音频
  stop = (key) => {
    key = key === undefined ? Object.values(PLAYER) : key;
    if (PLAYER[key]) {
      if (this.playing[key]?.audio) {
        this.playing[key].audio.pause();
        this.playing[key].currentTime = 0;
      }
      this.playing[key] = null;
    } else if (isArray(key)) {
      key.forEach(v => this.stop(v));
    }
  }
  // 从0开始播放音频
  replay = (key) => {
    if (this.playing[key]?.audio) {
      this.playing[key].audio.currentTime = 0;
      this.playing[key].audio.muted = this.muted;
      this.playing[key].audio.volume = this.getVolumeByVoice(this.playing[key].code);
      this.playing[key].audio.play().catch((e) => {
        console.log('audio.play() error', e);
      });
    }
  }
  // 加载音频
  load = (voice) => {
    return new Promise((resolve, reject) => {
      if (this.voiceStore[voice]) {
        return resolve(this.voiceStore[voice]);
      }
      if (this.loadLock[voice]) {
        return reject(false);
      }
      if (VOICE[voice].url) {
        this.loadLock[voice] = true;
        const audio = new Audio(VOICE[voice].url);
        if (VOICE[voice].preload) {
          audio.preload = 'auto';
        }
        audio.oncanplay = () => {
          audio.oncanplay = noop;
          this.voiceStore[voice] = audio;
          this.loadLock[voice] = false;
          resolve(audio);
        };
        audio.onerror = () => {
          this.loadLock[voice] = false;
          reject(false);
        };
      }
    });
  }
  // 播放音频
  play = (voice, isAudiometric) => {
    const audio = this.voiceStore[voice];
    const { type } = VOICE[voice] || {};
    const { sequence, player: _player } = getTypeConfigByVoice(voice);
    const { addFn = () => [] } = getTypeConfigByVoice(this.playing[player]?.code);
    // 试听走统一的试听播放器
    const player = isAudiometric ? PLAYER.AUDIOMETRIC : _player;
    // addFn(1, [1]).length < 2表示声音挤掉同队列声音
    if (player && audio && (isAudiometric || addFn(1, [1]).length < 2)) {
      audio.onended = () => {
        this.playing[player] = null;
        if (!isAudiometric) {
          this.queue[player][sequence].shift();
          const top = this.front(player);
          const { type: topType } = VOICE[top] || {};
          if (type === topType) {
            this.play(top);
          }
        }
      };
      if (this.playing[player]?.code !== voice) {
        this.stop(player);
        this.playing[player] = {
          audio,
          code: voice,
        };
      }
      this.replay(player);
    }
  }
  // 试听。此操作不走队列管控，但试听环境最好先disable整个系统
  audiometric = async (voice) => {
    try {
      if (!this.voiceStore[voice]) {
        await this.load(voice);
      }
      this.play(voice, true);
    } catch (e) {
      console.log('audiometric error', e);
    }
  }
  // 音频提醒
  notify = async (voice) => {
    if (voice === 'click_event') {
      this.handleWindowClick();
    }
    if (
      !VOICE[voice] || // 不合法音频
      this.destroyed || // 系统销毁
      this.disabled || // 系统禁用
      this.blacklist[voice] || // 声音没开
      this.ready === false // 系统未ready
    ) return;
    try {
      if (!this.voiceStore[voice]) {
        await this.load(voice);
      }
      if (this.ready) {
        this.enqueue(voice);
        const { player } = getTypeConfigByVoice(voice);
        if (this.front(player) === voice) {
          this.play(voice);
        }
      }
    } catch (e) {
      console.log('notify error', e);
    }
  }
  // 关闭音频
  close = (voice) => {
    if (VOICE[voice]) {
      this.requeue(voice);
      this.blacklist[voice] = true;
      const { player } = getTypeConfigByVoice(voice);
      if (this.playing[player]?.code === voice) {
        this.stop(player);
      }
    } else if (isArray(voice)) {
      voice.forEach(v => this.close(v));
    }
  }
  // 打开音频
  open = (voice) => {
    if (VOICE[voice]) {
      delete this.blacklist[voice];
    } else if (isArray(voice)) {
      voice.forEach(v => this.open(v));
    }
  }
}

const voiceQueue = new VoiceQueue();

export default voiceQueue;
