/**
 * Owner: tiger@kupotech.com
 */
import clsx from 'clsx';
import useCommonData from '../../../hooks/useCommonData';
import { ItemWrapper, SelectIcon, UnSelectIcon } from './style';

export default ({ item, selectVal, setSelectVal }) => {
  const { isSmStyle } = useCommonData();
  const { nodeId, nodeName, nodeLogo, appName } = item;
  const isActive = nodeId === selectVal;

  return (
    <ItemWrapper
      className={clsx({
        isSmStyle,
      })}
      onClick={() => setSelectVal(nodeId)}
    >
      <div className="leftBox">
        <img className="logo" src={nodeLogo} alt="logo" />
        <div>
          <div className="itemTitle">{nodeName}</div>
          <div className="itemDesc">{appName}</div>
        </div>
      </div>
      {isActive ? <SelectIcon /> : <UnSelectIcon />}
    </ItemWrapper>
  );
};
