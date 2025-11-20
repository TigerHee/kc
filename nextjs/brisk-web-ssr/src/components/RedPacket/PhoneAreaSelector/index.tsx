/*
 * @Owner: willen@kupotech.com
 * @Author: willen willen@kupotech.com
 * @Date: 2025-09-23 21:47:02
 * @LastEditors: Melon Melon@kupotech.com
 * @LastEditTime: 2025-09-23 23:00:06
 * @FilePath: /brisk-web-ssr/src/components/RedPacket/PhoneAreaSelector/index.tsx
 * @Description:
 *
 * PhoneAreaSelector - converted to TypeScript with @kux/mui-next
 */

import React, { useCallback, useEffect, useState } from 'react';
import { ICArrowDownOutlined, ICArrowUpOutlined } from '@kux/icons';
import { Dropdown } from '@kux/mui-next';
import { isFunction } from 'lodash-es';
import { isForbiddenCountry } from '../utils/countries';
import { manualTrack } from '@/tools/ga';
import Overlay from './OverLay';
import { getUserArea } from './service';
import { getTenantConfig } from '@/tenant';
import classnames from 'clsx';

import styles from './styles.module.scss';

const tenantConfig = getTenantConfig();

/**
 * * 默认区号控制：
 *  1.根据用户 IP默认填充区号
 *    a.国家区号 dismiss 为 true，不默认填充区号 （后端接口）
 *    b.奥地利AT43， 不默认填充手机区号
 *  2.根据用户语言默认填充区号
 *    a.葡萄牙语言 默认+55，巴西区号，不支持葡萄牙注册
 *    b.国家区号 dismiss 为 true, 不默认填充区号
 *  3.展示默认区号
 *    a.对于封禁国家，中国展示中文别名，其他国家展示英文别名
 *    b.正常的展示 +Code
 *  4.区号下拉列表选择
 *    a.对于dismiss为 true 的国家区号 不可选择
 *    b.对于封禁国家，中国展示中文别名，其他国家展示英文别名
 * *  5. 2025.09.23 多租户新的合规要求
 *    5.1 如果用户 IP 是奥地利， 则不默认填充手机区号； 仅对主站生效， au、eu、th不需要; tr 不需要默认且只能是tr区号 使用tenantConfig.common.notPreFillMobileCodeCountries()控制
 *    5.2 手机区号-默认展示美国区号；仅对主站生效， au、eu、th不需要; tr 不需要默认且只能是tr区号； 使用 tenantConfig.common.initLanguageCode 控制
 *    5.3 如果当前是葡萄牙语，则区号默认展示+55（巴西区号，我们不支持葡萄牙注册）； au、eu、th不需要; tr 不需要默认且只能是tr区号 通过 tenantConfig.common.dismissPT 控制
 *    5.4 区号选择过滤中国； 主站/au/eu需要； th不需要; tr 不需要默认且只能是tr区号 通过 tenantConfig.common.forbiddenCountriesForUse 控制
 */

/**
 * 区号选择框
 * @param {Array} props.countries 国家区号数据
 * @param {bool} props.isCn 是否是中文zh_CN
 * @param {function} props.onChange 修改选择回调
 * @param {string} props.value 默认回显
 * @param {string} props.language 语言
 * @param {bool} checkForbidden  =true的时候被禁止的国家，国旗/区号不显示， 国家名称显示为其他
 * @param {bool} props.forbiddenCountry 使用countries里的dismiss字段来禁止国家显示,被禁止的国家，不可选； 会展示文案"暂不支持 "
 * @param {bool} props.canChoose 被禁止的国家，可选，但是点击选择会toast提醒
 * @param {string} props.overlayBoxWidth 下拉选择内容盒子宽度
 * @param {string} [props.disabled] 是否禁用
 * @returns
 */
const PhoneAreaSelector: React.FC<any> = ({
  countries,
  isCn,
  onChange,
  value,
  language,
  checkForbidden,
  forbiddenCountry, // 使用countries里的dismiss字段来禁止国家显示
  canChoose,
  overlayBoxWidth,
  disabled = false,
}) => {
  const [param, setValue] = useState<string>(value || '');
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    /** 获取默认区号 */
    const getParam = async (): Promise<string> => {
      if (countries?.length === 0) {
        return '';
      }

      /** 根据用户语言默认填充区号 */
      const getValFromLang = (): string => {
        const langCode = language ? language.split('_')[1] : tenantConfig.common.initLanguageCode;
        // 葡萄牙语，则默认展示+55（巴西区号，我们不支持葡萄牙注册）
        if (tenantConfig.common.dismissPT && langCode === 'PT') {
          return '55';
        }
        const curCountry = countries.find(c => c.code === langCode);
        // forbiddenCountry = true, 且dismiss为true的国家，则默认显示 '1'
        if (forbiddenCountry && curCountry?.dismiss && !canChoose) {
          return '';
        }
        if (countries && curCountry) {
          return curCountry.mobileCode || '';
        }
        return '';
      };

      try {
        /** 获取用户的ip地址 */
        const res: any = await getUserArea();
        if (res?.success && res?.data) {
          // 根据用户 IP默认填充区号
          const data = res?.data || {};
          const countryItem = countries.find(i => i.code === (data as any).countryCode);

          if (!countryItem || countryItem.dismiss) {
            return '';
          }
          // 禁止自动预填写手机区号的国家
          if (tenantConfig.common.notPreFillMobileCodeCountries().includes(countryItem.code)) {
            // 埋点
            manualTrack(
              ['phoneAreaSelector', '1'],
              {
                category: 'notPreFillMobileCode',
                resultType: countryItem.code,
              },
              'technology_event'
            );
            return '';
          }
          return (data as any).mobileCode || '';
        }
        // 根据用户语言默认填充区号
        return getValFromLang();
      } catch {
        return getValFromLang();
      }
    };

    const initCode = async () => {
      const defaultParam = await getParam();
      setValue(defaultParam);
      isFunction(onChange) && onChange(defaultParam);
    };

    initCode();
  }, [countries, language, forbiddenCountry, canChoose]);

  const handleClick = (code: string) => {
    setValue(code);
    setVisible(false);
    isFunction(onChange) && onChange(code);
  };

  /** 获取是否是封禁国家 */
  const getIsForbidden = useCallback(
    (code: string) => {
      const forbiddenItem = isForbiddenCountry(code);
      const isForbidden = checkForbidden && forbiddenItem;
      return isForbidden ? forbiddenItem : false;
    },
    [checkForbidden]
  );

  /** 获取展示区号 */
  const getDisplayCode = (code: string): string => {
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

  const onVisibleChange = v => {
    // 下拉框选择只有一个区号的情况下，不展开下拉框
    const isMatch = param === countries[0]?.mobileCode;
    if (v && countries.length < 2 && isMatch) return;
    setVisible(v);
  };

  return (
    <Dropdown
      visible={visible}
      trigger="click"
      overlay={
        <Overlay
          overlayBoxWidth={overlayBoxWidth}
          data={countries}
          isCn={isCn}
          onClickCode={handleClick}
          checkForbidden={checkForbidden}
          forbiddenCountry={forbiddenCountry}
        />
      }
      onVisibleChange={disabled ? undefined : onVisibleChange}
    >
      <div className={classnames(styles.text, { [styles['text-disabled']]: disabled })}>
        <span style={{ fontSize: getIsForbidden(param) ? '12px' : '14px' }}>{getDisplayCode(param)}</span>
        {visible ? <ICArrowUpOutlined size={16} /> : <ICArrowDownOutlined size={16} />}
      </div>
    </Dropdown>
  );
};

export default PhoneAreaSelector;
