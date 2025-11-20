/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState } from 'react';
import { Box, Dialog, Button, Typography, Select, Checkbox, styled, useTheme, DatePicker } from '@kux/mui';
import Wrapper from './wrapper';
import SuccessImg from '../img/success.svg';

const Doc = () => {
  const [show, setShow] = useState(false);
  const [spaceButton, setSpaceButton] = useState(false);
  const [oneButton, setOneButton] = useState();
  const [noFooter, setNofooter] = useState(false);
  const theme = useTheme();

  const setChangeCheck = (b) => {
    setNofooter(false);
    setOneButton(false);
    setSpaceButton(false);
    setShow(true);
  };

  const setChangeSpaceButton = (b) => {
    setNofooter(false);
    setOneButton(false);
    setSpaceButton(b);
    setShow(true);
  };

  const setChangeOneButton = (b) => {
    setNofooter(false);
    setOneButton(b);
    setShow(true);
  };

  const setChangeNoFooter = (b) => {
    setNofooter(b);
    setShow(true);
  };

  return (
    <div>
      <Dialog
        title="List Dialog Title"
        open={show}
        onCancel={() => setShow(false)}
        onOk={() => setShow(false)}
        cancelText={oneButton ? null : 'Action1'}
        okText="Action2"
        centeredFooterButton={spaceButton}
        footer={noFooter ? null : undefined}
        maskClosable={true}
      >
        <DatePicker
          size="medium"
          width={260}
          picker="time"
          format="HH:mm:ss"
          placeholder="HH:mm:ss"
          allowClear />

        <Typography fontWeight="400" size="16" color={theme.colors.text60} marginBottom="32px">
          A dialog is a type of modal window that appears in front of app content to provide
          critical information, or prompt for a decision to be made.
        </Typography>
        <Box mb={noFooter ? '32px' : 0}>
          <Checkbox
            checkOptions={{
              type: 1, // 1黑色 2 灰色
              checkedType: 1, // 1黑色 2 绿色
            }}
          >
            Mollis enim ut tempor sagittis
          </Checkbox>
        </Box>
      </Dialog>
      <Box>
        <Typography variant="h4">Basic Dialog:</Typography>
        <Button onClick={() => setChangeCheck(true)} mr="20px">
          Normal
        </Button>
        <Button onClick={() => setChangeSpaceButton(true)} mr="20px">
          Button Centered
        </Button>
        <Button onClick={() => setChangeOneButton(true)} mr="20px">
          One Button
        </Button>
        <Button onClick={() => setChangeNoFooter(true)}>No Footer</Button>
      </Box>
    </div>
  );
};

const Doc1 = () => {
  const [show, setShow] = useState(false);

  return (
    <div style={{ marginTop: 20 }}>
      <Dialog
        title="List Dialog Title"
        size="medium"
        open={show}
        onCancel={() => setShow(false)}
        onOk={() => setShow(false)}
      >
        <Typography>This is a Medium Dialog.</Typography>
      </Dialog>
      <Button onClick={() => setShow(true)}>Medium</Button>
    </div>
  );
};

const Doc2 = () => {
  const [show, setShow] = useState(false);

  return (
    <div style={{ marginTop: 20 }}>
      <Dialog
        title="List Dialog Title"
        size="large"
        open={show}
        onCancel={() => setShow(false)}
        onOk={() => setShow(false)}
      >
        <Typography>This is a Large Dialog.</Typography>
      </Dialog>
      <Button onClick={() => setShow(true)}>Large</Button>
    </div>
  );
};

const Doc3 = () => {
  const [show, setShow] = useState(false);

  return (
    <div style={{ marginTop: 20 }}>
      <Dialog
        title="List Dialog Title"
        size="fullWidth"
        open={show}
        onCancel={() => setShow(false)}
        onOk={() => setShow(false)}
      >
        <Typography>This is a FullWidth Dialog.</Typography>
      </Dialog>
      <Button onClick={() => setShow(true)}>FullWidth</Button>
    </div>
  );
};

const Doc4 = () => {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);

  return (
    <div style={{ marginTop: 20 }}>
      <Dialog
        title="测试嵌套Dialog"
        size="large"
        open={show}
        onCancel={() => setShow(false)}
        onOk={() => setShow(false)}
      >
        <Button onClick={() => setShow1(true)}>Open Child Dialog</Button>
      </Dialog>
      <Dialog
        title="这是一个嵌套的Dialog"
        size="medium"
        open={show1}
        onCancel={() => setShow1(false)}
        onOk={() => setShow1(false)}
      >
        <Typography>这是一个嵌套的 Medium Dialog.</Typography>
      </Dialog>
      <Button onClick={() => setShow(true)}>嵌套Dialog</Button>
    </div>
  );
};

export default () => {
  return (
    <Wrapper>
      <Doc />
      <Doc1 />
      <Doc2 />
      <Doc3 />
      <Doc4 />
    </Wrapper>
  );
};
