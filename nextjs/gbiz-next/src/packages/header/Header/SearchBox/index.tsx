/**
 * Owner: roger@kupotech.com
 */
import { SearchIcon } from '@kux/iconpack';
import { Input } from '@kux/design';
import clsx from 'clsx';
import loadable from '@loadable/component';
import { debounce, trim } from 'lodash-es';
import React, { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { kcsensorsClick, kcsensorsManualTrack } from '../../common/tools';
import AnimateDropdown from '../AnimateDropdown';
import { useTranslation } from 'tools/i18n';
import { useHeaderStore } from '../model';
import styles from './styles.module.scss';

const SearchResult = loadable(() => import('./SearchResult'));
const SearchDefault = loadable(() => import('./SearchDefault'));

// todo: 代码优化一下
export const inputRef: any = {};

const SearchBox = props => {
  const { inDrawer, miniMode, inTrade } = props;
  const { t } = useTranslation('header');
  const ref = useRef(null);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchSessionId = useHeaderStore(state => state.searchSessionId);
  const searchWords = useHeaderStore(state => state.searchWords);
  const headerSearchWeb = useHeaderStore(state => state.searchWeb);

  const searchWeb = useCallback(
    keyword => {
      setLoading(true);
      headerSearchWeb?.({ keyword })
        .then(data => {
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
    [searchSessionId]
  );

  const debounceFilter = useMemo(
    () =>
      debounce(keyword => {
        searchWeb(keyword);
      }, 1000),
    [searchWeb]
  );

  const updateHeader = useHeaderStore(state => state.updateHeader);

  const handleSearchInput = useCallback(
    e => {
      const searchText = trim(e.target.value);
      const filter = async () => {
        setSearch(searchText);
        if (searchText) {
          setLoading(true);
          debounceFilter(searchText);
        } else {
          updateHeader?.({
            spotList: [],
            futuresList: [],
            earnList: [],
            web3List: [],
            alphaList: [],
            searchList: [],
          });
        }
        // 搜索
      };
      filter();
    },
    [debounceFilter]
  );

  const handleSearchFocus = useCallback(() => {
    if (!visible && search) {
      searchWeb(search);
    }
    setVisible(true);
    kcsensorsClick(['NavigationSearch', '1'], {
      pagecate: 'NavigationSearch',
    });

    (ref.current as any)?.focus?.();
  }, [search, searchWeb, visible]);

  inputRef.handleSearchFocus = handleSearchFocus;

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
      <div className={styles.h5Wrapper}>
        <div className={styles.inputWrapper}>
          <Input
            ref={ref}
            placeholder={t('bjdr6gK61CNwb3TMDHu4rW')}
            value={search}
            onChange={handleSearchInput}
            onFocus={handleSearchFocus}
            prefix={<SearchIcon size={20} color="var(--kux-icon40)" />}
            className={clsx(styles.cusInput, styles.cusInputInDrawer)}
          />
          {visible && (
            <div className={styles.inSearchWrapper}>
              <span
                className={styles.cancelSpan}
                onClick={() => {
                  setVisible(false);
                  setSearch('');
                }}
              >
                {t('99htGfgYTkdyH6qvAZRJsw')}
              </span>
            </div>
          )}
        </div>
        {visible ? (
          <div className={styles.content}>
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
          </div>
        ) : null}
      </div>
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
          <SearchResult additional={{ searchSessionId, searchWords }} loading={loading} {...props} />
        ) : (
          <SearchDefault visible={visible} {...props} />
        )
      }
      placement="bottom-start"
      className="Gbiz-searchBox"
      anchorProps={{ style: { display: 'block' } }}
    >
      <div className={clsx('noDrawer-search-wrapper', styles.searchWrapper)} data-inspector="inspector_header_search">
        <Input
          ref={ref}
          type="text"
          placeholder={t('bjdr6gK61CNwb3TMDHu4rW')}
          value={search}
          onChange={handleSearchInput}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          onClick={handleSearchFocus}
          prefix={<SearchIcon size={16} color="var(--kux-icon)" />}
          allowClear
          size={miniMode || inTrade ? 'small' : 'medium'}
          data-inspector="inspector_header_search_input"
          className={styles.cusInput}
        />
      </div>
    </AnimateDropdown>
  );
};

export default SearchBox;
