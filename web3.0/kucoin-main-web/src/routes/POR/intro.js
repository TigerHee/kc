/**
 * Owner: odan.ou@kupotech.com
 */
// 信息介绍页
import React, { memo, useMemo } from 'react';
import { _t } from 'tools/i18n';

const IntroItem = (props) => {
  const { title, desc } = props;
  return (
    <div className="words">
      <div>
        <div className="title">{title}</div>
        <div className="des">{desc}</div>
      </div>
    </div>
  );
};

const IntroPOR = () => {
  const list = useMemo(
    () => [
      {
        title: _t('assets.por.intro.title1'),
        desc: _t('assets.por.intro.content1'),
      },
      {
        title: _t('assets.por.intro.title2'),
        desc: _t('assets.por.intro.content2'),
      },
      // {
      //   title: _t('assets.por.intro.title3'),
      //   desc: _t('assets.por.intro.content3'),
      // },
      // {
      //   title: _t('assets.por.intro.title4'),
      //   desc: _t('assets.por.intro.content4'),
      // },
    ],
    [],
  );
  return (
    <div className="info">
      {list.map((item, index) => (
        <IntroItem {...item} key={String(index)} />
      ))}
    </div>
  );
};

export default memo(IntroPOR);
