import clsx from 'clsx';
import { ArrowRight2Icon, ArrowLeft2Icon } from '@kux/iconpack';
import styles from './styles.module.scss';

export default ({
  onLeft,
  onRight,
  leftDisabled,
  rightDisabled,
}: {
  onLeft: () => void;
  onRight: () => void;
  leftDisabled: boolean;
  rightDisabled: boolean;
}) => {
  return (
    <div className={styles.pagination}>
      <div
        className={clsx({
          [styles.ArrowWrap]: true,
          [styles.ArrowWrapDisabled]: leftDisabled,
        })}
        onClick={onLeft}
      >
        <ArrowLeft2Icon
          className={clsx({
            [styles.ArrowIcon]: true,
          })}
        />
      </div>
      <div
        className={clsx({
          [styles.ArrowWrap]: true,
          [styles.ArrowWrapDisabled]: rightDisabled,
        })}
        onClick={onRight}
      >
        <ArrowRight2Icon
          className={clsx({
            [styles.ArrowIcon]: true,
          })}
        />
      </div>
    </div>
  );
};
