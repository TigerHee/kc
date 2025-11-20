/**
 * Owner: jessie@kupotech.com
 */
import React, { useState, useMemo, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'dva';
import { map, find, indexOf, remove } from 'lodash';
import { useSnackbar } from '@kux/mui/hooks';
import {
  ICSearchOutlined,
  ICFavoriteUnselectOutlined,
  ICFavoriteSelectOutlined,
  ICHookOutlined,
} from '@kux/icons';
import { Tabs } from '@mui/Tabs';
import Empty from '@mui/Empty';
import Input from '@mui/Input';
import { useChartSavedData } from '@/pages/Chart/hooks/useChartSavedData';
import { namespace } from '@/pages/Chart/config';
import { KLINE_INDEX_FAVORITES } from '@/storageKey/chart';
import { _t } from 'utils/lang';
import studies from './studies';
import { langMap } from './config';
import {
  StudyModalWrapper,
  SearchBar,
  TabsBar,
  StudyList,
  ListContent,
  StudyItem,
  StudyText,
} from './style';

const { Tab } = Tabs;
const { group, languages, abbrObj, AllIndexList } = studies;

const getStudyChildren = (list, lang) => {
  const studyMap = languages[langMap[lang]] || languages.en;
  return (list || []).map((study) => {
    return { id: study, name: studyMap[study], abbr: abbrObj[study] };
  });
};

const StudyModal = ({ tvWidget }) => {
  const [activeKey, setActiveKey] = useState('trendanalysis');
  const [search, setSearch] = useState('');

  const dispatch = useDispatch();
  const { updateKlineConf } = useChartSavedData();
  const { message } = useSnackbar();

  const currentLang = useSelector((state) => state.app.currentLang);
  const favorites = useSelector((state) => state[namespace].favorites);
  const modalVisible = useSelector((state) => state[namespace].modalVisible);
  const activeStudies = useSelector((state) => state[namespace].activeStudies);

  const handleChange = (e) => {
    setSearch(e?.target?.value);
  };

  const addFavorites = useCallback(
    (e, id) => {
      e.stopPropagation();
      const _favorites = [...favorites];
      if (indexOf(_favorites, id) === -1) {
        _favorites.push(id);
        dispatch({ type: `${namespace}/update`, payload: { favorites: _favorites } });
        updateKlineConf(KLINE_INDEX_FAVORITES, _favorites);
      }
    },
    [dispatch, favorites, updateKlineConf],
  );

  const removeFavorites = useCallback(
    (e, id) => {
      e.stopPropagation();
      const _favorites = [...favorites];
      remove(_favorites, (item) => item === id);
      dispatch({ type: `${namespace}/update`, payload: { favorites: _favorites } });
      updateKlineConf(KLINE_INDEX_FAVORITES, _favorites);
    },
    [dispatch, favorites, updateKlineConf],
  );

  const changeTabs = (e, v) => {
    e.stopPropagation();
    setActiveKey(v);
  };

  const onCancel = () => {
    dispatch({
      type: `${namespace}/update`,
      payload: {
        modalVisible: false,
      },
    });
  };

  const onStudyClick = useCallback(
    (study) => {
      try {
        const studyArr = tvWidget.chart().getAllStudies() || [];
        // const compareIdx = studyArr.findIndex((item) => item.name === 'Compare');
        // // 合约需要剔除指数线
        // const stydyNum = compareIdx !== -1 ? studyArr.length - 1 : studyArr.length;
        const stydyNum = studyArr.length;
        if (stydyNum >= 10) {
          message.info(_t('bhwqKrfpZ1pouSodbcrekc', { num: 10 }));
          return;
        }
        tvWidget.chart().createStudy(study);

        if (activeStudies?.length) {
          const studyIndex = activeStudies.findIndex((name) => name === study);
          if (studyIndex === -1) {
            dispatch({
              type: `${namespace}/update`,
              payload: {
                activeStudies: [...activeStudies, study],
              },
            });
          }
        } else {
          dispatch({
            type: `${namespace}/update`,
            payload: {
              activeStudies: [study],
            },
          });
        }
      } catch (e) {
        console.error(`${e || 'tvWidget create study error'}`);
      }
    },
    [tvWidget, activeStudies, message, dispatch],
  );

  const renderLine = useCallback(
    (study) => {
      const active = activeStudies.indexOf(study.id) > -1;
      const favorite = favorites.indexOf(study.id) > -1;
      return (
        <StudyItem key={study.id} onClick={() => onStudyClick(study.id)}>
          {favorite ? (
            <ICFavoriteSelectOutlined
              onClick={(e) => removeFavorites(e, study.id)}
              className="active-icon"
            />
          ) : (
            <ICFavoriteUnselectOutlined onClick={(e) => addFavorites(e, study.id)} />
          )}

          <StudyText className={active ? 'active' : ''}>
            {study.name}
            {active ? <ICHookOutlined style={{ margin: 0 }} /> : null}
          </StudyText>
        </StudyItem>
      );
    },
    [activeStudies, favorites, addFavorites, onStudyClick, removeFavorites],
  );

  // tab list
  const tabList = useMemo(() => {
    const tabs = [];

    map(group, (v) => {
      tabs.push({
        title: v.title,
        key: v.key,
        children: getStudyChildren(v.children, currentLang),
      });
    });

    return tabs;
  }, [currentLang]);

  // data list
  const list = useMemo(() => {
    let arr = [];
    if (search) {
      const value = search.toLowerCase();
      const includeSearch = (str) => String(str).toLowerCase().includes(value);
      map(tabList, (v) => {
        const children = v.children.filter(({ name, abbr = '' }) => {
          return includeSearch(name) || includeSearch(abbr);
        });

        if (children?.length) {
          arr = arr.concat(children);
        }
      });
    } else if (activeKey === 'favorites') {
      arr = getStudyChildren(favorites, currentLang);
    } else {
      const activeItem = find(tabList, { key: activeKey });
      arr = activeItem ? activeItem.children : [];
    }

    return arr;
  }, [activeKey, search, tabList, favorites, currentLang]);

  return (
    <StudyModalWrapper
      title={_t('indicators')}
      open={modalVisible}
      footer={null}
      onCancel={onCancel}
      size="large"
    >
      <SearchBar>
        <Input
          prefix={<ICSearchOutlined size="16" />}
          value={search}
          onChange={handleChange}
          variant="filled"
        />
      </SearchBar>
      <ListContent>
        {!search ? (
          <TabsBar>
            <Tabs size="small" value={activeKey} onChange={changeTabs} variant="line" bordered={!0}>
              <Tab label={_t('8ee6566a77944000a934')} value="favorites" key="favorites" />
              {map(tabList, (v) => {
                return <Tab label={_t(v.title)} value={v.key} key={v.key} />;
              })}
            </Tabs>
          </TabsBar>
        ) : null}

        <StudyList className={search ? 'full-list' : ''}>
          {list?.length ? map(list, (study) => renderLine(study)) : <Empty />}
        </StudyList>
      </ListContent>
    </StudyModalWrapper>
  );
};
export default memo(StudyModal);

export { AllIndexList };
