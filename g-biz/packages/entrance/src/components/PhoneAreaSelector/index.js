/**
 * Owner: iron@kupotech.com
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dropdown, styled, Divider, Drawer, useResponsive } from '@kux/mui';
import { ICTriangleBottomOutlined, ICCloseOutlined } from '@kux/icons';
import { kcsensorsManualTrack } from '@utils/sensors';
import Overlay from './OverLay';
import { isForbiddenCountry } from '../../common/tools';
import { getUserArea } from './service';
import { tenantConfig } from '../../config/tenant';

const FixedBox = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  user-select: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`;
const Text = styled.div`
  width: auto;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  span {
    display: inline-flex;
    min-height: 10px;
    align-items: center;
  }
`;

const TriangleDownOutlinedIcon = styled(ICTriangleBottomOutlined)`
  color: ${({ theme }) => theme.colors.text60};
  transform: ${({ open }) => (open ? 'rotate(180deg)' : 'rotate(0deg)')};
  transform-origin: center;
  -webkit-transition: -webkit-transform 0.3s;
  transition: transform 0.3s;
`;

const DividerIcon = styled(Divider)`
  color: ${({ theme }) => theme.colors.cover12};
  height: 21px;
  margin: 0 4px 0 8px;
`;

const ExtendDrawer = styled(Drawer)`
  height: 100vh;
`;
const ExtendHeader = styled.div`
  width: 100%;
  height: 44px;
  display: flex;
  padding: 12px 22px;
  color: ${({ theme }) => theme.colors.text};
`;

/**
 *
 * @param {*} checkForbidden  被禁止的国家，国旗/区号不显示， 国家名称显示为其他 暂未使用，保留了逻辑
 * @param dropForbidden 被禁止的国家, 直接不显示  删除了逻辑，注释状态
 * @param forbiddenCountry 被禁止的国家，不可选
 * @param canChoose 被禁止的国家，可选，只toast提醒
 * @returns
 */
