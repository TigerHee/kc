/**
 * Owner: will.wang@kupotech.com
 */
import styles from './style.module.scss';

const Content = ({ info, onClick = () => {} }) => {
  return <p className={styles.cont} onClick={onClick}>{info.text}</p>;
};

export default Content;