/**
 * Owner: jesse.shao@kupotech.com
 */
import { useState, useCallback, useMemo } from 'react';
import { Table } from 'antd';
import cls from 'clsx';
import { useSelector, useDispatch } from 'dva';
import LoginDrawer from 'components/common/LoginDrawer';
import { useIsMobile } from 'components/Responsive';
import JsBridge from 'utils/jsBridge';
import { showDateTimeByZone } from 'helper';
import { _t, _tHTML } from 'utils/lang';
import styles from './styles.less';

const Staking = () => {
  const kcsHolds = useSelector(state => state.showcase.kcsHolds);
  const userLogin = useSelector(state => state.showcase.userLogin);
  const dispatch = useDispatch();
  const [openLogin, setOpenLogin] = useState(false);
  const isMobile = useIsMobile();
  const isInApp = useSelector(state => state.app.isInApp);
  const supportCookieLogin = useSelector(state => state.showcase.supportCookieLogin);

  const columns = [
    {
      title: _t('choice.staking.table.date'),
      dataIndex: 'date',
      key: 'date',
      render: a => `${showDateTimeByZone(a, 'YYYY-MM-DD')} UTC+8`,
    },
    {
      title: _t('choice.staking.table.kcsholding'),
      dataIndex: 'holdNum',
      key: 'holdNum',
      align: 'right',
      render: a => a ? <div>{a}<span className={styles.kcs}>KCS</span></div> : '-'
    },
  ];

  const handleLoginSuccess = useCallback(() => {
    dispatch({ type: 'showcase/init' });
    dispatch({ type: 'app/getUserInfo' });
    setOpenLogin(false);
    window.scrollTo(0, 0);
  }, [dispatch]);

  const handleLogin = useCallback((e) => {
    if (e.target.tagName.toUpperCase() !== 'A') {
      return;
    }
    if (isInApp && supportCookieLogin) { // 在App里面，同时支持注入Cookie登录
      JsBridge.open({
        type: 'jump',
        params: {
          url: '/user/login',
        },
      });
      return;
    }
    setOpenLogin(true);
  }, [isInApp, supportCookieLogin]);

  const loginDrawerProps = useMemo(() => ({
    openLogin,
    handleCloseLogin: () => setOpenLogin(false),
    handleLoginSuccess,
    needBox: isMobile,
  }), [handleLoginSuccess, isMobile, openLogin]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
      <div className={styles.title}>{_t('choice.staking.title')}</div>
        <Table
          locale={{ emptyText: !userLogin ? <div className={styles.noLogin} onClick={handleLogin}>{_tHTML('choice.vote.card.des.my.current.needLogin')}</div> : '' }}
          className={cls(styles.table, { [styles.noLoginTable]: !userLogin })}
          columns={columns}
          dataSource={kcsHolds}
          rowKey="key"
          pagination={false} />
      </div>
      <LoginDrawer {...loginDrawerProps} />
    </div>
  );
}

export default Staking;
