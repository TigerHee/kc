/**
 * Owner: will.wang@kupotech.com
 */
import styles from './style.module.scss';

const MainTitle = ({ info, withStyle, onClick = () => {} }) => {
  return (
    <p className={withStyle ? styles.title : ''} onClick={onClick}>
      {info.text}
    </p>
  );
};

export default MainTitle;
