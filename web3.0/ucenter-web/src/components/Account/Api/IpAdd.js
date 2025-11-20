/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { Button, Input, styled, useSnackbar } from '@kux/mui';
import clsx from 'clsx';
import IpTag from 'components/Account/Api/IpTag';
import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { _t } from 'tools/i18n';
import { IP_LIMIT_COUNT } from './constants';

const InfoWrapper = styled.div`
  color: ${(props) => props.theme.colors.text40};
  font-size: 12px;
  line-height: 20px;
  &.errorInfo {
    color: ${(props) => props.theme.colors.secondary} !important;
    font-size: 12px;
  }
`;

const IpAddTag = styled(IpTag)`
  margin-bottom: 12px;
`;

const IpAddMain = styled.div`
  display: flex;
  align-items: center;
`;

const IpAddInput = styled(Input)`
  flex-grow: 1;
  flex-shrink: 1;
  box-sizing: border-box;
  min-height: 48px;
  font-size: 16px;
  line-height: 46px;
  border: none;
  box-shadow: none;
  resize: none;
`;

// 验证ipv6 支持带* 前4段不能为*，最后4段允许为*
const testIpv6Asterisk = (ip) => {
  const arr = ip.split(':');
  const arrPre = arr?.slice(0, 4);
  return (
    ip.includes('*') && // 带*
    arr?.length > 4 && // 大于4段
    ip?.split('::')?.length < 3 && // 只有一个压缩
    ip?.split(':')?.length <= 8 && // 最多8段
    arr.every((i) => /^(([0-9A-Fa-f]{1,4})|\*)$/.test(i) || !i) && // 每一段满足ipv6格式
    arrPre?.every((i) => !i.includes('*')) // 前4段不带*
  );
};

// 校验单个ip地址合法性
export const isSingleValidIP = (ip) => {
  // ipv6 + ipv4 不带*
  const reg =
    /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/;

  // ipv4 支持带* 前两段不允许为*，最后两段允许为*
  const resAsteriskV4 =
    /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){2}(\*|25[0-5]|2[0-4]\d|[01]?\d\d?)(\.(\*|25[0-5]|2[0-4]\d|[01]?\d\d?))?$/;

  return reg.test(ip) || (ip.includes('*') && resAsteriskV4.test(ip)) || testIpv6Asterisk(ip);
};

const IpAdd = ({ initList = [], err = null, onChange }) => {
  const [inputVal, setInputVal] = useState('');
  const [list, setList] = useState(initList || []);
  const { message } = useSnackbar();

  useLocale();

  // 去除首尾空格
  const trimedVal = useMemo(() => inputVal.trim(), [inputVal]);

  // 分隔符错误
  const isSeperatorErr = useMemo(() => {
    return trimedVal.indexOf('，') !== -1;
  }, [trimedVal]);

  // 输入字符串分隔成数组
  const inputList = useMemo(() => {
    const _arr = trimedVal.split(',');
    const arr = [];
    _arr.forEach((item) => {
      // 去除已经存在列表中的
      if (item !== '' && list.indexOf(item) === -1) {
        arr.push(item);
      }
    });
    // 去除输入重复项
    return [...new Set(arr)];
  }, [trimedVal, list]);

  // 总共ip数量
  const totalIPAmout = useMemo(() => {
    return inputList.length + list.length;
  }, [inputList, list]);

  // 输入的所有ip已经添加过了
  const hadAddedItem = useMemo(() => {
    return inputList.length < 1;
  }, [inputList]);

  // 遍历验证每一个
  const isFormatValid = useMemo(() => {
    return !inputList.find((item) => isSingleValidIP(item) === false);
  }, [inputList]);

  // 监听输入
  const handleInputChange = (e) => {
    setInputVal(e.target.value);
  };

  // 添加到列表中去
  const handleAddToList = useCallback(() => {
    list.push(...inputList);
    onChange(list);
    setInputVal('');
  }, [inputList, list, onChange]);

  // 校验整个ip地址的合法性

  const validInput = () => {
    if (trimedVal === '') return false;
    if (isSeperatorErr) {
      message.error(_t('api.ip.error.seperator'));
      return false;
    }
    if (!isFormatValid) {
      message.error(_t('invalid.ip.address'));
      return false;
    }
    if (totalIPAmout > IP_LIMIT_COUNT) {
      message.error(_t('api.ip.error.amout', { num: IP_LIMIT_COUNT }));
      return false;
    }
    if (hadAddedItem) {
      message.error(_t('api.auth.ip.error'));
      return false;
    }
    return true;
  };

  // 提交
  const handleSubmit = (e) => {
    e.preventDefault();
    const bool = validInput(trimedVal);
    if (bool) {
      handleAddToList();
    }
  };

  // 删除
  const handleDelete = useCallback(
    (_ip) => {
      const newList = _.filter(list, (ip) => _ip !== ip);
      setList(newList);
      onChange(newList);
    },
    [list, onChange],
  );

  // enter键添加
  const handleEnter = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div data-inspector="api_create_ip_add">
      <div>
        {_.map(list, (ip) => (
          <IpAddTag
            ip={ip}
            key={ip}
            deletable
            onDelete={() => {
              handleDelete(ip);
            }}
          />
        ))}
      </div>
      <IpAddMain>
        <IpAddInput
          data-testid="input"
          value={inputVal}
          onChange={handleInputChange}
          onEnterPress={handleEnter}
          size="large"
          allowClear={true}
          autosize
        />
        <Button
          size="large"
          disabled={!inputVal}
          onClick={handleSubmit}
          style={{ flexShrink: 0, marginLeft: 20 }}
        >
          {_t('add')}
        </Button>
      </IpAddMain>
      <InfoWrapper className={clsx({ errorInfo: err })}>
        {err || _t('hpbPL2YEvMWps5onJ8WpE5', { num: IP_LIMIT_COUNT })}
      </InfoWrapper>
    </div>
  );
};

export default IpAdd;
