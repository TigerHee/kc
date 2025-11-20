/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Parser } from 'html-to-react';
import useLang from '../../../../hooks/useLang';
import plugins from '../../../../plugins';
import { METHODS } from '../../../../enums';
import styles from './styles.module.scss';

const htmlToReactParser = new (Parser as any)();

/** 补充信息 */
export default function SupplementInfo({ supplement = [], isSub }: { supplement: string[][], isSub?: boolean }) {
  const { t } = useLang();

  return (
    <div className={styles.container}>
      <div className={styles.errorSection}>{
      htmlToReactParser.parse(
        isSub ? t('b703ce9e16994800af0a') : t('safe_verify_matching_empty_hint1'))
      }</div>
      <div className={styles.errorSection}>
        {supplement?.map((list, li) => {
          if (!list.every(plugins.has)) {
            return null;
          }
          return (
            <div key={list.join(',')} className={styles.boldText}>
              {`${li + 1}. `}
              {list.map((item, ii) => {
                const { Name } = plugins.get(item) ?? {};
                const name = <Name recommend={item === METHODS.PASSKEY} />;
                return ii > 0 ? <span key={item}> + {name}</span> : name;
              })}
            </div>
          );
        })}
      </div>
      <div className={styles.errorSection}>{t('safe_verify_matching_empty_hint2')}</div>
    </div>
  );
}
