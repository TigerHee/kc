import { Button } from '@kux/mui';
import styles from './DialogContent.module.scss';
import clsx from 'clsx';
import { ReactNode } from 'react';

export const DialogContent = ({
  titleText,
  contentText,
  descText,
  agreeText,
  refuseText,
  onAgreeHandle,
  onLeaveHandle,
}: {
  titleText?: string;
  contentText: ReactNode;
  descText: string;
  agreeText: string;
  refuseText: string;
  onAgreeHandle: () => void;
  onLeaveHandle: () => void;
}) => {
  return (
    <>
      {titleText && <div className={clsx(styles.tipTitle)}>{titleText}</div>}
      <div className={clsx(styles.contentItem)}>{contentText}</div>
      <div className={clsx(styles.contentDesc)}>{descText}</div>
      <section className={clsx(styles.operate)}>
        <Button onClick={onAgreeHandle}>{agreeText}</Button>
        <Button variant="text" className={clsx(styles.exitBtn)} onClick={onLeaveHandle}>
          {refuseText}
        </Button>
      </section>
    </>
  );
};