function PhoneAreaSelector({
  countries,
  onChange,
  value,
  language,
  useInit,
  checkForbidden,
  forbiddenCountry, // 使用countries里的dismiss字段来禁止国家显示
  canChoose,
  disabled,
  defaultValue, // 默认的手机区号
  ...otherProps
}) {
  const { scene } = otherProps;
  const [param, setValue] = useState(value);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const isCn = language === 'zh_CN';
  const rv = useResponsive();
  const isSm = !rv?.sm;

  // 合规规则
  const getMobileCodeFromRules = (curCountry) => {
    // 葡萄牙语，则默认展示+55（巴西区号，我们不支持葡萄牙注册）
    if (tenantConfig.common.dismissPT && curCountry.code === 'PT') {
      return '55';
    }
    // forbiddenCountry = true, 且dismiss为true的国家，则默认显示 '1'
    if (forbiddenCountry && curCountry?.dismiss && !canChoose) {
      return '';
    }
    // 忘记密码 & 登陆 dismissLogin 也是没有区号
    if (['forgetPwd', 'login'].includes(scene) && curCountry.dismissLogin) {
      return '';
    }
    // 禁止自动预填写手机区号的国家
    if (tenantConfig.common.notPreFillMobileCodeCountries().includes(curCountry.code)) {
      kcsensorsManualTrack(
        {
          spm: ['phoneAreaSelector', '1'],
          data: {
            category: 'notPreFillMobileCode',
            resultType: curCountry.code,
          },
        },
        'technology_event',
      );
      return '';
    }
    // 区号列表和当前城市区号都存在
    if (countries && curCountry) {
      return curCountry.mobileCode || '';
    }
    return '';
  };
  // 默认值校验合规规则
  const getMobileCodeFromDefaultValue = () => {
    if (defaultValue) {
      const curCountry = countries.find((c) => c.mobileCode === defaultValue);
      return getMobileCodeFromRules(curCountry);
    }
    return '';
  };
  // 从语言中选择默认区号
  const getMobileCodeFromLang = () => {
    const langCode = language ? language.split('_')[1] : tenantConfig.common.initLanguageCode;
    const curCountry = countries.find((c) => c.code === langCode);
    return getMobileCodeFromRules(curCountry);
  };
  // 从用户IP中选择默认区号，兜底从语言中选择默认区号
  const getMobileCodeFromIP = async () => {
    const res = await getUserArea();
    if (res?.success && res?.data) {
      const data = res?.data || {};
      const countryItem = countries.find((i) => i.code === data?.countryCode);
      return getMobileCodeFromRules(countryItem);
    }
    return getMobileCodeFromLang();
  };
  // 获取默认区号
  const getDefaultMobileCode = async () => {
    if (countries?.length === 0) {
      return '';
    }
    try {
      // 如果默认值中的区号符合合规要求，使用默认值区号
      const defaultMobileCode = getMobileCodeFromDefaultValue();
      if (defaultMobileCode) {
        return defaultMobileCode;
      }
      // 使用根据IP获取合规的区号
      const mobileCode = await getMobileCodeFromIP();
      // IP 获得的区号是空，也要默认使用语言获取的区号
      return mobileCode || getMobileCodeFromLang();
    } catch (error) {
      // 兜底使用根据语言获取合规的区号
      return getMobileCodeFromLang();
    }
  };

  // 初始化方法
  const init = async () => {
    // 如果配置了useInit = trhe，并不是要调用 init，只表示使用 value 传入的初始值，不自动匹配默认区号
    if (useInit) {
      return;
    }
    const defaultParam = await getDefaultMobileCode();
    setValue(defaultParam);
    onChange(defaultParam);
  };

  const initRef = useRef(init);
  initRef.current = init;

  const handleClick = (code) => {
    setValue(code);
    if (isSm) {
      onClose();
    } else {
      setVisible(false);
    }
    onChange(code);
  };

  const getIsForbidden = useCallback(
    (code) => {
      const forbiddenItem = isForbiddenCountry(code);
      const isForbidden = checkForbidden && forbiddenItem;
      return isForbidden ? forbiddenItem : false;
    },
    [checkForbidden],
  );

  const getDisplayCode = (code) => {
    const codeFormat = code ? `+${code}` : '';
    if (!checkForbidden) {
      return codeFormat;
    }
    const isForbidden = getIsForbidden(code);
    let displayCode = '';
    if (isForbidden) {
      displayCode = isCn ? isForbidden.aliasName : isForbidden.aliasNameEN;
    }
    return isForbidden ? `${displayCode}` : codeFormat;
  };

  const onVisibleChange = (v) => {
    // 下拉框选择只有一个区号的情况下，不展开下拉框
    const isMatch = param === countries[0]?.mobileCode;
    if (v && countries.length < 2 && isMatch) return;
    setVisible(v);
  };

  const showList = useCallback(() => {
    setShow(true);
  }, []);
  const onClose = useCallback(() => {
    setShow(false);
  }, []);

  useEffect(() => {
    initRef.current();
  }, [useInit, countries, language, forbiddenCountry, canChoose, scene]);

  return isSm ? (
    <>
      <FixedBox onClick={showList} disabled={disabled}>
        <Text>
          <span>{getDisplayCode(param)}</span>
        </Text>
        <TriangleDownOutlinedIcon size={14} open={visible} />
        <DividerIcon type="vertical" />
      </FixedBox>
      <ExtendDrawer
        anchor="top"
        show={show}
        onClose={onClose}
        header={
          <ExtendHeader>
            <ICCloseOutlined size="20" onClick={onClose} />
          </ExtendHeader>
        }
      >
        <Overlay
          data={countries}
          isCn={isCn}
          onClickCode={handleClick}
          checkForbidden={checkForbidden}
          canChoose={canChoose}
          forbiddenCountry={forbiddenCountry}
          inDrawer
          isH5
          {...otherProps}
        />
      </ExtendDrawer>
    </>
  ) : (
    <Dropdown
      visible={visible}
      trigger="click"
      overlay={
        <Overlay
          data={countries}
          isCn={isCn}
          onClickCode={handleClick}
          checkForbidden={checkForbidden}
          canChoose={canChoose}
          forbiddenCountry={forbiddenCountry}
          {...otherProps}
        />
      }
      onVisibleChange={disabled ? undefined : onVisibleChange}
      popperStyle={{ width: '100%', transform: 'translateX(0px)' }}
      popperClassName="customDropdown"
      placement="bottom-start"
    >
      <FixedBox disabled={disabled} data-inspector="phone-selector-trigger">
        <Text>
          <span data-inspector="phone-selector-text">{getDisplayCode(param)}</span>
        </Text>
        <TriangleDownOutlinedIcon size={14} open={visible} />
        <DividerIcon type="vertical" />
      </FixedBox>
    </Dropdown>
  );
}

export default PhoneAreaSelector;
