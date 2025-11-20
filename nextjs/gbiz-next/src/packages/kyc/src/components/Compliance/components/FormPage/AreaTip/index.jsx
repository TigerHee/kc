/**
 * Owner: tiger@kupotech.com
 * 表单分类 标题 + 描述
 */
import clsx from 'clsx';
import useCommonData from 'kycCompliance/hooks/useCommonData';
import { AreaTipTitle, AreaTipDesc } from './style';

export default ({ componentTitle, componentContent }) => {
  const { isSmStyle, isH5 } = useCommonData();

  return (
    <>
      {componentTitle && (
        <AreaTipTitle className={clsx({ isSmStyle: isSmStyle || isH5 })}>
          {componentTitle}
        </AreaTipTitle>
      )}

      {componentContent && (
        <AreaTipDesc className={clsx({ isSmStyle: isSmStyle || isH5 })}>
          {componentContent}
        </AreaTipDesc>
      )}
    </>
  );
};
