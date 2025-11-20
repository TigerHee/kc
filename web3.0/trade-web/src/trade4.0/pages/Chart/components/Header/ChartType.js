/**
 * Owner: jessie@kupotech.com
 */
import React, { useMemo } from 'react';
import { useTheme } from '@kux/mui';
import DropdownSelect from '@/components/DropdownSelect';
import { useBoxCount } from '@/pages/Chart/hooks/useBoxCount';
import { _t } from 'utils/lang';
import { ChartTypeWrapper, LabelWrapper, Icon, DropdownExtend } from './style';

export default () => {
  const { onBoxCountChange, boxCount } = useBoxCount();
  const { colors } = useTheme();

  const chartTypeConfig = useMemo(() => {
    return [
      {
        value: '1',
        label: (
          <LabelWrapper>
            <Icon type="one-chart" fileName="chart" size={16} color={colors.icon} />
            {_t('tdt1rvbPmqukjvg62AQ7Rn')}
          </LabelWrapper>
        ),
        valueLabel: <Icon type="four-charts" fileName="chart" size={16} />,
      },
      {
        value: '4',
        label: (
          <LabelWrapper>
            <Icon type="four-charts" fileName="chart" size={16} color={colors.icon} />
            {_t('dJ9Ui1FyHw6nxWpR8u79vz')}
          </LabelWrapper>
        ),
        valueLabel: <Icon type="four-charts" fileName="chart" size={16} />,
      },
    ];
  }, [_t]);

  return (
    <ChartTypeWrapper className="chart-header-type">
      <DropdownSelect
        placement="bottom-end"
        extendStyle={DropdownExtend}
        isShowArrow={false}
        optionLabelProp="valueLabel"
        configs={chartTypeConfig}
        value={boxCount}
        onChange={onBoxCountChange}
        trigger="hover"
      />
    </ChartTypeWrapper>
  );
};
