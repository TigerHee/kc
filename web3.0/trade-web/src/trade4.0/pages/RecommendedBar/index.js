/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, { memo, useState, useCallback } from 'react';
import { useDispatch } from 'dva';
import {
  Wrapper,
  SelectItem,
  FavoritesIcon,
  PopularIcon,
  SelectItemText,
  DropdownSelectWrapper,
  DropdownExtend,
} from './style';

import SvgComponent from '@/components/SvgComponent';
import { commonSensorsFunc } from '@/meta/sensors';
import { FUTURES } from '@/meta/const';
import storage from 'utils/storage.js';
import { _t } from 'src/utils/lang';

import { RECOMMEND_BAR_TYPE_KEY, RECOMMEND_BAR_POSITION_KEY } from '@/storageKey/chart';

import { useTradeType } from '@/hooks/common/useTradeType';

import FuturesContent from './FuturesContent';
import SpotAndMarginContent from './SpotAndMarginContent';
import { isDisplayFeeInfo } from '@/meta/multiTenantSetting';

const { getItem, setItem } = storage;

export const LabelWithIcon = ({ icon, label }) => {
  return (
    <SelectItem>
      {icon}
      <SelectItemText className="test">{label}</SelectItemText>
    </SelectItem>
  );
};

const TABS_VALUE = {
  FAVORITE: '1',
  POPULAR: '2',
  NO_PREVIEW: 'nopreview',
};

const options = [
  {
    value: TABS_VALUE.FAVORITE,
    label: <LabelWithIcon icon={<FavoritesIcon />} label={_t('fav')} />,
  },
  ...(isDisplayFeeInfo() ? [
    {
      value: TABS_VALUE.POPULAR,
      label: <LabelWithIcon icon={<PopularIcon />} label={_t('n5TUd7iBhuX77bQAVubPze')} />,
    },
  ] : []),
  {
    value: TABS_VALUE.NO_PREVIEW,
    label: (
      <LabelWithIcon
        label={_t('vKizpQhWRENRuFmWCkhqjZ')}
        icon={<SvgComponent keepOrigin type="no-preview" />}
      />
    ),
  },
];

// 推荐列表，合约跟现货先拆分
const RecommendedContent = memo((props) => {
  const tradeType = useTradeType();

  if (tradeType === FUTURES) {
    return <FuturesContent {...props} />;
  }
  return <SpotAndMarginContent {...props} />;
});

/**
 * RecommendedBar
 * 热门币种
 */
const RecommendedBar = (props) => {
  const { ...restProps } = props;
  const dispatch = useDispatch();
  // 优先热门
  const [value, setValue] = useState(
    isDisplayFeeInfo()
      ? getItem(RECOMMEND_BAR_TYPE_KEY) || TABS_VALUE.POPULAR
      : TABS_VALUE.FAVORITE,
  );

  const handleChange = useCallback((v) => {
    commonSensorsFunc(['tradeZoneFunctionBar', v, 'click']);
    if (v === TABS_VALUE.NO_PREVIEW) {
      setItem(RECOMMEND_BAR_POSITION_KEY, v);
      dispatch({
        type: 'setting/update',
        payload: {
          recommendbarPosition: v,
        },
      });
    } else {
      setValue(v);
      setItem(RECOMMEND_BAR_TYPE_KEY, v);
    }
  }, [dispatch]);

  return (
    <Wrapper {...restProps} data-inspector="tradeV4_recommendedBar">
      <DropdownSelectWrapper
        extendStyle={DropdownExtend}
        configs={options}
        value={value}
        onChange={handleChange}
      />
      <RecommendedContent curType={value} />
    </Wrapper>
  );
};

export default memo(RecommendedBar);
