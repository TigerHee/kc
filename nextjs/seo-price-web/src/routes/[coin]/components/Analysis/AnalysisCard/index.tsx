/**
 * Owner: melon@kupotech.com
 */
/**
 * 可视化数据卡片 包含响应式
 * Header => 左边是title title包含文字提醒; 右边是操作区域 包含 类型选择（非必展示） 时间下拉选择
 *
 */
import { Select, Tabs, Tooltip } from '@kux/mui-next';
import { isFunction } from 'lodash';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import useScreen from 'src/hooks/useScreen';
import QuestionIcon from '@/assets/global/question.svg';
import styles from './style.module.scss';
import clsx from 'clsx';


const { Tab } = Tabs;

const times = [
  {
    value: '1H',
    label: '1H',
  },
  {
    value: '12H',
    label: '12H',
  },
  {
    value: '24H',
    label: '24H',
  },
];

const AnalysisCard = ({ onChangeType, onChangeTime, title, titleTip, businessTypes, children }: {
  onChangeType?: (params: { time: string; businessType: null | string }) => void;
  onChangeTime?: (params: { time: string; businessType: null | string }) => void;
  title?: ReactNode;
  titleTip?: ReactNode;
  businessTypes?: any[];
  children: any;
}) => {
  const { isSm } = useScreen();
  const showBusinessTypes = businessTypes && (businessTypes.length > 0);
  const businessTypesSelectRef = useRef<HTMLDivElement | null>(null);
  const [businessTypesSelectWidth, setBusinessTypesSelectWidth] = useState(125);
  const [businessType, setBusinessTypes] = useState<null | string>(null); // 业务类型
  const needVertical = isSm && showBusinessTypes; // 需要垂直布局
  const [time, setTime] = useState('24H'); // 时间

  useEffect(() => {
    if (businessTypes?.length) {
      setBusinessTypes(businessTypes[0].value);
    }
    return () => {
      setBusinessTypes(null);
    };
  }, [businessTypes]);
  useEffect(() => {
    if (showBusinessTypes && businessTypesSelectRef.current) {
      setBusinessTypesSelectWidth(businessTypesSelectRef.current.clientWidth);
    }
  }, [showBusinessTypes]);

  // 修改 businessType
  const onChangeBusinessType = useCallback(
    (val) => {
      setBusinessTypes(val);
      isFunction(onChangeType) && onChangeType({ businessType: val, time });
    },
    [onChangeType, time],
  );

  // 修改 time
  const onChangeSelectTime = useCallback(
    (val) => {
      if (val === time) return;
      setTime(val);
      isFunction(onChangeTime) && onChangeTime({ businessType, time: val });
    },
    [time, onChangeTime, businessType],
  );

  const Title = useCallback(() => {
    if (titleTip) {
      return (
        <header className={clsx(styles.titleWrapper, {
          [styles.vertical]: needVertical,
        })}>
          <h2 className={styles.titleText}>{title}</h2>
          <Tooltip
            title={<div style={{ maxWidth: 240 }}>{titleTip}</div>}
            trigger={isSm ? 'click' : 'hover'}
          >
            <img src={QuestionIcon} alt="QuestionIcon" />
          </Tooltip>
        </header>
      );
    }
    return (
      <header className={clsx(styles.titleWrapper, {
        [styles.vertical]: needVertical,
      })}>
        <h2 className={styles.titleText}>{title}</h2>
      </header>
    );
  }, [titleTip, title, needVertical, isSm]);

  return (
    <section className={styles.cardWrapper}>
      <div className={clsx(styles.cardHeader, {
        [styles.vertical]: needVertical,
      })}>
        <Title />
        <div className={clsx(styles.optWrapper, {
          [styles.bizTypeLarge]: showBusinessTypes && businessTypesSelectWidth > 125,
          [styles.bizTypeSmall]: showBusinessTypes && businessTypesSelectWidth <= 125,
        })}
        >
          {/* 业务选择区域 */}
          {showBusinessTypes ? (
            <div className={styles.businessTypesSelect} ref={businessTypesSelectRef}>
              <Tabs
                size="xsmall"
                type="normal"
                indicator={false}
                // variant="bordered"
                value={businessType}
                onChange={(e, value) => onChangeBusinessType(value)}
              >
                {businessTypes.map(({ value: val, label }) => (
                  <Tab key={val} value={val} label={label} />
                ))}
              </Tabs>
            </div>
          ) : null}
          {/* 时间选择 */}
          <div className={styles.timeSelect}>
            <Select
              size="small"
              placeholder="请选择"
              value={time}
              options={times}
              fullWidth
              matchWidth
              onChange={(val) => onChangeSelectTime(val)}
            />
          </div>
        </div>
      </div>
      <div className={styles.cardContent}>{children}</div>
    </section>
  );
};

export default AnalysisCard;