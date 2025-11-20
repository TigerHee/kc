/**
 * Owner: will.wang@kupotech.com
 */
import { Spin } from '@kux/mui-next';
import styles from './styles.module.scss';
import { FC, ReactNode } from 'react';

export const LoadingContainer: FC<{ children: ReactNode }> = (props) => {
  return (
    <div className={styles.loadingContainer}>
      {props.children}
    </div>
  )
}

export default () => {

  return (
    <LoadingContainer>
      <Spin type="normal" />
    </LoadingContainer>
  )
}
