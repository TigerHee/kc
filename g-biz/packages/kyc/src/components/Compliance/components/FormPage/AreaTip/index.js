/**
 * Owner: tiger@kupotech.com
 * 表单分类 标题 + 描述
 */
import classnames from 'classnames';
import useCommonData from '@kycCompliance/hooks/useCommonData';
import { AreaTipTitle, AreaTipDesc } from './style';

export default ({ componentTitle, componentContent }) => {
  const { isSmStyle, isH5 } = useCommonData();

  return (
    <>
      {componentTitle && (
        <AreaTipTitle className={classnames({ isSmStyle: isSmStyle || isH5 })}>
          {componentTitle}
        </AreaTipTitle>
      )}

      {componentContent && (
        <AreaTipDesc className={classnames({ isSmStyle: isSmStyle || isH5 })}>
          {componentContent}
        </AreaTipDesc>
      )}
    </>
  );
};
