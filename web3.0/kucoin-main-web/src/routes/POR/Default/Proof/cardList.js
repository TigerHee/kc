/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo, useMemo, useState, useCallback, useEffect } from 'react';
import { _t } from 'tools/i18n';
import { trackClickSpm } from 'utils/gaTrack';
import { useResponsive } from '@kux/mui';
import selfImg from 'static/por/self-prove.svg';
import { showDateTimeByZoneEight } from 'helper';
import { Button } from '@kux/mui';
import { useSelector } from 'src/hooks/useSelector';
import { AuditTypeExternal, AuditTypeInternal, getAuditDateList } from 'services/trade2.0/por';
import { useFetchHandle } from 'hooks';
import { ThirdDialog, SystemDialog } from './PorDialog';
import styles from './proof.less';
import { ThirdProofCard } from './components/ThirdProofCard';

const Card = (props) => {
  const { bgClassName = '', children, imgSrc, btn } = props;
  return (
    <div className={`${styles.card} card_wrap`}>
      <div className={`card ${bgClassName}`}>
        <div className="card_oper_wrap">{children}</div>
        <div className="card_img_wrap">
          <img className="card_img" src={imgSrc} alt="" />
        </div>
        {btn}
      </div>
    </div>
  );
};

const Oper = (props) => {
  const { title, time, children, extraInfo } = props;
  return (
    <div>
      <div className="card_title">{title}</div>
      <div className="card_time">
        <span>
          {_t('assets.por.audit.lastesTime', {
            auditTime: showDateTimeByZoneEight(time, 'YYYY/MM/DD'),
          })}
        </span>
        {!!extraInfo && <div> {extraInfo}</div>}
      </div>
      <div className="card_btn">{children}</div>
    </div>
  );
};

/**
 *
 * @param {{
 *  onLogin(): void,
 *  scope: string,
 * }} props
 */
const CardList = (props) => {
  const { onLogin, scope } = props;
  const { xs, sm, md, lg } = useResponsive(); // 判断当前屏幕尺寸是否满足条件
  const isMobile = xs && !sm && !md && !lg;
  const userId = useSelector(({ user }) => user.user?.uid);
  // 0 都不展示，1三方验证 2 系统验证
  const [dialogType, setDialogType] = useState(0);
  const [btn1Loading, setBtn1Loading] = useState(false);
  const [btn2Loading, setBtn2Loading] = useState(false);
  const btnLoadingSetterMap = useMemo(
    () => ({
      1: setBtn1Loading,
      2: setBtn2Loading,
    }),
    [],
  );
  // 审计日期数据
  const [auditDate, setAuditDate] = useState({
    [AuditTypeInternal]: [],
    [AuditTypeExternal]: [],
  });

  const { fetchHandle, loading } = useFetchHandle();
  const onClose = useCallback(() => {
    setDialogType(0);
  }, []);

  const onClick = useCallback(
    (fn, before) => {
      if (!userId) {
        // 优化INP: 中端mobile机登录组件渲染时间超INP标准
        before?.();
        setTimeout(() => {
          onLogin?.();
        }, 0);
      } else {
        fn?.();
      }
    },
    [userId, onLogin],
  );

  // 点击验证
  const onVerify = useCallback(
    (type) => {
      return onClick(
        () => {
          trackClickSpm(['verifyNow', type]);
          setDialogType(type);
        },
        () => {
          const btnLoadingSetter = btnLoadingSetterMap[type];
          btnLoadingSetter?.(true);
          setTimeout(() => {
            btnLoadingSetter?.(false);
          }, 500);
        },
      );
    },
    [btnLoadingSetterMap, onClick],
  );

  useEffect(() => {
    fetchHandle(getAuditDateList(), {
      onSilenceOk({ data }) {
        const dateObj = data?.reduce(
          (res, { auditType, auditDate, verifyAuditResultUrl }) => {
            if (res[auditType]) {
              res[auditType].push({
                auditDate,
                verifyAuditResultUrl,
              });
            }
            return res;
          },
          {
            [AuditTypeExternal]: [],
            [AuditTypeInternal]: [],
          },
        );
        setAuditDate(dateObj);
      },
    });
  }, [fetchHandle]);

  const { [AuditTypeInternal]: internalList } = auditDate;
  // 2025-02-26 外部审计失效，解决方案未定，暂定前端写死不展示
  // const externalList = [];
  const Btn = ({ type, loading }) => (
    <div className="btn_oper">
      <Button loading={loading} className="mr-18 black_btn" onClick={() => onVerify(type)}>
        {_t('assets.por.audit.now')}
      </Button>
    </div>
  );
  
  return (
    <div className={`${styles.cardList} cardList`}>
     <ThirdProofCard />
      {!!internalList?.length && (
        <Card
          bgClassName="self"
          imgSrc={selfImg}
          btn={isMobile && <Btn type={2} loading={btn2Loading} />}
        >
          <div>
            <Oper title={_t('assets.por.audit.inside')} time={internalList[0]?.auditDate}>
              {!isMobile && <Btn type={2} />}
            </Oper>
          </div>
        </Card>
      )}
     
      {dialogType === 2 && (
        <SystemDialog
          onClose={onClose}
          list={internalList}
          auditType={AuditTypeInternal}
          scope={scope}
        />
      )}
    </div>
  );
};

export default memo(CardList);
