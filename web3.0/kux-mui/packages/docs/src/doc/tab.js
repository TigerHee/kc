/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Tabs, Tab, Box, Button } from '@kux/mui';
import Wrapper from './wrapper';

// const { Tab } = Tabs;

const Doc1 = ({ size }) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <React.Fragment>
      <Box mb={20}>
        <Box width={400}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="line"
            size={size}
            showScrollButtons={false}
            // direction='rtl'
          >
            <Tab label="Deposit History" />
            <Tab label="Withdraw History" />
            <Tab label="Saved Address" />
            <Tab label="Universal Address" />
          </Tabs>
        </Box>
      </Box>
    </React.Fragment>
  );
};

const Doc2 = ({ size }) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <React.Fragment>
      <Box width={400}>
        <Tabs value={value} onChange={handleChange} variant="bordered" size={size}>
          <Tab label="Deposit History" />
          <Tab label="Withdraw History" />
          <Tab label="Saved Address" />
          <Tab label="Universal Address" />
        </Tabs>
      </Box>
    </React.Fragment>
  );
};

const Doc3 = ({ size }) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <React.Fragment>
      <Box width={400}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="bordered"
          size={size}
          activeType={'primary'}
        >
          <Tab label="Deposit History" />
          <Tab label="Withdraw History" />
          <Tab label="Saved Address" />
          <Tab label="Universal Address" />
        </Tabs>
      </Box>
    </React.Fragment>
  );
};

const Doc4 = ({ size }) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <React.Fragment>
      <Box width={400}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="bordered"
          size={size}
          activeType={'primary'}
          type="text"
        >
          <Tab label="Deposit History" />
          <Tab label="Withdraw History" />
          <Tab label="Saved Address" />
          <Tab label="Universal Address" />
        </Tabs>
      </Box>
    </React.Fragment>
  );
};

const Doc6 = ({ size }) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <React.Fragment>
      <Box width={800}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="bordered"
          size={size}
          activeType={'primary'}
          type="text"
          centeredActive
          // direction="rtl"
          // enableWheel
        >
          <Tab label="Deposit History" />
          <Tab label="Withdraw History" />
          <Tab label="Saved Address" />
          <Tab label="Universal Address" />
          <Tab label="Deposit History" />
          <Tab label="Withdraw History" />
          <Tab label="Saved Address" />
          <Tab label="Universal Address" />
          <Tab label="Deposit History" />
          <Tab label="Withdraw History" />
          <Tab label="Saved Address" />
          <Tab label="Universal Address" />
          <Tab label="Deposit History" />
          <Tab label="Withdraw History" />
          <Tab label="Saved Address" />
          <Tab label="Universal Address" />
          <Tab label="Deposit History" />
          <Tab label="Withdraw History" />
          <Tab label="Saved Address" />
          <Tab label="Universal Address" />
        </Tabs>
      </Box>
    </React.Fragment>
  );
};

const Doc5 = ({ size }) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <React.Fragment>
      <Box width={800}>
        <Tabs
          value={value}
          onChange={handleChange}
          size={size}
          indicator={false}
          centeredActive
          enableWheel
        >
          <Tab label="Deposit History" />
          <Tab label="Withdraw History" />
          <Tab label="Saved Address" />
          <Tab label="Universal Address" />
          <Tab label="Deposit History" />
          <Tab label="Withdraw History" />
          <Tab label="Saved Address" />
          <Tab label="Universal Address" />
          <Tab label="Deposit History" />
          <Tab label="Withdraw History" />
          <Tab label="Saved Address" />
          <Tab label="Universal Address" />
          <Tab label="Deposit History" />
          <Tab label="Withdraw History" />
          <Tab label="Saved Address" />
          <Tab label="Universal Address" />
          <Tab label="Deposit History" />
          <Tab label="Withdraw History" />
          <Tab label="Saved Address" />
          <Tab label="Universal Address" />
          <Tab label="Deposit History" />
          <Tab label="Withdraw History" />
          <Tab label="Saved Address" />
          <Tab label="Universal Address" />
        </Tabs>
      </Box>
    </React.Fragment>
  );
};

const Doc7 = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <React.Fragment>
      <Box width={800}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="slider"
        >
          <Tab label="Cross" />
          <Tab label="Isolated" />
        </Tabs>
      </Box>
    </React.Fragment>
  );
};

const Doc8 = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <React.Fragment>
      <Box width={800}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="slider"
          size="medium"
        >
          <Tab label="Cross" />
          <Tab label="Isolated" />
          <Tab label="Isolated" />
          <Tab label="Isolated" />
        </Tabs>
      </Box>
    </React.Fragment>
  );
};

const Doc9 = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <React.Fragment>
      <Box width={800}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="bordered"
          type="normal"
          size="medium"
        >
          <Tab label="Cross" />
          <Tab label="Isolated" />
          <Tab label="Isolated" />
          <Tab label="Isolated" />
          <Tab label="Cross" />
          <Tab label="Isolated" />
          <Tab label="Isolated" />
          <Tab label="Isolated" />
          <Tab label="Cross" />
          <Tab label="Isolated" />
          <Tab label="Isolated" />
          <Tab label="Isolated" />
          <Tab label="Cross" />
          <Tab label="Isolated" />
          <Tab label="Isolated" />
          <Tab label="Isolated" />
        </Tabs>
      </Box>
    </React.Fragment>
  );
};

export default () => {
  const [size, setSize] = React.useState('xlarge');

  return (
    <Wrapper>
      <Box>
        <Button mr={'20px'} onClick={() => setSize('xlarge')}>
          xlarge
        </Button>
        <Button mr={'20px'} onClick={() => setSize('large')}>
          large
        </Button>
        <Button mr={'20px'} onClick={() => setSize('medium')}>
          medium
        </Button>
        <Button mr={'20px'} onClick={() => setSize('small')}>
          small
        </Button>
        <Button onClick={() => setSize('xsmall')}>xsmall</Button>
      </Box>
      <p>size: {size}</p>
      <Doc1 size={size} />
      <p>variant: bordered</p>
      <Doc2 size={size} />
      <p>activeType: primary</p>
      <Doc3 size={size} />
      <p>type: text</p>
      <Doc4 size={size} />

      <p>type normal:  </p>
      <Doc9 />

      <p>indicator: false</p>
      <Doc5 size={size} />

      <p>centeredActive</p>
      <Doc6 size={size} />

      <p>variant: slider</p>
      <Doc7 />

      <p>variant: slider size: medium</p>
      <Doc8 />

    </Wrapper>
  );
};