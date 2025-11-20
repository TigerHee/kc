/**
 * Owner: Lena@kupotech.com
 */
import { styled } from '@kux/mui';
import { isArray, isEmpty, map } from 'lodash';
import { _t } from 'tools/i18n';

const ReasonContent = styled.div`
  text-align: left;
`;
const FailureReason = ({ failureReasonLists = [] }) => {
  const reasonList = failureReasonLists || [];

  //处理兜底错误文案
  const handleError = (list = []) => {
    if (isArray(list) && !isEmpty(list)) {
      return map(list, (item, index) => {
        if (item && item.trim()) {
          return <ReasonContent key={index}>{item}</ReasonContent>;
        }
      });
    }
    return null;
  };

  let reason = null;
  if (isArray(reasonList) && !isEmpty(reasonList)) {
    reason = map(reasonList, (item, index) => {
      if (item.includes('\n')) {
        return handleError(item.split('\n'));
      }
      if (item && item.trim()) {
        return <ReasonContent key={index}>{`${index + 1}. ${item}`}</ReasonContent>;
      }
    });
  }
  //兜底错误文案
  if (reasonList?.length === 0) {
    const textArr = _t('9P2JQ5UtKZGGCyWHGbP865')?.split('\n') || [];
    reason = handleError(textArr);
  }

  return <>{reason}</>;
};
export default FailureReason;
