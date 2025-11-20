import {useLockFn} from 'ahooks';

import {AGREEMENT_SCENE_TYPE} from 'constants/index';
import {useMutation, useQuery} from 'hooks/react-query';
import {queryUnsignedTerms, signTerms} from 'services/copy-trade';

/**
 * 协议中心hook
 * @typedef {Object} AgreementListCenter
 * @property {boolean} isFetched - 是否已获取数据
 * @property {Array<{
 *   articleId: number,
 *   title: string,
 *   context: string,
 *   url: string,
 *   version: string,
 *   updatedAt: number,
 *   publishTime: string,
 *   summary: string
 * }>} data - 未签署协议列表数据
 */
export const useAgreementListQuery = ({
  scene = AGREEMENT_SCENE_TYPE.LEAD_TRADE,
  disabled = false,
}) => {
  const isLead = scene === AGREEMENT_SCENE_TYPE.LEAD_TRADE;

  const {
    data: queryUnsignedTermsResp,
    isFetched,
    isLoading,
  } = useQuery({
    queryKey: ['queryUnsignedTerms', isLead],
    queryFn: async () => await queryUnsignedTerms(isLead),
    enabled: !!scene && !disabled,
    refetchOnFocus: false,
  });

  return {
    isFetched,
    isLoading,
    data: queryUnsignedTermsResp?.data,
    // 拉取完成 && 未签署列表为空
    isSignPass: isFetched && queryUnsignedTermsResp?.data?.length === 0,
  };
};

/**
 * 协议中心hook
 * @typedef {Object} AgreementListCenter
 * @property {boolean} isSignLoading - 签署中状态
 * @property {function(): Promise<void>} doSignTerms - 签署协议方法
 */
export const useDoSignAgreementMutation = ({
  scene = AGREEMENT_SCENE_TYPE.LEAD_TRADE,
}) => {
  const isLead = scene === AGREEMENT_SCENE_TYPE.LEAD_TRADE;

  const {mutateAsync: doSignTerms, isLoading: isSignLoading} = useMutation({
    mutationFn: async () => await signTerms(isLead),
  });

  const lockDoSign = useLockFn(doSignTerms);

  return {
    isSignLoading,
    doSignTerms: lockDoSign,
  };
};
