/**
 * Owner: jennifer.y.liu@kupotech.com
 */
import { POOL_STATUS, REMARK_STATUS_TEXT, VIP_ICONS, KCS_LEVEL_ICONS, POOL_TAG_TEXT, TASK_CONTENT_CONFIG } from 'src/components/TradeActivity/GemPool/config';
import { _t, _tHTML } from 'src/tools/i18n';

// Mock i18n 函数
jest.mock('src/tools/i18n', () => ({
  _t: jest.fn((key) => `translated_${key}`),
  _tHTML: jest.fn((key, params) => `html_translated_${key}_${JSON.stringify(params)}`),
}));

// Mock SVG 导入
jest.mock('static/gempool/kcsLevel1.svg', () => 'kcsLevel1.svg');
jest.mock('static/gempool/kcsLevel2.svg', () => 'kcsLevel2.svg');
jest.mock('static/gempool/kcsLevel3.svg', () => 'kcsLevel3.svg');
jest.mock('static/gempool/kcsLevel4.svg', () => 'kcsLevel4.svg');
jest.mock('static/gempool/vip0.svg', () => 'vip0.svg');
jest.mock('static/gempool/vip1.svg', () => 'vip1.svg');
// ...其他VIP图标mock类似

describe('poolConstants', () => {
  describe('POOL_STATUS', () => {
    it('should have correct status values', () => {
      expect(POOL_STATUS).toEqual({
        NOT_START: 'notStart',
        IN_PROCESS: 'inProcess',
        COMPLETED: 'completed',
      });
    });
  });

  describe('REMARK_STATUS_TEXT', () => {
    it('should have correct translation keys for each status', () => {
      expect(REMARK_STATUS_TEXT).toEqual({
        notStart: '6333cacabda24000a67f',
        inProcess: '7e9ed96c04204000acbf',
        completed: '07e43af0e0574000a983',
      });
    });
  });

  describe('VIP_ICONS', () => {
    it('should contain all VIP level icons in order', () => {
      expect(VIP_ICONS).toHaveLength(13);
      expect(VIP_ICONS[0]).toBe('vip0.svg');
      expect(VIP_ICONS[12]).toBe('vip12.svg');
    });
  });

  describe('KCS_LEVEL_ICONS', () => {
    it('should contain all KCS level icons in order', () => {
      expect(KCS_LEVEL_ICONS).toHaveLength(4);
      expect(KCS_LEVEL_ICONS[0]).toBe('kcsLevel1.svg');
      expect(KCS_LEVEL_ICONS[3]).toBe('kcsLevel4.svg');
    });
  });

  describe('POOL_TAG_TEXT', () => {
    it('should return correct translation for each tag type', () => {
      const tag1 = POOL_TAG_TEXT[1]();
      const tag2 = POOL_TAG_TEXT[2]();
      const tag3 = POOL_TAG_TEXT[3]();

      expect(_t).toHaveBeenCalledWith('45923acc280b4000a0a1');
      expect(_t).toHaveBeenCalledWith('f676e3b7c6c84000ae32');
      expect(_t).toHaveBeenCalledWith('3d7b250e31f44000acd6');
      
      expect(tag1).toBe('translated_45923acc280b4000a0a1');
      expect(tag2).toBe('translated_f676e3b7c6c84000ae32');
      expect(tag3).toBe('translated_3d7b250e31f44000acd6');
    });
  });

  describe('TASK_CONTENT_CONFIG', () => {
    describe('Type 0: 参与答题活动享受质押加成', () => {
      it('should return correct title', () => {
        const result = TASK_CONTENT_CONFIG[0].title({ maxBonusCoefficient: '' });
        expect(_tHTML).toHaveBeenCalledWith('b5dd9bb774da4800a889', expect.objectContaining({ maxBonusCoefficient: '' }));
        expect(result).toEqual(expect.stringContaining('html_translated_b5dd9bb774da4800a889'));
      });

      it('should return correct subTitle with params', () => {
        const params = { icon: 'icon.svg', num: 5 };
        const result = TASK_CONTENT_CONFIG[0].subTitle(params);
        expect(_tHTML).toHaveBeenCalledWith('cc13ba25ecb14000a132', params);
        expect(result).toBe('html_translated_cc13ba25ecb14000a132_'+JSON.stringify(params));
      });
    });

    describe('Type 1: VIP等级加成', () => {
      it('should return correct title', () => {
        const result = TASK_CONTENT_CONFIG[1].title();
        expect(_t).toHaveBeenCalledWith('738a65755eea4000a7a9');
        expect(result).toBe('translated_738a65755eea4000a7a9');
      });

      it('should return correct subTitle', () => {
        const result = TASK_CONTENT_CONFIG[1].subTitle();
        expect(_tHTML).toHaveBeenCalledWith('f0c92ecbfda74000a589');
      });
    });

    describe('Type 2: KCS忠诚权益等级加成', () => {
      it('should return correct title', () => {
        const result = TASK_CONTENT_CONFIG[2].title();
        expect(_t).toHaveBeenCalledWith('c0164264bc5a4800a6cc');
        expect(result).toBe('translated_c0164264bc5a4800a6cc');
      });

      it('should return correct subTitle', () => {
        const result = TASK_CONTENT_CONFIG[2].subTitle();
        expect(_t).toHaveBeenCalledWith('70f6cb03b68a4800af1a');
        expect(result).toBe('translated_70f6cb03b68a4800af1a');
      });
    });

    describe('Type 3: 邀请好友享受质押加成', () => {
      it('should return correct title', () => {
        const result = TASK_CONTENT_CONFIG[3].title();
        expect(_t).toHaveBeenCalledWith('7e466c135d554000ad25');
        expect(result).toBe('translated_7e466c135d554000ad25');
      });

      it('should return correct subTitle with percent', () => {
        const params = { percent: '10%' };
        const result = TASK_CONTENT_CONFIG[3].subTitle(params);
        expect(_tHTML).toHaveBeenCalledWith('a79c53a0cbbc4000ab7b', params);
        expect(result).toBe('html_translated_a79c53a0cbbc4000ab7b_'+JSON.stringify(params));
      });
    });
  });
});