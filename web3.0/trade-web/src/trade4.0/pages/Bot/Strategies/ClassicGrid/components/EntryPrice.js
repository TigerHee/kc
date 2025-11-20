/**
 * Owner: mike@kupotech.com
 */
import React, { useEffect, useRef } from 'react';
import DialogRef from 'Bot/components/Common/DialogRef';
import { formatNumber, jump, localDateTimeFormat } from 'Bot/helper';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'dva';
import { getEntryPirceActicle } from 'Bot/Strategies/ClassicGrid/config';
import isEmpty from 'lodash/isEmpty';
import { MIcons } from 'Bot/components/Common/Icon';
import { css } from '@emotion/css';
import { Spin } from '@kux/mui';
import { Text, Flex } from 'Bot/components/Widgets';
import { _t, _tHTML } from 'Bot/utils/lang';

// entryPriceLists = [
//   {
//     type: 'UPDATE_REGION',
//     price: 999,
//     time: Date.now(),
//   },
// ];
/**
 * @description:  获取操作对应的语言
 * @param {String} type 操作类型
 * @return {String}
 */
const getOperationLang = (type) => {
  // UPDATE_REGION(1, "修改区间"),
  // ADD_INVESTMENT(2, "追加投资额"),
  // EXTEND_REGION(14, "扩展区间"),
  const operationLangConfig = {
    UPDATE_REGION: 'updatepricerange',
    ADD_INVESTMENT: 'smart.addinverst',
    EXTEND_REGION: '4SfvaBjJAM4Jo8PURM5u8k',
  };
  return operationLangConfig[type] ? _t(operationLangConfig[type]) : '--';
};
/**
 * @description: 展示修改入场价格组件
 * @param {*} actionSheerRef  ref引用
 * @param {Number} pricePrecision 精度
 * @return {*}
 */
const EntryPriceSheet = ({ pricePrecision, taskId }) => {
  const entryPriceLists = useSelector((state) => state.classicgrid.entryPriceLists);
  const isLoading = useSelector(
    (state) => state.loading.effects['classicgrid/getUpdateEntryPriceLists'],
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'classicgrid/getUpdateEntryPriceLists',
      payload: taskId,
    });
  }, []);
  return (
    <div className="fs-14">
      <Text className="mb-12" color="text">
        {_t('wqMoLyTFN3tzXYGJjvytGH')}
      </Text>
      {isLoading && isEmpty(entryPriceLists) ? (
        <div className="Flex vc hc" style={{ height: 160 }}>
          <Spin />
        </div>
      ) : (
        <>
          <table className="fullWidth">
            <Text color="text40" as="thead">
              <tr>
                <td className="pt-4 pb-4">{_t('operation')}</td>
                <td>{_t('updatedate')}</td>
                <td className="right">{_t('updatepricethen')}</td>
              </tr>
            </Text>
            <Text as="tbody" color="text">
              {entryPriceLists?.slice(0, 5)?.map((item, index) => {
                return (
                  <tr key={`${item.type}${index}`}>
                    <td className="capitalize pt-4 pb-4">{getOperationLang(item.type)}</td>
                    <td>{localDateTimeFormat(item.time)}</td>
                    <td className="right">{formatNumber(item.price, pricePrecision)}</td>
                  </tr>
                );
              })}
            </Text>
          </table>
          {entryPriceLists.length > 5 && (
            <Text as="div" color="text40" className="mt-12">
              {_t('pdewD1YpQ3Yh6KmLhZmWNS')}
            </Text>
          )}
        </>
      )}
    </div>
  );
};

const middleLine = css`
  text-decoration: line-through;
`;
/**
 * @description: 入场价格显示， 如有修改可以弹窗展示
 * @param {*} value 入场价格
 * @param {Number} pricePrecision 精度
 * @param {Boolean} isUpdate 是否修改过
 * @param {String} direction row | row-reverse
 * @return {*}
 */
const EntryPrice = ({
  value,
  pricePrecision,
  isUpdate,
  direction = 'row',
  className,
  taskId,
  noMargin,
  as = 'span',
  ...rest
}) => {
  const actionSheerRef = useRef();
  if (!Number(value)) {
    return '--';
  }
  const showDialog = () => {
    if (!isUpdate) return;
    actionSheerRef.current.toggle();
  };
  if (!isUpdate) {
    return (
      <Text color="text" as={as}>
        {formatNumber(value, pricePrecision)}
      </Text>
    );
  }
  return (
    <>
      <Flex
        vc
        hc
        onClick={showDialog}
        color="text"
        className={`cursor-pointer ${className}`}
        as={as}
        {...rest}
      >
        {isUpdate && <MIcons.InfoLine size={12} className="mr-4" color="icon" />}
        <span className={clsx({ [middleLine]: isUpdate, 'mr-4': !noMargin })}>
          {formatNumber(value, pricePrecision)}
        </span>
      </Flex>

      <DialogRef
        onOk={() => actionSheerRef.current.close()}
        cancelButtonProps={{ onClick: () => jump(getEntryPirceActicle()) }}
        onCancel={() => actionSheerRef.current.close()}
        cancelText={_t('clsgrid.btchintcancel')}
        okText={_t('gridform24')}
        ref={actionSheerRef}
        title={_t('card14')}
        size="medium"
        maskClosable
      >
        <EntryPriceSheet
          actionSheerRef={actionSheerRef}
          pricePrecision={pricePrecision}
          taskId={taskId}
        />
      </DialogRef>
    </>
  );
};
export default EntryPrice;
