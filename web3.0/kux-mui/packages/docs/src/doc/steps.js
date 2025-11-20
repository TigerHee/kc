/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Steps, Divider } from '@kux/mui';
import { ICSearchOutlined } from '@kux/icons';
import Wrapper from './wrapper';

const { Step } = Steps;

const Doc = () => {
  const [current, setCurrent] = React.useState(1);
  return (
    <>
      <Divider>small</Divider>
      <Steps
        size="small"
        current={current}
        onChange={(step) => {
          setCurrent(step);
        }}
      >
        <Step title="Finished" description="This is a description." />
        <Step title="In Progress" description="This is a description." />
        <Step title="Waiting" description="This is a description." />
      </Steps>
      <Divider>basic</Divider>
      <Steps current={1}>
        <Step
          icon={<ICSearchOutlined size="20" />}
          title="Finished"
          description="This is a description."
        />
        <Step
          icon={<ICSearchOutlined size="20" />}
          title="In Progress"
          description="This is a description."
        />
        <Step title="Waiting" description="This is a description." />
      </Steps>
      <Divider>basic</Divider>
      <Steps current={1}>
        <Step title="Finished" />
        <Step title="In Progress" />
        <Step title="Waiting" />
      </Steps>
      <Divider>basic</Divider>
      <Steps current={2} labelPlacement="vertical">
        <Step
          title="Finished"
          description="This is a description.This is a description.This is a description."
        />
        <Step
          title="In Progress"
          description="This is a description.This is a description.This is a description."
        />
        <Step
          title="Waiting"
          description="This is a description.This is a description.This is a description."
        />
      </Steps>
      <Divider>error</Divider>
      <Steps status="error" current={1} labelPlacement="vertical">
        <Step
          title="Finished"
          description="This is a description.This is a description.This is a description."
        />
        <Step
          title="In Progress"
          description="This is a description.This is a description.This is a description.This is a description.This is a description.This is a description."
        />
        <Step
          title="Waiting"
          description="This is a description.This is a description.This is a description."
        />
      </Steps>
      <Divider>vertical</Divider>
      <Steps direction="vertical" current={2} labelPlacement="vertical">
        <Step
          title="Finished"
          description="This is a description.This is a description.This is a description."
        />
        <Step
          title="In Progress"
          description="This is a description.This is a description.This is a description."
        />
        <Step
          title="Waiting"
          description="This is a description.This is a description.This is a description."
        />
      </Steps>
      <Divider>vertical</Divider>
      <Steps size="small" direction="vertical" current={1}>
        <Step
          title="Finished"
          description="This is a description.This is a description.This is a description."
        />
        <Step
          title="In Progress"
          description="This is a description.This is a description.This is a description."
        />
        <Step
          title="Waiting"
          description="This is a description.This is a description.This is a description."
        />
      </Steps>

      <Steps type="simple" size="small" current={1}>
        <Step
          title="Finished"
          // description="This is a description.This is a description.This is a description."
        />
        <Step
          title="In Progress"
          // description="This is a description.This is a description.This is a description."
        />
        <Step
          title="Waiting"
          // description="This is a description.This is a description.This is a description."
        />
      </Steps>
    </>
  );
};

export default () => {
  return (
    <Wrapper>
      <Doc />
    </Wrapper>
  );
};
