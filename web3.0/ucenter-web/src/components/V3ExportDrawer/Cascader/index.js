/**
 * Owner: tiger@kupotech.com
 */
import { ICSuccessFilled, ICSuccessUnselectOutlined } from '@kux/icons';
import { Tooltip, useTheme } from '@kux/mui';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  ACCOUNT_STATEMENT,
  ACCOUNT_STATEMENT_CODE,
  ACCOUNT_STATEMENT_CUSTOM,
  ACCOUNT_STATEMENT_MONTHLY,
} from 'src/constants/download';
import { _t } from 'tools/i18n';
import { ALL_TOP_CODES_MAP, getTopCodes, options } from '../config';
import { generateMonthPickerDefaultTime } from '../MonthDatePicker';
import { getInitTime } from '../V3TimePicker';
import {
  Column,
  Content,
  Item,
  ItemArrow,
  ItemCheckIcon,
  ItemLeft,
  ItemText,
  Placeholder,
  PopoverStyled,
  SelectBox,
  Tag,
  TagBox,
  TagClose,
  TagText,
  Triangle,
  TriangleBox,
  WarnTips,
} from './ui';

// 最多展示多少个完整的tag
const MAX_SHOW_TAG_NUM = 6;

export default (props) => {
  const { id, error, setFieldsValue, queryCodes } = props;
  const { isSub } = useSelector((state) => state.user?.user) || {};

  // 弹窗是否展开
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  // 第1列激活项
  const [column1ActiveCode, setColumn1ActiveCode] = useState('');
  // 第2列数据
  const [column2data, setColumn2data] = useState([]);
  // 第2列激活项
  const [column2ActiveCode, setColumn2ActiveCode] = useState('');
  // 第3列数据
  const [column3data, setColumn3data] = useState([]);
  // 第3列激活项
  const [column3ActiveCode, setColumn3ActiveCode] = useState('');
  // 已选中的code
  const [checkCodes, setCheckCodes] = useState([]);

  // 第1列数据
  const column1data = useMemo(() => {
    if (isSub) {
      return options.filter((i) => i.isForSubAccount);
    }
    return options;
  }, [isSub]);

  // 所有树尖的code集合
  const ALL_TOP_CODES = useMemo(() => {
    return getTopCodes(column1data);
  }, [column1data]);

  useEffect(() => {
    if (queryCodes?.length && queryCodes.every((i) => ALL_TOP_CODES.includes(i))) {
      setCheckCodes(queryCodes);
    }
  }, [queryCodes, ALL_TOP_CODES]);

  // 选中某个code时，底部显示警示信息（多条换行展示）
  const SELECTED_WARN_TIPS = {
    'ASSET-SNAPSHOT': _t('8FuEsLqhtYhUP8fRVLNqUo', { code: ALL_TOP_CODES_MAP['ASSET-SNAPSHOT'] }),
    'MAIN-ACCOUNT-DETAILS': _t('8FuEsLqhtYhUP8fRVLNqUo', {
      code: ALL_TOP_CODES_MAP['MAIN-ACCOUNT-DETAILS'],
    }),
    'TRADE-ACCOUNT-DETAILS': _t('8FuEsLqhtYhUP8fRVLNqUo', {
      code: ALL_TOP_CODES_MAP['TRADE-ACCOUNT-DETAILS'],
    }),
    'CROSS-MARGIN-ACCOUNT-DETAILS': _t('8FuEsLqhtYhUP8fRVLNqUo', {
      code: ALL_TOP_CODES_MAP['CROSS-MARGIN-ACCOUNT-DETAILS'],
    }),
    'ISOLATED-MARGIN-ACCOUNT-DETAILS': _t('8FuEsLqhtYhUP8fRVLNqUo', {
      code: ALL_TOP_CODES_MAP['ISOLATED-MARGIN-ACCOUNT-DETAILS'],
    }),
  };

  // 处理第2列数据
  const handleColumn2data = (item) => {
    const { code, children } = item;
    if (code === column1ActiveCode || code === 0) {
      return;
    }
    setColumn1ActiveCode(code);
    const c2data = children || [];
    setColumn2data(c2data);
    setColumn2ActiveCode(c2data[0]?.code);
    setColumn3data(c2data[0]?.children || []);
    setColumn3ActiveCode('');
  };

  // 处理第3列数据
  const handleColumn3data = (item) => {
    const { code, children } = item;
    // if (code === column2ActiveCode) {
    //   return;
    // }
    setColumn2ActiveCode(code);
    setColumn3data(children || []);
    setColumn3ActiveCode('');
  };

  // 获取item树尖的code
  const getTreeTopCode = (item) => {
    if (item.children) {
      let arr = [];
      item.children.forEach((i) => {
        arr = [...arr, ...getTreeTopCode(i)];
      });
      return arr;
    }
    return [item.code];
  };

  const handleSelect = (codes) => {
    const newFieldValue = {
      [id]: codes.length ? codes : [],
    };
    // 是否包含账户结单自定义时间
    const isAccountStatementCustom = codes.some((i) => ACCOUNT_STATEMENT_CUSTOM === i);
    // 之前是否选了账户结单自定义时间
    const prevHasAccountStatementCustom = checkCodes.some((i) => ACCOUNT_STATEMENT_CUSTOM === i);

    // 之前是否选了月结单
    const prevHasAccountStatementMonthly = checkCodes.some((i) => ACCOUNT_STATEMENT_MONTHLY === i);
    // 现在是否选了月结单
    const newHasAccountStatementMonthly = codes.some((i) => ACCOUNT_STATEMENT_MONTHLY === i);

    // 之前或者现在是月结单
    if (prevHasAccountStatementMonthly || newHasAccountStatementMonthly) {
      // 现在是月结单，则使用月份，否则使用日期
      newFieldValue.times = newHasAccountStatementMonthly
        ? generateMonthPickerDefaultTime()
        : getInitTime(isAccountStatementCustom);
    } else if (isAccountStatementCustom || prevHasAccountStatementCustom) {
      // 否则，如果之前有选择自定义时间，或者现在是自定义时间，也要更新日期选择器默认日期
      newFieldValue.times = getInitTime(isAccountStatementCustom);
    }
    setFieldsValue(newFieldValue);
    setCheckCodes(codes);
  };

  // 新增 code
  const handleAddCheckCode = (item) => {
    let codes = [];
    // 全选
    if (item.code === 0) {
      codes = ALL_TOP_CODES;
    } else {
      // 其他选项
      let arr = getTreeTopCode(item);
      // 如果当前选项不是排他的，则需要把之前选中的也加上
      if (!item.isExclusive) {
        // 如果选择了账户结单，则只能选择月结单或自定义时间
        if (item.code === ACCOUNT_STATEMENT && arr.length > 0) {
          codes = [arr[0]];
        } else {
          // 如果选择了其他类型，则不能选择账户结单
          const other = checkCodes.filter((i) => !ACCOUNT_STATEMENT_CODE.includes(i));
          codes = [...new Set([...other, ...arr])];
        }
      } else {
        codes = arr;
      }
    }

    handleSelect(codes);
  };

  // 减少 code
  const handleRemoveCheckCode = (item) => {
    let codes = [];
    if (item.code !== 0) {
      const arr = getTreeTopCode(item);
      codes = checkCodes.filter((i) => !arr.includes(i));
    }

    handleSelect(codes);
  };

  // 当前项是否被check
  const getItemIsChecked = (item) => {
    if (item.code === 0) {
      return checkCodes.length === ALL_TOP_CODES.length;
    }
    if (item.children) {
      const codes = getTreeTopCode(item);
      return codes.some((i) => checkCodes.includes(i));
    }
    if (checkCodes.includes(item.code)) {
      return true;
    }
    return false;
  };

  // 点击删除tag
  const handleTagDel = (e, item) => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
    handleRemoveCheckCode(item);
  };

  const theme = useTheme();

  // 阻止选择触发选框高度变化，mousedown触发在了外面，导致下拉关闭
  const stopCloseRef = useRef(false);
  const stopCloseTimerRef = useRef(0);
  const handleCheckIconClick = () => {
    stopCloseRef.current = true;
    clearTimeout(stopCloseTimerRef.current);
    stopCloseTimerRef.current = setTimeout(() => {
      stopCloseRef.current = false;
    }, 200);
  };
  const handleClose = () => {
    if (stopCloseRef.current) return;
    setPopoverOpen(false);
  };

  // 每个选择项
  const getItem = ({ item, activeCode, ...otherProps }) => {
    const { code, label, children, tooltip } = item;
    const isChecked = getItemIsChecked(item);

    return (
      <Item active={code === activeCode} {...otherProps}>
        <ItemLeft>
          <ItemCheckIcon
            onClick={() => {
              isChecked ? handleRemoveCheckCode(item) : handleAddCheckCode(item);
              handleCheckIconClick();
            }}
          >
            {isChecked ? (
              <ICSuccessFilled size="20" color={theme.colors.primary} />
            ) : (
              <ICSuccessUnselectOutlined size="20" color={theme.colors.icon40} />
            )}
          </ItemCheckIcon>
          <Tooltip placement="top" title={tooltip || label}>
            <ItemText>{label}</ItemText>
          </Tooltip>
        </ItemLeft>
        {children ? <ItemArrow /> : null}
      </Item>
    );
  };

  // 下拉弹窗内容
  const content = (
    <Content>
      {/* 第1列 */}
      <Column>
        {column1data.map((item) => (
          <Fragment key={item.code}>
            {getItem({
              item,
              activeCode: column1ActiveCode,
              onClick: () => handleColumn2data(item),
            })}
          </Fragment>
        ))}
      </Column>

      {/* 第2列 */}
      {column2data.length ? (
        <Column>
          {column2data.map((item) => (
            <Fragment key={item.code}>
              {getItem({
                item,
                activeCode: column2ActiveCode,
                onClick: () => handleColumn3data(item),
              })}
            </Fragment>
          ))}
        </Column>
      ) : null}

      {/* 第3列 */}
      {column3data.length > 0 ? (
        <Column>
          {column3data.map((item) => (
            <Fragment key={item.code}>
              {getItem({
                item,
                activeCode: column3ActiveCode,
                onClick: () => setColumn3ActiveCode(item.code),
              })}
            </Fragment>
          ))}
        </Column>
      ) : null}
    </Content>
  );

  return (
    <>
      <PopoverStyled
        open={isPopoverOpen}
        onOpen={() => setPopoverOpen(true)}
        onClose={handleClose}
        content={content}
        trigger="click"
        arrow={false}
      >
        <SelectBox active={isPopoverOpen} error={error}>
          <Placeholder
            hasError={error}
            active={isPopoverOpen}
            top={checkCodes.length > 0 || isPopoverOpen}
          >
            {_t('iHGHX8kNKBSzhW5No277yg')}
          </Placeholder>
          <TagBox>
            {checkCodes.length > 0
              ? checkCodes.map((code, i) => {
                  if (i > MAX_SHOW_TAG_NUM - 1) return null;
                  return (
                    <Tag key={code}>
                      <TagText>{ALL_TOP_CODES_MAP[code]}</TagText>
                      <TagClose onClick={(e) => handleTagDel(e, { code })} />
                    </Tag>
                  );
                })
              : null}
            {checkCodes.length > MAX_SHOW_TAG_NUM ? (
              <Tag>+{checkCodes.length - MAX_SHOW_TAG_NUM}...</Tag>
            ) : null}
          </TagBox>
          <TriangleBox className="triangle">
            <Triangle active={isPopoverOpen} size={16} />
          </TriangleBox>
        </SelectBox>
      </PopoverStyled>
      {checkCodes?.map((code) => {
        return SELECTED_WARN_TIPS?.[code] ? (
          <WarnTips key={code}>{SELECTED_WARN_TIPS[code]}</WarnTips>
        ) : null;
      })}
    </>
  );
};
