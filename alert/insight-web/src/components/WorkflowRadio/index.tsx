import { CheckCard, CheckCardGroupProps } from '@ant-design/pro-components';
import { Avatar } from 'antd';
import { Common } from 'types/common';

interface WorkflowRadioProps extends CheckCardGroupProps {
  workflowOptions: Common.WorkflowOptionItem[];
}

export const WorkflowRadio: React.FC<WorkflowRadioProps> = (props) => {
  const { workflowOptions } = props;

  return (
    <div>
      <CheckCard.Group {...(props ?? {})}>
        {workflowOptions.map((item) => (
          <CheckCard
            avatar={
              <Avatar
                size={36}
                style={{
                  backgroundColor: '#01bc8d',
                }}
              >
                {item.label.slice(0, 1)}
              </Avatar>
            }
            key={item?.value}
            title={item?.label}
            description={item?.desc}
            value={item?.value}
          />
        ))}
      </CheckCard.Group>
    </div>
  );
};
