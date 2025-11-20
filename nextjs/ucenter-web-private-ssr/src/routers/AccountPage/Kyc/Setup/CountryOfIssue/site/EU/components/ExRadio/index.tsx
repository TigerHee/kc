import styles from './styles.module.scss';
import classNames from 'classnames';

interface ExRadioProps {
  title: string;
  value?: boolean;
  onChange: (value: boolean) => void;
}

const ExRadio = ({ title, value, onChange }: ExRadioProps) => {
  return <div className={styles.exRadio}>
    <div className={styles.exRadioTitle}>{title}</div>
    <div className={styles.exRadioContent}>
      <div className={classNames(styles.exRadioOption, value === true && styles.exRadioOptionActive)} onClick={() => onChange(true)}>{/** @todo */ 'Yes'}</div>
      <div className={classNames(styles.exRadioOption, value === false &&styles.exRadioOptionActive)} onClick={() => onChange(false)}>{/** @todo */ 'No'}</div>
    </div>
  </div>;
};

export default ExRadio;
