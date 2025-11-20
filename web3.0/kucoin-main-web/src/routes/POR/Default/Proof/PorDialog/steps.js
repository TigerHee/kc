/**
 * Owner: odan.ou@kupotech.com
 */

import React, { useMemo } from 'react';
import { Steps } from '@kufox/mui';
import { ArrowOutlined } from '@kufox/icons';
import { _t } from 'tools/i18n';
import styles from './style.less';

const { Step } = Steps;

/**
 * 箭头
 * @param {{
 *  show: boolean,
 *  rotate?: boolean,
 * }} props
 */
const Arrow = (props) => {
  const { rotate = true, show } = props;
  if (!show) return false;
  const style = {
    ...(rotate ? { transform: 'rotate(180deg)', marginLeft: 12 } : { marginRight: 12 }),
    fontSize: 12,
  };
  return <ArrowOutlined color="#01BC8D" style={style} />;
};

/**
 * 步骤条
 * @param {{
 *  list: { lable: string, value: React.ReactNode }[],
 *  currentStep: number,
 *  tip?: string,
 * }} props
 */
const PorSteps = (props) => {
  const { list: listOrigin, currentStep, tip, ...restProps } = props;
  const list = useMemo(() => {
    return listOrigin?.map(({ label, value, ...others }, index) => {
      return Object.assign(others, {
        title: (
          <div className="step_title">
            <div className="step_label">{label}</div>
            <div className="step_val">{value}</div>
            <Arrow show={index === currentStep} />
          </div>
        ),
      });
    });
  }, [listOrigin, currentStep]);
  return (
    <div className={styles.step}>
      <Steps current={currentStep} size="small" direction="vertical" {...restProps}>
        {list.map((step, idx) => {
          const { title, ...others } = step;
          return <Step title={title} {...others} key={idx} />;
        })}
      </Steps>
      {tip && <div className="step_error">{tip}</div>}
    </div>
  );
};

export default PorSteps;
