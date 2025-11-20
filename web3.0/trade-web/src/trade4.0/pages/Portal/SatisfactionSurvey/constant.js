/**
 * Owner: harry.lai@kupotech.com
 */
import smileIcon from '@/assets/survey/top_area_icon_smile.png';
import cryIcon from '@/assets/survey/top_area_icon_cry.png';
import { _t } from 'src/utils/lang';

// 涉及业务态标识 非需求调整不可修改值 是否提交过调研
export const SURVEY_HAS_SUBMIT_STORAGE_KEY = 'hasSubmitSatisfactionSurvey';
// 涉及业务态标识 非需求调整不可修改值 直接关闭调研次数
export const SURVEY_DIRECTLY_CLOSE_COUNTER_STORAGE_KEY = 'directlyCloseCounterSatisfactionSurvey';

export const TOP_AREA_ICON_MAP = {
  smile: smileIcon,
  cry: cryIcon,
};

export const OTHER_OPTION_VALUE = 'Other';

/** 体验选项 */
export const ExperienceOptions = [
  {
    label: _t('szZAmQXgfRmyDWHfr8WXdp'),
    value: 'Design',
  },
  {
    label: _t('2S1r91juvLh1W8kaVyA1d7'),
    value: 'Ease of use',
  },
  {
    label: _t('31m4p7hj8adR7UzssPhSjG'),
    value: 'Functional satisfaction',
  },
  {
    label: _t('4ie9WSnWvFctBG3C2WwXNo'),
    value: 'Clear guidance',
  },
  {
    label: _t('vhd7T6jUWiq6Q9A4nRP8wr'),
    value: OTHER_OPTION_VALUE,
  },
];

/** 其他内容区 最大长度 */
export const OTHER_CONTENT_MAX_LENGTH = 500;
