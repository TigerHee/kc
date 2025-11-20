/**
 * Owner: brick.fan@kupotech.com
 */
import { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { getQrCodeDetail } from 'services/cert';
import addFriendsImg from 'static/cert/add_friends.png';
import groupImg from 'static/cert/group.png';
import styles from './style.less';

const QRCode = (props) => {
  const match = useRouteMatch();
  const id = match?.params?.id;

  const [state = {}, setState] = useState({
    pageName: '',
    name: '',
    qrcode: '',
    type: '',
  });

  useEffect(() => {
    getQrCodeDetail(id)
      .then((res) => {
        if (res.success) {
          setState(res.data || {});
          document.title = res.data.pageName;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={styles.page} data-inspector="cert-page-qrcode">
      <div className={styles.body}>
        <div className={styles.header}>
          <img src={state.type === 'ADD_FRIEND' ? addFriendsImg : groupImg} alt="" />
          <span className={styles.name}>{state.name || ''}</span>
        </div>
        <img src={state.qrcode} className={styles.qrCode} alt="" />
      </div>
    </div>
  );
};

export default QRCode;
