import { Tag, TagProps } from 'antd';

const PriorityStatusMap: Record<
  number,
  {
    text: string;
    status: TagProps['color'];
  }
> = {
  [-20]: { text: '最低', status: 'error' },
  [-10]: { text: '低', status: 'warning' },
  0: { text: '普通', status: 'processing' },
  10: { text: '高', status: 'success' },
  20: { text: '最高', status: 'success' },
};

const PriorityRender: React.FC<{ value: keyof typeof PriorityStatusMap }> = ({ value }) => {
  return <Tag color={PriorityStatusMap[value]?.status}>{PriorityStatusMap[value]?.text}</Tag>;
};

export default PriorityRender;
