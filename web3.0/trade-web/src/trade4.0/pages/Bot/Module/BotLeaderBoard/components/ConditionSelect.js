/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useState, useLayoutEffect, useEffect } from 'react';
import { ReactComponent as FillterIcon } from '@/assets/bot/strategyIcon/fillter.svg';
import Dialog from '@mui/Dialog';
import Button from '@mui/Button';

import { _t } from 'Bot/utils/lang';
import { useDispatch, useSelector } from 'dva';
import useMergeState from 'Bot/hooks/useMergeState';
import { map, isEqual, isEmpty } from 'lodash';
import styled from '@emotion/styled';
import { Flex, Text } from 'Bot/components';

const ALL = 'ALL';

const Container = styled.div`
  max-height: 50vh;
  overflow-y: auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 5px;
  grid-row-gap: 12px;
`;

const GridItem = styled.span`
  border-radius: 6px;
  background-color: ${({ active, theme }) => theme.colors[active ? 'primary8' : 'cover4']};
  color: ${({ active, theme }) => theme.colors[active ? 'primary' : 'text60']};
  font-size: 12px;
  text-align: center;
  padding: 0px 12px;
  cursor: pointer;
`;

const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  padding: 32px;
  box-sizing: border-box;
  border-top: 1px solid rgba(243, 243, 243, 0.08);
`;

/**
 * @description: 展示的名字映射后端的key
 * @return {*}
 */
const gridNameCFG = {
  runTime: 'duration', //  运行时间
  totalCost: 'card6', //  总投资
  profitRateYear: 'card10', // 年化收益率
  profitRate: 'qyEh8evnYSN7ft2oY3gFCR', // 投资回报率
};

/**
 * @description: 获取默认配置
 * @param {object} criteria
 * @return {object}
 */
const getDefault = (criteria) => {
  const dft = {};
  Object.keys(criteria).forEach((key) => {
    dft[key] = ALL;
  });
  return dft;
};

/**
 * @description: 获取之前的设置
 * @param {FilterCondition} propValue
 * @param {object} criteria
 * @return {object}
 */
const getInit = (propValue, criteria) => {
  let init = {};
  if (isEmpty(propValue)) {
    init = getDefault(criteria);
  } else {
    init = { ...propValue };
  }
  return init;
};

/**
 * @description: 获取当前选中的条件个数
 * @param {FilterCondition} value
 * @return {*}
 */
const getConditionNum = (value) => {
  if (isEmpty(value)) {
    return 0;
  }
  return Object.values(value).filter((cd) => cd && cd !== ALL).length;
};

/**
 * ConditionSelect
 */
const ConditionSelect = memo((props) => {
  const { value: propValue, onChange, ...restProps } = props;
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  const criteria = useSelector((state) => state.BotRank.criteria) || {};
  const [mergedValue, setMerge] = useMergeState(getInit(propValue, criteria));

  const num = getConditionNum(propValue);

  useEffect(() => {
    setMerge(getInit(propValue, criteria));
  }, [propValue]);

  const handleClick = () => {
    setVisible(true);
  };


  const handleOk = () => {
    onChange && onChange(mergedValue);
    setVisible(false);
  };

  const onPick = (_value) => {
    setMerge(_value);
  };

  const onReset = () => {
    setMerge(getDefault(criteria));
  };

  useLayoutEffect(() => {
    dispatch({
      type: 'BotRank/getCriteria',
    });
  }, []);

  // if (isEmpty(criteria)) return null;

  return (
    <>
      <Flex vc onClick={handleClick} style={{ cursor: 'pointer' }}>
        {num > 0 && (
          <Text className="fs-12" color="primary">
            {_t('filter')}({num})
          </Text>
        )}
        <FillterIcon style={{ cursor: 'pointer' }} />
      </Flex>
      <Dialog
        size="medium"
        title={_t('smart.choosecoin')}
        destroyOnClose
        open={visible}
        onCancel={() => setVisible(false)}
        footer={
          <FooterWrapper>
            <Button onClick={onReset} variant="outlined" className="mr-12">{_t('reset')}</Button>
            <Button type="primary" onClick={handleOk}>{_t('confirm')}</Button>
          </FooterWrapper>
        }
      >
        <Container>
          {map(criteria, (items, key) => {
            if (key === 'templateType') return null;
            return (
              <div key={key} className="mb-16">
                <Text className="fs-14 mb-8" color="text" as="div" lh="130%">
                  {gridNameCFG[key] ? _t(gridNameCFG[key]) : ''}
                </Text>
                <Grid>
                  <GridItem
                    className="capitalize"
                    key={ALL}
                    onClick={() => onPick({ [key]: ALL })}
                    active={[ALL, undefined, ''].includes(mergedValue[key])}
                  >
                    {_t('allsymbol')}
                  </GridItem>
                  {items.map((item) => (
                    <GridItem
                      className="capitalize"
                      key={`${item.op} ${item.value} ${item.unit}`}
                      onClick={() => onPick({ [key]: item })}
                      active={isEqual(mergedValue[key], item)}
                    >
                      {`${item.op} ${item.value} ${item.unit}`}
                    </GridItem>
                  ))}
                </Grid>
              </div>
            );
          })}
        </Container>
      </Dialog>
    </>
  );
});

export default ConditionSelect;
