/**
 * Owner: will.wang@kupotech.com
 */
import { Input } from '@kux/mui-next';
import { useCallback } from 'react';
import styles from './style.module.scss';

export default ({ coin, value, setValue }) => {
  const onChange = useCallback((e) => {
    try {
      let val = e.target.value;
      val = val.replace(/[^\d.]/g, '');
      val = val.replace(/^\./g, '');
      val = val.replace(/\.{2,}/g, '');
      val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
      setValue(val);
    } catch (error) {
      setValue('');
    }
  }, [setValue]);

  return (
    <div className={styles.wrapper}>
      <Input
        suffix={<span className={styles.suffix}>{coin}</span>}
        placeholder="0.00"
        value={value}
        onChange={onChange}
        maxLength={18}
        variant="filled"
        size="large"
      />
    </div>
  );
};