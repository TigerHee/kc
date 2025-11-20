/**
 * Owner: mike@kupotech.com
 */
import React, { useState, useEffect } from 'react';
import { useTheme } from '@kux/mui';
import { useSelector, useDispatch } from 'react-redux';
import { isEmpty } from 'lodash';
import { useLang } from '../../../hookTool';
import { Wrapper, TradeListBlank1, TradeListBlank2 } from '../styled';
import { getBotList } from './config';
import * as S from './styled';
import { addLangToPath, kcsensorsManualTrack, kcsensorsClick } from '../../../common/tools';
import { TRADETYPE_MAP } from '../config';
import { namespace } from '../index';

const handleStopPropagation = (event) => {
  // 阻止事件冒泡，元素点击切换tab会冒泡到父级元素,会调用onSubMenuVisibleChange
  event.stopPropagation();
};
export default (props) => {
  const { machineMap } = useSelector((state) => state[namespace]);
  const { lang, parentRef, hostConfig } = props;
  const { t } = useLang();
  const { currentTheme } = useTheme();
  const [wrapperHeight, setWapperHeight] = useState(288);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({ type: `${namespace}/getBotLists` });
  }, []);

  useEffect(() => {
    const navOverlay = parentRef.current;
    if (navOverlay) {
      const height = navOverlay.offsetHeight;
      setWapperHeight(height);
    }
    kcsensorsManualTrack(['navigationDropDownBotList', '1'], {
      postTitle: TRADETYPE_MAP.TRADING_BOT,
      pagecate: 'navigationDropDownList',
    });
  }, []);

  const handler = (bot) => {
    kcsensorsClick(['navigationBotList', '1'], {
      id: bot.id,
      postTitle: bot.key,
      pagecate: 'navigationDropDownList',
    });
  };

  return (
    <Wrapper onClick={handleStopPropagation}>
      <S.ClipScrollerBar>
        <S.Scroller style={{ height: wrapperHeight }}>
          {isEmpty(machineMap) ? (
            <S.MSpin type="normal" size="small" />
          ) : (
            getBotList(machineMap).map((bot) => {
              return (
                <S.BotItem
                  key={bot.name}
                  onClick={() => handler(bot)}
                  href={addLangToPath(`${hostConfig.KUCOIN_HOST}${bot.href}`, lang)}
                >
                  <S.Flex>
                    <S.Avatar src={currentTheme === 'light' ? bot.iconLight : bot.iconDark} />
                    <S.Name>{t(bot.name)}</S.Name>
                  </S.Flex>
                  <S.Note>{t(bot.note)}</S.Note>
                </S.BotItem>
              );
            })
          )}
        </S.Scroller>
      </S.ClipScrollerBar>

      {/* wtf!!! 用于堵border-radius */}
      <TradeListBlank1 />
      <TradeListBlank2 />
    </Wrapper>
  );
};
