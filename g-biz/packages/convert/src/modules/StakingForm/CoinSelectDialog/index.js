/*
 * @owner: june.lee@kupotech.com
 */
import { useTranslation } from '@tools/i18n';
import { styled, Spin, useEventCallback } from '@kux/mui';
import { map, reduce, isPlainObject, isString } from 'lodash';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import storage from '@utils/storage';
import SearchList from './SearchList';
import SearchInput from './SearchInput';
import { SelectorProvider } from './usePropsSelector';
import CoinGroup from './common/CoinGroup';
import Dialog from '../Dialog';
import useDebounce from '../../../hooks/common/useDebounce';

const StyledDialog = styled(Dialog)`
  .KuxModalHeader-root {
    height: 90px !important;
    padding-top: 32px;
    padding-bottom: 24px;
    .KuxModalHeader-title {
      font-size: 20px;
    }
  }
  .KuxDialog-content {
    height: 474px;
    padding: 0;
  }
  .KuxMDialog-content {
    padding: 16px 0 0;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      padding: 0;
    }
  }
  .KuxMDialog-content,
  .KuxDialog-content {
    & > .KuxSpin-root {
      width: 100%;
      height: 100%;
      & > .KuxSpin-container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    }
  }
`;
const WithPadding = styled.div`
  padding: 0 32px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 18px;
  }
`;

const CoinSelectDialog = ({
  open,
  title,
  value,
  loading,
  onCancel,
  extraList,
  amountKey,
  currencyList,
  commonlyCacheKey,
  getTag: getTagFromProps,
  onChange: onChangeFromProps,
  currencyMap: currencyMapFromProps,
  ...otherProps
}) => {
  const { t: _t } = useTranslation('convert');
  const [_searchText, setSearchText] = useState('');
  const searchText = useDebounce(_searchText, { wait: 300 });
  const [commonlyList, setCommonlyList] = useState(() => {
    const ret = commonlyCacheKey ? storage.getItem(commonlyCacheKey) : [];
    return Array.isArray(ret) ? ret : [];
  });

  const currencyMap = useMemo(() => {
    if (currencyMapFromProps) return currencyMapFromProps;
    return reduce(
      currencyList,
      (a, b) => {
        a[b.currency] = b;
        return a;
      },
      {},
    );
  }, [currencyList, currencyMapFromProps]);

  useEffect(() => {
    setSearchText('');
  }, [open]);

  useEffect(() => {
    if (commonlyCacheKey && currencyMap[value]) {
      setCommonlyList((pre) => {
        const ret = [...pre];
        const index = ret.indexOf(value);
        if (index > -1) {
          ret.splice(index, 1);
        } else if (pre.length >= 10) {
          ret.pop();
        }
        ret.unshift(value);
        storage.setItem(commonlyCacheKey, ret);
        return ret;
      });
    }
  }, [value, currencyMap, commonlyCacheKey]);

  const getTag = useCallback(
    (v) => {
      let record;
      if (isString(v)) {
        record = currencyMap[v] || {};
      } else if (isPlainObject(v)) {
        record = { ...currencyMap[v], ...v };
      }
      return getTagFromProps ? getTagFromProps(record) : null;
    },
    [currencyMap, getTagFromProps],
  );

  const onChange = useEventCallback((item) => {
    if (onChangeFromProps) onChangeFromProps(item);
    if (onCancel) onCancel();
  });

  const removeCommonlyList = useEventCallback((items) => {
    setCommonlyList((pre) => {
      const ret = pre.filter((v) => !items.includes(v));
      if (ret.length) {
        storage.setItem(commonlyCacheKey, ret);
      } else {
        storage.removeItem(commonlyCacheKey);
      }
      return ret;
    });
  });

  const handleSearch = useEventCallback((e) => {
    const val = e?.target?.value;
    setSearchText(val);
  });

  return (
    <StyledDialog
      open={open}
      size="medium"
      footer={null}
      destroyOnClose
      onCancel={onCancel}
      headerProps={{ border: false }}
      title={title || _t('6YahpHLmefx263pTsh8PaH')}
      {...otherProps}
    >
      <Spin spinning={Boolean(loading)} size="small">
        <SelectorProvider value={{ value, amountKey, searchText, getTag, onChange }}>
          <WithPadding>
            <SearchInput value={_searchText} onChange={handleSearch} />
            {!searchText && (
              <>
                {Boolean(commonlyCacheKey) && (
                  <CoinGroup
                    dataSource={commonlyList}
                    currencyMap={currencyMap}
                    onDelete={removeCommonlyList}
                    title={_t('qaFjowFSaCHbheQgMaGCQR')}
                  />
                )}
                {map(extraList, ({ key, dataSource, ...other }, index) => {
                  if (dataSource?.length) {
                    return (
                      <CoinGroup
                        {...other}
                        key={key || index}
                        dataSource={dataSource}
                        currencyMap={currencyMap}
                      />
                    );
                  }
                  return null;
                })}
              </>
            )}
          </WithPadding>
          <SearchList value={value} searchText={searchText} dataSource={currencyList} />
        </SelectorProvider>
      </Spin>
    </StyledDialog>
  );
};

export default React.memo(CoinSelectDialog);
