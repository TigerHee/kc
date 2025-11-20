import BaseInfo from './BaseInfo';
import classes from './style.module.scss';

const CoinInfo = ({ id }) => {
  return (
    <div data-ssg="coin-info" data-inspector="inspector_kcs_info" id={id} className={classes.coinInfoBox}>
      <BaseInfo />
    </div>
  );
};

export default CoinInfo;
