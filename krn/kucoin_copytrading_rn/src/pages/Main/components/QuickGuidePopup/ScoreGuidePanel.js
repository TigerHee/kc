import React, {memo, useMemo, useState} from 'react';
import {css} from '@emotion/native';

import useLang from 'hooks/useLang';
import {Collapse} from './components/Collapse';
import {Panel} from './components/Panel';
import Tabs from './components/Tabs';
import {ScoreFollowerList, ScoreLeaderList, ScoreRoleType} from './constant';
import {Text60} from './styles';

const ScoreGuidePanel = () => {
  const {_t} = useLang();
  const [scoreRoleType, setScoreRoleType] = useState(ScoreRoleType.Follower);
  const switchList = useMemo(() => {
    return [
      {
        label: _t('d43f674997734000a04f'),
        value: ScoreRoleType.Follower,
      },
      {
        label: _t('d136dba490754000af0f'),
        value: ScoreRoleType.Leader,
      },
    ];
  }, [_t]);

  const contentList =
    scoreRoleType === ScoreRoleType.Follower
      ? ScoreFollowerList
      : ScoreLeaderList;
  return (
    <Panel>
      <Tabs
        options={switchList}
        value={scoreRoleType}
        onChange={setScoreRoleType}
      />
      <Text60
        style={css`
          margin-top: 16px;
        `}>
        {_t('bc90ef91c0794000a922')}
      </Text60>

      {contentList.map(({title, isCustom, content}) => (
        <Collapse key={title} label={_t(title)}>
          {isCustom ? content : <Text60>{_t(content)} </Text60>}
        </Collapse>
      ))}
    </Panel>
  );
};

export default memo(ScoreGuidePanel);
