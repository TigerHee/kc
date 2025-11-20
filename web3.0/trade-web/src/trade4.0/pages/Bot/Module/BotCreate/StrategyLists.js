/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import { styled } from '@/style/emotion';
import { ICArrowRightOutlined, ICFireOutlined } from '@kux/icons';
import { Text, Flex, Div } from 'Bot/components/Widgets';
import { ChangeRate, FormatNumber } from 'Bot/components/ColorText';
import { _t, t } from 'Bot/utils/lang';
import { useSelector, useDispatch } from 'dva';
import { trackClick } from 'utils/ga';
import { SvgIcon } from 'Bot/components/Common/Icon';
import Avatar from 'Bot/components/Common/BotAvatar';
import { tagEnum, strategyTypes } from './config';
import { Tabs } from '@mui/Tabs';
import map from 'lodash/map';
import { showNotice } from 'Bot/utils/util';
import GuideTooltip from '@/components/GuideTooltip';

const MTabs = styled(Tabs)`
  ${(props) => {
    return (
      props.isFloat &&
      `
    div.KuxTabs-scrollButtonBg {
      background: none;
    }
    .KuxTabs-scrollButton {
      background: ${props.theme.colors.layer};
      padding-top: 10px;
    }`
    );
  }}
`;
const TabsTab = styled(Tabs.Tab)`
  font-size: 14px !important;
`;
const FullHeight = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Scroller = styled.div`
  flex: 1;
  overflow-y: auto;
  position: relative;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-bottom: 70px;
  }
`;
const ListItem = styled.div`
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s linear;
  background-color: ${({ theme }) => theme.colors.cover2};
  &:hover {
    background-color: ${({ theme }) => theme.colors.cover4};
  }
  margin-bottom: 12px;
  position: relative;
  &:last-of-type {
    margin-bottom: 0;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  .strategy-title {
    flex-wrap: wrap;
    margin-bottom: -4px;
    > span {
      margin-bottom: 4px;
    }
  }
`;

const Tag = styled.span`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  height: 15px;
  line-height: 15px;
  border-radius: 2px;
  padding: 1px 4px;
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.primary8};
  margin-right: 4px;
  white-space: nowrap;
`;
const tagColor = {
  New: 'complementary',
  Hot: 'secondary',
  professional: 'primary',
  newbie: 'primary',
};
const Tags = ({ value = [] }) => {
  return value.map((val, index) => {
    const color = tagColor[val];
    return (
      <Tag color={color} key={index}>
        {['New', 'Hot'].includes(val) ? val : _t(val)}
      </Tag>
    );
  });
};
const RightTag = styled.span`
  font-size: 12px;
  font-weight: 500;
  line-height: 130%;
  border-radius: 0 12px 0 12px;
  height: 17px;
  line-height: 12px;
  color: ${({ color, theme }) => theme.colors[color]};
  background-color: ${({ theme, color }) => theme.colors[`${color}8`]};
  position: absolute;
  top: 0;
  right: 0;
  min-width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CircleTag = styled(RightTag)`
  position: unset;
  border-radius: 12px;
