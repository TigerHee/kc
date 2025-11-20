/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Fragment } from 'react';
import plugins from '../../../../plugins';
import { PlusIcon, ArrowRightIcon } from '@kux/iconpack';
import styles from './styles.module.scss';
import { METHODS } from 'packages/verification/src/enums';

interface MethodSelectorProps {
  methods: METHODS[][];
  onChange: (method: METHODS[]) => void;
}

export default function MethodSelector({ methods, onChange }: MethodSelectorProps) {
  return (
    <div className={styles.container} data-testid="method-selector">
      {methods.map((method) => {
        const key = method.join(',');
        return (
          <div
            key={key}
            className={styles.methodItem}
            onClick={() => {
              onChange(method);
            }}
          >
            {method.map((field, index) => {
              const { Name, Icon } = plugins.get(field) ?? {};
              return (
                <Fragment key={field}>
                  {index > 0 ? <PlusIcon className={styles.plusIcon} size={24} /> : null}
                  <div className={styles.fieldItem}>
                    {Icon && <Icon className={styles.methodIcon} />}
                    {Name ? <Name /> : <span>{field}</span>}
                  </div>
                </Fragment>
              );
            })}
            <ArrowRightIcon size="small" className={styles.arrowIcon} />
          </div>
        );
      })}
    </div>
  );
}
