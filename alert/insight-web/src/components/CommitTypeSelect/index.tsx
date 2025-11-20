import { Select, SelectProps } from 'antd';
const CommitTypeSelect: React.FC<SelectProps> = (props) => {
  return (
    <Select
      style={{ width: 110 }}
      size="small"
      // value={copyPrefix}
      // onChange={(value) => setCopyPrefix(value)}
      {...props}
      options={[
        {
          value: 'feat',
          label: 'feat',
        },
        {
          value: 'fix',
          label: 'fix',
        },
        {
          value: 'docs',
          label: 'docs',
        },
        {
          value: 'style',
          label: 'style',
        },
        {
          value: 'refactor',
          label: 'refactor',
        },
        {
          value: 'perf',
          label: 'perf',
        },
        {
          value: 'test',
          label: 'test',
        },
        {
          value: 'build',
          label: 'build',
        },
        {
          value: 'ci',
          label: 'ci',
        },
        {
          value: 'chore',
          label: 'chore',
        },
        {
          value: 'revert',
          label: 'revert',
        },
      ]}
    />
  );
};

export default CommitTypeSelect;
