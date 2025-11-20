import { useState, useMemo, memo } from 'react';
import classnames from 'classnames';
import { styled, Input } from '@kux/mui';
import { ICSearchOutlined } from '@kux/icons';
import useLang from '../../../../hookTool/useLang';
import Empty from '../Empty';

const Wrapper = styled.div`
  overflow: hidden;
  margin-top: 2px;
  border-radius: 8px;
  box-shadow: 0px 4px 40px 0px rgba(0, 0, 0, 0.06);
  border: 1px solid ${({ theme }) => theme.colors.cover4};
  background: ${({ theme }) => theme.colors.overlay};
  .header {
    padding: 20px 24px 24px;
  }
  .content {
    max-height: 280px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 4px;
      background-color: ${({ theme }) => theme.colors.background};
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: ${({ theme }) => theme.colors.cover8};
      border-radius: 4px;
    }

    &::-webkit-scrollbar-track {
      background-color: ${({ theme }) => theme.colors.background};
      border-radius: 4px;
    }
  }
  .groupLabel {
    padding: 0 24px;
  }
  .optionItem {
    height: 56px;
    padding: 0 24px;
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      background-color: ${({ theme }) => theme.colors.cover2};
    }
  }
  .optionItemActive {
    background-color: ${({ theme }) => theme.colors.cover2};
  }
`;
const SearchIcon = styled(ICSearchOutlined)`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text40};
`;

export default memo(({ onHandleClick, countryOptions, activeValue }) => {
  const { _t } = useLang();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchValue(e.target.value);
  };

  const renderOptions = useMemo(() => {
    return countryOptions.map((groupItem) => {
      const newOptions = groupItem?.options?.filter(({ title, value }) => {
        return `${title}_${value}`.toLowerCase().includes((searchValue || '').toLowerCase());
      });

      return {
        ...groupItem,
        options: newOptions,
      };
    });
  }, [searchValue, countryOptions]);

  const isEmpty = useMemo(() => {
    return renderOptions.every((groupItem) => {
      return groupItem?.options?.length === 0;
    });
  }, [renderOptions]);

  return (
    <Wrapper>
      <div className="header">
        <Input
          placeholder={_t('h2nHmo4Fgqf7G5JpsNSTEt')}
          fullWidth
          allowClear
          size="large"
          onChange={handleSearch}
          value={searchValue}
          prefix={<SearchIcon />}
          inputProps={{ autocomplete: 'off' }}
        />
      </div>
      <div className="content">
        {isEmpty ? (
          <Empty />
        ) : (
          renderOptions.map((groupItem) => {
            const GroupLabel = groupItem.label;
            return (
              <div key={groupItem.value}>
                <div className="groupLabel">{GroupLabel}</div>
                <div>
                  {groupItem.options.map(({ label, disabled, value }) => {
                    const LabelCom = label;
                    const isActive = activeValue === value;
                    return (
                      <div
                        onClick={() => {
                          if (disabled) {
                            return;
                          }
                          onHandleClick(value);
                        }}
                        className={classnames({
                          optionItem: true,
                          optionItemActive: isActive,
                        })}
                        key={value}
                      >
                        <LabelCom />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Wrapper>
  );
});
