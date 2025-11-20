/*
 * @owner: borden@kupotech.com
 */
import React from 'react';
import { _t } from 'utils/lang';
import { getMarginGuideLink } from '@/meta/link';
import { ControlsTitle, ControlsSubTitle, StyledICSupportOutlined } from './style';

const commonSubTitleProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
  onClick: e => e.stopPropagation(),
};

const FILE_PATH_PREFIX = 'https://assets.staticimg.com/static/video/2023/12';

export const CONTROLS_MENU = [
  // 布局介绍
  {
    videoName: () => _t('pZiKTi7KJzm811H8oe1oCY'),
    // 视频配置
    videoProps: {
      src: `${FILE_PATH_PREFIX}/layout-introduction.mp4`,
      poster: `${_PUBLIC_PATH_}images/layout-introduction-poster.jpg`,
    },
    // 字幕文件
    getStackProps: (lang) => {
      const srcMap = {
        en_US: { // 英语
          src: `${FILE_PATH_PREFIX}/layout-introduction-stack-en.vtt`,
        },
        ar_AE: { // 阿拉伯语
          src: `${FILE_PATH_PREFIX}/layout-introduction-stack-ar.vtt`,
        },
        de_DE: { // 德语
          src: `${FILE_PATH_PREFIX}/layout-introduction-stack-de.vtt`,
        },
        es_ES: { // 西班牙语
          src: `${FILE_PATH_PREFIX}/layout-introduction-stack-es.vtt`,
        },
        fr_FR: { // 法语
          src: `${FILE_PATH_PREFIX}/layout-introduction-stack-fr.vtt`,
        },
        id_ID: { // 印度尼西亚语
          src: `${FILE_PATH_PREFIX}/layout-introduction-stack-id.vtt`,
        },
        ja_JP: { // 日语
          src: `${FILE_PATH_PREFIX}/layout-introduction-stack-ja.vtt`,
        },
        ko_KR: { // 韩语
          src: `${FILE_PATH_PREFIX}/layout-introduction-stack-ko.vtt`,
        },
        nl_NL: { // 荷兰语
          src: `${FILE_PATH_PREFIX}/layout-introduction-stack-nl.vtt`,
        },
        pt_PT: { // 葡萄牙语
          src: `${FILE_PATH_PREFIX}/layout-introduction-stack-pt.vtt`,
        },
        ru_RU: { // 俄语
          src: `${FILE_PATH_PREFIX}/layout-introduction-stack-ru.vtt`,
        },
        th_TH: { // 泰语
          src: `${FILE_PATH_PREFIX}/layout-introduction-stack-th.vtt`,
        },
        tr_TR: { // 土耳其语
          src: `${FILE_PATH_PREFIX}/layout-introduction-stack-tr.vtt`,
        },
        vi_VN: { // 越南语
          src: `${FILE_PATH_PREFIX}/layout-introduction-stack-vi.vtt`,
        },
        uk_UA: { // 乌克兰语
          src: `${FILE_PATH_PREFIX}/layout-introduction-stack-uk.vtt`,
        },
        zh_HK: { // 繁体中文
          src: `${FILE_PATH_PREFIX}/layout-introduction-stack-hk.vtt`,
        },
      };
      return srcMap[lang] || srcMap.en_US;
    },
    // 视频节点
    videoPoints: [
      {
        intro: () => _t('gMTQ5ip8up5FTKwn8zkTgK'),
        time: 22000, // ms
      },
      {
        intro: () => _t('2GDZ4jY4gunTBWdzxqWwr4'),
        time: 50000,
      },
      {
        intro: () => _t('sSE8ak6ubFgiNxh4eHdTz3'),
        time: 64000,
      },
      {
        intro: () => _t('pGDQWXWH86QMLBSSKsjRTw'),
        time: 106000,
      },
      {
        intro: () => _t('7C77o5CQr9XKhytK31TEje'),
        time: 121000,
      },
      {
        intro: () => _t('hFR4vLcY2meP4NPJGtA2Vn'),
        time: 146000,
      },
      {
        intro: () => _t('bcmAefu9GjBJ5kxAjywsuw'),
        time: 165000,
      },
      {
        intro: () => _t('8ayXwBSfWhPgHGfkgtkXNu'),
        time: 179000,
      },
    ],
  },
  // 杠杆交易介绍
  {
    videoName: () => (
      <div>
        <ControlsTitle>{_t('a988bb33c7b54000a697')}</ControlsTitle>
        <ControlsSubTitle {...commonSubTitleProps} href={getMarginGuideLink()}>
          <StyledICSupportOutlined />
          {_t('51d53a6707a64000a73d')}
        </ControlsSubTitle>
      </div>
    ),
    // 视频配置
    videoProps: {
      src: `${FILE_PATH_PREFIX}/margin-introduction.mp4`,
      poster: `${_PUBLIC_PATH_}images/margin-introduction-poster.jpg`,
    },
    getStackProps: (lang) => {
      const srcMap = {
        en_US: { // 英语
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-en.vtt`,
        },
        ar_AE: { // 阿拉伯语
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-ar.vtt`,
        },
        bn_BD: { // 孟加拉语
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-bn.vtt`,
        },
        de_DE: { // 德语
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-de.vtt`,
        },
        es_ES: { // 西班牙语
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-es.vtt`,
        },
        fil_PH: { // 菲律宾
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-fil.vtt`,
        },
        fr_FR: { // 法语
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-fr.vtt`,
        },
        hi_IN: { // 印度
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-hi.vtt`,
        },
        id_ID: { // 印度尼西亚语
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-id.vtt`,
        },
        it_IT: { // 意大利
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-it.vtt`,
        },
        ja_JP: { // 日语
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-ja.vtt`,
        },
        ko_KR: { // 韩语
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-ko.vtt`,
        },
        ms_MY: { // 马来西亚
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-ms.vtt`,
        },
        nl_NL: { // 荷兰语
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-nl.vtt`,
        },
        pl_PL: { // 波兰
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-pl.vtt`,
        },
        pt_PT: { // 葡萄牙语
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-pt.vtt`,
        },
        ru_RU: { // 俄语
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-ru.vtt`,
        },
        th_TH: { // 泰语
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-th.vtt`,
        },
        tr_TR: { // 土耳其语
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-tr.vtt`,
        },
        ur_PK: { // 乌尔都语
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-ur.vtt`,
        },
        vi_VN: { // 越南语
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-vi.vtt`,
        },
        uk_UA: { // 乌克兰语
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-uk.vtt`,
        },
        zh_HK: { // 繁体中文
          src: `${FILE_PATH_PREFIX}/margin-introduction-stack-hk.vtt`,
        },
      };
      return srcMap[lang] || srcMap.en_US;
    },
    videoPoints: [
      {
        intro: () => _t('a988bb33c7b54000a697'),
        time: 4000, // ms
      },
      {
        intro: () => _t('bd41f74cad774000a472'),
        time: 33000,
      },
      {
        intro: () => _t('6befabd82f6d4000a2ce'),
        time: 112000,
      },
      {
        intro: () => _t('0c479c0d9bb34000a84b'),
        time: 144000,
      },
      {
        intro: () => _t('6b23763d1a604000abcc'),
        time: 149000,
      },
      {
        intro: () => _t('f282a28b88fc4000a909'),
        time: 168000,
      },
      {
        intro: () => _t('6ced67bfb70e4000aded'),
        time: 180000,
      },
      {
        intro: () => _t('de143b4770944000a743'),
        time: 313000,
      },
      {
        intro: () => _t('5726d9b9b7a34000a79b'),
        time: 327000,
      },
    ],
  },
];
