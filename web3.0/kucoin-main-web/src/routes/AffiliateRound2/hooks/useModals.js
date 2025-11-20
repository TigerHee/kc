/**
 * Owner: jesse.shao@kupotech.com
 */
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { useCallback } from 'react';

// export const MODAL_MAP = {
//   DOWNLOAD_FILE: 'DOWNLOAD_FILE',
//   // 异常兜底弹窗
//   DATAERR: 'DATAERR',
//   LOGIN_ERR: 'LOGIN_ERR',
//   NO_AUTH: 'NO_AUTH',
//   // 短弹窗
//   YESTERDAY_COMMISSION: 'YESTERDAY_COMMISSION',
//   THIS_WEEK_COMMISSION: 'THIS_WEEK_COMMISSION',
//   // 有效新用户数
//   EFFECTIVE_NEWUSERS: 'EFFECTIVE_NEWUSERS',
//   // /累计交易量
//   CUMULATIVE_VOLUME: 'CUMULATIVE_VOLUME',
//   // 子返佣比例申请
//   COMMISSION_RATE_APPLICATIONS: 'COMMISSION_RATE_APPLICATIONS',
//   // 新人首月定级规则
//   COUPLE_FIRST_GRADING_RULES: 'COUPLE_FIRST_GRADING_RULES',
//   // 季度考核规则
//   QUARTERLY_ASSESSMENT_RULES: 'QUARTERLY_ASSESSMENT_RULES',
//   // 数据概览
//   DATA_OVERVIEW: 'DATA_OVERVIEW',
//   // 已邀请人数
//   INVITED_PERSON_NUM: 'INVITED_PERSON_NUM',
//   // 人均贡献返佣
//   PERSON_REBATE: 'PERSON_REBATE',
//   // 子合伙人
//   SUBAFFILIATE_EXPLAIN: 'SUBAFFILIATE_EXPLAIN',
// };

const useModals = () => {
  const dispatch = useDispatch();
  const { showModalId } = useSelector((state) => state.v2Affiliate);

  const showModal = useCallback((id) => {
    dispatch({
      type: 'v2Affiliate/update',
      payload: {
        showModalId: id,
      },
    });
  }, []);

  const clearModal = useCallback((id) => {
    dispatch({
      type: 'v2Affiliate/update',
      payload: {
        showModalId: '',
      },
    });
  }, []);

  return {
    showModalId,
    clearModal,
    showModal,
  };
};

export default useModals;
