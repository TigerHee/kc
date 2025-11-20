import React from 'react';
import { ICHookOutlined } from '@kux/icons';
import _ from 'lodash-es';
import { useTranslation } from 'tools/i18n';
import { REGEXP_PWD_GROUP } from '../../common/tools';
import styles from './styles.module.scss';
import clsx from 'clsx';

const PasswordCheck = ({ password, always = false, isError, matchAllRules }) => {
  const { t } = useTranslation('entrance');
  //  输入密码，密码checkList
  const PWD_STEPS = [
    {
      // 10-32位
      reg: REGEXP_PWD_GROUP.length,
      msg: () => t('newsignup.pwd.valid.length', { num1: 10, num2: 32 }),
    },
    {
      reg: REGEXP_PWD_GROUP.str,
      msg: () => t('newsignup.pwd.valid.str'),
    },
    {
      // 只有这里使用
      reg: REGEXP_PWD_GROUP.space,
      msg: () => t('newsignup.pwd.valid.space'),
    },
  ];
  if (!password && !always) return null;
  return (
    <section className={clsx(styles.tipContainer, isError ? styles.isError : null, matchAllRules ? styles.matchAllRules : null)}>
      {_.map(PWD_STEPS, ({ reg, msg }, index) => {
        const fail = !reg.test(password) || !password;
        return (
          <p className={clsx(styles.tipItem, fail ? styles.fail : null)} key={index}>
            {fail ? (
              <span className={styles.failIcon} />
            ) : (
              <span className={styles.checkIcon}>
                <ICHookOutlined size="16px" />
              </span>
            )}
            <span>{msg()}</span>
          </p>
        );
      })}
    </section>
  );
};

export default PasswordCheck;
