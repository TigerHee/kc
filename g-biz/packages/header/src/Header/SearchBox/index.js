/**
 * Owner: roger@kupotech.com
 */
import { ICSearchOutlined } from '@kux/icons';
import { useTheme } from '@kux/mui';
import loadable from '@loadable/component';
import { debounce, trim } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PREFIX } from '../../common/constants';
import { kcsensorsClick, kcsensorsManualTrack } from '../../common/tools';
import { useLang } from '../../hookTool';
import AnimateDropdown from '../AnimateDropdown';

import {
  CancelSpan,
  Content,
  CusInput,
  H5Wrapper,
  InSearchWrapper,
  InputWrapper,
  SearchWrapper,
} from './styled';

const SearchResult = loadable(() => import('./SearchResult'));
const SearchDefault = loadable(() => import('./SearchDefault'));

const namespace = `${PREFIX}_header`;

export default (props) => {
  const { inDrawer, miniMode, inTrade } = props;
  const { t } = useLang();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { colors } = theme;
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { searchSessionId, searchWords } = useSelector((state) => state[namespace]);
  const searchWeb = useCallback(
    (keyword) => {
      setLoading(true);
      dispatch({
        type: `${namespace}/searchWeb`,
        payload: {
          keyword,
        },
      })
        .then((data) => {
          setLoading(false);
          if (data && data.length > 0) {
            kcsensorsManualTrack(['NavigationSearchEnterValidKeyword', '1'], {
              groupId: searchSessionId,
              contentItem: keyword,
              pagecate: 'NavigationSearchEnterValidKeyword',
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
      kcsensorsManualTrack(['NavigationSearchEnterKeyword', '1'], {
        groupId: searchSessionId,
        contentItem: keyword,
        pagecate: 'NavigationSearchEnterKeyword',
      });
    },
    [searchSessionId],
  );

  const debounceFilter = useMemo(
    () =>
      debounce((keyword) => {
        searchWeb(keyword);
      }, 1000),
    [searchWeb],
  );

  const handleSearchInput = useCallback(
    (e) => {
      const searchText = trim(e.target.value);
      const filter = async () => {
        setSearch(searchText);
        if (searchText) {
          setLoading(true);
          debounceFilter(searchText);
        } else {
          dispatch({
            type: `${namespace}/update`,
            payload: {
              spotList: [],
              futuresList: [],
              earnList: [],
              web3List: [],
              searchList: [],
            },
          });
        }
        // 搜索
      };
      filter();
    },
    [debounceFilter],
  );

  const handleSearchFocus = useCallback(() => {
    if (!visible && search) {
      searchWeb(search);
    }
    setVisible(true);
    kcsensorsClick(['NavigationSearch', '1'], {
      pagecate: 'NavigationSearch',
    });
  }, [search, searchWeb, visible]);

  const handleSearchBlur = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    kcsensorsManualTrack(['NavigationSearch', '1'], {
      pagecate: 'NavigationSearch',
    });
  }, []);

  if (inDrawer) {
    return (
      <H5Wrapper inSearch={visible}>
        <InputWrapper inSearch={visible}>
          <CusInput
            inSearch={visible}
            size="medium"
            placeholder={t('bjdr6gK61CNwb3TMDHu4rW')}
            value={search}
            onChange={handleSearchInput}
            onFocus={handleSearchFocus}
            prefix={<ICSearchOutlined size={20} color={colors.icon60} />}
            allowClear
          />
          {visible && (
            <InSearchWrapper>
              <CancelSpan
                onClick={() => {
                  setVisible(false);
                  setSearch('');
                }}
              >
                {t('99htGfgYTkdyH6qvAZRJsw')}
              </CancelSpan>
            </InSearchWrapper>
          )}
        </InputWrapper>
        {visible ? (
          <Content>
            {search ? (
              <SearchResult
                {...props}
                inDrawer
                additional={{
                  searchSessionId,
                  searchWords,
                }}
                loading={loading}
              />
            ) : (
              <SearchDefault {...props} visible={visible} inDrawer />
            )}
          </Content>
        ) : null}
      </H5Wrapper>
    );
  }
  return (
    <AnimateDropdown
      inDrawer={inDrawer}
      visible={visible}
      trigger="click"
      keepMounted
      overlay={
        search ? (
          <SearchResult
            additional={{ searchSessionId, searchWords }}
            loading={loading}
            {...props}
          />
        ) : (
          <SearchDefault visible={visible} {...props} />
        )
      }
      placement="bottom-start"
      className="Gbiz-searchBox"
      anchorProps={{ style: { 'display': 'block' } }}
    >
      <SearchWrapper className="noDrawer-search-wrapper" data-inspector="inspector_header_search">
        <CusInput
          type="text"
          placeholder={t('bjdr6gK61CNwb3TMDHu4rW')}
          value={search}
          onChange={handleSearchInput}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          onClick={handleSearchFocus}
          prefix={<ICSearchOutlined size={16} color={colors.icon} />}
          allowClear
          size={miniMode || inTrade ? 'small' : 'medium'}
          inTrade={inTrade}
          data-inspector="inspector_header_search_input"
        />
      </SearchWrapper>
    </AnimateDropdown>
  );
};
