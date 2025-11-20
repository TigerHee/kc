/**
 * Owner: Ray.Lee@kupotech.com
 */
import matchVoice1 from 'assets/voice/match/Vibration.mp3';
import matchVoice2 from 'assets/voice/match/Comedy.mp3';
import matchVoice3 from 'assets/voice/match/Correct_answer.mp3';
import matchVoice4 from 'assets/voice/match/Throwing_coins.mp3';
import matchVoice5 from 'assets/voice/match/Bicycle_bell.mp3';
import matchVoice6 from 'assets/voice/match/Water_droplets.mp3';
import doneVoice1 from 'assets/voice/done/Game_reward.mp3';
import doneVoice2 from 'assets/voice/done/Fresh.mp3';
import doneVoice3 from 'assets/voice/done/Crisp.mp3';
import doneVoice4 from 'assets/voice/done/Happy_rhythm.mp3';
import doneVoice5 from 'assets/voice/done/Sweet.mp3';
import doneVoice6 from 'assets/voice/done/The_forest.mp3';
import { _t } from 'utils/lang';
import { each } from 'lodash';

export const matchVoiceConfig = [
  {
    key: 'NONE',
    value: 'NONE',
    label: () => _t('orders.voice.close'),
  },
  {
    key: 'WATER_DROPLETS',
    value: 'WATER_DROPLETS',
    voice: matchVoice6,
    label: _t('73E8XwGzkqwCMwxdBr2ykC'),
  },
  {
    key: 'VIBRATION',
    value: 'VIBRATION',
    voice: matchVoice1, // 默认音效
    label: _t('atxgC4WxRnmQxNRVBGgnNr'),
  },
  {
    key: 'COMEDY',
    value: 'COMEDY',
    voice: matchVoice2,
    label: _t('mPAEBuSzHLwcrLtYd6hhh3'),
  },
  {
    key: 'CORRECT_ANSWER',
    value: 'CORRECT_ANSWER',
    voice: matchVoice3,
    label: _t('8JbwLcCubaVT4Fqc74zQw7'),
  },
  {
    key: 'BICYCLE_BELL',
    value: 'BICYCLE_BELL',
    voice: matchVoice5,
    label: _t('fKtVhgaPQzjvjnetXE7Vhi'),
  },
];
const matchVoiceConfigMap = {};
each(matchVoiceConfig, (v) => {
  matchVoiceConfigMap[v.value] = v;
});
export { matchVoiceConfigMap };

export const doneVoiceConfig = [
  {
    key: 'NONE',
    value: 'NONE',
    label: () => _t('orders.voice.close'),
  },
  {
    key: 'THROWING_COINS',
    value: 'THROWING_COINS',
    voice: matchVoice4,
    label: _t('swt67XPQk8WxtB7X9BcrPZ'),
  },
  {
    key: 'GAME_REWARD',
    value: 'GAME_REWARD',
    voice: doneVoice1, // 默认音效
    label: _t('gQe173RJrXHbqABRcadxBP'),
  },
  {
    key: 'FRESH',
    value: 'FRESH',
    voice: doneVoice2,
    label: _t('oAy3NR8P7QX81j6WCW2N8E'),
  },
  {
    key: 'CRISP',
    value: 'CRISP',
    voice: doneVoice3,
    label: _t('c18pVjExKH1Cns6wQK9J5S'),
  },
  {
    key: 'HAPPY_RHYTHM',
    value: 'HAPPY_RHYTHM',
    voice: doneVoice4,
    label: _t('44nbBS5w8PLzfK6VNwExcB'),
  },
  {
    key: 'SWEET',
    value: 'SWEET',
    voice: doneVoice5,
    label: _t('gBh4Tji384d5YDaxtyRweh'),
  },
  {
    key: 'THE_FOREST',
    value: 'THE_FOREST',
    voice: doneVoice6,
    label: _t('tGsprC72NAw5wkgDxp5Jtj'),
  },
];
