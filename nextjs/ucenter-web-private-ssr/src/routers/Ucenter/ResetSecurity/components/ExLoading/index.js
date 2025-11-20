import { Loading } from '@kux/design';
import classNames from 'classnames';
import * as styles from './styles.module.scss';

export default function ExLoading({
  loading,
  type = 'brand',
  size = 'large',
  className,
  children,
}) {
  return (
    <div className={classNames(className, styles.container, loading && styles.loading)}>
      {children}
      {loading && (
        <div className={styles.loadingWrapper}>
          <Loading type={type} size={size} />
        </div>
      )}
    </div>
  );
}
