/**
 * Owner: hanx.wei@kupotech.com
 */
import React from 'react';
// 柱状图
import { TIME_PARAMS_MAP } from './config';
import AnalysisCard from '@/routes/[coin]/components/Analysis/AnalysisCard';
import { useRouter } from 'kc-next/compat/router';
import { useMount, useRequest } from 'ahooks';
import { getAnalysisMValue } from '@/services/coinDetailAnalysis';
import { saTrackForBiz } from '@/tools/ga';
import useTranslation from '@/hooks/useTranslation';
import dynamic from 'next/dynamic';

// 放在客户端渲染，减轻服务端压力
const Barometer = dynamic(() => import('./Barometer'), { ssr: false });

const Analysis = () => {
  const router = useRouter();
  const coin = router?.query.coin;
  const [barometerTimeText, setBarometerTimeText] = React.useState('24H');
  const { _t } = useTranslation();

  const { loading, data = { mType: 0, mValue: 0, }, run } = useRequest(async (params: any) => {
    const data = await getAnalysisMValue(params);

    return {
      mValue: data.data.mvalue,
      mType: data.data.mtype,
    }
  }, {
    debounceWait: 50,
    manual: true,
  })


  useMount(() => {
    run({
      coin,
      dataAnalysisTimeDimensionEnum: 'TWENTY_FOUR_HOUR',
    });
    saTrackForBiz({}, ['BScoinDetail', ['Chart', '1']], { symbol: coin });
  });

  const handleBarometerTimeChange = React.useCallback(
    ({ time }) => {
      setBarometerTimeText(time);
      run({
        coin,
        dataAnalysisTimeDimensionEnum: TIME_PARAMS_MAP[time],
      })
      saTrackForBiz({}, ['BScoinDetail', ['Chart', '1']], { symbol: coin });
    },
    [run, coin],
  );

  return (
    <>
      <AnalysisCard
        title={_t('mZAdWqbs7eS1ELHDU6nU4x', { time: barometerTimeText })}
        onChangeTime={handleBarometerTimeChange}
      >
        <Barometer loading={loading} mValue={data.mValue} mType={data.mType} />
      </AnalysisCard>

    </>
  );
};

export default Analysis;
