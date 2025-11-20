/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useMemo } from 'react';
import DropdownSelect from '@/components/DropdownSelect';
import dropStyle from '@/components/DropdownSelect/style';
import styled from '@emotion/styled';
import { useSelector } from 'dva';
import { stras } from 'Bot/config';
import { isEmpty } from 'lodash';
import { _t } from 'Bot/utils/lang';

const ALL = 'ALL';
const strasLists = [...stras];
const AllItem = {
  key: ALL,
  name: '所有',
  lang: 'allstrategy',
  id: ALL,
};
strasLists.unshift(AllItem);

const strasIdMap = new Map();
strasLists.forEach((stra) => strasIdMap.set(stra.id, stra));

const DropdownExtend = {
  Text: styled(dropStyle.Text)`
    align-items: center;
    height: 100%;
    padding: 0 2px 0 0;
  `,
  Icon: styled(dropStyle.Icon)`
    svg {
      fill: ${(props) => props.theme.colors.icon60};
    }
  `,
  List: styled(dropStyle.List)`
    max-height: 30vh;
    overflow-y: auto;
  `,
};

const DropdownSelectWrapper = styled(DropdownSelect)`
  font-size: 12px;
  .dropdown-item {
    text-align: left;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    padding: 11px 12px;
  }
`;

/**
 * @description: 获取支持的策略类型
 * @param {Array} templateType
 * @return {*}
 */
const getAvail = (templateType = []) => {
  if (!isEmpty(templateType)) {
    return strasLists;
  }
  const availIds = templateType.map((el) => el.value);
  const lists = stras.filter((stra) => availIds.includes(stra.id));
  lists.unshift(AllItem);
  return lists;
};

/**
 * StrategySelect
 */
const StrategySelect = memo((props) => {
  const { value = 'all', onChange, ...restProps } = props;

  const templateType = useSelector((state) => state.BotRank.criteria.templateType);

  const _strasLists = useMemo(() => getAvail(templateType), [templateType]);

  return (
    <DropdownSelectWrapper
      value={value}
      extendStyle={DropdownExtend}
      onChange={onChange}
      configs={_strasLists.map(({ lang, id }) => {
        return {
          label: _t(lang),
          value: id,
          key: id,
        };
      })}
      {...restProps}
    />
  );
});

export default StrategySelect;
