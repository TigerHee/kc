/**
 * Owner: odan.ou@kupotech.com
 */
// 资产证明
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { useFetchHandle } from 'hooks';
import { getAssetReserve } from 'services/trade2.0/por';
import Login from 'src/kComponents/Login';
import Intro from './Default/Intro';
import IntroPOR from './intro';
import ReserveRatio from './Default/ReserveRatio';
import Proof from './Default/Proof';
import styles from './styles.less';

const POR = () => {
  const { fetchHandle } = useFetchHandle();
  const [data, setData] = useState({});

  const [showLogin, setShowLogin] = useState(false);
  const userId = useSelector(({ user }) => user.user?.uid);
  const onLogin = useCallback(() => {
    if (!userId) {
      setShowLogin(true);
    }
  }, [userId]);

  useEffect(() => {
    fetchHandle(getAssetReserve(), {
      onSilenceOk({ data }) {
        setData(data);
      },
    });
  }, [fetchHandle]);
  const scope = useMemo(() => {
    return data?.reserveAsset?.map((item) => item.currency).join('、') || '';
  }, [data]);

  return (
    <div data-inspector="proof_of_reserves_page" className={styles.por}>
      <div className="por_page">
        <div className="por_wrap por_intro">
          <div className="por_content">
            <Intro />
          </div>
        </div>
        <div className="por_wrap por_ratio">
          <div className="por_content">
            <ReserveRatio data={data} />
          </div>
        </div>
        <div className="por_wrap">
          <div className="por_content">
            <Proof onLogin={onLogin} scope={scope} />
          </div>
        </div>
        <div className="por_wrap intro">
          <div className="por_content">
            <IntroPOR />
          </div>
        </div>
      </div>
      <Login open={showLogin} setOpen={setShowLogin} />
    </div>
  );
};

export default POR;
