/**
 * Owner: pike@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import Filters from './Filters';
import { getEarnFields } from 'components/EarnAccountV2/config';
// import ExportCsvButton from 'components/common/ExportCsvButton';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';

const FiltersWrapper = ({ dispatchEvent = () => {}, filtersParams = {} }) => {
  const filters = useSelector((state) => state['earnAccount-assets'].filters);
  const productCategory = useSelector((state) => state['earnAccount-assets'].productCategory);
  const bizTypeList = useSelector((state) => state['earnAccount-assets'].bizTypeList);
  const orderStatus = useSelector((state) => state['earnAccount-assets'].orderStatus);

  // const currenciesList = useSelector((state) => state.earnAccount.currenciesList);

  const dispatch = useDispatch();

  const clearFilter = useCallback(() => {
    dispatch({
      type: 'earnAccount-assets/resetFilters',
    });
  }, [dispatch]);

  useEffect(() => {
    // const payload = { page: 1 };
    // if (dispatchEvent) {
    //   dispatchEvent(payload);
    // }
    return () => {
      clearFilter();
    };
  }, [clearFilter]);

  const onEarnFilterChange = useCallback(
    (filter) => {
      const _filter = filter.rangeDate
        ? { startAt: filter.rangeDate[0], endAt: filter.rangeDate[1] }
        : { ...filter };
      const payload = { ..._filter, page: 1 };
      if (dispatchEvent) {
        dispatchEvent(payload);
      }
    },
    [dispatchEvent],
  );
  const fields = getEarnFields({
    bizTypeItems: bizTypeList,
    productCategoryItems: productCategory,
    orderStatusItems: orderStatus,
    ...filtersParams,
  }).map((item) => {
    return {
      ...item,
      colStyle: {
        maxWidth: '375px',
        minWidth: '200px',
        height: '40px',
      },
    };
  });
  return (
    <React.Fragment>
      <Filters
        extra={null}
        fields={fields}
        values={{ ...filters, rangeDate: [filters.startAt, filters.endAt] }}
        onFilterChange={onEarnFilterChange}
        // ExportCsvButton={<ExportCsvButton onClick={() => this.handleModalVisible(true)} />}
      />
    </React.Fragment>
  );
};

export default FiltersWrapper;
