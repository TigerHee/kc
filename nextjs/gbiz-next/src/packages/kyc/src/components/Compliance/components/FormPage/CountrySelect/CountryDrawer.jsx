/**
 * Owner: tiger@kupotech.com
 */
import { Input, Empty } from '@kux/mui';
import useLang from 'packages/kyc/src/hookTool/useLang';
import { FooterBtnBox } from 'kycCompliance/components/commonStyle';
import { StyledDrawer, DrawerHeader, CloseIcon, SearchIcon, UncheckIcon, CheckIcon } from './style';

export default function CountryDrawer({
  show,
  onClose,
  label,
  searchValue,
  setSearchValue,
  appCountryOptions,
  onChange,
  value,
  isMultiChoice,
}) {
  const { _t } = useLang();

  const onHideDrawer = () => {
    onClose();
    setSearchValue('');
  };

  return (
    <StyledDrawer
      show={show}
      onClose={onHideDrawer}
      anchor="right"
      header={
        <DrawerHeader>
          <div className="headerTop">
            <span className="headerTitle">{label}</span>
            <CloseIcon onClick={onHideDrawer} />
          </div>
          <Input
            placeholder={_t('h2nHmo4Fgqf7G5JpsNSTEt')}
            fullWidth
            allowClear
            size="medium"
            onChange={(e) => {
              e.preventDefault();
              setSearchValue(e.target.value);
            }}
            value={searchValue}
            prefix={<SearchIcon />}
            inputProps={{ autocomplete: 'off' }}
          />
        </DrawerHeader>
      }
    >
      <div className="drawerContent">
        {appCountryOptions.length > 0 ? (
          <div className="list">
            {appCountryOptions.map((item) => {
              const { value: itemValue, label, disabled } = item;

              return (
                <div
                  key={itemValue}
                  className="listItem"
                  onClick={() => {
                    if (disabled) {
                      return;
                    }

                    if (isMultiChoice) {
                      // 多选模式：如果value包含itemValue就去掉，不包含就加上
                      if (value.includes(itemValue)) {
                        onChange(value.filter((v) => v !== itemValue));
                      } else {
                        onChange([...value, itemValue]);
                      }
                    } else {
                      // 单选模式：直接设置值并关闭抽屉
                      onChange(itemValue);
                      onHideDrawer();
                    }
                  }}
                >
                  {label()}
                  {isMultiChoice ? (
                    <>{value.includes(itemValue) ? <CheckIcon /> : <UncheckIcon />}</>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="emptyBox">
            <Empty description={_t('tjVXsDRHhXnSLT4q8mThSm')} size="small" />
          </div>
        )}
      </div>

      {isMultiChoice && (
        <FooterBtnBox
          onNext={onHideDrawer}
          nextText={_t('4c3f71f2c6144000a119', { num: value.length })}
        />
      )}
    </StyledDrawer>
  );
}
