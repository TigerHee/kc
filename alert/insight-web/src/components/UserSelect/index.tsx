import { Select, SelectProps, Tag } from 'antd';
import { UserItem } from '../UserItem';
import { Common } from 'types/common';

export const UserSelect: React.FC<
  SelectProps & {
    userOptions: Common.UserSelectOptionItem[];
  }
> = (props) => {
  const { mode, maxCount, userOptions, ...restProps } = props;

  return (
    <Select
      mode="multiple"
      maxCount={mode === 'multiple' ? maxCount : 1}
      {...restProps}
      options={userOptions}
      filterOption={(input, option) => {
        return ((option?.label as string) ?? '').toLowerCase().includes(input.toLowerCase());
      }}
      tagRender={(props) => {
        const { value, closable, onClose } = props;
        const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
          event.preventDefault();
          event.stopPropagation();
        };
        return (
          <Tag onMouseDown={onPreventMouseDown} closable={closable} onClose={onClose}>
            <UserItem
              user={userOptions.find((user) => user.value === value) as Common.SelectOptionItem}
              size="small"
              onMouseDown={onPreventMouseDown}
            />
          </Tag>
        );
      }}
    />
  );
};