`;
/**
 * @description:
 * @param {*} tags
 * @param {enum} type (CircleTag, RightTag)
 * @return {*}
 */
const ItemTags = ({ value = [], type }) => {
  const Cmp = type === 'CircleTag' ? CircleTag : RightTag;
  return value?.map((tag) => {
    if (tag === tagEnum.New) {
      return (
        <Cmp color="complementary" key={tag}>
          {tagEnum.New.toUpperCase()}
        </Cmp>
      );
    } else if (tag === tagEnum.Hot) {
      return (
        <Cmp color="secondary" key={tag}>
          <ICFireOutlined size={12} />
          <span>{tagEnum.Hot.toUpperCase()}</span>
        </Cmp>
      );
    }
    return null;
  });
};
const CArrowRight = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  margin-left: 12px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  > svg {
    [dir='rtl'] & {
      transform: rotate(180deg);
    }
  }
  ${({ theme }) => {
    if (theme.currentTheme === 'light') {
      return {
        backgroundColor: theme.colors.text,
        color: '#fff',
      };
    }
    return {
      backgroundColor: theme.colors.primary,
      color: '#1B1B1B',
    };
  }}
`;
const ArrowRight = () => {
  return (
    <CArrowRight>
      <ICArrowRightOutlined size={12} />
    </CArrowRight>
  );
};
const filterTag = (tags = []) => {
  const newHotTags = [];
  const otherTags = [];
  tags.forEach((el) => {
    if (el === tagEnum.New || el === tagEnum.Hot) {
      newHotTags.push(el);
    } else {
      otherTags.push(el);
    }
  });
  return {
    newHotTags,
    otherTags,
  };
};
const StrategyItem = ({ list, currentSymbol }) => {
  const dispatch = useDispatch();
  const onJump = () => {
    trackClick(['botChoose', String(list.id)]);
    if (window.IS_NEW_TRADE_BOT) {
      dispatch({
        type: 'BotStatus/switchToCreate',
        payload: {
          botId: list.id,
        },
      });
      // dispatch(routeToBotById(list.id, currentSymbol));
    } else {
      showNotice(list.id, currentSymbol);
    }
  };
  const { newHotTags, otherTags } = filterTag(list.indexTag);
  const strategyMap = useSelector((state) => state.BotStrategyLists?.strategyMap);
  const meta = strategyMap[list.id];

  return (
    <ListItem onClick={onJump}>
      <ItemTags value={newHotTags} type="RightTag" />
      <div>
        <Flex vc>
          <Avatar id={list.id} className="mr-8" size={24} />
          <Flex vc className="strategy-title">
            <Text color="text" ft={500} fs={14} mr={4}>
              {_t(list.name)}
            </Text>
            <Tags value={otherTags} />
          </Flex>
        </Flex>
        <Flex mt={6} mb={8}>
          <Text color="text40" fs={12} lh="130%">
            {_t(list.note)}
          </Text>
        </Flex>
        <Flex fs={12} vc lh="12px">
          <Flex mr={24} vc>
            <SvgIcon color="none" type="user" fileName="botsvg" width="12" height="12" keepOrigin />
            <Text color="text40" pl={4}>
              <FormatNumber value={meta?.totalRunNumber ?? 0} precision={0} />
            </Text>
          </Flex>
          <Flex vc>
            <SvgIcon
              color="icon60"
              type="rank"
              fileName="botsvg"
              width="12"
              height="12"
              keepOrigin
            />
            <Text color="primary" pl={4}>
              <ChangeRate value={meta?.profitRate ?? 0} hasUnit={false} precision={0} />
            </Text>
          </Flex>
        </Flex>
      </div>
      <ArrowRight />
    </ListItem>
  );
};
const Title = styled.div`
  margin-bottom: 8px;
  margin-top: 16px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text40};
  font-weight: 400;
  line-height: 130%;
`;
const Content = styled(Div)``;

const okButtonProps = {
  size: 'mini',
  variant: 'contained',
  type: 'primary',
  className: 'bot-upgrade-tooltip',
  style: {
    backgroundColor: '#01BC8D',
    color: '#1D1D1D',
  },
};
const ALL = 'ALL';
const StrategyLists = React.memo(({ currentSymbol, moduleProps }) => {
  const dispatch = useDispatch();
  const strategyMap = useSelector((state) => state.BotStrategyLists?.strategyMap);
  const category = useSelector((state) => state.BotStrategyLists?.category);
  const StrategyTypes = React.useMemo(() => strategyTypes(strategyMap), [strategyMap]);
  React.useEffect(() => {
    dispatch({
      type: 'BotStrategyLists/getStrategyLists',
    });
  }, []);
  const setTabJack = (e, val) => {
    dispatch({
      type: 'BotStrategyLists/update',
      payload: {
        category: val,
      },
    });
  };

  const StrategyTabs = (
    <MTabs value={category} onChange={setTabJack} size="xsmall" isFloat={moduleProps.isFloat}>
      <TabsTab label={_t('all')} value={ALL} key={ALL} />
      {map(StrategyTypes, (item, key) => {
        return <TabsTab label={_t(item.name)} value={item.name} key={key} />;
      })}
    </MTabs>
  );
  const clickJack = React.useCallback(() => {
    if (!window.IS_NEW_TRADE_BOT) return;
    const guide = document.querySelector('.bot-upgrade-tooltip');
    if (guide) {
      guide.click();
    }
  }, []);
  return (
    <FullHeight onClick={clickJack}>
      {window.IS_NEW_TRADE_BOT ? (
        <GuideTooltip
          code="botUpgrade"
          placement="left-start"
          iconProps={{ type: 'bot', fileName: 'botsvg' }}
          title={_t('botupgrade')}
          describe={_t('botupgrade.hint')}
          footerProps={{
            okText: t('i.know'),
            cancelText: null,
            okButtonProps,
          }}
        >
          {StrategyTabs}
        </GuideTooltip>
      ) : (
        StrategyTabs
      )}
      <Scroller id="strategy-scroller" key={category}>
        {map(StrategyTypes, (item, key) => {
          if (category !== ALL) {
            if (item.name !== category) {
              return null;
            }
          }
          return (
            <React.Fragment key={key}>
              {category === ALL && <Title id={`title${item.index}`}>{_t(item.name)}</Title>}

              <Content mt={category !== ALL ? 16 : 0}>
                {item.children.map((list, index) => {
                  return <StrategyItem list={list} key={index} currentSymbol={currentSymbol} />;
                })}
              </Content>
            </React.Fragment>
          );
        })}
      </Scroller>
    </FullHeight>
  );
});

export default StrategyLists;
